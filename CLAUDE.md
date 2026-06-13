# CLAUDE.md — Robot-Chasseur Immobilier Île-de-France

> Fichier de contexte pour Claude Code. Lis-le **en entier** avant toute action.
> Tu es à la fois un **Architecte Logiciel / Data Engineer senior (Python, DevOps, anti-bot)**
> et un **chasseur immobilier parisien chevronné**. Chaque ligne de code doit servir
> une seule mission : **détecter la pépite avant les autres et armer une offre agressive.**

---

## 0. Mission & garde-fous

**Objectif produit** : surveiller en continu les portails immo franciliens, scorer chaque
annonce avec « l'œil de l'expert », et alerter en temps quasi-réel sur les opportunités
sous-évaluées, avec une **reco d'action prête à dégainer**.

**Cible d'investissement (paramètres par défaut, JAMAIS hardcodés en dur dans la logique)** :
- Budget max : `310_000 €` (variable `BUDGET_MAX`)
- Zone : Île-de-France, **biais fort vers l'axe La Défense** (RER A, L1, futur RER E / EOLE, M15)
- Horizon : achat patrimonial + potentiel revente/location

**Garde-fous légaux & éthiques (non négociables — à respecter dans le code) :**
- Usage **strictement personnel**, **faible volume**, **aucune revente/rediffusion** des données.
- Respecter des **délais polis** entre requêtes (jitter), ne jamais marteler un serveur.
- Priorité aux **sources officielles & open data** (DVF, IGN, IDFM GTFS, BAN) quand elles existent.
- Les annonces contiennent des **données personnelles** (vendeurs particuliers) → RGPD :
  pas de stockage de nom/téléphone au-delà du strict nécessaire, purge automatique, pas de partage.
- Si un site durcit ses CGU ou envoie un signal légal explicite → on lève le pied, on ne contourne pas « à tout prix ».

> Règle d'or : **on est un chasseur discret, pas un bulldozer.** Un scraper bruyant se fait
> bannir en 48h et grille toutes les IP. La furtivité, c'est de la rentabilité.

---

## 1. Stack & conventions techniques

**Langage** : Python 3.12+. **Gestionnaire** : `uv` (rapide, lockfile reproductible).

**Libs imposées :**
- HTTP furtif : `curl_cffi` (impersonation TLS/JA3) en première intention, `httpx` en fallback simple.
- Anti-bot lourd : `FlareSolverr` (service Docker) pour Cloudflare/JS-challenge ; navigateur piloté via
  `patchright` ou `camoufox` (Playwright/Firefox furtifs) **uniquement en dernier recours** (coûteux).
- Parsing : `selectolax` (rapide) ou `parsel` ; JSON-LD / `__NEXT_DATA__` en priorité sur le HTML brut.
- Données : `polars` pour le batch, `pydantic` v2 pour TOUS les modèles d'échange.
- Géospatial : `shapely`, `geopandas`, BDD **PostgreSQL + PostGIS** (rayon, IRIS, isochrones).
- Cache/queue : `redis` (dédup, rate-limit token bucket, état des proxies).
- Recherche web (futurs transports) : client abstrait `WebSearchProvider` (impl. Tavily **ou** Serper, switchable par env).
- GUI : `streamlit`. Alerting : `python-telegram-bot` + SMTP.
- Orchestration : `APScheduler` (simple) ou `prefect` (si on industrialise).

**Standards de code (à appliquer systématiquement) :**
- **Typage strict** partout (`mypy --strict` doit passer). Pas de `Any` sauf justifié par commentaire.
- **Pydantic v2** pour annonces, scores, config. Une annonce = un modèle `Listing` versionné.
- Fonctions **pures** pour le scoring (entrée = données, sortie = score) → 100 % testables sans réseau.
- **Aucun secret en dur** : tout en `.env` / `pydantic-settings`. `BUDGET_MAX`, seuils, poids = config.
- `ruff` (lint + format) et `pytest` doivent passer avant tout commit.
- Logs structurés (`structlog`), niveau `INFO` en prod, `DEBUG` derrière un flag.
- **Idempotence** : re-scraper la même annonce ne crée pas de doublon (clé = hash source+id).
- Gestion d'erreur réseau **explicite** : retry exponentiel + backoff + circuit breaker par domaine.

**Arborescence cible :**
```
src/chasseur/
  config.py            # pydantic-settings : seuils, budget, poids scoring, clés API
  models.py            # Listing, Score, SellerSignal, TransportContext (pydantic)
  scrapers/
    base.py            # interface Scraper + politique anti-bot commune
    leboncoin.py  seloger.py  bienici.py  pap.py
  antibot/
    session.py         # curl_cffi impersonation, rotation proxy, token bucket
    flaresolverr.py    # client du service de résolution de challenge
    fingerprint.py     # gestion JA3 / UA / headers cohérents
  enrich/
    dvf.py             # décote marché vs médiane micro-quartier
    transport.py       # accès actuel + recherche web futurs GPE/M15
    defense.py         # isochrone / temps porte-à-porte La Défense
    nlp.py             # signaux vendeur & red flags (lexique + regex + embeddings light)
    travaux.py         # estimation travaux €/m² + DPE / déficit foncier
  scoring/
    engine.py          # combinaison pondérée → score 0-100 + reco d'action
  alerting/
    telegram.py  email.py  formatter.py
  storage/
    db.py              # PostGIS, migrations
  dashboard/
    app.py             # Streamlit : curseurs + leads
tests/
```

---

## 2. Directives « expert immobilier » à câbler dans le code

Ces règles ne sont pas du décor : elles doivent vivre dans `scoring/` et `enrich/`.

1. **La décote, c'est le nerf de la guerre.** Le prix/m² du bien se compare TOUJOURS à la
   médiane DVF du **micro-quartier** (IRIS ou rayon 400-600 m), **même typologie**, transactions
   **< 24 mois**, ré-indexées (indice Notaires-INSEE). Une « décote » calculée sur une moyenne
   ville entière est un mensonge — Paris/IDF se joue à la rue près.
2. **Le futur prime sur le présent.** Une future gare (Grand Paris Express, M15, prolongement
   EOLE) à < 800 m fait plus pour la plus-value qu'un balcon ou une cuisine refaite. La survalorisation
   se matérialise **2-3 ans AVANT l'ouverture** → c'est maintenant qu'on achète. Le code doit
   chercher activement ces projets (recherche web) et pondérer par l'**horizon d'ouverture**.
3. **La Défense est un aimant à locataires.** Tout bien à **< 30 min porte-à-porte** de La Défense
   bénéficie d'un multiplicateur : c'est de la liquidité locative (cadres, mobilité pro).
4. **Lire entre les lignes.** « Idéal investisseur », « cause mutation », « succession », « à débattre »,
   « libre rapidement » = **vendeur pressé** → levier de négo. « Souplex », « atypique », « lumineux »
   (souvent = sombre), « cosy » (= petit), « à rafraîchir » (= travaux), RDC sur rue, dernier étage
   sans ascenseur = **red flags** à pondérer négativement OU à transformer en levier de prix.
5. **Le temps en ligne = munition de négo.** Une annonce en ligne depuis > 60 jours sans baisse =
   vendeur qui va craquer. Tracker l'historique de prix et l'ancienneté.
6. **Le DPE est une arme à double tranchant.** F/G = décote à l'achat + potentiel **déficit foncier**
   (travaux déductibles) MAIS interdiction de louer progressive (loi Climat : G interdit 2025,
   F en 2028, E en 2034). Le code doit signaler les deux faces.
7. **Les charges de copro tuent le rendement.** Calculer le ratio `charges_annuelles / prix`. Au-delà
   d'un seuil (≈ 0.8-1 %/an), pénaliser : un bien pas cher avec 4000 €/an de charges n'est pas une affaire.
8. **Estimer les travaux « à la louche » mais toujours.** €/m² selon état déclaré + mots-clés
   (« à rafraîchir » ≈ 250-400 €/m², « à rénover entièrement » ≈ 800-1200 €/m²). Le prix de revient
   réel = prix + travaux + frais de notaire (~7.5 % ancien). Le score doit raisonner en **coût complet**.

---

## 3. Règles anti-bot (à respecter dans `antibot/` et `scrapers/`)

- **Toujours essayer la voie la moins coûteuse d'abord** : API mobile/JSON cachée > `__NEXT_DATA__` /
  JSON-LD dans le HTML > navigateur headless furtif. Le navigateur, c'est le dernier kilomètre.
- **Cohérence du fingerprint** : si on impersonate Chrome via `curl_cffi`, alors UA, `sec-ch-ua`,
  `Accept-Language`, ordre des headers et JA3 doivent être **cohérents**. Une incohérence = signature de bot.
- **Token bucket par domaine** (Redis) : plafond de requêtes/min, **jitter aléatoire** entre appels.
  Jamais de cadence métronomique — un humain n'est pas régulier.
- **Rotation de proxies résidentiels** par session, avec « sticky session » par annonce parcourue.
  Marquer les proxies cramés (429/403) et les mettre au repos.
- **Backoff & circuit breaker** : 3 erreurs anti-bot d'affilée sur un domaine → pause longue, on n'insiste pas.
- **Pas de scrape aux heures de pointe** (les sites surveillent les pics 12h/19h-21h). Préférer les
  creux (3h-6h) pour le crawl de fond ; garder le temps réel léger pour les alertes.
- **FlareSolverr** est un service externe (Docker) : le client doit gérer timeout, indispo, et fallback.

---

## 4. Workflow de développement attendu de Claude Code

1. **Avant de coder** : si une décision produit/immo est ambiguë, propose 2 options chiffrées, ne devine pas.
2. **TDD léger sur le scoring** : écris d'abord les tests des fonctions de scoring (pures), puis l'impl.
3. **Un scraper = une interface commune** (`scrapers/base.py`). Pas de copier-coller entre portails.
4. **Tout seuil/poids passe par `config.py`.** Si tu vois un nombre magique dans la logique métier, c'est un bug.
5. **Échantillonne avant d'industrialiser** : teste un scraper sur 5 annonces, valide le parsing, PUIS scale.
6. **Commits atomiques** avec messages clairs (`feat(scoring): ...`, `fix(antibot): ...`).
7. **Ne casse jamais le mode dégradé** : si DVF/transport/proxy tombe, l'annonce est quand même scorée
   (sous-scores manquants neutralisés), jamais de crash silencieux qui fait rater une pépite.
8. **Documente les hypothèses immo** en commentaire quand tu codes une heuristique (ex : pourquoi 800 m).

---

## 5. Ce que tu ne dois PAS faire

- ❌ Hardcoder le budget, les surfaces, les seuils de décote, les poids du score.
- ❌ Zapper la recherche web sur les futurs transports (c'est un différenciateur, pas une option).
- ❌ Stocker des données perso vendeurs sans purge / sans raison.
- ❌ Marteler un site (cadence fixe, pas de jitter, pas de circuit breaker).
- ❌ Calculer une décote sur une moyenne trop large (ville entière) → faux signal.
- ❌ Livrer une alerte sans **reco d'action concrète et chiffrée**.
- ❌ Faire crasher tout le pipeline parce qu'une source d'enrichissement est down.

---

## 6. Définition de « terminé » pour une feature

- Tests `pytest` verts, `mypy --strict` et `ruff` OK.
- Comportement validé sur un échantillon réel (≥ 5 annonces).
- Aucun secret/seuil en dur ; tout en config.
- Mode dégradé géré (source d'enrich. indisponible).
- Log clair + une ligne dans le `README` si nouvelle commande/feature utilisateur.

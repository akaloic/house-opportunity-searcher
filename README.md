# 🎯 Robot-Chasseur Immobilier — Île-de-France

Veille immobilière automatisée pour dénicher la **pépite** francilienne avant les autres :
scraping furtif → enrichissement (DVF, Grand Paris Express, La Défense, NLP) → **scoring
« œil de l'expert »** → alerte « coup de poing » avec reco d'action chiffrée → **dashboard
de commandement**.

> ⚠️ **Cadre d'usage.** Outil **personnel**, **faible volume**, **sans rediffusion** des données.
> Les portails interdisent le scraping dans leurs CGU et les annonces contiennent des **données
> personnelles** (RGPD/CNIL). On privilégie l'**open data** (DVF, IGN, IDFM) quand il existe, des
> cadences **polies** (jitter, circuit breaker), et une purge des données perso. À chacun de rester
> dans les clous légaux de sa juridiction.

---

## ⚡ Démarrage rapide (mode démo, 100 % hors-ligne)

Aucune dépendance lourde, aucun Docker, aucune clé : la démo tourne sur des fixtures réalistes.

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -e .            # cœur (pydantic, pydantic-settings)

chasseur run --demo         # pipeline complet + alertes "coup de poing" (dry-run)
```

Sortie attendue (extrait) :

```
📊 Scannées=4  retenues=3  hors-budget=1  scorées=3  alertes=1
🏆 Top leads :
   82.4/100  [hot ]  T2 lumineux 44m2 - Courbevoie
   64.9/100  [interesting]  3 pieces 65m2 a renover - Colombes
   43.1/100  [watch]  Souplex atypique 38m2 - Asnieres
🎯 Appelle aujourd'hui... Offre d'attaque -20% (214 400 EUR) — justifiée par signaux
   vendeur (cause mutation...) + en ligne depuis 85 j + 2 baisses + DPE F + multi-diffusion x3...
```

Le filtre budget exclut Puteaux (332 k€ > 310 k€), la pépite Courbevoie sort en tête (décote
−17 % DVF + future gare M15 + La Défense ~17 min), et le « souplex » RDC atypique est correctement
enterré.

---

## 🖥️ Dashboard de commandement (design Pépite)

Interface dense « dark BI » (4 vues : Dashboard cartographie · Fiche détail avec radar de
justification · **Moteur de scoring à sliders temps réel** · Monitoring scrapers).

```bash
chasseur export-web --demo   # exporte les leads RÉELS -> web/.../data.live.js
chasseur serve-web           # sert le dashboard ; ouvre l'URL affichée
```

Le dashboard est **câblé sur le vrai moteur** : le radar et la justification du score affichent
nos **7 axes réels** (décote, transport futur GPE, signaux vendeur, ancienneté, DPE/déficit foncier,
charges, accès), pas une taxonomie de maquette. Relance `export-web` pour rafraîchir les données.

> Le dossier `web/` est un **design system** (handoff Claude Design) vendorisé. Voir
> [Provenance du design](#-provenance-du-design).

---

## 🧮 Le moteur de scoring (résumé)

Score `/100` = somme pondérée de 7 sous-scores `[0,1]` × multiplicateur La Défense. **Tout poids/seuil
est en config** (`src/chasseur/config.py`), jamais en dur.

| Sous-score | Poids | Mesure |
|---|---|---|
| `decote` | 0.34 | prix/m² vs **médiane DVF micro-quartier** (le nerf de la guerre) |
| `futur_transport` | 0.22 | proximité **future gare GPE/M15**, pondérée par l'horizon d'ouverture |
| `signaux_vendeur` | 0.14 | NLP : urgence (succession, mutation…) vs red flags (souplex, RDC…) |
| `anciennete` | 0.10 | jours en ligne + baisses de prix = vendeur qui craque |
| `dpe_travaux` | 0.10 | DPE : décote/déficit foncier **vs** interdiction de louer (loi Climat) |
| `charges` | 0.06 | ratio charges copro / prix |
| `acces_actuel` | 0.04 | métro/RER/tram à pied aujourd'hui |

`× M_défense` (jusqu'à +20 % si porte-à-porte ≤ 30 min). Mode dégradé : un sous-score manquant est
neutralisé (politique configurable), jamais de crash. Voir `CLAUDE.md` pour les directives métier
complètes câblées dans le code.

```bash
chasseur score-file fixtures/listings.sample.json   # debug : scorer une annonce JSON
```

---

## 🥷 Passer en production : scrapers live & anti-bot

Les scrapers live sont des **squelettes honnêtes** (`src/chasseur/scrapers/`) : chacun documente sa
stratégie d'attaque réelle et lève `AntibotNotConfigured` tant que l'infra n'est pas branchée.

- **BienIci / PAP** — protection légère → **commencer ici** (PAP = particuliers, négo directe).
- **SeLoger** — DataDome → FlareSolverr (cookie) puis `__NEXT_DATA__`.
- **LeBonCoin** — DataDome → API interne + proxy résidentiel FR.

Couche anti-bot (`src/chasseur/antibot/`) : `curl_cffi` (impersonation JA3/TLS) → `httpx` → `urllib`
en dégradé, token bucket poli + jitter, rotation de proxies, backoff + circuit breaker.

```bash
pip install -e ".[scrape]"   # curl_cffi, selectolax, httpx
```

---

## 🐳 Infrastructure (optionnelle, prod)

```bash
docker compose up -d         # PostGIS + Redis + FlareSolverr
```

- **PostGIS** : agrégation DVF réelle au niveau IRIS / rayon (`enrich/dvf.py → DVFPostGISReference`).
- **Redis** : rate-limit / état des proxies distribué.
- **FlareSolverr** : résolution des challenges Cloudflare/JS.

---

## ⚙️ Configuration

Tout est surchargeable par variables d'environnement (`.env`, préfixe `CHASSEUR_`, imbrication `__`).
Copier `.env.example` → `.env`. Exemples :

```bash
CHASSEUR_BUDGET_MAX=310000
CHASSEUR_SCORING__DECOTE_TARGET=0.15
CHASSEUR_SCORING__ALERT_THRESHOLD=70
CHASSEUR_SEARCH__PROVIDER=tavily          # recherche web futurs transports
CHASSEUR_ALERT__TELEGRAM_BOT_TOKEN=...     # alerting (dry-run par défaut)
```

---

## 🧪 Développement

```bash
pip install -e ".[dev]"
pytest                       # 30 tests : scoring, NLP, travaux, store, pipeline, webexport
ruff check . && mypy src     # lint + typage strict
```

Le cœur (config, modèles, scoring, enrich purs, store, pipeline, webexport) est testé **sans réseau
ni Docker**. Les fonctions de scoring sont **pures** → 100 % testables.

---

## 🗂️ Structure

```
src/chasseur/
  config.py  models.py  pipeline.py  cli.py
  scoring/      # subscores purs + engine pondéré + reco d'action
  enrich/       # dvf, transport (GPE + web search), defense, nlp, travaux, geo
  antibot/      # session furtive, ratelimit, proxies, fingerprint, flaresolverr
  scrapers/     # base + sample + squelettes leboncoin/seloger/bienici/pap + registry
  storage/      # SQLiteStore (dédup, historique, cooldown) + PostGIS (skeleton)
  alerting/     # formatter coup-de-poing + telegram + email + notifier
  dashboard/    # webexport : pipeline -> window.PEPITE_DATA
web/            # design system Pépite (vendorisé) + ui_kit dashboard
data/           # gpe_stations.json, market_medians.sample.json
fixtures/       # annonces de démo
tests/          # pytest
CLAUDE.md       # contexte/standards pour le développement assisté
```

---

## ⚠️ Limites & risques

- **Technique** : DataDome/Kasada évoluent ; prévoir 5–20 % de blocage même bien configuré, multiplier
  les sources. Le backend `urllib` (sans `curl_cffi`) ne contourne **rien** — cibles non protégées only.
- **Immo** : l'estimation auto se trompe (DVF en retard, géocodage approximatif, NLP faillible). Le robot
  **présélectionne et arme la négo** — il ne signe pas le compromis. La visite reste reine.
- Données GPE / médianes DVF de la démo = **approximatives/illustratives** → fiabiliser via l'open data
  officiel (Société du Grand Paris, DVF) avant usage réel.

---

## 🎨 Provenance du design

`web/` est un **handoff Claude Design** (`Pépite — Design System`) : tokens dark BI, composants
(`ScoreGauge`, `ScoreRadar`, `RangeSlider`…) et un UI kit 4-vues. Il est **vendorisé tel quel** ;
l'app y injecte les données réelles du pipeline via `chasseur export-web` (contrat `window.PEPITE_DATA`).
Polices IBM Plex / Space Grotesk et icônes Lucide via CDN (substitutions — remplaçables par des polices
licenciées en self-host).
```

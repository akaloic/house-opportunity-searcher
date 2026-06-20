import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

// Système FR/EN léger : le FRANÇAIS est la source (les clés sont les chaînes FR
// du code). EN[fr] fournit la traduction ; clé absente → on retombe sur le FR.
// Les CONTENUS de données (titres d'annonces, adresses, logs) ne sont pas traduits
// — seul l'habillage UI l'est, comme dans une vraie app bilingue.
export type Lang = 'fr' | 'en'

const EN: Record<string, string> = {
  // ---- Shell / navigation ----
  'VEILLE · IDF': 'WATCH · IDF',
  Navigation: 'Navigation',
  Recherches: 'Saved searches',
  'Mes favoris': 'My favorites',
  'Filtrer :': 'Filter:',
  'Données pipeline': 'Pipeline data',
  'Mode démo': 'Demo mode',
  'Rechercher annonce, quartier, ID…': 'Search listing, area, ID…',
  Effacer: 'Clear',
  'Recherche rapide': 'Quick search',
  Rafraîchir: 'Refresh',
  // ---- Titres de vue ----
  "Vue d'ensemble": 'Overview',
  Opportunités: 'Opportunities',
  'Opportunités · Île-de-France': 'Opportunities · Île-de-France',
  'Moteur de scoring': 'Scoring engine',
  Monitoring: 'Monitoring',
  'Fiche détail': 'Listing detail',
  'Monitoring technique': 'Technical monitoring',
  'Carte & flux': 'Map & feed',
  'Tableau de bord': 'Dashboard',
  'Pondération & alertes': 'Weights & alerts',
  'Santé du pipeline': 'Pipeline health',
  'Aller à': 'Go to',
  Biens: 'Listings',
  'Aller à une vue, chercher un bien…': 'Go to a view, search a listing…',
  'Aucun résultat.': 'No results.',
  naviguer: 'navigate',
  ouvrir: 'open',
  fermer: 'close',
  // ---- score labels ----
  Pépite: 'Gem',
  'Bon plan': 'Good deal',
  Correct: 'Fair',
  'À surveiller': 'Watch',
  Surévalué: 'Overpriced',
  // ---- Overview / hero ----
  'Veille active · Île-de-France · axe La Défense': 'Live watch · Île-de-France · La Défense axis',
  'Détectez la ': 'Spot the ',
  'pépite immobilière': 'property gem',
  'avant tout le monde.': 'before anyone else.',
  "Chaque annonce est scorée sur 7 critères d'expert (décote DVF, futures gares du Grand Paris, signaux vendeur) pour révéler les biens sous-évalués.":
    'Every listing is scored on 7 expert criteria (DVF discount, future Grand Paris stations, seller signals) to surface undervalued properties.',
  "d'économie potentielle vs marché DVF": 'potential saving vs DVF market',
  'pépites détectées': 'gems detected',
  'Explorer les opportunités': 'Explore opportunities',
  'Voir la pépite n°1': 'See gem #1',
  'Pépites ≥ 80': 'Gems ≥ 80',
  'Décote médiane': 'Median discount',
  'Biens scannés': 'Listings scanned',
  'Meilleur score': 'Best score',
  'Pépite n°1': 'Gem #1',
  'sous le marché estimé · levier de négo': 'below estimated market · negotiation leverage',
  'Économie cumulée détectée': 'Cumulative saving detected',
  'Somme des décotes vs marché DVF, par ordre de détection': 'Sum of discounts vs DVF market, by detection order',
  'Pépites détectées': 'Gems detected',
  'score ≥ 80 / 100': 'score ≥ 80 / 100',
  'vs médiane DVF quartier': 'vs area DVF median',
  'Médiane marché /m²': 'Market median /m²',
  'micro-quartier, < 24 mois': 'micro-area, < 24 months',
  'Opportunités du moment': 'Current opportunities',
  'Tout voir': 'See all',
  'Cartographie des opportunités': 'Opportunity map',
  'Pins réels colorés par score · OSM + DVF': 'Real pins colored by score · OSM + DVF',
  'Chargement de la carte…': 'Loading map…',
  'Top pépites': 'Top gems',
  'Clic → fiche détail': 'Click → detail',
  'Répartition des scores': 'Score distribution',
  'Distribution des biens scannés': 'Distribution of scanned listings',
  'Profil de scoring moyen': 'Average scoring profile',
  'Forces du portefeuille détecté': 'Strengths of the detected portfolio',
  // ---- Opportunities ----
  pépites: 'gems',
  annonces: 'listings',
  Score: 'Score',
  Récent: 'Recent',
  Favoris: 'Favorites',
  Cartographie: 'Map',
  'Pins réels colorés par score': 'Real pins colored by score',
  'Flux de pépites': 'Gem feed',
  "Aucun favori pour l'instant. Cliquez sur ★ pour suivre un bien.":
    'No favorites yet. Click ★ to follow a listing.',
  'Aucune annonce ne correspond': 'No listing matches',
  'Toutes les annonces': 'All listings',
  'Aucun résultat.​': 'No results.',
  // ---- Scoring ----
  "7 critères d'expert · pondérables": '7 expert criteria · weighted',
  'Pondération du scoring': 'Score weighting',
  "Ajustez les poids : l'aperçu se recalcule en direct": 'Adjust the weights: the preview recomputes live',
  'Somme des poids · normalisée à 100 %': 'Sum of weights · normalized to 100%',
  pts: 'pts',
  'Filtres stricts': 'Hard filters',
  'Exclusion ferme : appliqués avant le scoring': 'Hard exclusion: applied before scoring',
  'Prix maximum': 'Max price',
  'Surface minimum': 'Min area',
  'Zones géographiques': 'Geographic zones',
  Zone: 'Zone',
  'Code postal à ajouter (ex : 92110)': 'Postal code to add (e.g. 92110)',
  'DPE maximum': 'Max EPC',
  Tous: 'All',
  'Aperçu temps réel': 'Live preview',
  'Re-classement instantané': 'Instant re-ranking',
  alertes: 'alerts',
  'Aucun bien ne passe les filtres stricts.': 'No listing passes the hard filters.',
  Alertes: 'Alerts',
  "Seuil d'alerte (score min.)": 'Alert threshold (min. score)',
  'Alerte e-mail': 'Email alert',
  'Notification instantanée': 'Instant notification',
  Réinitialiser: 'Reset',
  Enregistrer: 'Save',
  'Enregistré ✓': 'Saved ✓',
  // ---- Monitoring ----
  'Pipeline actif': 'Pipeline live',
  'Uptime · 30j': 'Uptime · 30d',
  'Requêtes / min': 'Requests / min',
  'Taux de succès': 'Success rate',
  'Requêtes bloquées': 'Blocked requests',
  'Proxies sains': 'Healthy proxies',
  'Sources de scraping': 'Scraping sources',
  Source: 'Source',
  Scannées: 'Scanned',
  Pépites: 'Gems',
  Bloquées: 'Blocked',
  'Taux · proxy': 'Rate · proxy',
  'Débit de scraping': 'Scraping throughput',
  'Requêtes / minute · 24 dernières heures': 'Requests / minute · last 24 hours',
  'Pool de proxies': 'Proxy pool',
  'Santé système': 'System health',
  'Console de logs': 'Log console',
  'Flux agrégé · toutes sources': 'Aggregated feed · all sources',
  'En pause': 'Paused',
  Reprendre: 'Resume',
  Pause: 'Pause',
  Exporter: 'Export',
  // ---- Detail ----
  Retour: 'Back',
  Précédent: 'Previous',
  Suivant: 'Next',
  "Voir l'annonce": 'View listing',
  'Annonces similaires': 'Similar listings',
  'Suivi ✓': 'Following ✓',
  Suivre: 'Follow',
  Suivi: 'Following',
  Surface: 'Area',
  Pièces: 'Rooms',
  Étage: 'Floor',
  Balcon: 'Balcony',
  Ascenseur: 'Elevator',
  Oui: 'Yes',
  Non: 'No',
  'Transports & accessibilité': 'Transit & access',
  'Temps de marche · isochrone 15 min': 'Walking time · 15 min isochrone',
  'Aucune gare renseignée.': 'No station listed.',
  'Prix de vente': 'Asking price',
  "Plan d'action": 'Action plan',
  'Moteur de scoring · reco chiffrée': 'Scoring engine · costed reco',
  'Estimation · stratégie de négociation': 'Estimate · negotiation strategy',
  moteur: 'engine',
  estimation: 'estimate',
  "Offre d'attaque suggérée": 'Suggested opening offer',
  'vs prix affiché': 'vs listed price',
  'Coût de revient complet': 'Full all-in cost',
  'Prix affiché': 'Listed price',
  'Travaux estimés': 'Estimated works',
  'Frais de notaire (7,5 %)': 'Notary fees (7.5%)',
  'Coût de revient': 'All-in cost',
  'Leviers de négociation': 'Negotiation levers',
  'La Défense': 'La Défense',
  'Rendement net est.': 'Est. net yield',
  'Comparaison au marché': 'Market comparison',
  'Cette annonce': 'This listing',
  Médiane: 'Median',
  'sous le marché estimé': 'below estimated market',
  'au-dessus du marché': 'above market',
  'Justification du score': 'Score breakdown',
  'Score pondéré total': 'Total weighted score',
  'Voir l’annonce': 'View listing',
  // ---- CRITERIA (labels & shorts) ----
  'Décote vs marché (DVF)': 'Discount vs market (DVF)',
  Décote: 'Discount',
  'Transport futur (Grand Paris)': 'Future transit (Grand Paris)',
  'Signaux vendeur (NLP)': 'Seller signals (NLP)',
  Vendeur: 'Seller',
  'Ancienneté / levier négo': 'Time on market / leverage',
  Négo: 'Nego',
  'DPE / déficit foncier': 'EPC / tax deficit',
  'Charges copropriété': 'HOA fees',
  Charges: 'Fees',
  'Accès transports actuel': 'Current transit access',
  Accès: 'Access',
  // ---- Listing cards ----
  'sous le marché estimé​': 'below estimated market',
  // ---- divers ----
  'Équilibré': 'Balanced',
  Investisseur: 'Investor',
  'Cash-flow': 'Cash-flow',
  'bloq.': 'blk',
  'Médiane quartier': 'Area median',
  'score = Σ ( critère × poids )': 'score = Σ ( criterion × weight )',
  'détectée il y a': 'detected',
  Language: 'Language',
}

function detect(): Lang {
  try {
    const s = localStorage.getItem('pepite_lang')
    if (s === 'fr' || s === 'en') return s
  } catch {
    /* ignore */
  }
  return typeof navigator !== 'undefined' && !navigator.language?.toLowerCase().startsWith('fr') ? 'en' : 'fr'
}

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: 'fr', setLang: () => {} })

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detect)
  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem('pepite_lang', l)
    } catch {
      /* ignore */
    }
    document.documentElement.lang = l
  }, [])
  return <LangCtx.Provider value={{ lang, setLang }}>{children}</LangCtx.Provider>
}

export function useLang() {
  return useContext(LangCtx)
}

// Hook de traduction : retourne t(fr) → EN si dispo et langue=en, sinon fr.
export function useT() {
  const { lang } = useContext(LangCtx)
  return useCallback((fr: string) => (lang === 'en' ? EN[fr] ?? fr : fr), [lang])
}

// Toggle FR/EN « liquid glass » avec indicateur qui glisse.
export function LangToggle() {
  const { lang, setLang } = useLang()
  return (
    <div className="lang" role="group" aria-label="Language">
      <span className="lang__slider" data-lang={lang} aria-hidden="true" />
      {(['fr', 'en'] as const).map((l) => (
        <button
          key={l}
          type="button"
          className={`lang__btn${lang === l ? ' is-active' : ''}`}
          aria-pressed={lang === l}
          onClick={() => setLang(l)}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

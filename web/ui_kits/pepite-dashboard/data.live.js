/* Généré par `chasseur export-web` — données RÉELLES du pipeline. Ne pas éditer. */
window.PEPITE_DATA = {
  "CRITERIA": [
    {
      "key": "decote",
      "label": "Décote vs marché (DVF)",
      "short": "Décote",
      "icon": "euro",
      "accent": "var(--viz-1)"
    },
    {
      "key": "futur_transport",
      "label": "Transport futur (Grand Paris)",
      "short": "GPE",
      "icon": "route",
      "accent": "var(--viz-2)"
    },
    {
      "key": "signaux_vendeur",
      "label": "Signaux vendeur (NLP)",
      "short": "Vendeur",
      "icon": "zap",
      "accent": "var(--viz-6)"
    },
    {
      "key": "anciennete",
      "label": "Ancienneté / levier négo",
      "short": "Négo",
      "icon": "history",
      "accent": "var(--viz-3)"
    },
    {
      "key": "dpe_travaux",
      "label": "DPE / déficit foncier",
      "short": "DPE",
      "icon": "leaf",
      "accent": "var(--viz-8)"
    },
    {
      "key": "charges",
      "label": "Charges copropriété",
      "short": "Charges",
      "icon": "layers",
      "accent": "var(--viz-5)"
    },
    {
      "key": "acces_actuel",
      "label": "Accès transports actuel",
      "short": "Accès",
      "icon": "train",
      "accent": "var(--brand-500)"
    }
  ],
  "WEIGHTS": {
    "decote": 34,
    "futur_transport": 22,
    "signaux_vendeur": 14,
    "anciennete": 10,
    "dpe_travaux": 10,
    "charges": 6,
    "acces_actuel": 4
  },
  "LISTINGS": [
    {
      "id": "cb-001",
      "score": 82,
      "title": "T2 lumineux 44m2 - Courbevoie",
      "addr": "Courbevoie 92400",
      "quartier": "Courbevoie",
      "price": 268000,
      "surface": 44,
      "rooms": 2,
      "floor": 3,
      "floors": 3,
      "ppm2": 6091,
      "marketPpm2": 7300,
      "dpe": "F",
      "source": "Échantillon",
      "freshMin": 123065,
      "photos": 0,
      "metro": [
        {
          "line": "M15",
          "name": "Becon-les-Bruyeres",
          "min": 5
        },
        {
          "line": "M15",
          "name": "Bois-Colombes",
          "min": 17
        }
      ],
      "crit": {
        "decote": 100,
        "futur_transport": 30,
        "signaux_vendeur": 100,
        "anciennete": 100,
        "dpe_travaux": 50,
        "charges": 69,
        "acces_actuel": 50
      },
      "x": 45,
      "y": 37,
      "tags": [
        "Pépite",
        "Sous le marché",
        "Vendeur qui craque"
      ],
      "fav": false
    },
    {
      "id": "co-003",
      "score": 65,
      "title": "3 pieces 65m2 a renover - Colombes",
      "addr": "Colombes 92700",
      "quartier": "Colombes",
      "price": 295000,
      "surface": 65,
      "rooms": 3,
      "floor": 1,
      "floors": 1,
      "ppm2": 4538,
      "marketPpm2": 5600,
      "dpe": "G",
      "source": "Échantillon",
      "freshMin": 222365,
      "photos": 0,
      "metro": [
        {
          "line": "M15",
          "name": "Bois-Colombes",
          "min": 17
        },
        {
          "line": "M15",
          "name": "Becon-les-Bruyeres",
          "min": 25
        },
        {
          "line": "M15",
          "name": "Les Agnettes",
          "min": 31
        }
      ],
      "crit": {
        "decote": 100,
        "futur_transport": 2,
        "signaux_vendeur": 60,
        "anciennete": 100,
        "dpe_travaux": 40,
        "charges": 39,
        "acces_actuel": 50
      },
      "x": 44,
      "y": 30,
      "tags": [
        "Sous le marché",
        "Passoire (G)",
        "Future gare"
      ],
      "fav": false
    },
    {
      "id": "as-002",
      "score": 43,
      "title": "Souplex atypique 38m2 - Asnieres",
      "addr": "Asnieres-sur-Seine 92600",
      "quartier": "Asnieres-sur-Seine",
      "price": 235000,
      "surface": 38,
      "rooms": 2,
      "floor": 0,
      "floors": 0,
      "ppm2": 6184,
      "marketPpm2": 7000,
      "dpe": "E",
      "source": "Échantillon",
      "freshMin": 5885,
      "photos": 0,
      "metro": [
        {
          "line": "M15",
          "name": "Les Agnettes",
          "min": 10
        },
        {
          "line": "M15",
          "name": "Bois-Colombes",
          "min": 16
        },
        {
          "line": "M15",
          "name": "Becon-les-Bruyeres",
          "min": 20
        }
      ],
      "crit": {
        "decote": 78,
        "futur_transport": 16,
        "signaux_vendeur": 50,
        "anciennete": 6,
        "dpe_travaux": 50,
        "charges": 69,
        "acces_actuel": 50
      },
      "x": 48,
      "y": 33,
      "tags": [
        "Sous le marché",
        "Future gare"
      ],
      "fav": false
    }
  ],
  "SOURCES": [
    {
      "name": "Échantillon",
      "status": "online",
      "scanned": 4,
      "found": 3,
      "blocked": 0,
      "latency": 0,
      "proxy": "direct"
    },
    {
      "name": "Leboncoin",
      "status": "idle",
      "scanned": 0,
      "found": 0,
      "blocked": 0,
      "latency": 0,
      "proxy": "—"
    },
    {
      "name": "SeLoger",
      "status": "idle",
      "scanned": 0,
      "found": 0,
      "blocked": 0,
      "latency": 0,
      "proxy": "—"
    },
    {
      "name": "Bien'ici",
      "status": "idle",
      "scanned": 0,
      "found": 0,
      "blocked": 0,
      "latency": 0,
      "proxy": "—"
    },
    {
      "name": "PAP",
      "status": "idle",
      "scanned": 0,
      "found": 0,
      "blocked": 0,
      "latency": 0,
      "proxy": "—"
    }
  ],
  "LOGS": [
    {
      "time": "20:05:41",
      "level": "debug",
      "source": "sample",
      "message": "pu-004 exclu (budget)"
    },
    {
      "time": "20:05:41",
      "level": "info",
      "source": "sample",
      "message": "co-003 scoré 65 (interesting)"
    },
    {
      "time": "20:05:41",
      "level": "info",
      "source": "sample",
      "message": "as-002 scoré 43 (watch)"
    },
    {
      "time": "20:05:41",
      "level": "ok",
      "source": "sample",
      "message": "cb-001 scoré 82 (hot)"
    }
  ]
};
window.fmtEur = (n) => n.toLocaleString('fr-FR');
window.fmtAgo = (m) => m < 60 ? `${m} min` : m < 1440 ? `${Math.round(m/60)} h` : `${Math.round(m/1440)} j`;

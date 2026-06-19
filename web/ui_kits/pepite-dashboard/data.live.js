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
      "url": "https://example.invalid/annonce/cb-001",
      "score": 82,
      "title": "T2 lumineux 44m2 - Courbevoie",
      "addr": "Courbevoie 92400",
      "quartier": "Courbevoie",
      "price": 268000,
      "surface": 44,
      "rooms": 2,
      "floor": 3,
      "floors": 5,
      "floorKnown": true,
      "balcon": true,
      "elevator": true,
      "ppm2": 6091,
      "marketPpm2": 7300,
      "dpe": "F",
      "source": "Échantillon",
      "freshMin": 131139,
      "photos": 1,
      "photoUrls": [
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
      ],
      "lat": 48.905,
      "lon": 2.267,
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
      "fav": false,
      "reco": {
        "recommendation": "Appelle aujourd'hui, cale une visite sous 48h. Offre d'attaque -20% (214 400 EUR) — justifiée par signaux vendeur (cause mutation, mutation professionnelle, ideal investisseur, a debattre, libre rapidement) + en ligne depuis 91 j + 2 baisses de prix + DPE F + multi-diffusion x3 + vente de particulier.",
        "level": "hot",
        "suggestedOfferPrice": 214400.0,
        "suggestedDiscount": 0.2,
        "fullCost": 288100.0,
        "effectivePpm2": 6548.0,
        "netYield": null,
        "decotePct": 16.6,
        "defenseMinutes": 16.8,
        "flags": [
          "Décote +17% vs médiane micro-quartier 7300 EUR/m2 (DVF)",
          "Future gare Becon-les-Bruyeres (M15 Ouest) à 427 m, ouverture ~2031",
          "Levier déficit foncier possible (travaux déductibles des revenus fonciers)",
          "⚠️ DPE F : location interdite dès 2028 — budgéter la rénovation énergétique",
          "Accès La Défense ultra-compétitif (~17 min porte-à-porte)"
        ],
        "renovation": {
          "totalCost": 0,
          "costPerM2": 0,
          "condition": "good",
          "notes": "état correct, aléa travaux faible"
        },
        "sellerSignals": {
          "urgency": [
            "cause mutation",
            "mutation professionnelle",
            "ideal investisseur",
            "a debattre",
            "libre rapidement"
          ],
          "redflags": []
        }
      }
    },
    {
      "id": "co-003",
      "url": "https://example.invalid/annonce/co-003",
      "score": 65,
      "title": "3 pieces 65m2 a renover - Colombes",
      "addr": "Colombes 92700",
      "quartier": "Colombes",
      "price": 295000,
      "surface": 65,
      "rooms": 3,
      "floor": 1,
      "floors": 6,
      "floorKnown": true,
      "balcon": false,
      "elevator": false,
      "ppm2": 4538,
      "marketPpm2": 5600,
      "dpe": "G",
      "source": "Échantillon",
      "freshMin": 230439,
      "photos": 0,
      "photoUrls": [],
      "lat": 48.923,
      "lon": 2.254,
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
      "fav": false,
      "reco": {
        "recommendation": "À surveiller — recontacte si le prix bouge ou si une visite se libère. Offre d'attaque -20% (236 000 EUR) — justifiée par signaux vendeur (succession, vente rapide) + en ligne depuis 160 j + DPE G. Budget travaux estimé ~84 500 EUR (rénovation lourde / tout à refaire). Attention : non louable en l'état, monter le dossier sur la revente ou la rénovation.",
        "level": "interesting",
        "suggestedOfferPrice": 236000.0,
        "suggestedDiscount": 0.2,
        "fullCost": 401625.0,
        "effectivePpm2": 6179.0,
        "netYield": null,
        "decotePct": 19.0,
        "defenseMinutes": 21.0,
        "flags": [
          "Décote +19% vs médiane micro-quartier 5600 EUR/m2 (DVF)",
          "Future gare Bois-Colombes (M15 Ouest) à 1346 m, ouverture ~2031",
          "Levier déficit foncier possible (travaux déductibles des revenus fonciers)",
          "⚠️ DPE G : location déjà interdite (loi Climat) — viser revente ou rénovation",
          "Charges copro élevées (1.2%/an du prix) — rentabilité grevée"
        ],
        "renovation": {
          "totalCost": 84500,
          "costPerM2": 1300,
          "condition": "gut",
          "notes": "rénovation lourde / tout à refaire"
        },
        "sellerSignals": {
          "urgency": [
            "succession",
            "vente rapide"
          ],
          "redflags": [
            "a renover entierement",
            "gros travaux",
            "travaux a prevoir"
          ]
        }
      }
    },
    {
      "id": "pu-005",
      "url": "https://example.invalid/annonce/pu-005",
      "score": 61,
      "title": "T3 avec balcon 58m2 - Courbevoie",
      "addr": "Courbevoie 92400",
      "quartier": "Courbevoie",
      "price": 299000,
      "surface": 58,
      "rooms": 3,
      "floor": 4,
      "floors": 6,
      "floorKnown": true,
      "balcon": true,
      "elevator": true,
      "ppm2": 5155,
      "marketPpm2": 7300,
      "dpe": "D",
      "source": "Échantillon",
      "freshMin": 10119,
      "photos": 0,
      "photoUrls": [],
      "lat": 48.897,
      "lon": 2.252,
      "metro": [
        {
          "line": "M15",
          "name": "La Défense",
          "min": 15
        },
        {
          "line": "M15",
          "name": "Becon-les-Bruyeres",
          "min": 23
        },
        {
          "line": "RER",
          "name": "Nanterre La Folie",
          "min": 26
        }
      ],
      "crit": {
        "decote": 100,
        "futur_transport": 5,
        "signaux_vendeur": 50,
        "anciennete": 11,
        "dpe_travaux": 50,
        "charges": 68,
        "acces_actuel": 50
      },
      "x": 43,
      "y": 41,
      "tags": [
        "Sous le marché",
        "Future gare"
      ],
      "fav": false,
      "reco": {
        "recommendation": "À surveiller — recontacte si le prix bouge ou si une visite se libère. Offre d'attaque -7% (278 070 EUR) — justifiée par vente de particulier.",
        "level": "interesting",
        "suggestedOfferPrice": 278070.0,
        "suggestedDiscount": 0.07,
        "fullCost": 321425.0,
        "effectivePpm2": 5542.0,
        "netYield": null,
        "decotePct": 29.4,
        "defenseMinutes": 11.5,
        "flags": [
          "Décote +29% vs médiane micro-quartier 7300 EUR/m2 (DVF)",
          "Future gare La Défense (M15 Ouest) à 1176 m, ouverture ~2031",
          "Accès La Défense ultra-compétitif (~12 min porte-à-porte)"
        ],
        "renovation": {
          "totalCost": 0,
          "costPerM2": 0,
          "condition": "good",
          "notes": "état correct, aléa travaux faible"
        },
        "sellerSignals": {
          "urgency": [],
          "redflags": []
        }
      }
    },
    {
      "id": "as-002",
      "url": "https://example.invalid/annonce/as-002",
      "score": 44,
      "title": "Souplex atypique 38m2 - Asnieres",
      "addr": "Asnieres-sur-Seine 92600",
      "quartier": "Asnieres-sur-Seine",
      "price": 235000,
      "surface": 38,
      "rooms": 2,
      "floor": 0,
      "floors": 4,
      "floorKnown": true,
      "balcon": false,
      "elevator": false,
      "ppm2": 6184,
      "marketPpm2": 7000,
      "dpe": "E",
      "source": "Échantillon",
      "freshMin": 13959,
      "photos": 0,
      "photoUrls": [],
      "lat": 48.917,
      "lon": 2.288,
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
        "anciennete": 15,
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
      "fav": false,
      "reco": {
        "recommendation": "Veille passive : pas prioritaire en l'état. Offre d'attaque -5% (223 250 EUR). Budget travaux estimé ~13 300 EUR (rafraîchissement (peinture, sols)).",
        "level": "watch",
        "suggestedOfferPrice": 223250.0,
        "suggestedDiscount": 0.05,
        "fullCost": 265925.0,
        "effectivePpm2": 6998.0,
        "netYield": null,
        "decotePct": 11.7,
        "defenseMinutes": 24.6,
        "flags": [
          "Décote +12% vs médiane micro-quartier 7000 EUR/m2 (DVF)",
          "Future gare Les Agnettes (M15 Ouest) à 778 m, ouverture ~2031"
        ],
        "renovation": {
          "totalCost": 13300,
          "costPerM2": 350,
          "condition": "refresh",
          "notes": "rafraîchissement (peinture, sols)"
        },
        "sellerSignals": {
          "urgency": [],
          "redflags": [
            "souplex",
            "rez-de-chaussee sur rue",
            "atypique",
            "vis-a-vis"
          ]
        }
      }
    },
    {
      "id": "pu-004",
      "url": "https://example.invalid/annonce/pu-004",
      "score": 28,
      "title": "T2 refait a neuf - Puteaux",
      "addr": "Puteaux 92800",
      "quartier": "Puteaux",
      "price": 332000,
      "surface": 40,
      "rooms": 2,
      "floor": 5,
      "floors": 8,
      "floorKnown": true,
      "balcon": true,
      "elevator": true,
      "ppm2": 8300,
      "marketPpm2": 8200,
      "dpe": "C",
      "source": "Échantillon",
      "freshMin": 43179,
      "photos": 0,
      "photoUrls": [],
      "lat": 48.884,
      "lon": 2.239,
      "metro": [
        {
          "line": "M15",
          "name": "La Défense",
          "min": 11
        },
        {
          "line": "RER",
          "name": "Nanterre La Folie",
          "min": 28
        }
      ],
      "crit": {
        "decote": 50,
        "futur_transport": 12,
        "signaux_vendeur": 50,
        "anciennete": 39,
        "dpe_travaux": 50,
        "charges": 68,
        "acces_actuel": 50
      },
      "x": 42,
      "y": 46,
      "tags": [
        "Future gare"
      ],
      "fav": false,
      "reco": {
        "recommendation": "Veille passive : pas prioritaire en l'état. Offre d'attaque -5% (315 400 EUR).",
        "level": "watch",
        "suggestedOfferPrice": 315400.0,
        "suggestedDiscount": 0.05,
        "fullCost": 356900.0,
        "effectivePpm2": 8922.0,
        "netYield": null,
        "decotePct": -1.2,
        "defenseMinutes": 10.3,
        "flags": [
          "Décote -1% vs médiane micro-quartier 8200 EUR/m2 (DVF)",
          "Future gare La Défense (M15 Ouest) à 870 m, ouverture ~2031",
          "Accès La Défense ultra-compétitif (~10 min porte-à-porte)"
        ],
        "renovation": {
          "totalCost": 0,
          "costPerM2": 0,
          "condition": "new",
          "notes": "rien à prévoir"
        },
        "sellerSignals": {
          "urgency": [],
          "redflags": []
        }
      }
    }
  ],
  "SOURCES": [
    {
      "name": "Échantillon",
      "status": "online",
      "scanned": 5,
      "found": 5,
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
      "time": "10:39:22",
      "level": "info",
      "source": "sample",
      "message": "pu-005 scoré 61 (interesting)"
    },
    {
      "time": "10:39:22",
      "level": "info",
      "source": "sample",
      "message": "pu-004 scoré 28 (watch)"
    },
    {
      "time": "10:39:22",
      "level": "info",
      "source": "sample",
      "message": "co-003 scoré 65 (interesting)"
    },
    {
      "time": "10:39:22",
      "level": "info",
      "source": "sample",
      "message": "as-002 scoré 44 (watch)"
    },
    {
      "time": "10:39:22",
      "level": "ok",
      "source": "sample",
      "message": "cb-001 scoré 82 (hot)"
    }
  ]
};
window.fmtEur = (n) => n.toLocaleString('fr-FR');
window.fmtAgo = (m) => m < 60 ? `${m} min` : m < 1440 ? `${Math.round(m/60)} h` : `${Math.round(m/1440)} j`;

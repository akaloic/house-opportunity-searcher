"""Filet de sécurité : rend le paquet importable en tests sans installation.

Permet `import chasseur` même si `pip install -e .` n'a pas été lancé.
"""

from __future__ import annotations

import sys
from pathlib import Path

SRC = Path(__file__).parent / "src"
if SRC.is_dir() and str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

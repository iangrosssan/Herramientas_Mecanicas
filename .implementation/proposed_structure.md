# Proposed Structure for MecaToolbox

Modular architecture to expand from a simple script collection to a professional Engineering Suite.

```text
MecaToolbox/
├── frontend/             # Unified Engineering Dashboard (Vite/React)
│   ├── src/
│   │   ├── modules/      # Integrated Solvers
│   │   │   ├── heat/     # Heat Convection (Integrated)
│   │   │   ├── deflection/ # Multi-field Deflection (Proposed)
│   │   │   └── fluids/   # Fluid Dynamics (Planned)
│   │   └── components/   # Shared UI (Cards, Charts)
├── backend/              # Unified Physics Engine (FastAPI)
│   ├── app/
│   │   ├── api/          # Modular API routes
│   │   │   ├── heat.py
│   │   │   └── deflection.py
│   │   └── core/         # Shared Physics Logic
│   │       ├── materials/ # Shared Material Database
│   │       └── units/    # Global Unit Converter
├── deflection_tool/      # Stand-alone Solid Mechanics Module
├── heat_convection/      # Heat Transfer Module
├── legacy/               # Spreadsheet & Notebook tools
└── docs/                 # Engineering manuals
```

### Integration Plan
1. **Solver Access**: The dashboard at `frontend/src` will act as a "Multifield Hub".
2. **Modular Backend**: Each tool will eventually migrate its core logic to `backend/app/api/`.
3. **Materials DB**: Consolidate `deflection_tool/data/materials.json` and `heat_convection/properties.py` into a single source of truth.

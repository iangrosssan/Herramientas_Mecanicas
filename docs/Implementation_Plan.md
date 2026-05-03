# Implementation Plan — MecaToolbox

From engineering scripts to an interactive, process-driven toolbox hosted on the Portafolio.

## Vision

MecaToolbox evolves from a collection of solvers into a **kinematic simulator** — a "choose your fighter" experience where the user selects an observable (solid, fluid, thermodynamic cycle, electrical circuit) and applies mechanical operations to it. Distinct panels give access to different engineering processes:

- Define a solid → run FEM
- Measure properties across a thermodynamic cycle
- Design gears from stress constraints
- Calculate deflection on arbitrary beam/shaft geometries

The Portafolio (Eleventy site) acts as the public gateway; MecaToolbox runs on localhost as a self-hosted engineering dashboard.

---

## Current State

| Module | Status | Stack |
|---|---|---|
| `heat_convection` | Dashboard interactivo | FastAPI + Vite/React |
| `deflection_tool` | Solver validado (CLI) | Python puro |
| Legacy (engranes, frenos) | Hojas sueltas | Excel / Mathematica |

---

## Roadmap

### Phase 1 — Unified Backend
1. Migrate `heat_convection` physics to `backend/app/api/heat.py`
2. Expose `deflection_tool/core/solver.py` via `backend/app/api/deflection.py`
3. Consolidate material data (`materials.json` + `properties.py`) into `backend/app/core/materials/`
4. Add unit conversion layer at `backend/app/core/units/`

### Phase 2 — Multifield Dashboard
1. Scaffold `frontend/` (Vite/React) with module-routed panels
2. Port `heat_convection` UI into `frontend/src/modules/heat/`
3. Build interactive deflection panel at `frontend/src/modules/deflection/`
4. Shared components: input cards, result charts, material selector

### Phase 3 — Process-Driven UX
1. "Observable selector" — choose solid/fluid/cycle/circuit as starting point
2. Chain operations (e.g., define shaft → apply loads → view deflection → check fatigue)
3. Versátil panel access — different views depending on operation type
4. Real-time feedback & micro-animations per the dashboard design

### Phase 4 — Portafolio Integration
1. Eleventy migration complete (see `Portafolio/.implementation/eleventy_migration.md`)
2. MecaToolbox linked from `repo_codigo/` section
3. Live demo endpoint or embedded preview in portfolio
4. GitHub Pages deploy via Actions

### Phase 5 — Tool Upload & Legacy Migration
1. Digitize `Calculo_de_Engrane.xlsx` → gear design module
2. Port `frenos&embragues.nb` → brake/clutch module
3. All tools accessible from localhost dashboard
4. Legacy files moved to `legacy/` directory

### Phase 6 — Nest web app
1. Mount webapp as a subdomain of MyWebPage (currently Portafolio)
2. 

---

## Target Structure

```text
MecaToolbox/
├── frontend/                # Unified Engineering Dashboard (Vite/React)
│   └── src/
│       ├── modules/
│       │   ├── heat/        # Heat Convection (port from current UI)
│       │   ├── deflection/  # Deflection Solver (new panel)
│       │   └── fluids/      # Fluid Dynamics (planned)
│       └── components/      # Shared UI (Cards, Charts, Material Selector)
├── backend/                 # Unified Physics Engine (FastAPI)
│   └── app/
│       ├── api/             # Modular API routes
│       │   ├── heat.py
│       │   └── deflection.py
│       └── core/            # Shared Physics Logic
│           ├── materials/   # Consolidated Material Database
│           └── units/       # Global Unit Converter
├── heat_convection/         # Current standalone module (source of truth)
├── deflection_tool/         # Current standalone solver
├── legacy/                  # Excel & Notebook tools (pre-migration)
└── docs/                    # Engineering manuals & reference PDFs
```

---

## Links

- Portafolio Eleventy migration: `Portafolio/.implementation/eleventy_migration.md`
- Proposed structure detail: `.implementation/proposed_structure.md`
- Deflection validation: `deflection_tool/VALIDATED_RESULTS.md/`

Última Actualización
marzo 10 2026

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict
import functions
import properties

app = FastAPI(title="Heat Convection Toolbox API")

# Enable CORS for frontend interaction
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FluidRequest(BaseModel):
    fluid_type: str  # "water" or "air"
    temp: float

class ReRequest(BaseModel):
    u: float
    L: float
    nu: float

class NuMixedRequest(BaseModel):
    Re_L: float
    Pr: float
    Re_c: float = 5e5
    faces: int = 1

@app.get("/")
def read_root():
    return {"message": "Heat Convection Toolbox API is running"}

@app.post("/properties")
def get_properties(req: FluidRequest):
    fluid_map = {
        "water": properties.Water,
        "air": properties.Air
    }
    
    fluid_class = fluid_map.get(req.fluid_type.lower())
    if not fluid_class:
        raise HTTPException(status_code=400, detail="Invalid fluid type. Use 'water' or 'air'.")
    
    try:
        props = properties.get_derived_props(fluid_class, req.temp)
        return props
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/calculate/re")
def calculate_re(req: ReRequest):
    result = functions.re(req.u, req.L, req.nu)
    return {"re": result}

@app.post("/calculate/nu_mixed")
def calculate_nu_mixed(req: NuMixedRequest):
    result = functions.nu_mixed_plate(req.Re_L, req.Pr, req.Re_c, req.faces)
    return {"nu": result}

# Add more endpoints as needed...

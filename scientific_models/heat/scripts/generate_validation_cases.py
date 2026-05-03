import json
import os
import sys
import datetime

# Add back-path to import heat_convection properties from the legacy backend
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))
try:
    from heat_convection.properties import Water, Air, get_derived_props
except ImportError:
    print("Could not import heat_convection. Run this script from the workspace root.")
    sys.exit(1)

def generate_fluids_spec():
    """Generates fluids.json by calculating properties over a stable Tier-A range."""
    water_temps = [280, 300, 320, 340, 360]  # K, approximated since original was degC or K?
    # Wait, Water class uses T in degC or Kelvin? 
    # Let's inspect properties.py: T = 0.1C - 100C for Water, T=200K - 400K for Air.
    # We will compute arrays.
    
    water_temps_C = [10, 20, 40, 60, 80, 90]
    air_temps_K = [250, 280, 300, 320, 350, 400]
    
    fluids_data = {
        "metadata": {
            "source": "Python source-of-truth kernel (heat_convection.properties)",
            "units": "SI (T in specified keys)",
            "generated_by": "generate_validation_cases.py",
            "generated_at": datetime.datetime.now().isoformat(),
            "notes": "Tier A demo-safe operating range for Water (C) and Air (K)"
        },
        "Water": {},
        "Air": {}
    }
    
    for T in water_temps_C:
        fluids_data["Water"][str(T)] = get_derived_props(Water, T)
        
    for T in air_temps_K:
        fluids_data["Air"][str(T)] = get_derived_props(Air, T)
        
    spec_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../spec'))
    os.makedirs(spec_dir, exist_ok=True)
    
    fluids_path = os.path.join(spec_dir, 'fluids.json')
    with open(fluids_path, 'w') as f:
        json.dump(fluids_data, f, indent=2)
    print(f"Generated {fluids_path}")

def generate_validation_cases():
    """Generates correlation fixtures."""
    # We will run canonical functions from T3, T5, etc if available.
    # For now, we will create the structure.
    cases = {
        "metadata": {
            "source": "Python source-of-truth kernel",
            "units": "SI",
            "generated_by": "generate_validation_cases.py",
            "generated_at": datetime.datetime.now().isoformat()
        },
        "cases": []
    }
    spec_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../spec'))
    os.makedirs(spec_dir, exist_ok=True)
    
    validations_path = os.path.join(spec_dir, 'validation_cases.json')
    with open(validations_path, 'w') as f:
        json.dump(cases, f, indent=2)
    print(f"Generated {validations_path}")

if __name__ == '__main__':
    generate_fluids_spec()
    generate_validation_cases()

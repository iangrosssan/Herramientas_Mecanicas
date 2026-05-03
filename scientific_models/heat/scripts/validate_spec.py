import json
import os
import sys

# Simplified custom schema validation for Python without external jsonschema dependency
def validate_fluids(data):
    if "metadata" not in data: return False
    if "Water" not in data or "Air" not in data: return False
    for t, props in data["Water"].items():
        if not all(k in props for k in ["rho", "mu", "cp", "k", "nu", "alpha", "pr"]): return False
    return True

def validate_cases(data):
    if "metadata" not in data: return False
    if "cases" not in data: return False
    return isinstance(data["cases"], list)

if __name__ == '__main__':
    spec_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../spec'))
    
    with open(os.path.join(spec_dir, 'fluids.json'), 'r') as f:
        fluids = json.load(f)
        assert validate_fluids(fluids), "fluids.json schema invalid!"
        
    with open(os.path.join(spec_dir, 'validation_cases.json'), 'r') as f:
        cases = json.load(f)
        assert validate_cases(cases), "validation_cases.json schema invalid!"
        
    print("Heat JSON Schemas validated successfully.")

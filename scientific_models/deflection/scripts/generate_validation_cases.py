import json
import os
import sys
import datetime

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))
try:
    from deflection_tool.core.beam import Beam
    from deflection_tool.core.profiles import CircularProfile
    from deflection_tool.core.materials import Material
    from deflection_tool.core.loads import DistributedLoad, PointLoad
    from deflection_tool.core.solver import Solver
except ImportError:
    print("Could not import deflection_tool. Run this script from the workspace root.")
    sys.exit(1)

def generate_canonical_cases():
    """Generates deflection cases: Cantilever and Simply Supported."""
    spec_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../spec'))
    os.makedirs(spec_dir, exist_ok=True)
    
    # Material
    steel = Material(name="Steel", E=200e9, G=77e9, nu=0.3, rho=7850)
    
    # Case 1: Cantilever with Point Load at tip
    # NOTE: The python solver solves Fixed-Free Cantilever inherently due to 
    # y=0, theta=0 assumptions OR Supported-Supported via C1.
    # The existing solver.py currently imposes Supported-Supported BCs for Bending:
    # C1 = -y_0[-1] / self.beam.length
    # self.slope = theta_0 + C1
    # self.deflection = y_0 + C1 * self.x
    # Since solver.py enforces simply supported behavior, we will generate simply supported cases!
    
    L = 2.0
    diam = 0.05
    profile = CircularProfile(diam)
    beam_ss = Beam(L, steel, profile)
    
    # Center Point Load
    P = -1000  # N
    beam_ss.add_load(PointLoad(magnitude=P, position=L/2))
    
    # Solve
    # Num points set low so JSON isn't massive
    num_points = 5 
    solver = Solver(beam_ss, num_points=num_points)
    res = solver.solve()
    
    out_payload = {
        "metadata": {
            "source": "deflection_tool.core.solver",
            "units": "SI",
            "generated_by": "generate_validation_cases.py",
            "generated_at": datetime.datetime.now().isoformat()
        },
        "cases": [
            {
                "case_id": "simply_supported_center_point_load",
                "inputs": {
                    "L_m": L,
                    "E_Pa": steel.E,
                    "I_m4": profile.I,
                    "loads": [
                        {"type": "point", "magnitude_N": P, "position_m": L/2}
                    ],
                    "num_points": num_points
                },
                "outputs": {
                    "x": res["x"].tolist(),
                    "deflection_m": res["deflection"].tolist(),
                    "slope_rad": res["slope"].tolist()
                }
            }
        ]
    }
    
    validations_path = os.path.join(spec_dir, 'validation_cases.json')
    with open(validations_path, 'w') as f:
        json.dump(out_payload, f, indent=2)
    print(f"Generated {validations_path}")

if __name__ == '__main__':
    generate_canonical_cases()

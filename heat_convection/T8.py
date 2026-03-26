from properties import Air, Water, get_derived_props
import functions as fn

class MixedFlow:
    """Solvers for surfaces with both Laminar and Turbulent regions"""
    @staticmethod
    def nusselt_mixed_plate(Re_L, Pr, Re_c=5e5):
        return fn.nu_mixed_plate(Re_L, Pr, Re_c, faces=1)

def run_test_suite():
    print("=== Testing T8: Mixed Flow (Laminar + Turbulent) ===")
    
    test_cases = [
        {"name": "Air @ 25°C", "fluid": Air, "temp": 25.0 + 273.15, "U": 25.0, "L": 1.0},
        {"name": "Water @ 40°C", "fluid": Water, "temp": 40.0, "U": 2.0, "L": 2.0},
    ]

    re_crit_list = [1e5, 5e5, 1e6]

    for case in test_cases:
        props = get_derived_props(case["fluid"], case["temp"])
        re_L = fn.re(case["U"], case["L"], props['nu'])
        
        print(f"\n--- Case: {case['name']} (U={case['U']} m/s, L={case['L']} m) ---")
        print(f"Total Reynolds (Re_L): {re_L:.2e}")
        print(f"{'Re_crit':<10} | {'Nu_mixed':<10}")
        print("-" * 25)
        
        for re_c in re_crit_list:
            nu_mixed = MixedFlow.nusselt_mixed_plate(re_L, props['pr'], Re_c=re_c)
            print(f"{re_c:1.0e}  | {nu_mixed:>10.2f}")

if __name__ == "__main__":
    run_test_suite()
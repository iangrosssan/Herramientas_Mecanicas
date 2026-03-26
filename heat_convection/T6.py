from properties import Air, Water, get_derived_props

import functions as fn

class Correlations:
    @staticmethod
    def nusselt_flat_plate_turbulent(Re, Pr, faces=2):
        return fn.nu_turbulent_flat_plate(Re, Pr, faces)

    @staticmethod
    def transition_length(Re_crit, velocity, nu):
        return (Re_crit * nu) / velocity

    @staticmethod
    def boundary_layer_thickness_turbulent(L, Re):
        return fn.delta_turbulent(L, Re)

def run_test_suite():
    print("=== Testing T6: Turbulent Correlations (Physics Corrected) ===")
    
    test_cases = [
        {"name": "Air @ 300K", "fluid": Air, "temp": 300.0, "U": 3.0, "L": 1.0},
        {"name": "Water @ 20°C", "fluid": Water, "temp": 20.0, "U": 1.0, "L": 0.5},
    ]

    re_crit_values = [1e5, 5e5, 1e6]

    for case in test_cases:
        props = get_derived_props(case["fluid"], case["temp"])
        re_L = fn.re(case["U"], case["L"], props['nu'])
        
        print(f"\n--- Case: {case['name']} (U={case['U']} m/s, L={case['L']} m) ---")
        print(f"Total Reynolds (Re_L): {re_L:.2e}")
        print(f"{'Re_crit':<10} | {'L_trans [m]':<12} | {'State':<15} | {'Nu_plate':<10}")
        print("-" * 60)
        
        for rec in re_crit_values:
            l_trans = fn.transition_length(rec, case["U"], props['nu'])
            
            if l_trans > case["L"]:
                state = "Fully Laminar"
                # For laminar plate, Nu_avg = 0.664 * Re_L^0.5 * Pr^(1/3) * faces
                nu_val = 2 * 0.664 * (re_L**0.5) * (props['pr']**(1/3))
            else:
                state = "Part. Turbulent"
                # Simple turbulent average for the whole plate (assuming transition happens at l_trans)
                # Note: Real mixed Nu often uses Nu = (Nu_turb_L - Nu_turb_trans + Nu_lam_trans)
                # Here we keep the user's Nu correlation for the 'turbulent' part
                nu_val = fn.nu_turbulent_flat_plate(re_L, props['pr'])
            
            print(f"{rec:1.0e} | {l_trans:>12.4f} | {state:<15} | {nu_val:>10.2f}")

if __name__ == "__main__":
    run_test_suite()
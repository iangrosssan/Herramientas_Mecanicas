from properties import Air, get_derived_props
import functions as fn
import numpy as np
from scipy.optimize import fsolve

def solve_wall_interface(Th_c, Tc_c, L, e, kw, fluid=Air):
    Th, Tc = Th_c + 273.15, Tc_c + 273.15
    g = 9.81
    
    def residuals(Tw):
        Tpel = (Tw + Tc) / 2
        p = get_derived_props(fluid, Tpel)
        beta = 1 / Tpel
        
        # Convection Resistance from shared function
        Rc = fn.resistance_buoyancy_convection(L, p['nu'], p['alpha'], beta, p['k'], g, p['pr'])
        
        # Conduction Resistance
        Rk = fn.resistance_conduction_wall(e, kw)
        
        return ((Th - Tw) / Rc) - ((Tw - Tc) / Rk)

    Tw_final = fsolve(residuals, x0=(Th + Tc)/2)[0]
    
    # Calculate heat flux at convergence
    Tpel_final = (Tw_final + Tc) / 2
    p_f = get_derived_props(fluid, Tpel_final)
    Rk = fn.resistance_conduction_wall(e, kw)
    q = (Tw_final - Tc) / Rk
    
    return Tw_final - 273.15, q

def run_test_suite():
    print("=== Testing T12: Thermal Resistance Analogy ===")
    
    # PROBLEM: Wall Interface (Th=150, Tc=20, L=1.5, e=0.1, kw=0.36)
    Th, Tc = 150, 20
    L, e, kw = 1.5, 0.1, 0.36
    
    tw_sol, q_sol = solve_wall_interface(Th_c=Th, Tc_c=Tc, L=L, e=e, kw=kw)
    
    print(f"\n[Problem: High Temp Wall Interface]")
    print(f"Condition:  Th={Th}°C, Tc={Tc}°C, e={e}m, kw={kw}W/mK")
    print(f"Interface Temperature (Tw): {tw_sol:.3f} °C")
    print(f"Heat Flux (q):              {q_sol:.3f} W/m^2")

    # Bejan Omega Parameter check
    p_f = get_derived_props(Air, (tw_sol + Tc)/2 + 273.15)
    ra_l = fn.rayleigh_number(9.81, 1/((tw_sol + Tc)/2 + 273.15), tw_sol - Tc, L, p_f['nu'], p_f['alpha'])
    omega = fn.bejan_convection_conduction_param(L, e, p_f['k'], kw, ra_l)
    print(f"Bejan Omega Parameter:      {omega:.4f}")

if __name__ == "__main__":
    run_test_suite()
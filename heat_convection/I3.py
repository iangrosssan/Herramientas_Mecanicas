from properties import Air, get_derived_props
import functions as fn
import numpy as np

def run_test_suite():
    print("=== Testing I3: Natural Convection Comparison (UST vs UHF) ===")
    
    # 1. Integration Factors (Theoretical Verification)
    ratio_a = (1 - 2**0.8) / (-2**0.8)
    ratio_b = 1 / (2**0.8)
    print(f"\n[Theoretical Integration Factors]")
    print(f"Factor A: {ratio_a:.6f}")
    print(f"Factor B: {ratio_b:.6f}")

    # 2. Case Study: Air @ 300K on Vertical Plate
    L = 1.0
    g = 9.81
    p = get_derived_props(Air, 300)
    beta = 1/300
    
    # Isothermal Case (UST)
    delta_T = 20.0
    ra_l = fn.rayleigh_number(g, beta, delta_T, L, p['nu'], p['alpha'])
    nu_ust = fn.nu_vertical_plate_natural(ra_l, p['pr'])
    
    # Isoflux Case (UHF)
    q_flux = 500.0 # W/m^2
    ra_star = fn.rayleigh_modified(g, beta, q_flux, L, p['k'], p['nu'], p['alpha'])
    nu_uhf = fn.nu_vertical_plate_isoflux(ra_star, p['pr'])
    
    print(f"\n[Case Study: Air @ 300K, L={L}m]")
    print(f"UST (dT={delta_T}K):   Ra_L = {ra_l:.2e}, Nu = {nu_ust:.2f}")
    print(f"UHF (q\"={q_flux}W/m2): Ra* = {ra_star:.2e}, Nu = {nu_uhf:.2f}")

if __name__ == "__main__":
    run_test_suite()
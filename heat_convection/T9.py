from properties import Air, Water, get_derived_props
import functions as fn
import numpy as np

def run_test_suite():
    print("=== Testing T9: Internal Flow (Pipes & Ducts) ===")
    
    # PROBLEM 1: Nu_turb/Nu_lam Ratio (Air @ 300K)
    Re_test = 2300
    props_air = get_derived_props(Air, 300)
    nu_turb_db = fn.nu_internal_dittus_boelter(Re_test, props_air['pr'], mode='heating')
    nu_lam = fn.nu_internal_laminar_uniform_q()
    
    ratio = nu_turb_db / nu_lam
    print(f"\n[Problem 1: Nu Ratio (Air @ 300K, Re={Re_test})]")
    print(f"Nu_turb (Dittus-Boelter): {nu_turb_db:.4f}")
    print(f"Nu_lam (Uniform q\"):      {nu_lam:.4f}")
    print(f"Ratio:                    {ratio:.4f}")

    # PROBLEM 2: Water Pipe Flow
    L, Dh = 10.0, 0.02
    Tin = 20.0
    q_flux = 5e4
    flow_rate_L_s = 0.5
    Qm = flow_rate_L_s / 1000 # m^3/s
    
    U = Qm / (np.pi * (Dh**2) / 4)
    props_w = get_derived_props(Water, Tin)
    Re_D = fn.re(U, Dh, props_w['nu'])
    f = 0.024 # Assumed friction factor
    
    delta_p = fn.pressure_drop_darcy(f, L, Dh, props_w['rho'], U)
    nu_col = fn.nu_internal_colburn(Re_D, props_w['pr'], f)
    nu_gn = fn.nu_internal_gnielinski(Re_D, props_w['pr'], f, Dh, L)
    nu_ta = fn.nu_internal_taler(Re_D, props_w['pr'])
    
    # Energy Balance for Exit Temperature
    m_dot = Qm * props_w['rho']
    area_surf = np.pi * Dh * L
    delta_T_io = (q_flux * area_surf) / (m_dot * props_w['cp'])
    Tout = Tin + delta_T_io
    
    print(f"\n[Problem 2: Water Pipe Flow]")
    print(f"U (m/s):     {U:.3f}")
    print(f"Re_D:        {Re_D:.2e}")
    print(f"Pressure Drop: {delta_p:.2f} Pa")
    print(f"Nu Colburn:    {nu_col:.2f}")
    print(f"Nu Gnielinski: {nu_gn:.2f}")
    print(f"Nu Taler:      {nu_ta:.2f}")
    print(f"Exit Temp:     {Tout:.2f} °C")

if __name__ == "__main__":
    run_test_suite()
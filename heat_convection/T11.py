from properties import Air, get_derived_props
import functions as fn
import numpy as np

def solve_heater_temp(Q_total, L, T_inf_c, efficiency=1.0):
    g = 9.81
    T_inf_k = T_inf_c + 273.15
    area = 2 * L**2
    q = (Q_total * efficiency) / area
    
    T_s_k = T_inf_k + 50 # Initial guess
    
    for _ in range(10):
        T_film = (T_s_k + T_inf_k) / 2
        props = get_derived_props(Air, T_film)
        
        beta = 1 / T_film
        ra = fn.rayleigh_number(g, beta, T_s_k - T_inf_k, L, props['nu'], props['alpha'])
        nu_avg = fn.nu_vertical_plate_natural(ra, props['pr'])
        h_avg = (nu_avg * props['k']) / L
        
        T_s_k = (q / h_avg) + T_inf_k
        
    return T_s_k - 273.15, ra

def run_test_suite():
    print("=== Testing T11: Natural Convection (Vertical Plate) ===")
    
    # Case 1: 100% Power (520W)
    temp_full, ra_full = solve_heater_temp(520, 0.6, 15)
    print(f"\n[Problem: Vertical Heater @ 15°C Ambient]")
    print(f"Full Power (520W):  Ts = {temp_full:.2f} °C (Ra_L = {ra_full:.2e})")

    # Case 2: 50% Power (260W)
    temp_half, ra_half = solve_heater_temp(520, 0.6, 15, efficiency=0.5)
    print(f"50% Power (260W):   Ts = {temp_half:.2f} °C (Ra_L = {ra_half:.2e})")

    # Case 3: Safe Power Limit for 50°C
    powers = np.linspace(100, 520, 20)
    temps = [solve_heater_temp(p, 0.6, 15, efficiency=0.5)[0] for p in powers]
    safe_power = np.interp(50, temps, powers)
    print(f"Safe power limit for 50°C surface: {safe_power:.1f} W")

if __name__ == "__main__":
    run_test_suite()
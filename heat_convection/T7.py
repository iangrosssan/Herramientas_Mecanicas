from properties import Water, Air, get_derived_props
import functions as fn
from scipy.optimize import fsolve

class HeatBalance:
    """Solves for equilibrium interface temperatures"""
    @staticmethod
    def balance_surface_temp(fluid_a, T_a, fluid_b, T_b, U_a, U_b, L=1.0):
        props_a = get_derived_props(fluid_a, T_a)
        re_a = fn.re(U_a, L, props_a['nu'])
        h_a = (props_a['k'] / L) * 0.0296 * (re_a**0.8) * (props_a['pr']**(1/3))
        
        props_b = get_derived_props(fluid_b, T_b)
        re_b = fn.re(U_b, L, props_b['nu'])
        h_b = (props_b['k'] / L) * 0.0296 * (re_b**0.8) * (props_b['pr']**(1/3))
        
        t_s = (h_a * T_a + h_b * T_b) / (h_a + h_b)
        return t_s, h_a, h_b

def run_test_suite():
    print("=== Testing T7: Turbulent BL & Heat Balance ===")
    
    # PROBLEM 1: Heat Balance (Water/Air)
    Tw, Ta = 10, 30
    Uw = 0.1
    ratio_target = Water.k(Tw) / Air.k(Ta + 273.15)
    
    def objective(Ua):
        Ts, hw, ha = HeatBalance.balance_surface_temp(Water, Tw, Air, Ta+273.15, Uw, Ua)
        return (hw / ha) - ratio_target

    ua_sol = fsolve(objective, x0=1.0)[0]
    ts_sol, _, _ = HeatBalance.balance_surface_temp(Water, Tw, Air, Ta+273.15, Uw, ua_sol)
    
    print(f"\n[Heat Balance]")
    print(f"Ua solution: {ua_sol:.2f} m/s ({ua_sol*3.6:.1f} km/h)")
    print(f"Ts solution: {ts_sol:.2f} °C")

    # PROBLEM 2: Turbulent Wall Coordinates
    T, U, x, y_plus = 20, 0.2, 6, 2.7
    props = get_derived_props(Water, T)
    re_x = fn.re(U, x, props['nu'])
    
    u_star = fn.friction_velocity(U, re_x)
    y = fn.wall_y_plus_to_meters(y_plus, props['nu'], u_star)
    delta = fn.delta_turbulent_17th(x, re_x)
    u_at_y = y_plus * u_star # valid for y+ < 5
    
    # Average Nusselt (Bejan)
    nu_avg = 0.037 * (re_x**0.8) * (props['pr']**(1/3))
    h_avg = nu_avg * props['k'] / x

    print(f"\n[Turbulent BL - Water @ 20°C]")
    print(f"Re_x:        {re_x:.2e}")
    print(f"u* (m/s):    {u_star:.4f}")
    print(f"y (m):       {y:.7f}")
    print(f"delta (m):   {delta:.4f}")
    print(f"u at y:      {u_at_y:.5f} m/s")
    print(f"Average h:   {h_avg:.3f} W/m^2K")

if __name__ == "__main__":
    run_test_suite()
import numpy as np
from scipy.special import erfc
from scipy.optimize import newton
import sympy as sp

from properties import Water

class FluidSolvers:
    @staticmethod
    def stokes_first_problem(y, t, U, nu):
        """Analytical solution for a fluid above an impulsively started plate."""
        if t <= 0: return 0.0
        return U * erfc(y / (2 * np.sqrt(nu * t)))

    @staticmethod
    def colebrook_friction_factor(Re, epsilon_d):
        """Implicit Colebrook-White equation solver for Darcy friction factor 'f'."""
        if Re < 2300: return 64 / Re
        f_guess = (1.8 * np.log10((epsilon_d/3.7)**1.11 + 6.9/Re))**-2
        func = lambda f: 1/np.sqrt(f) + 2*np.log10((epsilon_d/3.7) + 2.51/(Re*np.sqrt(f)))
        return newton(func, f_guess)

def run_test_suite():
    print("=== Testing Stokes First Problem (Water @ 15°C, U=1.5 m/s) ===")
    T_ref = 15
    nu_15 = Water.mu(T_ref) / Water.rho(T_ref)
    
    stokes_cases = [1, 60, 3600]
    print(f"{'Time [s]':<10} | {'y [m]':<10} | {'u(y,t) [m/s]':<15}")
    print("-" * 40)
    for t in stokes_cases:
        u = FluidSolvers.stokes_first_problem(0.02, t, U=1.5, nu=nu_15)
        print(f"{t:<10} | {'0.02':<10} | {u:<15.4e}")

    print("\n=== Testing Colebrook Friction Factor ===")
    colebrook_cases = [
        {"name": "Laminar", "Re": 1000, "ed": 0.0},
        {"name": "Turbulent (Smooth)", "Re": 1e5, "ed": 0.0},
        {"name": "Turbulent (Rough)", "Re": 1e5, "ed": 0.01},
    ]
    print(f"{'Case':<20} | {'Re':<10} | {'e/D':<10} | {'f':<10}")
    print("-" * 55)
    for case in colebrook_cases:
        f = FluidSolvers.colebrook_friction_factor(case["Re"], case["ed"])
        print(f"{case['name']:<20} | {case['Re']:<10.0e} | {case['ed']:<10.4f} | {f:<10.5f}")

if __name__ == "__main__":
    run_test_suite()
    
    # Sympy Integration Check
    p, delta = sp.symbols('p delta')
    expr = delta * p * (1 - p)
    print(f"\nIntegration result: {sp.integrate(expr, (p, 0, 1))}")


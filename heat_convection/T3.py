import numpy as np

from properties import Water, Air, get_derived_props


import functions as fn

class BoundaryLayer:
    def __init__(self, fluid_class, T_film, velocity=3.0):
        self.fluid = fluid_class
        self.T = T_film
        self.u = velocity
        
        # Get thermophysical properties at film temperature
        props = get_derived_props(self.fluid, self.T)
        self.nu = props['nu']
        self.pr = props['pr']

    def reynolds(self, L):
        return fn.re(self.u, L, self.nu)

    def critical_length(self, Re_crit=5e5):
        """Re_crit * nu / u"""
        return (Re_crit * self.nu) / self.u

    def cf(self, L):
        """Local friction coefficient"""
        return fn.cf_laminar(self.reynolds(L))

    def delta(self, L):
        """Hydrodynamic boundary layer thickness"""
        return fn.delta_laminar(L, self.reynolds(L))

    def delta_t(self, L):
        """Thermal boundary layer thickness"""
        return fn.delta_t_laminar(self.delta(L), self.pr)



def run_test_cases():
    test_cases = [
        {"name": "Water @ 20°C", "fluid": Water, "temp": 20.0, "vel": 1.0, "unit": "°C"},
        {"name": "Water @ 37.5°C", "fluid": Water, "temp": 37.5, "vel": 3.0, "unit": "°C"},
        {"name": "Water @ 80°C", "fluid": Water, "temp": 80.0, "vel": 5.0, "unit": "°C"},
        {"name": "Air @ 300K", "fluid": Air, "temp": 300.0, "vel": 2.0, "unit": "K"},
        {"name": "Air @ 310.65K", "fluid": Air, "temp": 310.65, "vel": 3.0, "unit": "K"},
        {"name": "Air @ 400K", "fluid": Air, "temp": 400.0, "vel": 10.0, "unit": "K"},
    ]

    print(f"{'Case Name':<20} | {'Temp':<10} | {'Vel [m/s]':<10} | {'L_crit [m]':<12} | {'Pr':<8}")
    print("-" * 75)

    for case in test_cases:
        bl = BoundaryLayer(case["fluid"], T_film=case["temp"], velocity=case["vel"])
        l_crit = bl.critical_length()
        print(f"{case['name']:<20} | {case['temp']:>6.1f} {case['unit']:<2} | {case['vel']:>10.1f} | {l_crit:>12.5f} | {bl.pr:>8.3f}")

if __name__ == "__main__":
    run_test_cases()
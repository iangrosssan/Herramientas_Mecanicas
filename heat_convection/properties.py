import numpy as np

class Water:
    """Properties for Liquid Water at 1 atm (0.1°C - 100°C)"""
    @staticmethod
    def rho(T): # Density [kg/m^3]
        return 999.98 + 0.0262*T - 0.00603*T**2 + 0.0000164*T**3
    
    @staticmethod
    def cp(T):  # Specific Heat [J/kg·K]
        return 4223.16 - 2.346*T + 0.0346*T**2 - 0.000117*T**3
    
    @staticmethod
    def mu(T):  # Dynamic Viscosity [Pa·s]
        return (1744 - 46.47*T + 0.5698*T**2 - 0.002538*T**3) * 1e-6
    
    @staticmethod
    def k(T):   # Thermal Conductivity [W/m·K]
        return 0.55608 + 0.0022823*T - 0.000011182*T**2
    
    @staticmethod
    def beta(T): # Thermal Expansion [1/K]
        return (-0.622 + 0.156*T - 0.001296*T**2 + 5.068e-6*T**3) * 1e-4

class Air:
    """Properties for Dry Air at 1 atm (200K - 400K)"""
    @staticmethod
    def rho(T):
        return 351.99/T + 344.88/T**2
    
    @staticmethod
    def cp(T):
        return 1030.5 - 0.19975*T + 3.9734e-4*T**2
    
    @staticmethod
    def mu(T):
        return (1.4592e-6 * T**1.5) / (109.1 + T)
    
    @staticmethod
    def k(T):
        return (2.3340e-3 * T**1.5) / (164.54 + T)
    
    @staticmethod
    def beta(T):
        return 1/T

def get_derived_props(fluid, T):
    """Calculates nu, alpha, and Pr for any fluid class at temp T"""
    rho = fluid.rho(T)
    mu = fluid.mu(T)
    cp = fluid.cp(T)
    k = fluid.k(T)
    
    nu = mu / rho
    alpha = k / (rho * cp)
    pr = nu / alpha
    return {
        "rho": rho, "mu": mu, "cp": cp, "k": k,
        "nu": nu, "alpha": alpha, "pr": pr
    }

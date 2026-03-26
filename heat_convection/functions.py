import numpy as np

def re(u, L, nu):
    """Reynolds number: Re = (u * L) / nu"""
    if nu == 0: return 0.0
    return (u * L) / nu

def pr(nu, alpha):
    """Prandtl number: Pr = nu / alpha"""
    if alpha == 0: return 0.0
    return nu / alpha

def delta_laminar(L, Re):
    """Hydrodynamic boundary layer thickness (Laminar): 4.91 * L / sqrt(Re)"""
    if Re <= 0: return 0.0
    return (4.91 * L) / np.sqrt(Re)

def delta_t_laminar(delta, Pr):
    """Thermal boundary layer thickness (Laminar): delta * Pr^(-1/3)"""
    if Pr <= 0: return 0.0
    return delta * (Pr**(-1/3))

def delta_turbulent(L, Re):
    """Hydrodynamic boundary layer thickness (Turbulent): 0.373 * L * Re^(-1/5)"""
    if Re <= 0: return 0.0
    return 0.373 * L * (Re**(-0.2))

def cf_laminar(Re):
    """Local friction coefficient (Laminar): 0.664 / sqrt(Re)"""
    if Re <= 0: return 0.0
    return 0.664 / np.sqrt(Re)

def nu_turbulent_flat_plate(Re, Pr, faces=2):
    """Nusselt correlation for turbulent flow over flat plate: Nu = faces * 0.0161 * Re^(4/5) * Pr^(1/3)"""
    return faces * 0.0161 * (Re**0.8) * (Pr**(1/3))

def nu_mixed_plate(Re_L, Pr, Re_c=5e5, faces=1):
    """
    Mixed flow (Laminar + Turbulent) Nusselt correlation:
    Nu = faces * (0.664 * Re_c^0.5 + 0.0363 * (Re_L^0.8 - Re_c^0.8)) * Pr^(1/3)
    """
    laminar_term = 0.664 * (Re_c**0.5)
    turbulent_term = 0.0363 * (Re_L**0.8 - Re_c**0.8)
    return faces * (laminar_term + turbulent_term) * (Pr**(1/3))

def transition_length(Re_crit, u, nu):
    """Calculates length x where Re_crit is reached: x = Re_crit * nu / u"""
    if u == 0: return np.inf
    return (Re_crit * nu) / u

def friction_velocity(U_inf, Re_x):
    """Calculates friction velocity u* using skin friction correlation: 0.058 * Re_x^-1/5"""
    if Re_x <= 0: return 0.0
    cf = 2 * 0.058 * (Re_x**-0.2)
    return U_inf * np.sqrt(cf / 2)

def wall_y_plus_to_meters(y_plus, nu, u_star):
    """Converts dimensionless y+ to physical distance y (meters): y = y+ * nu / u*"""
    if u_star == 0: return np.inf
    return y_plus * nu / u_star

def delta_turbulent_17th(x, Re_x):
    """Boundary layer thickness delta using 1/7th power law: 0.37 * x * Re_x^-1/5"""
    if Re_x <= 0: return 0.0
    return 0.37 * x * (Re_x**-0.2)

# --- Internal Flow (Pipes/Ducts) ---

def nu_internal_laminar_uniform_q():
    """Fully developed laminar flow with uniform heat flux (q" = const): Nu = 4.36"""
    return 4.36

def nu_internal_colburn(Re, Pr, f):
    """Colburn Analogy for internal flow: Nu = 0.125 * f * Re * Pr^(1/3)"""
    return 0.125 * f * Re * (Pr**(1/3))

def nu_internal_gnielinski(Re, Pr, f, Dh, L):
    """
    Gnielinski Correlation: Highly accurate for 2300 < Re < 5e6.
    Nu = ((f/8)*(Re-1000)*Pr) / (1 + 12.7*sqrt(f/8)*(Pr^(2/3)-1)) * (1 + (Dh/L)^(2/3))
    """
    top = (f/8) * (Re - 1000) * Pr
    bottom = 1 + 12.7 * np.sqrt(f/8) * (Pr**(2/3) - 1)
    entrance_correction = 1 + (Dh/L)**(2/3)
    return (top / bottom) * entrance_correction

def nu_internal_taler(Re, Pr):
    """Taler Correlation for internal flow: Nu = 0.00881 * Re^0.8991 * Pr^0.3911"""
    return 0.00881 * (Re**0.8991) * (Pr**0.3911)

def nu_internal_dittus_boelter(Re, Pr, mode='heating'):
    """Dittus-Boelter Correlation: Nu = 0.023 * Re^0.8 * Pr^n (n=0.4 for heating, 0.3 for cooling)"""
    n = 0.4 if mode == 'heating' else 0.3
    return 0.023 * (Re**0.8) * (Pr**n)

def pressure_drop_darcy(f, L, Dh, rho, U):
    """Darcy-Weisbach Equation: Delta P = f * (L/Dh) * (rho * U^2 / 2)"""
    return f * (L / Dh) * (rho * U**2 / 2)

# --- Natural Convection ---

def rayleigh_number(g, beta, delta_T, L, nu, alpha):
    """Calculates Rayleigh number Ra_L = (g * beta * delta_T * L^3) / (nu * alpha)"""
    return (g * beta * delta_T * L**3) / (nu * alpha)

def nu_vertical_plate_natural(Ra_L, Pr):
    """
    Churchill and Chu correlation for average Nusselt on a vertical plate.
    Valid for all Ra_L.
    """
    term1 = 0.67 * (Ra_L**0.25)
    term2 = (1 + (0.492 / Pr)**(9/16))**(4/9)
    return 0.68 + (term1 / term2)

def rayleigh_modified(g, beta, q_flux, L, k, nu, alpha):
    """
    Calculates the Modified Rayleigh Number (Ra*) for UHF cases.
    Ra* = (g * beta * q'' * L^4) / (k * nu * alpha)
    """
    return (g * beta * q_flux * L**4) / (k * nu * alpha)

def nu_vertical_plate_isoflux(Ra_star, Pr):
    """
    Correlation for Uniform Heat Flux (UHF) on a vertical plate.
    Nu = ca * Ra_star^0.2
    """
    ca = (Pr / (4 + 9 * np.sqrt(Pr) + 10 * Pr))**0.2
    return ca * (Ra_star**0.2)

# --- Thermal Resistance Analogy ---

def resistance_conduction_wall(thickness, k_material):
    """Thermal resistance for conduction through a plane wall: R = L / k"""
    return thickness / k_material

def resistance_convection(h, Area=1.0):
    """Thermal resistance for convection: R = 1 / (h * A)"""
    return 1 / (h * Area)

def resistance_buoyancy_convection(L, nu, alpha, beta, k, g, pr):
    """
    Specific convection resistance correlation for buoyancy-driven flows:
    Rc = factor * ((nu * alpha * L) / (g * beta * k^4))^0.2
    where factor is a function of Prandtl number.
    """
    factor = 4 / (5 * (pr / (4 + 9*np.sqrt(pr) + 10*pr))**0.2)
    return factor * ((nu * alpha * L) / (g * beta * k**4))**0.2

def bejan_convection_conduction_param(L, e, k_fluid, k_wall, Ra_L):
    """Dimensionless parameter to check convection/conduction dominance: omega = (e/L)*(k_f/k_w)*Ra_L^0.25"""
    return (e / L) * (k_fluid / k_wall) * (Ra_L**0.25)

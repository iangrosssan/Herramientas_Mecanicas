/**
 * Heat Convection Correlations — Ported from functions.py
 * Engineering correlations for boundary layers, Nusselt, friction, etc.
 */

/* ─── Dimensionless Numbers ─── */
export const re = (u, L, nu) => (nu === 0 ? 0 : (u * L) / nu);
export const pr = (nu, alpha) => (alpha === 0 ? 0 : nu / alpha);

/* ─── External Flow — Flat Plate ─── */
export const deltaLaminar   = (L, Re) => (Re <= 0 ? 0 : (4.91 * L) / Math.sqrt(Re));
export const deltaTLaminar  = (delta, Pr) => (Pr <= 0 ? 0 : delta * Pr ** (-1 / 3));
export const deltaTurbulent = (L, Re) => (Re <= 0 ? 0 : 0.373 * L * Re ** -0.2);
export const cfLaminar      = (Re) => (Re <= 0 ? 0 : 0.664 / Math.sqrt(Re));

export const nuTurbulentFlatPlate = (Re, Pr, faces = 2) =>
  faces * 0.0161 * Re ** 0.8 * Pr ** (1 / 3);

export function nuMixedPlate(Re_L, Pr, Re_c = 5e5, faces = 1) {
  const laminar   = 0.664 * Re_c ** 0.5;
  const turbulent = 0.0363 * (Re_L ** 0.8 - Re_c ** 0.8);
  return faces * (laminar + turbulent) * Pr ** (1 / 3);
}

export const transitionLength = (Re_crit, u, nu) =>
  u === 0 ? Infinity : (Re_crit * nu) / u;

export function frictionVelocity(U_inf, Re_x) {
  if (Re_x <= 0) return 0;
  const cf = 2 * 0.058 * Re_x ** -0.2;
  return U_inf * Math.sqrt(cf / 2);
}

export const wallYPlusToMeters = (y_plus, nu, u_star) =>
  u_star === 0 ? Infinity : (y_plus * nu) / u_star;

export const deltaTurbulent17th = (x, Re_x) =>
  Re_x <= 0 ? 0 : 0.37 * x * Re_x ** -0.2;

/* ─── Internal Flow (Pipes/Ducts) ─── */
export const nuInternalLaminarUniformQ = () => 4.36;

export const nuInternalColburn = (Re, Pr, f) =>
  0.125 * f * Re * Pr ** (1 / 3);

export function nuInternalGnielinski(Re, Pr, f, Dh, L) {
  const top    = (f / 8) * (Re - 1000) * Pr;
  const bottom = 1 + 12.7 * Math.sqrt(f / 8) * (Pr ** (2 / 3) - 1);
  const entrance = 1 + (Dh / L) ** (2 / 3);
  return (top / bottom) * entrance;
}

export const nuInternalTaler = (Re, Pr) =>
  0.00881 * Re ** 0.8991 * Pr ** 0.3911;

export function nuInternalDittusBoelter(Re, Pr, mode = 'heating') {
  const n = mode === 'heating' ? 0.4 : 0.3;
  return 0.023 * Re ** 0.8 * Pr ** n;
}

export const pressureDropDarcy = (f, L, Dh, rho, U) =>
  f * (L / Dh) * (rho * U ** 2 / 2);

/* ─── Natural Convection ─── */
export const rayleighNumber = (g, beta, deltaT, L, nu, alpha) =>
  (g * beta * deltaT * L ** 3) / (nu * alpha);

export function nuVerticalPlateNatural(Ra_L, Pr) {
  const term1 = 0.67 * Ra_L ** 0.25;
  const term2 = (1 + (0.492 / Pr) ** (9 / 16)) ** (4 / 9);
  return 0.68 + term1 / term2;
}

export const rayleighModified = (g, beta, q_flux, L, k, nu, alpha) =>
  (g * beta * q_flux * L ** 4) / (k * nu * alpha);

export function nuVerticalPlateIsoflux(Ra_star, Pr) {
  const ca = (Pr / (4 + 9 * Math.sqrt(Pr) + 10 * Pr)) ** 0.2;
  return ca * Ra_star ** 0.2;
}

/* ─── Thermal Resistance ─── */
export const resistanceConductionWall = (thickness, k) => thickness / k;
export const resistanceConvection     = (h, A = 1) => 1 / (h * A);

export function resistanceBuoyancyConvection(L, nu, alpha, beta, k, g, pr) {
  const factor = 4 / (5 * (pr / (4 + 9 * Math.sqrt(pr) + 10 * pr)) ** 0.2);
  return factor * ((nu * alpha * L) / (g * beta * k ** 4)) ** 0.2;
}

export const bejanParam = (L, e, k_fluid, k_wall, Ra_L) =>
  (e / L) * (k_fluid / k_wall) * Ra_L ** 0.25;

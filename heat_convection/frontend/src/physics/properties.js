/**
 * Fluid Properties — Ported from properties.py
 * Polynomial curve-fits for Water (liquid, 1 atm) and Air (dry, 1 atm).
 */

export const Water = {
  label: 'Water (Liquid)',
  /** Density [kg/m³] */
  rho: (T) => 999.98 + 0.0262 * T - 0.00603 * T ** 2 + 0.0000164 * T ** 3,
  /** Specific Heat [J/kg·K] */
  cp:  (T) => 4223.16 - 2.346 * T + 0.0346 * T ** 2 - 0.000117 * T ** 3,
  /** Dynamic Viscosity [Pa·s] */
  mu:  (T) => (1744 - 46.47 * T + 0.5698 * T ** 2 - 0.002538 * T ** 3) * 1e-6,
  /** Thermal Conductivity [W/m·K] */
  k:   (T) => 0.55608 + 0.0022823 * T - 0.000011182 * T ** 2,
  /** Thermal Expansion [1/K] */
  beta:(T) => (-0.622 + 0.156 * T - 0.001296 * T ** 2 + 5.068e-6 * T ** 3) * 1e-4,
};

export const Air = {
  label: 'Air (Dry)',
  rho: (T) => 351.99 / T + 344.88 / (T ** 2),
  cp:  (T) => 1030.5 - 0.19975 * T + 3.9734e-4 * T ** 2,
  mu:  (T) => (1.4592e-6 * T ** 1.5) / (109.1 + T),
  k:   (T) => (2.3340e-3 * T ** 1.5) / (164.54 + T),
  beta:(T) => 1 / T,
};

export const FLUIDS = { water: Water, air: Air };

/**
 * Calculates derived properties: nu, alpha, Pr
 */
export function getDerivedProps(fluid, T) {
  const rho  = fluid.rho(T);
  const mu   = fluid.mu(T);
  const cp   = fluid.cp(T);
  const k    = fluid.k(T);
  const nu   = mu / rho;
  const alpha = k / (rho * cp);
  const pr   = nu / alpha;
  return { rho, mu, cp, k, nu, alpha, pr };
}

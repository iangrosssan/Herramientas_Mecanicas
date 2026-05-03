import type { Velocity, Meters } from "./units";

export function getReynolds(velocity_m_s: Velocity, characteristic_length_m: Meters, nu_m2_s: number): number {
  return (velocity_m_s * characteristic_length_m) / nu_m2_s;
}

export function classifyPipeFlow(Re: number): "laminar" | "transitional" | "turbulent" {
  if (Re < 2300) return "laminar";
  if (Re > 10000) return "turbulent";
  return "transitional";
}

export function getPrandtl(cp_J_kgK: number, mu_Pa_s: number, k_W_mK: number): number {
  return (cp_J_kgK * mu_Pa_s) / k_W_mK;
}

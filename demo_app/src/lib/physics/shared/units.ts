// units.ts
export type Kelvin = number;
export type Celsius = number;
export type Meters = number;
export type Velocity = number; // m/s
export type Pascals = number;

export function CtoK(c: Celsius): Kelvin {
  return c + 273.15;
}

export function KtoC(k: Kelvin): Celsius {
  return k - 273.15;
}

// Ensure strict typing mapped down from the explicit unit
export interface Dimensionless {
  value: number;
}

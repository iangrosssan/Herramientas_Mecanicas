import type { DeflectionInput } from "../../lib/physics/deflection/solver";

// Example preset inputs
export const DeflectionPresets: Record<string, DeflectionInput> = {
  "Steel Shaft (Simply Supported)": {
    L_m: 2.0,
    E_Pa: 200e9, 
    I_m4: 3.0679615e-7, // 50mm dia
    loads: [
      { type: "point", magnitude_N: -1000, position_m: 1.0 }
    ],
    support_type: "simply_supported"
  },
  "Balcony Overhang (Cantilever)": {
    L_m: 3.0,
    E_Pa: 30e9, // Concrete approx
    I_m4: 0.001, 
    loads: [
      { type: "point", magnitude_N: -5000, position_m: 3.0 }
    ],
    support_type: "cantilever"
  }
};

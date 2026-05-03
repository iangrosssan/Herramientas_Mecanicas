import type { HeatInput } from "../../lib/physics/heat/solver";

export const HeatPresets: Record<string, HeatInput> = {
  "Water Pipe (Turbulent)": {
    fluid: "Water",
    T_bulk_C: 20,
    T_wall_C: 60,
    velocity_m_s: 2.0,
    diameter_m: 0.05,
    length_m: 2.0
  },
  "Water Pipe (Laminar)": {
    fluid: "Water",
    T_bulk_C: 20,
    T_wall_C: 60,
    velocity_m_s: 0.01,
    diameter_m: 0.05,
    length_m: 2.0
  },
  "Air HVAC (Turbulent)": {
    fluid: "Air", // Make sure this runs against 250K-400K or mapped close
    T_bulk_C: 20,
    T_wall_C: 10,
    velocity_m_s: 5.0,
    diameter_m: 0.3,
    length_m: 10.0
  }
};

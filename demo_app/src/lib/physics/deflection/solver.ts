import type { Meters, Pascals } from "../shared/units";
import { type SolverPayload, buildPayload } from "../shared/guards";
import { zeros, linspace, cumtrapz } from "./linalg";

export interface Load {
  type: "point" | "distributed";
  magnitude_N: number;
  position_m: number; // Start for distributed
}

export interface DeflectionInput {
  L_m: Meters;
  E_Pa: Pascals;
  I_m4: number;
  loads: Load[];
  support_type: "cantilever" | "simply_supported";
}

export interface DeflectionOutputPayload {
  max_deflection_m: number;
  max_moment_Nm: number;
  reactions_N: number[];
  x_array: number[];
  deflection_array: number[];
  slope_array: number[];
}

export interface DeflectionMetaPayload {
  case_id: string;
  is_statically_determinate: boolean;
}

export function solveDeflection(input: DeflectionInput): SolverPayload<DeflectionOutputPayload, DeflectionMetaPayload> {
  const payload = buildPayload<DeflectionOutputPayload, DeflectionMetaPayload>();
  
  if (input.L_m <= 0) {
    payload.status = "invalid";
    payload.warnings.push("Length must be > 0");
    return payload;
  }

  const num_points = 1000; 
  const x = linspace(0, input.L_m, num_points);
  const moment_dist = zeros(num_points);

  // Superposition of M(x) for determinate setups
  let Ra = 0;
  let Rb = 0;

  for (const load of input.loads) {
    if (load.type === "point") {
      const P = load.magnitude_N;
      const a = load.position_m;
      // Note: Strict Canonical Cases!
      if (input.support_type === "cantilever") {
        // Fixed at x=0
        Ra += -P;
        const M_fixed = P * a;
        for (let i = 0; i < num_points; i++) {
          if (x[i] <= a) {
            moment_dist[i] += M_fixed + Ra * x[i];
          }
        }
      } else if (input.support_type === "simply_supported") {
        const reactionA = -P * (input.L_m - a) / input.L_m;
        const reactionB = -P * a / input.L_m;
        Ra += reactionA;
        Rb += reactionB;
        for (let i = 0; i < num_points; i++) {
          if (x[i] <= a) moment_dist[i] += reactionA * x[i];
          else moment_dist[i] += reactionA * x[i] + P * (x[i] - a); // convention follows cut from right
        }
      }
    }
    // Limited to points for this MVP canonical demo
  }

  const EI = input.E_Pa * input.I_m4;
  const theta_0 = cumtrapz(moment_dist.map(M => M / EI), x);
  const y_0 = cumtrapz(theta_0, x);

  let slope = theta_0;
  let deflection = y_0;

  if (input.support_type === "simply_supported") {
    // y(0)=0 and y(L)=0
    const C1 = -y_0[num_points - 1] / input.L_m;
    slope = theta_0.map(t => t + C1);
    deflection = y_0.map((y, i) => y + C1 * x[i]);
  }

  const max_def = Math.max(...deflection.map(Math.abs));
  const max_m = Math.max(...moment_dist.map(Math.abs));

  payload.meta = {
    case_id: "canonical_beam_analysis",
    is_statically_determinate: true
  };

  payload.outputs = {
    max_deflection_m: max_def * Math.sign(deflection[deflection.map(Math.abs).indexOf(max_def)] || 1),
    max_moment_Nm: max_m,
    reactions_N: input.support_type === "cantilever" ? [Ra, -Ra*input.L_m /* placeholder */] : [Ra, Rb],
    x_array: x,
    deflection_array: deflection,
    slope_array: slope
  };

  return payload;
}

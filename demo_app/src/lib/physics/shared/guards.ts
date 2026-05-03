export type SolverStatus = "valid" | "warning" | "invalid";

export interface SolverPayload<TOutputs, TMeta = unknown> {
  status: SolverStatus;
  warnings: string[];
  assumptions: string[];
  outputs: TOutputs | null; // Null if invalid
  meta: TMeta | null;
}

export function buildPayload<TOutputs, TMeta>(): SolverPayload<TOutputs, TMeta> {
  return {
    status: "valid",
    warnings: [],
    assumptions: [],
    outputs: null,
    meta: null,
  };
}

export function checkBounds(val: number, min: number, max: number, name: string): string | null {
  if (val < min || val > max) {
    return `${name} is out of typical bounds (${min} to ${max})`;
  }
  return null;
}

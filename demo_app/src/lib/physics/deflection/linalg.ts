// linalg.ts
// Small dense matrix operations restricted explicitly to Canonical Beam Analysis.
// NO generalized FEM semantics.

export function zeros(n: number): number[] {
  return new Array(n).fill(0);
}

// Generates an array representing linearly spaced points
export function linspace(start: number, stop: number, num: number): number[] {
  if (num <= 1) return [stop];
  const step = (stop - start) / (num - 1);
  return Array.from({ length: num }, (_, i) => start + step * i);
}

// Numerical integration via trapezoidal rule (mimicking scipy's cumtrapz)
export function cumtrapz(y: number[], x: number[]): number[] {
  const result = zeros(y.length);
  for (let i = 1; i < y.length; i++) {
    const dx = x[i] - x[i - 1];
    result[i] = result[i - 1] + 0.5 * (y[i] + y[i - 1]) * dx;
  }
  return result;
}

/**
 * Beam Deflection Solver — Ported from deflection_tool/core/
 * Supports: point load, distributed load, moment, torsion, axial.
 * Uses trapezoidal integration (replaces scipy cumtrapz).
 */

/* ─── Materials Database ─── */
export const MATERIALS = {
  AISI4140: { name: 'AISI 4140', type: 'steel', rho: 7850, yield_strength: 1.77e9, E: 210e9, nu: 0.3 },
  AISI1040: { name: 'AISI 1040', type: 'steel', rho: 7850, yield_strength: 700e6,  E: 200e9, nu: 0.3 },
  Aluminum6061: { name: 'Al 6061', type: 'aluminum', rho: 2700, yield_strength: 276e6,  E: 68.9e9, nu: 0.33 },
};

/* ─── Profile Calculators ─── */
export function circularProfile(diameter) {
  const r = diameter / 2;
  return {
    type: 'circular',
    A: Math.PI * r ** 2,
    I: (Math.PI * r ** 4) / 4,
    J: (Math.PI * r ** 4) / 2,
    y_max: r,
  };
}

export function rectangularProfile(width, height) {
  return {
    type: 'rectangular',
    A: width * height,
    I: (width * height ** 3) / 12,
    J: 0,
    y_max: height / 2,
  };
}

/* ─── Numerical Integration (replaces scipy cumtrapz) ─── */
function cumtrapz(y, x) {
  const result = new Float64Array(y.length);
  result[0] = 0;
  for (let i = 1; i < y.length; i++) {
    result[i] = result[i - 1] + 0.5 * (y[i] + y[i - 1]) * (x[i] - x[i - 1]);
  }
  return result;
}

function linspace(start, end, n) {
  const arr = new Float64Array(n);
  const step = (end - start) / (n - 1);
  for (let i = 0; i < n; i++) arr[i] = start + i * step;
  return arr;
}

/* ─── Solver ─── */
export function solveBeam({ length, material, profile, loads }, numPoints = 1000) {
  const matData = typeof material === 'string' ? MATERIALS[material] : material;
  const E = matData.E;
  const G = matData.G ?? E / (2 * (1 + matData.nu));

  const x = linspace(0, length, numPoints);
  const moment  = new Float64Array(numPoints);
  const torque  = new Float64Array(numPoints);
  const axial   = new Float64Array(numPoints);
  const L = length;

  /* ─── Accumulate load contributions ─── */
  for (const load of loads) {
    if (load.type === 'point') {
      const P = load.magnitude;
      const a = load.position;
      for (let i = 0; i < numPoints; i++) {
        if (x[i] <= a) {
          moment[i] += P * (L - a) * x[i] / L;
        } else {
          moment[i] += P * a * (L - x[i]) / L;
        }
      }
    } else if (load.type === 'distributed') {
      const q = load.magnitude;
      for (let i = 0; i < numPoints; i++) {
        moment[i] += (q * L * x[i]) / 2 - (q * x[i] ** 2) / 2;
      }
    } else if (load.type === 'moment') {
      const M0 = load.magnitude;
      const a  = load.position;
      const Ra = -M0 / L;
      for (let i = 0; i < numPoints; i++) {
        if (x[i] <= a) {
          moment[i] += Ra * x[i];
        } else {
          moment[i] += Ra * x[i] + M0;
        }
      }
    } else if (load.type === 'torsion') {
      const T = load.magnitude;
      const a = load.position;
      for (let i = 0; i < numPoints; i++) {
        if (x[i] <= a) torque[i] += T;
      }
    } else if (load.type === 'axial') {
      const P = load.magnitude;
      const a = load.position;
      for (let i = 0; i < numPoints; i++) {
        if (x[i] <= a) axial[i] += P;
      }
    }
  }

  /* ─── Bending: double integration with simply-supported BCs ─── */
  const EI = E * profile.I;
  const curvature = new Float64Array(numPoints);
  for (let i = 0; i < numPoints; i++) curvature[i] = moment[i] / EI;

  const theta0    = cumtrapz(curvature, x);
  const y0        = cumtrapz(theta0, x);
  const C1        = -y0[numPoints - 1] / L;

  const slope      = new Float64Array(numPoints);
  const deflection = new Float64Array(numPoints);
  for (let i = 0; i < numPoints; i++) {
    slope[i]      = theta0[i] + C1;
    deflection[i] = y0[i] + C1 * x[i];
  }

  /* ─── Torsion ─── */
  const GJ = G * (profile.J || 1e-20);
  const phiPrime = new Float64Array(numPoints);
  for (let i = 0; i < numPoints; i++) phiPrime[i] = torque[i] / GJ;
  const twist = cumtrapz(phiPrime, x);

  /* ─── Axial ─── */
  const EA = E * profile.A;
  const uPrime = new Float64Array(numPoints);
  for (let i = 0; i < numPoints; i++) uPrime[i] = axial[i] / EA;
  const elongation = cumtrapz(uPrime, x);

  /* ─── Summary values ─── */
  let maxDefl = 0, maxSlope = 0, maxTwist = 0, maxElong = 0;
  let maxDeflX = 0;
  for (let i = 0; i < numPoints; i++) {
    const ad = Math.abs(deflection[i]);
    if (ad > maxDefl) { maxDefl = ad; maxDeflX = x[i]; }
    maxSlope  = Math.max(maxSlope,  Math.abs(slope[i]));
    maxTwist  = Math.max(maxTwist,  Math.abs(twist[i]));
    maxElong  = Math.max(maxElong,  Math.abs(elongation[i]));
  }

  return {
    x: Array.from(x),
    deflection: Array.from(deflection),
    slope: Array.from(slope),
    twist: Array.from(twist),
    elongation: Array.from(elongation),
    moment: Array.from(moment),
    summary: {
      maxDeflection_mm: maxDefl * 1000,
      maxDeflectionAt_m: maxDeflX,
      maxSlope_deg: maxSlope * (180 / Math.PI),
      maxTwist_deg: maxTwist * (180 / Math.PI),
      maxElongation_mm: maxElong * 1000,
    },
  };
}

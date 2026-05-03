import { describe, it, expect } from 'vitest';
import { solveDeflection, type Load } from '../src/lib/physics/deflection/solver';
import canonicalCases from '../../scientific_models/deflection/spec/validation_cases.json';

describe('Deflection Scientific Parity', () => {
  it('Should match Python manual overriding oracle', () => {
    // Reads from validation_cases.json directly
    const simCase = canonicalCases.cases.find(c => c.case_id === 'simply_supported_center_load');
    expect(simCase).toBeDefined();
    if (!simCase) return;

    const result = solveDeflection({
      L_m: simCase.inputs.L_m,
      E_Pa: simCase.inputs.E_Pa,
      I_m4: simCase.inputs.I_m4,
      loads: simCase.inputs.loads as unknown as Load[],
      support_type: "simply_supported"
    });

    expect(result.status).toBe('valid');
    // We check for parity matching the exact python output dump
    expect(result.outputs?.max_deflection_m).toBeCloseTo(simCase.outputs.max_deflection_m, 6);
    expect(Math.abs(result.outputs!.max_moment_Nm - simCase.outputs.max_moment_Nm)).toBeLessThan(1);
  });
});

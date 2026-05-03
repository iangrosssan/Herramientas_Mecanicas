export const DeflectionContent = {
  explainer: {
    title: "Canonical Beam Analysis",
    description: "Evaluates exact analytical solutions for common beam mechanical setups using localized numerical arrays.",
    equation: "EI * y''(x) = M(x)",
    assumptions: [
      "Small deflections (linear elasticity)",
      "Euler-Bernoulli beam theory valid (L/d > 10)",
      "Isotropic, homogeneous material",
      "Statically determinate loading"
    ]
  },
  glossary: [
    { symbol: "E", name: "Elastic Modulus", description: "Material stiffness parameter (e.g. Steel ~ 200 GPa). [Pa]" },
    { symbol: "I", name: "Area Moment of Inertia", description: "Geometrical resistance to bending. [m⁴]" },
    { symbol: "M(x)", name: "Internal Bending Moment", description: "The integrated torque load distributed along the beam. [Nm]" },
    { symbol: "y(x)", name: "Deflection", description: "The transversal displacement of the beam. [m]" }
  ],
  supportTypes: {
    cantilever: "Fixed at x=0. Slope and Deflection constrained to 0.",
    simply_supported: "Pinned at endpoints. Moments are 0 at supports."
  }
};

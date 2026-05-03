export const HeatContent = {
  explainer: {
    title: "Forced Convection in a Pipe",
    description: "Calculates the heat transfer coefficient (h) for forced fluid flow inside a circular pipe.",
    equation: "Nu = 0.023 * Re^(0.8) * Pr^n",
    assumptions: [
      "Fully developed turbulent flow",
      "Smooth pipe walls",
      "Constant properties evaluated at bulk temperature"
    ]
  },
  glossary: [
    { symbol: "Re", name: "Reynolds Number", description: "Ratio of inertial to viscous forces. Determines flow regime." },
    { symbol: "Pr", name: "Prandtl Number", description: "Ratio of momentum to thermal diffusivity." },
    { symbol: "Nu", name: "Nusselt Number", description: "Ratio of convective to conductive heat transfer." },
    { symbol: "h", name: "Heat Transfer Coefficient", description: "Proportionality constant between heat flux and thermodynamic driving force. [W/m²K]" }
  ],
  regimes: {
    laminar: "Re < 2300: Flow is highly ordered. Heat transfer depends primarily on conduction.",
    transitional: "2300 < Re < 10000: Flow fluctuates unpredictably. Standard correlations are prone to huge error.",
    turbulent: "Re > 10000: Flow contains chaotic eddies which vastly increase mixing and heat transfer rates."
  }
};

// Physics Study Hub - Thermodynamics Content
// Based on OpenStax University Physics Volume 2

export interface Chapter {
  id: number;
  title: string;
  topics: string[];
  summary: string;
  keyFormulas: Formula[];
  concepts: Concept[];
  openStaxUrl?: string;
}

export interface Formula {
  name: string;
  formula: string;
  description: string;
  variables?: { symbol: string; description: string; unit?: string }[];
}

export interface Concept {
  title: string;
  explanation: string;
  example?: string;
}

export interface PracticeProblem {
  id: number;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  question: string;
  solution: string;
  answer: string;
  hints?: string[];
}

export const chapters: Chapter[] = [
  {
    id: 1,
    title: "Temperature and Heat",
    topics: ["Temperature Scales", "Thermal Expansion", "Heat Transfer", "Specific Heat", "Phase Changes"],
    summary: "Temperature is a measure of the average kinetic energy of particles in a substance. Heat is the transfer of thermal energy between objects at different temperatures. This chapter covers temperature scales, thermal expansion of materials, methods of heat transfer (conduction, convection, radiation), and phase changes.",
    openStaxUrl: "https://openstax.org/books/university-physics-volume-2/pages/1-introduction",
    keyFormulas: [
      {
        name: "Celsius to Fahrenheit",
        formula: "T_{F} = (9/5)T_{C} + 32",
        description: "Convert temperature from Celsius to Fahrenheit",
      },
      {
        name: "Celsius to Kelvin",
        formula: "T_{K} = T_{C} + 273.15",
        description: "Convert temperature from Celsius to Kelvin",
      },
      {
        name: "Linear Thermal Expansion",
        formula: "ΔL = αL₀ΔT",
        description: "Change in length due to temperature change",
        variables: [
          { symbol: "ΔL", description: "Change in length", unit: "m" },
          { symbol: "α", description: "Coefficient of linear expansion", unit: "1/°C" },
          { symbol: "L₀", description: "Original length", unit: "m" },
          { symbol: "ΔT", description: "Change in temperature", unit: "°C or K" },
        ],
      },
      {
        name: "Heat Transfer",
        formula: "Q = mcΔT",
        description: "Heat required to change temperature",
        variables: [
          { symbol: "Q", description: "Heat energy", unit: "J" },
          { symbol: "m", description: "Mass", unit: "kg" },
          { symbol: "c", description: "Specific heat capacity", unit: "J/(kg·K)" },
          { symbol: "ΔT", description: "Change in temperature", unit: "K" },
        ],
      },
      {
        name: "Heat Conduction",
        formula: "Q/t = kA(T_{h} - T_{c})/L",
        description: "Rate of heat transfer through a material",
        variables: [
          { symbol: "Q/t", description: "Heat transfer rate", unit: "W" },
          { symbol: "k", description: "Thermal conductivity", unit: "W/(m·K)" },
          { symbol: "A", description: "Cross-sectional area", unit: "m²" },
          { symbol: "L", description: "Thickness", unit: "m" },
        ],
      },
    ],
    concepts: [
      {
        title: "Temperature vs Heat",
        explanation: "Temperature measures the average kinetic energy of particles, while heat is the transfer of thermal energy. Two objects at the same temperature have no net heat transfer between them (thermal equilibrium).",
        example: "A small cup of boiling water and a large pot of warm water can have the same temperature, but the pot contains more thermal energy (heat).",
      },
      {
        title: "Thermal Equilibrium",
        explanation: "When two objects in contact reach the same temperature, they are in thermal equilibrium and no net heat flows between them. This is the basis of the Zeroth Law of Thermodynamics.",
      },
      {
        title: "Methods of Heat Transfer",
        explanation: "Heat transfers through three main methods: Conduction (direct contact), Convection (fluid movement), and Radiation (electromagnetic waves). All three can occur simultaneously.",
        example: "A pot on a stove: conduction heats the pot bottom, convection circulates the liquid inside, and radiation from the burner also contributes.",
      },
    ],
  },
  {
    id: 2,
    title: "Kinetic Theory of Gases",
    topics: ["Molecular Model", "Pressure and Temperature", "RMS Speed", "Mean Free Path", "Heat Capacity"],
    summary: "The kinetic theory explains gas behavior by treating gases as collections of molecules in constant random motion. Pressure results from molecular collisions with container walls, and temperature is related to average molecular kinetic energy.",
    openStaxUrl: "https://openstax.org/books/university-physics-volume-2/pages/2-introduction",
    keyFormulas: [
      {
        name: "Ideal Gas Law",
        formula: "PV = nRT",
        description: "Relationship between pressure, volume, temperature, and moles",
        variables: [
          { symbol: "P", description: "Pressure", unit: "Pa" },
          { symbol: "V", description: "Volume", unit: "m³" },
          { symbol: "n", description: "Number of moles", unit: "mol" },
          { symbol: "R", description: "Universal gas constant", unit: "8.314 J/(mol·K)" },
          { symbol: "T", description: "Temperature", unit: "K" },
        ],
      },
      {
        name: "RMS Speed",
        formula: "v_{rms} = √(3RT/M) = √(3kT/m)",
        description: "Root-mean-square speed of gas molecules",
        variables: [
          { symbol: "M", description: "Molar mass", unit: "kg/mol" },
          { symbol: "m", description: "Molecular mass", unit: "kg" },
          { symbol: "k", description: "Boltzmann constant", unit: "1.38×10⁻²³ J/K" },
        ],
      },
      {
        name: "Average Kinetic Energy",
        formula: "KE_{avg} = (3/2)kT",
        description: "Average kinetic energy per molecule",
      },
      {
        name: "Pressure from Kinetic Theory",
        formula: "P = (1/3)ρv²_{rms}",
        description: "Pressure related to molecular motion",
        variables: [
          { symbol: "ρ", description: "Density", unit: "kg/m³" },
        ],
      },
    ],
    concepts: [
      {
        title: "Assumptions of Kinetic Theory",
        explanation: "1) Gas molecules are point particles. 2) No intermolecular forces except during collisions. 3) Collisions are elastic. 4) Molecules move randomly. 5) Time between collisions >> collision time.",
      },
      {
        title: "Temperature and Molecular Speed",
        explanation: "Higher temperature means higher average molecular speed. All gas molecules at the same temperature have the same average kinetic energy, but lighter molecules move faster.",
        example: "At room temperature, hydrogen molecules move at ~1900 m/s while oxygen molecules move at ~480 m/s.",
      },
    ],
  },
  {
    id: 3,
    title: "First Law of Thermodynamics",
    topics: ["Internal Energy", "Work and Heat", "Thermodynamic Processes", "Heat Capacity", "Adiabatic Processes"],
    summary: "The First Law states that energy is conserved: the change in internal energy equals heat added minus work done. This chapter covers various thermodynamic processes and how energy transforms between heat, work, and internal energy.",
    openStaxUrl: "https://openstax.org/books/university-physics-volume-2/pages/3-introduction",
    keyFormulas: [
      {
        name: "First Law",
        formula: "ΔU = Q - W",
        description: "Change in internal energy equals heat added minus work done by the system",
        variables: [
          { symbol: "ΔU", description: "Change in internal energy", unit: "J" },
          { symbol: "Q", description: "Heat added to system", unit: "J" },
          { symbol: "W", description: "Work done by system", unit: "J" },
        ],
      },
      {
        name: "Work by Gas",
        formula: "W = ∫PdV",
        description: "Work done during volume change",
      },
      {
        name: "Work at Constant Pressure",
        formula: "W = PΔV",
        description: "Work done in isobaric process",
      },
      {
        name: "Internal Energy (Ideal Gas)",
        formula: "U = (f/2)nRT",
        description: "Internal energy depends on degrees of freedom",
        variables: [
          { symbol: "f", description: "Degrees of freedom", unit: "dimensionless" },
        ],
      },
      {
        name: "Heat Capacity at Constant Volume",
        formula: "C_{V} = (f/2)nR",
        description: "Heat capacity when volume is constant",
      },
      {
        name: "Heat Capacity at Constant Pressure",
        formula: "C_{P} = C_{V} + nR",
        description: "Heat capacity when pressure is constant",
      },
      {
        name: "Adiabatic Process",
        formula: "PV^γ = constant",
        description: "Process with no heat transfer (Q=0)",
        variables: [
          { symbol: "γ", description: "Heat capacity ratio C_{P}/C_{V}", unit: "dimensionless" },
        ],
      },
    ],
    concepts: [
      {
        title: "Sign Conventions",
        explanation: "Q > 0: heat added TO system. Q < 0: heat removed FROM system. W > 0: work done BY system. W < 0: work done ON system.",
        example: "Compressing a gas: W < 0 (work done on gas). Gas expanding: W > 0 (gas does work).",
      },
      {
        title: "Thermodynamic Processes",
        explanation: "Isothermal (constant T): ΔU=0, Q=W. Isobaric (constant P): W=PΔV. Isochoric (constant V): W=0, Q=ΔU. Adiabatic (Q=0): ΔU=-W.",
      },
      {
        title: "Why C_{P} > C_{V}",
        explanation: "At constant pressure, some energy goes into expansion work, so more heat is needed to raise temperature by 1K compared to constant volume.",
      },
    ],
  },
  {
    id: 4,
    title: "Second Law of Thermodynamics",
    topics: ["Heat Engines", "Entropy", "Carnot Cycle", "Refrigerators", "Efficiency"],
    summary: "The Second Law introduces the concept of entropy and explains why certain processes are irreversible. It sets fundamental limits on heat engine efficiency and defines the direction of spontaneous processes.",
    openStaxUrl: "https://openstax.org/books/university-physics-volume-2/pages/4-introduction",
    keyFormulas: [
      {
        name: "Heat Engine Efficiency",
        formula: "η = W/Q_{h} = 1 - Q_{c}/Q_{h}",
        description: "Efficiency of heat engine",
        variables: [
          { symbol: "W", description: "Work output", unit: "J" },
          { symbol: "Q_{h}", description: "Heat absorbed from hot reservoir", unit: "J" },
          { symbol: "Q_{c}", description: "Heat rejected to cold reservoir", unit: "J" },
        ],
      },
      {
        name: "Carnot Efficiency",
        formula: "η_{C} = 1 - T_{c}/T_{h}",
        description: "Maximum theoretical efficiency (Carnot engine)",
        variables: [
          { symbol: "T_{c}", description: "Cold reservoir temperature", unit: "K" },
          { symbol: "T_{h}", description: "Hot reservoir temperature", unit: "K" },
        ],
      },
      {
        name: "Coefficient of Performance (Refrigerator)",
        formula: "COP_{ref} = Q_{c}/W = Q_{c}/(Q_{h} - Q_{c})",
        description: "Efficiency measure for refrigerators",
      },
      {
        name: "Entropy Change",
        formula: "ΔS = Q_{rev}/T",
        description: "Entropy change for reversible process",
        variables: [
          { symbol: "ΔS", description: "Change in entropy", unit: "J/K" },
          { symbol: "Q_{rev}", description: "Heat in reversible process", unit: "J" },
        ],
      },
      {
        name: "Entropy (Statistical)",
        formula: "S = k ln(W)",
        description: "Boltzmann's entropy formula",
        variables: [
          { symbol: "W", description: "Number of microstates", unit: "dimensionless" },
        ],
      },
    ],
    concepts: [
      {
        title: "Second Law Statements",
        explanation: "Kelvin-Planck: No engine can convert heat completely to work in a cycle. Clausius: Heat cannot spontaneously flow from cold to hot. Entropy: Total entropy of isolated system never decreases.",
      },
      {
        title: "Reversible vs Irreversible",
        explanation: "Reversible processes are idealizations with no entropy increase (infinitely slow, frictionless). All real processes are irreversible and increase total entropy.",
        example: "Dropping an ice cube in hot water is irreversible - it never spontaneously reforms from the cooled water.",
      },
      {
        title: "Heat Engines vs Refrigerators",
        explanation: "Heat engines convert heat to work (high to low temp). Refrigerators use work to move heat from cold to hot. Both are limited by the Second Law.",
      },
      {
        title: "Why We Can't Have 100% Efficiency",
        explanation: "A heat engine must reject some heat to a cold reservoir (Q_{c} > 0) because temperature difference is required for heat flow. Perfect efficiency would require T_{c} = 0 K (impossible).",
      },
    ],
  },
  // Additional chapters for Volume 1 (5-16)
  {
    id: 5,
    title: "Electric Charges and Fields",
    topics: ["Coulomb's Law", "Electric Fields", "Gauss's Law", "Electric Potential"],
    summary: "Introduction to electrostatics, including electric charge, electric fields, and electric potential.",
    openStaxUrl: "https://openstax.org/books/university-physics-volume-2/pages/5-introduction",
    keyFormulas: [
      {
        name: "Coulomb's Law",
        formula: "F = k(q₁q₂)/r²",
        description: "Force between two point charges",
      },
    ],
    concepts: [
      { term: "Electric Field", definition: "Force per unit charge" }
    ],
  },
  {
    id: 6,
    title: "Electric Potential and Capacitance",
    topics: ["Electric Potential Energy", "Capacitors", "Dielectrics"],
    summary: "Electric potential, capacitance, and energy storage in electric fields.",
    openStaxUrl: "https://openstax.org/books/university-physics-volume-2/pages/6-introduction",
    keyFormulas: [
      {
        name: "Capacitance",
        formula: "C = Q/V",
        description: "Capacitance definition",
      },
    ],
    concepts: [
      { term: "Capacitor", definition: "Device that stores electric charge" }
    ],
  },
  {
    id: 7,
    title: "Current and Resistance",
    topics: ["Electric Current", "Ohm's Law", "Resistance", "Power"],
    summary: "Electric current, resistance, and power in electric circuits.",
    openStaxUrl: "https://openstax.org/books/university-physics-volume-2/pages/7-introduction",
    keyFormulas: [
      {
        name: "Ohm's Law",
        formula: "V = IR",
        description: "Relationship between voltage, current, and resistance",
      },
    ],
    concepts: [
      { term: "Current", definition: "Rate of charge flow" }
    ],
  },
  {
    id: 8,
    title: "DC Circuits",
    topics: ["Series and Parallel", "Kirchhoff's Rules", "RC Circuits"],
    summary: "Analysis of direct current circuits using Kirchhoff's laws.",
    openStaxUrl: "https://openstax.org/books/university-physics-volume-2/pages/8-introduction",
    keyFormulas: [
      {
        name: "Series Resistance",
        formula: "R_{total} = R₁ + R₂ + ...",
        description: "Total resistance in series",
      },
    ],
    concepts: [
      { term: "Kirchhoff's Laws", definition: "Conservation of charge and energy in circuits" }
    ],
  },
  {
    id: 9,
    title: "Magnetic Forces and Fields",
    topics: ["Magnetic Force", "Lorentz Force", "Magnetic Fields"],
    summary: "Magnetic forces on moving charges and currents.",
    openStaxUrl: "https://openstax.org/books/university-physics-volume-2/pages/9-introduction",
    keyFormulas: [
      {
        name: "Lorentz Force",
        formula: "F = qvB sin θ",
        description: "Force on moving charge in magnetic field",
      },
    ],
    concepts: [
      { term: "Magnetic Field", definition: "Force field created by moving charges" }
    ],
  },
  {
    id: 10,
    title: "Sources of Magnetic Fields",
    topics: ["Biot-Savart Law", "Ampere's Law", "Solenoids"],
    summary: "Sources of magnetic fields including wires and solenoids.",
    openStaxUrl: "https://openstax.org/books/university-physics-volume-2/pages/10-introduction",
    keyFormulas: [
      {
        name: "Ampere's Law",
        formula: "∮B·dl = μ₀I",
        description: "Magnetic field from current",
      },
    ],
    concepts: [
      { term: "Solenoid", definition: "Coil that produces uniform magnetic field" }
    ],
  },
  {
    id: 11,
    title: "Electromagnetic Induction",
    topics: ["Faraday's Law", "Lenz's Law", "Inductance"],
    summary: "Induced EMF and electromagnetic induction.",
    openStaxUrl: "https://openstax.org/books/university-physics-volume-2/pages/11-introduction",
    keyFormulas: [
      {
        name: "Faraday's Law",
        formula: "ε = -dΦ/dt",
        description: "Induced EMF from changing flux",
      },
    ],
    concepts: [
      { term: "Induction", definition: "Generation of EMF by changing magnetic flux" }
    ],
  },
  {
    id: 12,
    title: "Inductance",
    topics: ["Self-Inductance", "RL Circuits", "LC Circuits"],
    summary: "Inductance in circuits and energy storage in magnetic fields.",
    openStaxUrl: "https://openstax.org/books/university-physics-volume-2/pages/12-introduction",
    keyFormulas: [
      {
        name: "Self-Inductance",
        formula: "ε = -L(dI/dt)",
        description: "Induced EMF in inductor",
      },
    ],
    concepts: [
      { term: "Inductor", definition: "Component that stores energy in magnetic field" }
    ],
  },
  {
    id: 13,
    title: "Alternating Current Circuits",
    topics: ["AC Voltage", "RLC Circuits", "Resonance", "Impedance"],
    summary: "Analysis of alternating current circuits.",
    openStaxUrl: "https://openstax.org/books/university-physics-volume-2/pages/13-introduction",
    keyFormulas: [
      {
        name: "Impedance",
        formula: "Z = √(R² + (X_{L} - X_{C})²)",
        description: "Total opposition to AC current",
      },
    ],
    concepts: [
      { term: "Impedance", definition: "AC resistance including reactance" }
    ],
  },
  {
    id: 14,
    title: "Electromagnetic Waves",
    topics: ["Maxwell's Equations", "EM Spectrum", "Wave Propagation"],
    summary: "Electromagnetic waves and Maxwell's equations.",
    openStaxUrl: "https://openstax.org/books/university-physics-volume-2/pages/14-introduction",
    keyFormulas: [
      {
        name: "Wave Speed",
        formula: "c = 1/√(ε₀μ₀)",
        description: "Speed of light in vacuum",
      },
    ],
    concepts: [
      { term: "EM Wave", definition: "Propagating disturbance in electric and magnetic fields" }
    ],
  },
  {
    id: 15,
    title: "Geometric Optics",
    topics: ["Reflection", "Refraction", "Mirrors", "Lenses"],
    summary: "Ray optics including mirrors and lenses.",
    openStaxUrl: "https://openstax.org/books/university-physics-volume-3/pages/1-introduction",
    keyFormulas: [
      {
        name: "Snell's Law",
        formula: "n₁ sin θ₁ = n₂ sin θ₂",
        description: "Refraction at interface",
      },
    ],
    concepts: [
      { term: "Refraction", definition: "Bending of light at interface between media" }
    ],
  },
  {
    id: 16,
    title: "Wave Optics",
    topics: ["Interference", "Diffraction", "Young's Experiment", "Polarization"],
    summary: "Wave properties of light including interference and diffraction.",
    openStaxUrl: "https://openstax.org/books/university-physics-volume-3/pages/2-introduction",
    keyFormulas: [
      {
        name: "Double-Slit Interference",
        formula: "d sin θ = mλ",
        description: "Constructive interference condition",
      },
    ],
    concepts: [
      { term: "Interference", definition: "Superposition of waves creating patterns" }
    ],
  },
];

export const practiceProblems: PracticeProblem[] = [
  // Easy Problems
  {
    id: 1,
    difficulty: "Easy",
    topic: "Temperature",
    question: "Convert 100°F to Celsius.",
    solution: "Use the formula: T_{C} = (5/9)(T_{F} - 32)\nT_{C} = (5/9)(100 - 32) = (5/9)(68) = 37.8°C",
    answer: "37.8°C",
    hints: ["Remember to subtract 32 first", "Multiply by 5/9, not 9/5"],
  },
  {
    id: 2,
    difficulty: "Easy",
    topic: "Ideal Gas Law",
    question: "A gas at 300 K occupies 2.0 L at 1.0 atm. What is the volume at 600 K and 1.0 atm?",
    solution: "Since P is constant, use V₁/T₁ = V₂/T₂\n2.0 L / 300 K = V₂ / 600 K\nV₂ = 2.0 L × (600 K / 300 K) = 4.0 L",
    answer: "4.0 L",
    hints: ["Pressure is constant (isobaric process)", "Volume is proportional to temperature"],
  },
  {
    id: 3,
    difficulty: "Easy",
    topic: "Heat Transfer",
    question: "How much heat is needed to raise the temperature of 2.0 kg of water from 20°C to 100°C? (c_{water} = 4186 J/(kg·K))",
    solution: "Q = mcΔT\nQ = (2.0 kg)(4186 J/(kg·K))(80 K)\nQ = 669,760 J ≈ 670 kJ",
    answer: "670 kJ",
    hints: ["ΔT = 80 K", "Remember units: 1 K change = 1°C change"],
  },

  // Medium Problems
  {
    id: 4,
    difficulty: "Medium",
    topic: "Heat Conduction",
    question: "A copper rod (k = 400 W/(m·K)) with cross-section 0.01 m² and length 0.5 m connects a 100°C reservoir to a 0°C reservoir. What is the rate of heat flow?",
    solution: "Use Q/t = kA(T_{h} - T_{c})/L\nQ/t = (400 W/(m·K))(0.01 m²)(100 K)/(0.5 m)\nQ/t = 800 W",
    answer: "800 W",
    hints: ["Steady-state heat conduction", "Temperature difference is 100 K"],
  },
  {
    id: 5,
    difficulty: "Medium",
    topic: "First Law",
    question: "A gas absorbs 500 J of heat and expands, doing 200 J of work. What is the change in internal energy?",
    solution: "First Law: ΔU = Q - W\nΔU = 500 J - 200 J = 300 J\nInternal energy increases by 300 J.",
    answer: "ΔU = +300 J",
    hints: ["Q is positive (heat added)", "W is positive (system does work)"],
  },
  {
    id: 6,
    difficulty: "Medium",
    topic: "Carnot Engine",
    question: "A Carnot engine operates between 500 K and 300 K. What is its efficiency?",
    solution: "η_{C} = 1 - T_{c}/T_{h}\nη_{C} = 1 - 300 K/500 K = 1 - 0.6 = 0.4 = 40%",
    answer: "40%",
    hints: ["Must use absolute temperature (Kelvin)", "Carnot efficiency is maximum possible"],
  },

  // Hard Problems
  {
    id: 7,
    difficulty: "Hard",
    topic: "Adiabatic Process",
    question: "An ideal diatomic gas (γ = 1.4) expands adiabatically from 2.0 L at 5.0 atm to 5.0 L. What is the final pressure?",
    solution: "For adiabatic process: P₁V₁^γ = P₂V₂^γ\nP₂ = P₁(V₁/V₂)^γ\nP₂ = 5.0 atm × (2.0/5.0)^1.4\nP₂ = 5.0 atm × (0.4)^1.4 = 5.0 atm × 0.303 = 1.52 atm",
    answer: "1.52 atm",
    hints: ["Adiabatic means Q = 0", "For diatomic gas, γ = 7/5 = 1.4"],
  },
  {
    id: 8,
    difficulty: "Hard",
    topic: "Entropy",
    question: "Calculate the entropy change when 1.0 kg of ice at 0°C melts to water at 0°C. (L_{f} = 334 kJ/kg)",
    solution: "For phase change at constant T: ΔS = Q/T\nQ = mL_{f} = (1.0 kg)(334,000 J/kg) = 334,000 J\nT = 273.15 K\nΔS = 334,000 J / 273.15 K = 1223 J/K ≈ 1.22 kJ/K",
    answer: "1.22 kJ/K",
    hints: ["Temperature is constant during phase change", "Use T in Kelvin"],
  },
  {
    id: 9,
    difficulty: "Hard",
    topic: "Heat Engine",
    question: "A heat engine absorbs 1000 J from a hot reservoir, does 400 J of work, and rejects Q_{c} to a cold reservoir. If the hot reservoir is at 600 K, what is the minimum temperature of the cold reservoir?",
    solution: "Q_{c} = Q_{h} - W = 1000 J - 400 J = 600 J\nActual efficiency: η = W/Q_{h} = 400/1000 = 0.4\nFor Carnot (max efficiency): η_{C} = 1 - T_{c}/T_{h}\n0.4 = 1 - T_{c}/600 K\nT_{c} = 600 K × (1 - 0.4) = 360 K\nSince actual engine has same efficiency as Carnot, T_{c} = 360 K is minimum.",
    answer: "360 K (87°C)",
    hints: ["Use energy conservation to find Q_{c}", "Minimum T_{c} occurs for Carnot efficiency"],
  },
];

export const flashcards = [
  {
    id: 1,
    topic: "Temperature",
    front: "What is the difference between temperature and heat?",
    back: "Temperature measures average kinetic energy of particles. Heat is the transfer of thermal energy between objects at different temperatures.",
  },
  {
    id: 2,
    topic: "First Law",
    front: "State the First Law of Thermodynamics",
    back: "ΔU = Q - W. The change in internal energy equals heat added minus work done by the system. Energy is conserved.",
  },
  {
    id: 3,
    topic: "Second Law",
    front: "Why can't a heat engine be 100% efficient?",
    back: "The Second Law requires heat engines to reject some heat (Q_{c} > 0) to a cold reservoir. Perfect efficiency would require T_{c} = 0 K, which is impossible.",
  },
  {
    id: 4,
    topic: "Entropy",
    front: "What does entropy measure?",
    back: "Entropy measures the disorder or number of possible microstates of a system. Higher entropy = more disorder/possibilities.",
  },
  {
    id: 5,
    topic: "Ideal Gas Law",
    front: "State the Ideal Gas Law and its conditions",
    back: "PV = nRT. Valid when: 1) Low pressure, 2) High temperature, 3) No intermolecular forces, 4) Point particles.",
  },
];

// ========== VOLUME 1: MECHANICS ==========
// Based on OpenStax University Physics Volume 1

export const volume1Chapters: Chapter[] = [
  {
    id: 1,
    title: "Units and Measurement",
    topics: ["SI Units", "Unit Conversion", "Dimensional Analysis", "Uncertainty and Significant Figures", "Estimation"],
    summary: "Physics is built on measurement and quantification. This chapter introduces the International System of Units (SI), dimensional analysis, significant figures, and the importance of precision and accuracy in scientific measurements.",
    openStaxUrl: "https://openstax.org/books/university-physics-volume-1/pages/1-introduction",
    keyFormulas: [],
    concepts: [
      {
        title: "SI Base Units",
        explanation: "The seven SI base units are: meter (m) for length, kilogram (kg) for mass, second (s) for time, ampere (A) for electric current, kelvin (K) for temperature, mole (mol) for amount of substance, and candela (cd) for luminous intensity.",
      },
      {
        title: "Dimensional Analysis",
        explanation: "A method to check equations and convert units by treating units as algebraic quantities that can be cancelled.",
      },
    ],
  },
  {
    id: 2,
    title: "Vectors",
    topics: ["Vector Components", "Vector Addition", "Scalar and Vector Products", "Unit Vectors"],
    summary: "Vectors are mathematical objects that have both magnitude and direction. This chapter covers vector representation, addition, subtraction, and multiplication operations essential for describing physical quantities like displacement, velocity, and force.",
    openStaxUrl: "https://openstax.org/books/university-physics-volume-1/pages/2-introduction",
    keyFormulas: [
      {
        name: "Vector Magnitude",
        formula: "|v| = √(v_{x}² + v_{y}² + v_{z}²)",
        description: "Magnitude of a vector from its components",
      },
      {
        name: "Dot Product",
        formula: "A · B = |A||B|cos(θ)",
        description: "Scalar product of two vectors",
      },
      {
        name: "Cross Product Magnitude",
        formula: "|A × B| = |A||B|sin(θ)",
        description: "Magnitude of vector product",
      },
    ],
    concepts: [
      {
        title: "Scalar vs Vector",
        explanation: "Scalars have only magnitude (temperature, mass, time), while vectors have both magnitude and direction (velocity, force, acceleration).",
      },
    ],
  },
  {
    id: 3,
    title: "Motion Along a Straight Line",
    topics: ["Position and Displacement", "Average and Instantaneous Velocity", "Acceleration", "Free Fall", "Kinematic Equations"],
    summary: "Kinematics describes motion without considering its causes. This chapter focuses on one-dimensional motion, including concepts of displacement, velocity, acceleration, and the kinematic equations for constant acceleration.",
    openStaxUrl: "https://openstax.org/books/university-physics-volume-1/pages/3-introduction",
    keyFormulas: [
      {
        name: "Average Velocity",
        formula: "v_{avg} = Δx/Δt",
        description: "Average velocity over a time interval",
      },
      {
        name: "Constant Acceleration",
        formula: "v = v₀ + at",
        description: "Velocity as a function of time",
      },
      {
        name: "Position with Constant Acceleration",
        formula: "x = x₀ + v₀t + (1/2)at²",
        description: "Position as a function of time",
      },
      {
        name: "Velocity-Position Relation",
        formula: "v² = v₀² + 2a(x - x₀)",
        description: "Relates velocity to position without time",
      },
    ],
    concepts: [
      {
        title: "Free Fall",
        explanation: "An object in free fall experiences constant downward acceleration g = 9.8 m/s² near Earth's surface, neglecting air resistance.",
      },
    ],
  },
  {
    id: 4,
    title: "Motion in Two and Three Dimensions",
    topics: ["Position and Velocity Vectors", "Acceleration Vector", "Projectile Motion", "Uniform Circular Motion", "Relative Velocity"],
    summary: "Extending kinematics to two and three dimensions, this chapter covers vector methods for analyzing motion, projectile motion, circular motion, and relative motion between different reference frames.",
    openStaxUrl: "https://openstax.org/books/university-physics-volume-1/pages/4-introduction",
    keyFormulas: [
      {
        name: "Projectile Motion (Horizontal)",
        formula: "x = v₀cos(θ)t",
        description: "Horizontal position in projectile motion",
      },
      {
        name: "Projectile Motion (Vertical)",
        formula: "y = v₀sin(θ)t - (1/2)gt²",
        description: "Vertical position in projectile motion",
      },
      {
        name: "Centripetal Acceleration",
        formula: "a_{c} = v²/r",
        description: "Acceleration toward center in circular motion",
      },
    ],
    concepts: [
      {
        title: "Independence of Motion",
        explanation: "In projectile motion, horizontal and vertical motions are independent. Horizontal velocity remains constant while vertical motion undergoes constant acceleration.",
      },
    ],
  },
  {
    id: 5,
    title: "Newton's Laws of Motion",
    topics: ["Force and Mass", "Newton's First Law", "Newton's Second Law", "Newton's Third Law", "Free-Body Diagrams", "Friction"],
    summary: "Newton's three laws of motion form the foundation of classical mechanics. This chapter introduces the concept of force, inertia, and the relationship between force, mass, and acceleration.",
    openStaxUrl: "https://openstax.org/books/university-physics-volume-1/pages/5-introduction",
    keyFormulas: [
      {
        name: "Newton's Second Law",
        formula: "F = ma",
        description: "Net force equals mass times acceleration",
      },
      {
        name: "Weight",
        formula: "W = mg",
        description: "Gravitational force on an object",
      },
      {
        name: "Kinetic Friction",
        formula: "f_{k} = μ_{k} N",
        description: "Friction force when object is moving",
      },
      {
        name: "Static Friction",
        formula: "f_{s} ≤ μ_{s} N",
        description: "Maximum static friction before motion",
      },
    ],
    concepts: [
      {
        title: "Newton's Third Law",
        explanation: "For every action, there is an equal and opposite reaction. Forces always come in pairs acting on different objects.",
      },
    ],
  },
  {
    id: 6,
    title: "Applications of Newton's Laws",
    topics: ["Drag Forces", "Tension", "Normal Force", "Springs and Hooke's Law", "Centripetal Force"],
    summary: "This chapter applies Newton's laws to various physical situations including drag forces, tension in ropes and cables, normal forces, elastic forces in springs, and forces in circular motion.",
    openStaxUrl: "https://openstax.org/books/university-physics-volume-1/pages/6-introduction",
    keyFormulas: [
      {
        name: "Hooke's Law",
        formula: "F = -kx",
        description: "Spring force proportional to displacement",
      },
      {
        name: "Drag Force",
        formula: "F_{D} = (1/2)CρAv²",
        description: "Air resistance force",
      },
    ],
    concepts: [
      {
        title: "Free-Body Diagrams",
        explanation: "A diagram showing all forces acting on an object, essential for applying Newton's second law systematically.",
      },
    ],
  },
  {
    id: 7,
    title: "Work and Kinetic Energy",
    topics: ["Work Done by a Force", "Kinetic Energy", "Work-Energy Theorem", "Power"],
    summary: "Work is the transfer of energy by a force. This chapter introduces the concepts of work and kinetic energy, and establishes the work-energy theorem connecting them.",
    openStaxUrl: "https://openstax.org/books/university-physics-volume-1/pages/7-introduction",
    keyFormulas: [
      {
        name: "Work",
        formula: "W = F·d = Fd cos(θ)",
        description: "Work done by constant force",
      },
      {
        name: "Kinetic Energy",
        formula: "KE = (1/2)mv²",
        description: "Energy of motion",
      },
      {
        name: "Work-Energy Theorem",
        formula: "W_{net} = ΔKE",
        description: "Net work equals change in kinetic energy",
      },
      {
        name: "Power",
        formula: "P = W/t = F·v",
        description: "Rate of doing work",
      },
    ],
    concepts: [
      {
        title: "Conservative vs Non-conservative Forces",
        explanation: "Conservative forces (like gravity) store energy that can be fully recovered, while non-conservative forces (like friction) dissipate energy as heat.",
      },
    ],
  },
  {
    id: 8,
    title: "Potential Energy and Conservation of Energy",
    topics: ["Potential Energy", "Conservative Forces", "Mechanical Energy Conservation", "Energy Diagrams"],
    summary: "Potential energy is stored energy due to position or configuration. This chapter covers gravitational and elastic potential energy, and introduces the principle of conservation of mechanical energy.",
    openStaxUrl: "https://openstax.org/books/university-physics-volume-1/pages/8-introduction",
    keyFormulas: [
      {
        name: "Gravitational Potential Energy",
        formula: "U_{g} = mgh",
        description: "Potential energy near Earth's surface",
      },
      {
        name: "Elastic Potential Energy",
        formula: "U_{s} = (1/2)kx²",
        description: "Energy stored in a spring",
      },
      {
        name: "Conservation of Mechanical Energy",
        formula: "KE₁ + PE₁ = KE₂ + PE₂",
        description: "Total mechanical energy is constant",
      },
    ],
    concepts: [
      {
        title: "Energy Conservation",
        explanation: "In the absence of non-conservative forces, the total mechanical energy (kinetic plus potential) of a system remains constant.",
      },
    ],
  },
  {
    id: 9,
    title: "Linear Momentum and Collisions",
    topics: ["Linear Momentum", "Impulse", "Conservation of Momentum", "Elastic and Inelastic Collisions", "Center of Mass"],
    summary: "Momentum is mass times velocity. This chapter covers momentum conservation, impulse-momentum theorem, and analyzes various types of collisions between objects.",
    openStaxUrl: "https://openstax.org/books/university-physics-volume-1/pages/9-introduction",
    keyFormulas: [
      {
        name: "Linear Momentum",
        formula: "p = mv",
        description: "Momentum of an object",
      },
      {
        name: "Impulse",
        formula: "J = FΔt = Δp",
        description: "Change in momentum",
      },
      {
        name: "Conservation of Momentum",
        formula: "p₁ᵢ + p₂ᵢ = p₁f + p₂f",
        description: "Total momentum before equals after",
      },
    ],
    concepts: [
      {
        title: "Elastic vs Inelastic Collisions",
        explanation: "In elastic collisions, kinetic energy is conserved. In inelastic collisions, some kinetic energy is converted to other forms. Momentum is conserved in both.",
      },
    ],
  },
  {
    id: 10,
    title: "Fixed-Axis Rotation",
    topics: ["Rotational Kinematics", "Rotational Inertia", "Torque", "Rotational Kinetic Energy", "Angular Momentum"],
    summary: "This chapter extends the concepts of kinematics and dynamics to rotational motion about a fixed axis, introducing angular quantities and their relationships.",
    openStaxUrl: "https://openstax.org/books/university-physics-volume-1/pages/10-introduction",
    keyFormulas: [
      {
        name: "Angular Velocity",
        formula: "ω = Δθ/Δt",
        description: "Rate of angular displacement",
      },
      {
        name: "Torque",
        formula: "τ = rF sin(θ)",
        description: "Rotational effect of a force",
      },
      {
        name: "Rotational Inertia",
        formula: "I = Σmr²",
        description: "Resistance to rotational acceleration",
      },
      {
        name: "Rotational Kinetic Energy",
        formula: "KE_{rot} = (1/2)Iω²",
        description: "Energy of rotation",
      },
    ],
    concepts: [
      {
        title: "Moment of Inertia",
        explanation: "The rotational analog of mass, depending on both the mass distribution and the axis of rotation.",
      },
    ],
  },
  {
    id: 11,
    title: "Angular Momentum",
    topics: ["Angular Momentum of a Particle", "Angular Momentum of a Rigid Body", "Conservation of Angular Momentum", "Precession"],
    summary: "Angular momentum is the rotational analog of linear momentum. This chapter covers its calculation, conservation, and applications including gyroscopes and precession.",
    openStaxUrl: "https://openstax.org/books/university-physics-volume-1/pages/11-introduction",
    keyFormulas: [
      {
        name: "Angular Momentum",
        formula: "L = Iω",
        description: "Angular momentum of rotating body",
      },
      {
        name: "Conservation of Angular Momentum",
        formula: "L_{i} = L_{f}",
        description: "Angular momentum conserved when no external torque",
      },
    ],
    concepts: [
      {
        title: "Angular Momentum Conservation",
        explanation: "When the net external torque on a system is zero, the total angular momentum remains constant. This explains phenomena like figure skaters spinning faster when they pull their arms in.",
      },
    ],
  },
  {
    id: 12,
    title: "Static Equilibrium and Elasticity",
    topics: ["Conditions for Equilibrium", "Center of Gravity", "Stress and Strain", "Elastic Moduli"],
    summary: "An object in static equilibrium has no net force and no net torque acting on it. This chapter analyzes equilibrium conditions and introduces stress, strain, and elastic properties of materials.",
    openStaxUrl: "https://openstax.org/books/university-physics-volume-1/pages/12-introduction",
    keyFormulas: [
      {
        name: "First Condition of Equilibrium",
        formula: "ΣF = 0",
        description: "No net force",
      },
      {
        name: "Second Condition of Equilibrium",
        formula: "Στ = 0",
        description: "No net torque",
      },
      {
        name: "Young's Modulus",
        formula: "Y = (F/A)/(ΔL/L)",
        description: "Measure of stiffness",
      },
    ],
    concepts: [
      {
        title: "Static Equilibrium",
        explanation: "For an object to be in static equilibrium, both the net force and net torque must be zero.",
      },
    ],
  },
  {
    id: 13,
    title: "Gravitation",
    topics: ["Newton's Law of Universal Gravitation", "Gravitational Potential Energy", "Kepler's Laws", "Satellite Orbits"],
    summary: "Gravitation is the attractive force between all masses. This chapter covers Newton's law of universal gravitation, gravitational potential energy, orbital motion, and Kepler's laws of planetary motion.",
    openStaxUrl: "https://openstax.org/books/university-physics-volume-1/pages/13-introduction",
    keyFormulas: [
      {
        name: "Newton's Law of Gravitation",
        formula: "F = Gm₁m₂/r²",
        description: "Gravitational force between two masses",
      },
      {
        name: "Gravitational Potential Energy",
        formula: "U = -Gm₁m₂/r",
        description: "Potential energy in gravitational field",
      },
      {
        name: "Orbital Speed",
        formula: "v = √(GM/r)",
        description: "Speed for circular orbit",
      },
    ],
    concepts: [
      {
        title: "Kepler's Laws",
        explanation: "Kepler's three laws describe planetary motion: 1) Orbits are ellipses with the Sun at one focus, 2) Equal areas swept in equal times, 3) Period squared proportional to semi-major axis cubed.",
      },
    ],
  },
  {
    id: 14,
    title: "Fluid Mechanics",
    topics: ["Density and Pressure", "Buoyancy", "Fluid Dynamics", "Bernoulli's Equation", "Viscosity"],
    summary: "Fluid mechanics studies the behavior of liquids and gases. This chapter covers pressure, buoyancy, continuity equation, Bernoulli's equation, and viscous flow.",
    openStaxUrl: "https://openstax.org/books/university-physics-volume-1/pages/14-introduction",
    keyFormulas: [
      {
        name: "Pressure",
        formula: "P = F/A",
        description: "Force per unit area",
      },
      {
        name: "Buoyant Force",
        formula: "F_{B} = ρ_{fluid} V_{displaced} g",
        description: "Upward force on submerged object",
      },
      {
        name: "Continuity Equation",
        formula: "A₁v₁ = A₂v₂",
        description: "Volume flow rate is constant",
      },
      {
        name: "Bernoulli's Equation",
        formula: "P + (1/2)ρv² + ρgh = constant",
        description: "Energy conservation for fluids",
      },
    ],
    concepts: [
      {
        title: "Archimedes' Principle",
        explanation: "The buoyant force on an object equals the weight of the fluid displaced by the object.",
      },
    ],
  },
];

// ========== VOLUME 3: OPTICS AND MODERN PHYSICS ==========
// Based on OpenStax University Physics Volume 3

export const volume3Chapters: Chapter[] = [
  {
    id: 1,
    title: "The Nature of Light",
    topics: ["Propagation of Light", "Speed of Light", "Electromagnetic Spectrum", "Wave-Particle Duality", "Huygens's Principle"],
    summary: "Light is an electromagnetic wave that travels at approximately 3×10⁸ m/s in vacuum. This chapter explores the fundamental nature of light, including its propagation, the electromagnetic spectrum from radio waves to gamma rays, and the dual wave-particle nature that is central to modern physics.",
    openStaxUrl: "https://openstax.org/books/university-physics-volume-3/pages/1-introduction",
    keyFormulas: [
      {
        name: "Speed of Light",
        formula: "c = 3.00 × 10⁸ m/s",
        description: "Speed of light in vacuum",
      },
      {
        name: "Index of Refraction",
        formula: "n = c/v",
        description: "Ratio of speed of light in vacuum to speed in medium",
      },
      {
        name: "Wavelength-Frequency",
        formula: "c = λf",
        description: "Relationship between wavelength and frequency for electromagnetic waves",
      },
    ],
    concepts: [
      {
        title: "Electromagnetic Spectrum",
        explanation: "The electromagnetic spectrum encompasses all forms of electromagnetic radiation, from long-wavelength radio waves to short-wavelength gamma rays. All travel at the speed of light in vacuum but differ in wavelength and frequency.",
        example: "Visible light occupies a narrow band from about 400 nm (violet) to 700 nm (red). Radio waves can be kilometers long, while gamma rays are shorter than atomic nuclei.",
      },
      {
        title: "Wave-Particle Duality",
        explanation: "Light exhibits both wave-like properties (interference, diffraction) and particle-like properties (photoelectric effect). This duality is fundamental to quantum mechanics.",
      },
    ],
  },
  {
    id: 2,
    title: "Geometric Optics and Image Formation",
    topics: ["Reflection", "Refraction", "Snell's Law", "Total Internal Reflection", "Mirrors", "Lenses", "Optical Instruments"],
    summary: "Geometric optics describes how light rays interact with mirrors and lenses to form images. This chapter covers the laws of reflection and refraction, image formation by curved mirrors and lenses, and applications in optical instruments like cameras, telescopes, and microscopes.",
    openStaxUrl: "https://openstax.org/books/university-physics-volume-3/pages/2-introduction",
    keyFormulas: [
      {
        name: "Law of Reflection",
        formula: "θᵢ = θᵣ",
        description: "Angle of incidence equals angle of reflection",
      },
      {
        name: "Snell's Law",
        formula: "n₁sinθ₁ = n₂sinθ₂",
        description: "Law of refraction relating angles and indices of refraction",
      },
      {
        name: "Mirror Equation",
        formula: "1/f = 1/dₒ + 1/dᵢ",
        description: "Relates object distance, image distance, and focal length for mirrors",
      },
      {
        name: "Lens Maker's Equation",
        formula: "1/f = (n-1)(1/R₁ - 1/R₂)",
        description: "Focal length depends on index of refraction and radii of curvature",
      },
      {
        name: "Magnification",
        formula: "m = -dᵢ/dₒ = hᵢ/hₒ",
        description: "Ratio of image size to object size",
      },
    ],
    concepts: [
      {
        title: "Total Internal Reflection",
        explanation: "When light travels from a denser to less dense medium at an angle greater than the critical angle, all light is reflected back. This principle enables fiber optic communication.",
        example: "Critical angle for water-air interface is about 48.6°. Light hitting at steeper angles is completely reflected, which is why underwater objects can appear mirror-like from below.",
      },
      {
        title: "Real vs Virtual Images",
        explanation: "Real images are formed by actual convergence of light rays and can be projected on a screen. Virtual images are formed by apparent divergence of rays and cannot be projected.",
        example: "A movie projector forms a real image on the screen. A plane mirror forms a virtual image that appears behind the mirror.",
      },
    ],
  },
  {
    id: 3,
    title: "Interference",
    topics: ["Superposition", "Young's Double-Slit", "Thin-Film Interference", "Coherence", "Interferometers"],
    summary: "Wave optics describes phenomena that depend on the wave nature of light. Interference occurs when two or more light waves overlap, creating patterns of constructive and destructive interference. This chapter explains interference patterns, thin-film effects like colors in soap bubbles, and applications in precision measurements.",
    openStaxUrl: "https://openstax.org/books/university-physics-volume-3/pages/3-introduction",
    keyFormulas: [
      {
        name: "Double-Slit Constructive Interference",
        formula: "dsinθ = mλ (m = 0, ±1, ±2, ...)",
        description: "Condition for bright fringes in double-slit experiment",
      },
      {
        name: "Double-Slit Destructive Interference",
        formula: "dsinθ = (m + 1/2)λ",
        description: "Condition for dark fringes in double-slit experiment",
      },
      {
        name: "Thin-Film Interference",
        formula: "2nt = mλ or (m + 1/2)λ",
        description: "Interference condition for thin films (depends on reflections)",
      },
    ],
    concepts: [
      {
        title: "Coherence",
        explanation: "Coherent light sources maintain a constant phase relationship, essential for producing stable interference patterns. Lasers are highly coherent; ordinary light bulbs are not.",
      },
      {
        title: "Path Difference",
        explanation: "Interference patterns arise from differences in the distances traveled by light waves. Constructive interference occurs when path difference is an integer multiple of wavelength; destructive when it's a half-integer multiple.",
        example: "In thin soap films, light reflected from the front and back surfaces interferes, creating colorful patterns that change with film thickness and viewing angle.",
      },
    ],
  },
  {
    id: 4,
    title: "Diffraction",
    topics: ["Single-Slit Diffraction", "Circular Apertures", "Resolution", "Diffraction Gratings", "X-ray Diffraction"],
    summary: "Diffraction is the bending and spreading of waves around obstacles and through openings. This chapter examines single-slit diffraction patterns, the resolution limits of optical instruments due to diffraction, diffraction gratings used in spectroscopy, and X-ray diffraction for determining crystal structures.",
    openStaxUrl: "https://openstax.org/books/university-physics-volume-3/pages/4-introduction",
    keyFormulas: [
      {
        name: "Single-Slit Minima",
        formula: "asinθ = mλ (m = ±1, ±2, ...)",
        description: "Dark fringes in single-slit diffraction pattern",
      },
      {
        name: "Rayleigh Criterion",
        formula: "θ = 1.22λ/D",
        description: "Minimum angular separation for resolving two point sources",
      },
      {
        name: "Diffraction Grating",
        formula: "dsinθ = mλ",
        description: "Condition for maxima in grating diffraction pattern",
      },
      {
        name: "Grating Resolution",
        formula: "R = mN",
        description: "Resolving power of a diffraction grating",
      },
    ],
    concepts: [
      {
        title: "Diffraction Limit",
        explanation: "Diffraction sets a fundamental limit on the resolution of optical systems. Smaller apertures and longer wavelengths increase diffraction effects, reducing resolution.",
        example: "Telescopes with larger mirrors can resolve finer details because their larger aperture reduces diffraction. This is why professional telescopes have mirrors several meters in diameter.",
      },
      {
        title: "Diffraction Gratings",
        explanation: "A diffraction grating contains thousands of equally-spaced slits that produce sharp, intense interference maxima at specific angles. Used in spectrometers to separate light into its component wavelengths.",
        example: "A CD or DVD acts as a reflection grating, separating white light into rainbow colors. The closely spaced tracks (1.6 μm for CDs) serve as the grating lines.",
      },
    ],
  },
];

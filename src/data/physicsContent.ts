// Physics Study Hub - Thermodynamics Content
// Based on OpenStax University Physics Volume 2

export interface Chapter {
  id: number;
  title: string;
  topics: string[];
  summary: string;
  keyFormulas: Formula[];
  concepts: Concept[];
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
    keyFormulas: [
      {
        name: "Celsius to Fahrenheit",
        formula: "T_F = (9/5)T_C + 32",
        description: "Convert temperature from Celsius to Fahrenheit",
      },
      {
        name: "Celsius to Kelvin",
        formula: "T_K = T_C + 273.15",
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
        formula: "Q/t = kA(T_h - T_c)/L",
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
        formula: "v_rms = √(3RT/M) = √(3kT/m)",
        description: "Root-mean-square speed of gas molecules",
        variables: [
          { symbol: "M", description: "Molar mass", unit: "kg/mol" },
          { symbol: "m", description: "Molecular mass", unit: "kg" },
          { symbol: "k", description: "Boltzmann constant", unit: "1.38×10⁻²³ J/K" },
        ],
      },
      {
        name: "Average Kinetic Energy",
        formula: "KE_avg = (3/2)kT",
        description: "Average kinetic energy per molecule",
      },
      {
        name: "Pressure from Kinetic Theory",
        formula: "P = (1/3)ρv²_rms",
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
        formula: "C_V = (f/2)nR",
        description: "Heat capacity when volume is constant",
      },
      {
        name: "Heat Capacity at Constant Pressure",
        formula: "C_P = C_V + nR",
        description: "Heat capacity when pressure is constant",
      },
      {
        name: "Adiabatic Process",
        formula: "PV^γ = constant",
        description: "Process with no heat transfer (Q=0)",
        variables: [
          { symbol: "γ", description: "Heat capacity ratio C_P/C_V", unit: "dimensionless" },
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
        title: "Why C_P > C_V",
        explanation: "At constant pressure, some energy goes into expansion work, so more heat is needed to raise temperature by 1K compared to constant volume.",
      },
    ],
  },
  {
    id: 4,
    title: "Second Law of Thermodynamics",
    topics: ["Heat Engines", "Entropy", "Carnot Cycle", "Refrigerators", "Efficiency"],
    summary: "The Second Law introduces the concept of entropy and explains why certain processes are irreversible. It sets fundamental limits on heat engine efficiency and defines the direction of spontaneous processes.",
    keyFormulas: [
      {
        name: "Heat Engine Efficiency",
        formula: "η = W/Q_h = 1 - Q_c/Q_h",
        description: "Efficiency of heat engine",
        variables: [
          { symbol: "W", description: "Work output", unit: "J" },
          { symbol: "Q_h", description: "Heat absorbed from hot reservoir", unit: "J" },
          { symbol: "Q_c", description: "Heat rejected to cold reservoir", unit: "J" },
        ],
      },
      {
        name: "Carnot Efficiency",
        formula: "η_C = 1 - T_c/T_h",
        description: "Maximum theoretical efficiency (Carnot engine)",
        variables: [
          { symbol: "T_c", description: "Cold reservoir temperature", unit: "K" },
          { symbol: "T_h", description: "Hot reservoir temperature", unit: "K" },
        ],
      },
      {
        name: "Coefficient of Performance (Refrigerator)",
        formula: "COP_ref = Q_c/W = Q_c/(Q_h - Q_c)",
        description: "Efficiency measure for refrigerators",
      },
      {
        name: "Entropy Change",
        formula: "ΔS = Q_rev/T",
        description: "Entropy change for reversible process",
        variables: [
          { symbol: "ΔS", description: "Change in entropy", unit: "J/K" },
          { symbol: "Q_rev", description: "Heat in reversible process", unit: "J" },
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
        explanation: "A heat engine must reject some heat to a cold reservoir (Q_c > 0) because temperature difference is required for heat flow. Perfect efficiency would require T_c = 0 K (impossible).",
      },
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
    solution: "Use the formula: T_C = (5/9)(T_F - 32)\nT_C = (5/9)(100 - 32) = (5/9)(68) = 37.8°C",
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
    question: "How much heat is needed to raise the temperature of 2.0 kg of water from 20°C to 100°C? (c_water = 4186 J/(kg·K))",
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
    solution: "Use Q/t = kA(T_h - T_c)/L\nQ/t = (400 W/(m·K))(0.01 m²)(100 K)/(0.5 m)\nQ/t = 800 W",
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
    solution: "η_C = 1 - T_c/T_h\nη_C = 1 - 300 K/500 K = 1 - 0.6 = 0.4 = 40%",
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
    question: "Calculate the entropy change when 1.0 kg of ice at 0°C melts to water at 0°C. (L_f = 334 kJ/kg)",
    solution: "For phase change at constant T: ΔS = Q/T\nQ = mL_f = (1.0 kg)(334,000 J/kg) = 334,000 J\nT = 273.15 K\nΔS = 334,000 J / 273.15 K = 1223 J/K ≈ 1.22 kJ/K",
    answer: "1.22 kJ/K",
    hints: ["Temperature is constant during phase change", "Use T in Kelvin"],
  },
  {
    id: 9,
    difficulty: "Hard",
    topic: "Heat Engine",
    question: "A heat engine absorbs 1000 J from a hot reservoir, does 400 J of work, and rejects Q_c to a cold reservoir. If the hot reservoir is at 600 K, what is the minimum temperature of the cold reservoir?",
    solution: "Q_c = Q_h - W = 1000 J - 400 J = 600 J\nActual efficiency: η = W/Q_h = 400/1000 = 0.4\nFor Carnot (max efficiency): η_C = 1 - T_c/T_h\n0.4 = 1 - T_c/600 K\nT_c = 600 K × (1 - 0.4) = 360 K\nSince actual engine has same efficiency as Carnot, T_c = 360 K is minimum.",
    answer: "360 K (87°C)",
    hints: ["Use energy conservation to find Q_c", "Minimum T_c occurs for Carnot efficiency"],
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
    back: "The Second Law requires heat engines to reject some heat (Q_c > 0) to a cold reservoir. Perfect efficiency would require T_c = 0 K, which is impossible.",
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

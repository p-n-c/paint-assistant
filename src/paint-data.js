export const paints = [
  {
    code: 'AX-117-R',
    name: 'Crimson Aurora',
    base: '#DC143C',
    formula: {
      components: [
        { type: 'PR-170', ratio: 0.45 },
        { type: 'PW-6', ratio: 0.3 },
        { type: 'PY-42', ratio: 0.25 },
      ],
      viscosity: '85-90 KU',
      mixingTime: '20-25 mins',
    },
    application: {
      temperature: { min: 10, max: 35 },
      humidity: { min: 20, max: 80 },
      coats: 2,
      dryingTime: '4-6 hours',
      coverage: '8-10 m²/L',
    },
    safety: {
      flashPoint: '32°C',
      VOC: 38,
      toxicityClass: 'B',
    },
  },
  {
    code: 'BX-235-M',
    name: 'Marine Depth',
    base: '#1B4B6F',
    formula: {
      components: [
        { type: 'PB-15', ratio: 0.55 },
        { type: 'PBk-7', ratio: 0.25 },
        { type: 'PW-6', ratio: 0.2 },
      ],
      viscosity: '80-85 KU',
      mixingTime: '15-20 mins',
    },
    application: {
      temperature: { min: 12, max: 32 },
      humidity: { min: 25, max: 75 },
      coats: 2,
      dryingTime: '6-8 hours',
      coverage: '9-11 m²/L',
    },
    safety: {
      flashPoint: '35°C',
      VOC: 42,
      toxicityClass: 'B',
    },
  },
  {
    code: 'CX-344-G',
    name: 'Forest Whisper',
    base: '#2E5A35',
    formula: {
      components: [
        { type: 'PG-7', ratio: 0.5 },
        { type: 'PY-42', ratio: 0.3 },
        { type: 'PBk-7', ratio: 0.2 },
      ],
      viscosity: '82-87 KU',
      mixingTime: '18-22 mins',
    },
    application: {
      temperature: { min: 15, max: 30 },
      humidity: { min: 30, max: 70 },
      coats: 3,
      dryingTime: '5-7 hours',
      coverage: '7-9 m²/L',
    },
    safety: {
      flashPoint: '38°C',
      VOC: 35,
      toxicityClass: 'A',
    },
  },
  {
    code: 'DX-456-P',
    name: 'Desert Dawn',
    base: '#C19A6B',
    formula: {
      components: [
        { type: 'PY-42', ratio: 0.4 },
        { type: 'PR-101', ratio: 0.35 },
        { type: 'PW-6', ratio: 0.25 },
      ],
      viscosity: '88-93 KU',
      mixingTime: '22-26 mins',
    },
    application: {
      temperature: { min: 18, max: 38 },
      humidity: { min: 15, max: 65 },
      coats: 2,
      dryingTime: '3-5 hours',
      coverage: '10-12 m²/L',
    },
    safety: {
      flashPoint: '41°C',
      VOC: 30,
      toxicityClass: 'A',
    },
  },
  {
    code: 'EX-567-S',
    name: 'Steel Symphony',
    base: '#71797E',
    formula: {
      components: [
        { type: 'PBk-7', ratio: 0.45 },
        { type: 'PW-6', ratio: 0.4 },
        { type: 'PB-15', ratio: 0.15 },
      ],
      viscosity: '83-88 KU',
      mixingTime: '16-20 mins',
    },
    application: {
      temperature: { min: 10, max: 35 },
      humidity: { min: 20, max: 80 },
      coats: 2,
      dryingTime: '5-7 hours',
      coverage: '9-11 m²/L',
    },
    safety: {
      flashPoint: '36°C',
      VOC: 40,
      toxicityClass: 'B',
    },
  },
  {
    code: 'FX-678-M',
    name: 'Midnight Sparkle',
    base: '#2C3E50',
    formula: {
      components: [
        { type: 'PBk-7', ratio: 0.4 },
        { type: 'PB-15', ratio: 0.35 },
        { type: 'PM-100', ratio: 0.25 }, // Metallic pigment
      ],
      viscosity: '90-95 KU',
      mixingTime: '25-30 mins',
    },
    application: {
      temperature: { min: 15, max: 30 },
      humidity: { min: 30, max: 60 },
      coats: 3,
      dryingTime: '8-10 hours',
      coverage: '6-8 m²/L',
    },
    safety: {
      flashPoint: '39°C',
      VOC: 45,
      toxicityClass: 'C',
    },
  },
  {
    code: 'GX-789-P',
    name: 'Pearl Cascade',
    base: '#F0F8FF',
    formula: {
      components: [
        { type: 'PW-6', ratio: 0.6 },
        { type: 'PI-100', ratio: 0.4 }, // Iridescent pigment
      ],
      viscosity: '87-92 KU',
      mixingTime: '28-32 mins',
    },
    application: {
      temperature: { min: 18, max: 28 },
      humidity: { min: 40, max: 65 },
      coats: 4,
      dryingTime: '12-14 hours',
      coverage: '5-7 m²/L',
    },
    safety: {
      flashPoint: '45°C',
      VOC: 50,
      toxicityClass: 'C',
    },
  },
  {
    code: 'HX-890-T',
    name: 'Thermal Shift',
    base: '#FF5733',
    formula: {
      components: [
        { type: 'PT-100', ratio: 0.5 }, // Thermochromic pigment
        { type: 'PR-170', ratio: 0.3 },
        { type: 'PY-42', ratio: 0.2 },
      ],
      viscosity: '92-97 KU',
      mixingTime: '30-35 mins',
    },
    application: {
      temperature: { min: 20, max: 25 },
      humidity: { min: 45, max: 55 },
      coats: 3,
      dryingTime: '24 hours',
      coverage: '4-6 m²/L',
    },
    safety: {
      flashPoint: '48°C',
      VOC: 55,
      toxicityClass: 'D',
    },
  },
  {
    code: 'IX-901-H',
    name: 'Hydro Guard',
    base: '#4682B4',
    formula: {
      components: [
        { type: 'PB-15', ratio: 0.45 },
        { type: 'PW-6', ratio: 0.3 },
        { type: 'PH-100', ratio: 0.25 }, // Hydrophobic additive
      ],
      viscosity: '85-90 KU',
      mixingTime: '20-25 mins',
    },
    application: {
      temperature: { min: 15, max: 35 },
      humidity: { min: 20, max: 90 },
      coats: 2,
      dryingTime: '6-8 hours',
      coverage: '8-10 m²/L',
    },
    safety: {
      flashPoint: '37°C',
      VOC: 35,
      toxicityClass: 'B',
    },
  },
  {
    code: 'JX-012-U',
    name: 'UV Shield',
    base: '#FAFAFA',
    formula: {
      components: [
        { type: 'PW-6', ratio: 0.55 },
        { type: 'PU-100', ratio: 0.45 }, // UV-resistant additive
      ],
      viscosity: '83-88 KU',
      mixingTime: '18-22 mins',
    },
    application: {
      temperature: { min: 10, max: 40 },
      humidity: { min: 15, max: 85 },
      coats: 2,
      dryingTime: '4-6 hours',
      coverage: '10-12 m²/L',
    },
    safety: {
      flashPoint: '34°C',
      VOC: 28,
      toxicityClass: 'A',
    },
  },
]

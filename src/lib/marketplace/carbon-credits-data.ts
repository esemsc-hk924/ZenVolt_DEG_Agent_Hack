export type ProjectType =
  | 'renewable-energy'
  | 'reforestation'
  | 'carbon-capture'
  | 'energy-efficiency'
  | 'waste-management'
  | 'agriculture';

export type VerificationStandard =
  | 'VCS'
  | 'Gold Standard'
  | 'CAR'
  | 'ACR'
  | 'Verra'
  | 'Puro Earth';

export interface CarbonCredit {
  id: string;
  projectName: string;
  projectType: ProjectType;
  verificationStandard: VerificationStandard | VerificationStandard[]; // Support multiple standards
  pricePerTon: number; // GBP
  availableTons: number;
  location: string;
  country: string;
  vintageYear: number;
  qualityScore: number; // 1-100
  provider: string;
  providerLogo?: string;
  description: string;
  longDescription?: string;
  coBenefits: string[]; // e.g., ["Biodiversity", "Community Development"]
  additionality: boolean;
  permanence: 'high' | 'medium' | 'low';
  registryId?: string;
  projectUrl?: string;
  imageUrl?: string;
  scope3Relevant?: boolean; // Best for Scope 3 emissions offsetting
}

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  'renewable-energy': 'Renewable Energy',
  'reforestation': 'Reforestation',
  'carbon-capture': 'Carbon Capture',
  'energy-efficiency': 'Energy Efficiency',
  'waste-management': 'Waste Management',
  'agriculture': 'Agriculture',
};

export const VERIFICATION_STANDARD_COLORS: Record<VerificationStandard, string> = {
  'VCS': 'bg-blue-500',
  'Gold Standard': 'bg-yellow-500',
  'CAR': 'bg-green-500',
  'ACR': 'bg-purple-500',
  'Verra': 'bg-indigo-500',
  'Puro Earth': 'bg-teal-500',
};

// Project types most relevant for Scope 3 emissions offsetting
export const SCOPE3_RELEVANT_TYPES: ProjectType[] = [
  'renewable-energy', // Reduces supply chain emissions
  'energy-efficiency', // Reduces supplier emissions
  'waste-management', // Reduces upstream waste emissions
  'carbon-capture', // Direct removal for hard-to-abate emissions
];

// Real carbon credit companies and projects - 2025 data
export const DEMO_CARBON_CREDITS: CarbonCredit[] = [
  // South Pole
  {
    id: 'cc-001',
    projectName: 'South Pole Renewable Energy Portfolio',
    projectType: 'renewable-energy',
    verificationStandard: ['VCS', 'Gold Standard'],
    pricePerTon: 11.02, // 14.50 USD * 0.76
    availableTons: 125000,
    location: 'Global',
    country: 'Multiple',
    vintageYear: 2025,
    qualityScore: 91,
    provider: 'South Pole',
    description: 'Renewable energy credits from verified projects across multiple regions.',
    longDescription: 'South Pole sources high-quality renewable energy credits verified under VCS and Gold Standard, ideal for companies offsetting Scope 3 emissions from supplier energy use.',
    coBenefits: ['Transparency', 'Liquidity', 'Verification'],
    additionality: true,
    permanence: 'high',
    registryId: 'SP-RE-2025-001',
    scope3Relevant: true,
  },
  {
    id: 'cc-002',
    projectName: 'World Land Trust – Carbon Balanced',
    projectType: 'reforestation',
    verificationStandard: ['VCS', 'Gold Standard'],
    pricePerTon: 14.25, // 18.75 USD * 0.76
    availableTons: 85000,
    location: 'Global',
    country: 'Multiple',
    vintageYear: 2025,
    qualityScore: 89,
    provider: 'World Land Trust – Carbon Balanced',
    description: 'Nature-based credits supporting biodiversity and forest conservation.',
    longDescription: 'Carbon Balanced projects protect and restore critical habitats, providing durable carbon benefits and biodiversity co-benefits.',
    coBenefits: ['Biodiversity', 'Community Development', 'Ecosystem Services'],
    additionality: true,
    permanence: 'high',
    registryId: 'WLT-CB-2025-002',
    scope3Relevant: false,
  },

  // Climate Impact Partners
  {
    id: 'cc-003',
    projectName: 'Climate Impact Partners Energy Efficiency Bundle',
    projectType: 'renewable-energy',
    verificationStandard: ['VCS', 'Gold Standard', 'CAR'],
    pricePerTon: 10.07, // 13.25 USD * 0.76
    availableTons: 200000,
    location: 'Global',
    country: 'Multiple',
    vintageYear: 2025,
    qualityScore: 88,
    provider: 'Climate Impact Partners',
    description: 'Aggregated credits from verified energy efficiency projects.',
    longDescription: 'A diversified portfolio of energy efficiency improvements verified across multiple standards, tailored for Scope 3 reductions.',
    coBenefits: ['On-chain Transparency', 'Price Discovery', 'Market Efficiency'],
    additionality: true,
    permanence: 'high',
    registryId: 'CIP-EE-2025-003',
    scope3Relevant: true,
  },

  // Forest Carbon
  {
    id: 'cc-004',
    projectName: 'Forest Carbon – UK Woodland Creation',
    projectType: 'reforestation',
    verificationStandard: 'VCS',
    pricePerTon: 12.16, // 16.00 USD * 0.76
    availableTons: 95000,
    location: 'UK',
    country: 'United Kingdom',
    vintageYear: 2025,
    qualityScore: 93,
    provider: 'Forest Carbon',
    description: 'Woodland creation and restoration projects delivering verified UK carbon units.',
    longDescription: 'Forest Carbon develops reforestation projects in the UK under recognized codes, creating local nature and carbon benefits.',
    coBenefits: ['Biodiversity', 'Indigenous Rights', 'Water Conservation'],
    additionality: true,
    permanence: 'high',
    registryId: 'FC-UK-2025-004',
    scope3Relevant: false,
  },
  {
    id: 'cc-005',
    projectName: 'CarbonFootprint.com Renewable Energy',
    projectType: 'renewable-energy',
    verificationStandard: ['Gold Standard', 'VCS'],
    pricePerTon: 11.78, // 15.50 USD * 0.76
    availableTons: 110000,
    location: 'Global',
    country: 'Multiple',
    vintageYear: 2025,
    qualityScore: 90,
    provider: 'CarbonFootprint.com',
    description: 'Renewable energy project credits from wind and solar sites.',
    longDescription: 'CarbonFootprint.com aggregates verified renewable projects suitable for addressing Scope 3 electricity-related emissions.',
    coBenefits: ['Energy Access', 'Job Creation', 'Technology Transfer'],
    additionality: true,
    permanence: 'high',
    registryId: 'CFP-RE-2025-005',
    scope3Relevant: true,
  },

  // Verra (via project developers/retailers)
  {
    id: 'cc-006',
    projectName: 'Verra Verified Nature Portfolio',
    projectType: 'renewable-energy',
    verificationStandard: ['Gold Standard', 'VCS'],
    pricePerTon: 11.21, // 14.75 USD * 0.76
    availableTons: 75000,
    location: 'Global',
    country: 'Multiple',
    vintageYear: 2025,
    qualityScore: 87,
    provider: 'Verra',
    description: 'Verified carbon projects listed under the VCS program.',
    longDescription: 'A curated portfolio of Verra VCS projects from reputable developers and retailers.',
    coBenefits: ['Energy Access', 'Economic Development', 'Health Improvements'],
    additionality: true,
    permanence: 'high',
    registryId: 'VERRA-VCS-2025-006',
    scope3Relevant: true,
  },

  // Gold Standard Marketplace
  {
    id: 'cc-007',
    projectName: 'Gold Standard Verified Projects',
    projectType: 'agriculture',
    verificationStandard: ['VCS', 'CAR'],
    pricePerTon: 17.10, // 22.50 USD * 0.76
    availableTons: 45000,
    location: 'North America',
    country: 'United States',
    vintageYear: 2025,
    qualityScore: 92,
    provider: 'Gold Standard Marketplace',
    description: 'Portfolio of projects verified by Gold Standard.',
    longDescription: 'High-quality Gold Standard projects across multiple geographies and categories.',
    coBenefits: ['Soil Health', 'Water Retention', 'Farmer Livelihoods', 'Biodiversity'],
    additionality: true,
    permanence: 'medium',
    registryId: 'GS-MKT-2025-007',
    scope3Relevant: true,
  },

  // Patch
  {
    id: 'cc-008',
    projectName: 'Patch Nature-Based Credits',
    projectType: 'reforestation',
    verificationStandard: ['VCS', 'Gold Standard'],
    pricePerTon: 14.63, // 19.25 USD * 0.76
    availableTons: 68000,
    location: 'Southeast Asia',
    country: 'Multiple',
    vintageYear: 2025,
    qualityScore: 90,
    provider: 'Patch',
    description: 'Aggregated nature-based credits from vetted developers.',
    longDescription: 'Patch sources nature-based credits with transparent developer metadata and verification.',
    coBenefits: ['Biodiversity', 'Community Development', 'Ecosystem Restoration'],
    additionality: true,
    permanence: 'high',
    registryId: 'PATCH-NB-2025-008',
    scope3Relevant: false,
  },
  {
    id: 'cc-009',
    projectName: 'Cloverly Renewable Energy Pool',
    projectType: 'renewable-energy',
    verificationStandard: ['Gold Standard', 'VCS'],
    pricePerTon: 11.40, // 15.00 USD * 0.76
    availableTons: 105000,
    location: 'Global',
    country: 'Multiple',
    vintageYear: 2025,
    qualityScore: 89,
    provider: 'Cloverly',
    description: 'Renewable credits aggregated for enterprise programs.',
    longDescription: 'Cloverly aggregates renewable energy credits from wind, solar, and hydro projects globally.',
    coBenefits: ['Energy Transition', 'Market Access', 'Verification'],
    additionality: true,
    permanence: 'high',
    registryId: 'CLO-RE-2025-009',
    scope3Relevant: true,
  },

  // Nori
  {
    id: 'cc-010',
    projectName: 'Nori Soil Carbon Removal',
    projectType: 'agriculture',
    verificationStandard: 'CAR',
    pricePerTon: 18.24, // 24.00 USD * 0.76
    availableTons: 35000,
    location: 'United States',
    country: 'United States',
    vintageYear: 2025,
    qualityScore: 94,
    provider: 'Nori',
    description: 'Verified soil carbon removal credits from regenerative farming practices in the United States.',
    longDescription: 'Nori provides transparent, verified soil carbon removal credits. Farmers adopt regenerative practices that sequester carbon in soil, creating permanent carbon storage. Ideal for companies offsetting Scope 3 emissions from agricultural supply chains.',
    coBenefits: ['Soil Health', 'Farmer Income', 'Water Quality', 'Biodiversity'],
    additionality: true,
    permanence: 'medium',
    registryId: 'NORI-CAR-2025-010',
    scope3Relevant: true,
  },

  // Puro.earth
  {
    id: 'cc-011',
    projectName: 'Puro.earth Carbon Removal',
    projectType: 'carbon-capture',
    verificationStandard: 'Puro Earth',
    pricePerTon: 34.20, // 45.00 USD * 0.76
    availableTons: 25000,
    location: 'North America',
    country: 'Multiple',
    vintageYear: 2025,
    qualityScore: 96,
    provider: 'Puro.earth',
    description: 'Permanent carbon removal credits across eligible methodologies.',
    longDescription: 'Puro.earth provides verified carbon removal credits including biochar, EBC, and other permanent storage methods.',
    coBenefits: ['Technology Innovation', 'Circular Economy', 'Industry Decarbonization'],
    additionality: true,
    permanence: 'high',
    registryId: 'PURO-2025-011',
    scope3Relevant: true,
  },

  // Cool Effect
  {
    id: 'cc-012',
    projectName: 'Cool Effect Forest Projects',
    projectType: 'reforestation',
    verificationStandard: ['VCS', 'Gold Standard'],
    pricePerTon: 13.30, // 17.50 USD * 0.76
    availableTons: 80000,
    location: 'Global',
    country: 'Multiple',
    vintageYear: 2025,
    qualityScore: 91,
    provider: 'Cool Effect',
    description: 'Curated nature-based projects with detailed transparency.',
    longDescription: 'Cool Effect offers rigorously curated projects with transparent documentation and pricing.',
    coBenefits: ['Technology Innovation', 'Biodiversity', 'Community Development'],
    additionality: true,
    permanence: 'high',
    registryId: 'CE-NB-2025-012',
    scope3Relevant: false,
  },

  // Terrapass
  {
    id: 'cc-013',
    projectName: 'Terrapass Direct Air Capture',
    projectType: 'carbon-capture',
    verificationStandard: 'Puro Earth',
    pricePerTon: 72.20, // 95.00 USD * 0.76
    availableTons: 12000,
    location: 'Iceland',
    country: 'Iceland',
    vintageYear: 2025,
    qualityScore: 98,
    provider: 'Terrapass',
    description: 'Direct air capture and removal credits via partners.',
    longDescription: 'Terrapass provides access to removal technologies including DAC with high-integrity verification.',
    coBenefits: ['Technology Innovation', 'Permanent Removal', 'Scalability'],
    additionality: true,
    permanence: 'high',
    registryId: 'TP-DAC-2025-013',
    scope3Relevant: true,
  },

  // ClimatePartner
  {
    id: 'cc-014',
    projectName: 'ClimatePartner Carbon Removal',
    projectType: 'carbon-capture',
    verificationStandard: ['Puro Earth', 'VCS'],
    pricePerTon: 57.00, // 75.00 USD * 0.76
    availableTons: 30000,
    location: 'Global',
    country: 'Multiple',
    vintageYear: 2025,
    qualityScore: 95,
    provider: 'ClimatePartner',
    description: 'Curated removal credits from leading technologies.',
    longDescription: 'ClimatePartner aggregates high-quality carbon removal credits, enabling robust Scope 3 strategies.',
    coBenefits: ['Technology Innovation', 'Market Development', 'Permanent Storage'],
    additionality: true,
    permanence: 'high',
    registryId: 'CP-REM-2025-014',
    scope3Relevant: true,
  },

  // Watershed
  {
    id: 'cc-015',
    projectName: 'Watershed Carbon Removal Portfolio',
    projectType: 'carbon-capture',
    verificationStandard: ['Puro Earth', 'VCS', 'Gold Standard'],
    pricePerTon: 49.40, // 65.00 USD * 0.76
    availableTons: 50000,
    location: 'Global',
    country: 'Multiple',
    vintageYear: 2025,
    qualityScore: 93,
    provider: 'Watershed',
    description: 'Portfolio of removal and reduction projects for enterprises.',
    longDescription: 'Watershed curates removal and reduction portfolios with rigorous diligence suitable for large enterprises.',
    coBenefits: ['Technology Innovation', 'Market Leadership', 'Verification'],
    additionality: true,
    permanence: 'high',
    registryId: 'WS-PORT-2025-015',
    scope3Relevant: true,
  },
];





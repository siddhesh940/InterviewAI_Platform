/**
 * Centralized company configuration - single source of truth for all company data
 * This ensures consistency across all Dream Company Station features
 */

export interface CompanyConfig {
  folderName: string;
  displayName: string;
  description: string;
}

export const COMPANY_CONFIG = {
  'accenture': {
    folderName: 'ACCENTURE',
    displayName: 'Accenture',
    description: 'Global professional services company with leading capabilities in digital, cloud and security.'
  },
  'capgemini': {
    folderName: 'CAPGEMINI', 
    displayName: 'Capgemini',
    description: 'French multinational information technology consulting and professional services company.'
  },
  'cognizant': {
    folderName: 'COGNIZANT',
    displayName: 'Cognizant',
    description: 'American multinational technology company that provides IT services and consulting.'
  },
  'infosys': {
    folderName: 'INFOSYS',
    displayName: 'Infosys',
    description: 'Indian multinational information technology company that provides consulting and software services.'
  },
  'tcs': {
    folderName: 'TCS',
    displayName: 'TCS',
    description: 'Tata Consultancy Services - Indian multinational IT services and consulting company.'
  },
  'wipro': {
    folderName: 'WIPRO',
    displayName: 'Wipro',
    description: 'Indian multinational corporation providing IT, consulting and business process services.'
  }
} as const satisfies Record<string, CompanyConfig>;

export type CompanySlug = keyof typeof COMPANY_CONFIG;

/**
 * Get company configuration by slug
 */
export function getCompanyConfig(slug: string): CompanyConfig | null {
  const normalizedSlug = slug.toLowerCase().trim();
  
return COMPANY_CONFIG[normalizedSlug as CompanySlug] || null;
}

/**
 * Get all available company slugs
 */
export function getAvailableCompanySlugs(): string[] {
  return Object.keys(COMPANY_CONFIG);
}

/**
 * Check if a company slug is valid
 */
export function isValidCompanySlug(slug: string): slug is CompanySlug {
  return slug.toLowerCase().trim() in COMPANY_CONFIG;
}

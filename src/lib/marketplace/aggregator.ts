import { CarbonCredit, ProjectType, VerificationStandard } from './carbon-credits-data';

export interface FilterOptions {
  projectTypes?: ProjectType[];
  verificationStandards?: VerificationStandard[];
  priceRange?: { min: number; max: number };
  qualityScoreMin?: number;
  locations?: string[];
  countries?: string[];
  vintageYearRange?: { min: number; max: number };
  permanence?: ('high' | 'medium' | 'low')[];
  searchQuery?: string;
  scope3Relevant?: boolean; // Filter for Scope 3 relevant credits
}

export type SortOption = 
  | 'price-low-high'
  | 'price-high-low'
  | 'quality-high-low'
  | 'quality-low-high'
  | 'available-high-low'
  | 'vintage-new-old'
  | 'best-value'; // Combines price and quality

/**
 * Filter carbon credits based on provided options
 */
export function filterCredits(
  credits: CarbonCredit[],
  filters: FilterOptions
): CarbonCredit[] {
  return credits.filter((credit) => {
    // Project type filter
    if (filters.projectTypes && filters.projectTypes.length > 0) {
      if (!filters.projectTypes.includes(credit.projectType)) {
        return false;
      }
    }

    // Verification standard filter (handle both single and array)
    if (filters.verificationStandards && filters.verificationStandards.length > 0) {
      const creditStandards = Array.isArray(credit.verificationStandard) 
        ? credit.verificationStandard 
        : [credit.verificationStandard];
      const hasMatchingStandard = creditStandards.some(std => 
        filters.verificationStandards!.includes(std)
      );
      if (!hasMatchingStandard) {
        return false;
      }
    }

    // Price range filter
    if (filters.priceRange) {
      if (credit.pricePerTon < filters.priceRange.min || credit.pricePerTon > filters.priceRange.max) {
        return false;
      }
    }

    // Quality score filter
    if (filters.qualityScoreMin !== undefined) {
      if (credit.qualityScore < filters.qualityScoreMin) {
        return false;
      }
    }

    // Location filter
    if (filters.locations && filters.locations.length > 0) {
      if (!filters.locations.some(loc => 
        credit.location.toLowerCase().includes(loc.toLowerCase())
      )) {
        return false;
      }
    }

    // Country filter
    if (filters.countries && filters.countries.length > 0) {
      if (!filters.countries.includes(credit.country)) {
        return false;
      }
    }

    // Vintage year range filter
    if (filters.vintageYearRange) {
      if (credit.vintageYear < filters.vintageYearRange.min || 
          credit.vintageYear > filters.vintageYearRange.max) {
        return false;
      }
    }

    // Permanence filter
    if (filters.permanence && filters.permanence.length > 0) {
      if (!filters.permanence.includes(credit.permanence)) {
        return false;
      }
    }

    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const searchableText = [
        credit.projectName,
        credit.description,
        credit.location,
        credit.country,
        credit.provider,
        credit.projectType,
      ].join(' ').toLowerCase();
      
      if (!searchableText.includes(query)) {
        return false;
      }
    }

    // Scope 3 relevance filter
    if (filters.scope3Relevant !== undefined) {
      if (credit.scope3Relevant !== filters.scope3Relevant) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sort carbon credits based on sort option
 */
export function sortCredits(
  credits: CarbonCredit[],
  sortOption: SortOption
): CarbonCredit[] {
  const sorted = [...credits];

  switch (sortOption) {
    case 'price-low-high':
      return sorted.sort((a, b) => a.pricePerTon - b.pricePerTon);
    
    case 'price-high-low':
      return sorted.sort((a, b) => b.pricePerTon - a.pricePerTon);
    
    case 'quality-high-low':
      return sorted.sort((a, b) => b.qualityScore - a.qualityScore);
    
    case 'quality-low-high':
      return sorted.sort((a, b) => a.qualityScore - b.qualityScore);
    
    case 'available-high-low':
      return sorted.sort((a, b) => b.availableTons - a.availableTons);
    
    case 'vintage-new-old':
      return sorted.sort((a, b) => b.vintageYear - a.vintageYear);
    
    case 'best-value': {
      // Best value = high quality score relative to price
      // Calculate value score: qualityScore / pricePerTon
      return sorted.sort((a, b) => {
        const valueA = a.qualityScore / a.pricePerTon;
        const valueB = b.qualityScore / b.pricePerTon;
        return valueB - valueA;
      });
    }
    
    default:
      return sorted;
  }
}

export type SortColumn = 'project' | 'type' | 'standard' | 'location' | 'vintage' | 'price' | null;
export type SortDirection = 'asc' | 'desc' | null;

/**
 * Sort carbon credits by column
 */
export function sortCreditsByColumn(
  credits: CarbonCredit[],
  column: SortColumn,
  direction: SortDirection
): CarbonCredit[] {
  if (!column || !direction) return [...credits];
  
  const sorted = [...credits];
  
  switch (column) {
    case 'project':
      return sorted.sort((a, b) => {
        const comparison = a.projectName.localeCompare(b.projectName);
        return direction === 'asc' ? comparison : -comparison;
      });
    
    case 'type':
      return sorted.sort((a, b) => {
        const comparison = a.projectType.localeCompare(b.projectType);
        return direction === 'asc' ? comparison : -comparison;
      });
    
    case 'standard': {
      // For standards, compare the first standard or the standard itself
      return sorted.sort((a, b) => {
        const aStandard = Array.isArray(a.verificationStandard) 
          ? a.verificationStandard[0] 
          : a.verificationStandard;
        const bStandard = Array.isArray(b.verificationStandard) 
          ? b.verificationStandard[0] 
          : b.verificationStandard;
        const comparison = aStandard.localeCompare(bStandard);
        return direction === 'asc' ? comparison : -comparison;
      });
    }
    
    case 'location':
      return sorted.sort((a, b) => {
        const comparison = a.country.localeCompare(b.country);
        return direction === 'asc' ? comparison : -comparison;
      });
    
    case 'vintage':
      return sorted.sort((a, b) => {
        const comparison = a.vintageYear - b.vintageYear;
        return direction === 'asc' ? comparison : -comparison;
      });
    
    case 'price':
      return sorted.sort((a, b) => {
        const comparison = a.pricePerTon - b.pricePerTon;
        return direction === 'asc' ? comparison : -comparison;
      });
    
    default:
      return sorted;
  }
}

/**
 * Find the best carbon credits based on multiple criteria
 * Similar to how DeFi aggregators find best routes
 */
export function findBestCredits(
  credits: CarbonCredit[],
  targetTons: number,
  maxPrice?: number,
  minQuality?: number
): CarbonCredit[] {
  let candidates = [...credits];

  // Filter by constraints
  if (maxPrice !== undefined) {
    candidates = candidates.filter(c => c.pricePerTon <= maxPrice);
  }
  if (minQuality !== undefined) {
    candidates = candidates.filter(c => c.qualityScore >= minQuality);
  }

  // Filter by availability
  candidates = candidates.filter(c => c.availableTons >= targetTons);

  // Sort by best value (quality/price ratio)
  candidates = sortCredits(candidates, 'best-value');

  // Return top 5 best options
  return candidates.slice(0, 5);
}

/**
 * Calculate total cost for purchasing credits
 */
export function calculateTotalCost(
  credit: CarbonCredit,
  tons: number
): number {
  return credit.pricePerTon * tons;
}

/**
 * Get unique values for filter dropdowns
 */
export function getUniqueValues(credits: CarbonCredit[]) {
  const countries = Array.from(new Set(credits.map(c => c.country))).sort();
  const locations = Array.from(new Set(credits.map(c => c.location))).sort();
  const providers = Array.from(new Set(credits.map(c => c.provider))).sort();
  
  // Handle both single and array standards
  const allStandards = new Set<VerificationStandard>();
  credits.forEach(c => {
    const standards = Array.isArray(c.verificationStandard) 
      ? c.verificationStandard 
      : [c.verificationStandard];
    standards.forEach(std => allStandards.add(std));
  });
  const standards = Array.from(allStandards).sort();
  
  const projectTypes = Array.from(new Set(credits.map(c => c.projectType))).sort();
  
  const priceRange = {
    min: Math.min(...credits.map(c => c.pricePerTon)),
    max: Math.max(...credits.map(c => c.pricePerTon)),
  };

  const vintageRange = {
    min: Math.min(...credits.map(c => c.vintageYear)),
    max: Math.max(...credits.map(c => c.vintageYear)),
  };

  return {
    countries,
    locations,
    providers,
    standards,
    projectTypes,
    priceRange,
    vintageRange,
  };
}





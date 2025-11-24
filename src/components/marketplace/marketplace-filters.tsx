"use client";

import { useState } from "react";
import { ProjectType, VerificationStandard } from "@/lib/marketplace/carbon-credits-data";
import { FilterOptions } from "@/lib/marketplace/aggregator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, ChevronDown, ChevronUp, Filter } from "lucide-react";
import { PROJECT_TYPE_LABELS } from "@/lib/marketplace/carbon-credits-data";
import { motion, AnimatePresence } from "framer-motion";

interface MarketplaceFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableOptions: {
    projectTypes: ProjectType[];
    standards: VerificationStandard[];
    countries: string[];
    priceRange: { min: number; max: number };
    vintageRange: { min: number; max: number };
  };
}

export default function MarketplaceFilters({
  filters,
  onFiltersChange,
  availableOptions,
}: MarketplaceFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleArrayFilter = (key: 'projectTypes' | 'verificationStandards' | 'countries' | 'permanence', value: any) => {
    const current = filters[key] || [];
    const newArray = Array.isArray(current) ? [...current] : [];
    const index = newArray.indexOf(value);
    
    if (index > -1) {
      newArray.splice(index, 1);
    } else {
      newArray.push(value);
    }
    
    onFiltersChange({ ...filters, [key]: newArray.length > 0 ? newArray : undefined });
  };

  const toggleScope3Filter = () => {
    onFiltersChange({ 
      ...filters, 
      scope3Relevant: filters.scope3Relevant === true ? undefined : true 
    });
  };

  const removeFilter = (key: keyof FilterOptions, value?: any) => {
    if (key === 'scope3Relevant') {
      onFiltersChange({ ...filters, scope3Relevant: undefined });
    } else if (key === 'searchQuery') {
      onFiltersChange({ ...filters, searchQuery: undefined });
    } else if (key === 'priceRange' || key === 'vintageYearRange' || key === 'qualityScoreMin') {
      onFiltersChange({ ...filters, [key]: undefined });
    } else {
      const current = filters[key] as any[];
      if (Array.isArray(current)) {
        const newArray = current.filter(item => item !== value);
        onFiltersChange({ ...filters, [key]: newArray.length > 0 ? newArray : undefined });
      }
    }
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;
  const activeFilterCount = Object.keys(filters).length;

  return (
    <div className="space-y-4">
      {/* Collapsible Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="h-5 px-1.5 text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-7 px-2"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Active Filters Chips (Always Visible) */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.scope3Relevant && (
            <Badge 
              variant="secondary" 
              className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-2 py-1 text-xs rounded-full flex items-center gap-1"
            >
              Best for Scope 3
              <button
                onClick={() => removeFilter('scope3Relevant')}
                className="ml-1 hover:bg-emerald-500/30 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {filters.projectTypes?.map((type) => (
            <Badge 
              key={type}
              variant="secondary" 
              className="px-2 py-1 text-xs rounded-full flex items-center gap-1"
            >
              {PROJECT_TYPE_LABELS[type]}
              <button
                onClick={() => removeFilter('projectTypes', type)}
                className="ml-1 hover:bg-muted rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          
          {filters.verificationStandards?.map((standard) => (
            <Badge 
              key={standard}
              variant="secondary" 
              className="px-2 py-1 text-xs rounded-full flex items-center gap-1"
            >
              {standard}
              <button
                onClick={() => removeFilter('verificationStandards', standard)}
                className="ml-1 hover:bg-muted rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          
          {filters.countries?.map((country: string) => (
            <Badge 
              key={country}
              variant="secondary" 
              className="px-2 py-1 text-xs rounded-full flex items-center gap-1"
            >
              {country}
              <button
                onClick={() => removeFilter('countries', country)}
                className="ml-1 hover:bg-muted rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          
          {filters.permanence?.map((perm: 'high' | 'medium' | 'low') => (
            <Badge 
              key={perm}
              variant="secondary" 
              className="px-2 py-1 text-xs rounded-full flex items-center gap-1 capitalize"
            >
              {perm}
              <button
                onClick={() => removeFilter('permanence', perm)}
                className="ml-1 hover:bg-muted rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          
          {filters.searchQuery && (
            <Badge 
              variant="secondary" 
              className="px-2 py-1 text-xs rounded-full flex items-center gap-1"
            >
              "{filters.searchQuery}"
              <button
                onClick={() => removeFilter('searchQuery')}
                className="ml-1 hover:bg-muted rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          )}
        </div>
      )}

      {/* Expandable Filter Options */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 pt-2 border-t">
              {/* Scope 3 Filter */}
              <div>
                <button
                  onClick={toggleScope3Filter}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 border ${
                    filters.scope3Relevant
                      ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                      : 'bg-muted/50 hover:bg-muted border-transparent'
                  }`}
                >
                  Best for Scope 3
                </button>
              </div>

              {/* Project Types */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">
                  Project Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableOptions.projectTypes.map((type: ProjectType) => {
                    const isSelected = filters.projectTypes?.includes(type);
                    return (
                      <button
                        key={type}
                        onClick={() => toggleArrayFilter('projectTypes', type)}
                        className={`px-3 py-1.5 rounded-lg text-xs transition-all duration-200 border ${
                          isSelected
                            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                            : 'bg-muted/50 hover:bg-muted border-transparent'
                        }`}
                      >
                        {PROJECT_TYPE_LABELS[type]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Verification Standards */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">
                  Verification Standard
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableOptions.standards.map((standard: VerificationStandard) => {
                    const isSelected = filters.verificationStandards?.includes(standard);
                    return (
                      <button
                        key={standard}
                        onClick={() => toggleArrayFilter('verificationStandards', standard)}
                        className={`px-3 py-1.5 rounded-lg text-xs transition-all duration-200 border ${
                          isSelected
                            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                            : 'bg-muted/50 hover:bg-muted border-transparent'
                        }`}
                      >
                        {standard}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Permanence */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">
                  Permanence
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['high', 'medium', 'low'] as const).map((perm) => {
                    const isSelected = filters.permanence?.includes(perm);
                    return (
                      <button
                        key={perm}
                        onClick={() => toggleArrayFilter('permanence', perm)}
                        className={`px-3 py-1.5 rounded-lg text-xs transition-all duration-200 border capitalize ${
                          isSelected
                            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                            : 'bg-muted/50 hover:bg-muted border-transparent'
                        }`}
                      >
                        {perm}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { DEMO_CARBON_CREDITS } from "@/lib/marketplace/carbon-credits-data";
import { filterCredits, sortCredits, sortCreditsByColumn, getUniqueValues, FilterOptions, SortOption, SortColumn, SortDirection, findBestCredits } from "@/lib/marketplace/aggregator";
import CarbonCreditCard from "@/components/marketplace/carbon-credit-card";
import CompactCreditCard from "@/components/marketplace/compact-credit-card";
import MarketplaceFilters from "@/components/marketplace/marketplace-filters";
import CreditComparisonTable from "@/components/marketplace/credit-comparison-table";
import PurchaseModal from "@/components/marketplace/purchase-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Grid, List, Sparkles, TrendingUp, Search } from "lucide-react";
import { toast } from "sonner";
import orgDemo from "@/data/org_demo.json";
import clsx from "clsx";
import { useCountUp } from "@/hooks/use-count-up";

function CreditCountDisplay({ count }: { count: number }) {
  const { displayValue, ref } = useCountUp(count, { decimals: 0, startOnView: false });
  const countNum = Math.round(parseFloat(displayValue));
  return (
    <span className="text-sm text-muted-foreground hidden sm:inline" ref={ref as React.RefObject<HTMLSpanElement>}>
      {countNum} credit{countNum !== 1 ? 's' : ''} found
    </span>
  );
}

export default function MarketplacePage() {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sortOption, setSortOption] = useState<SortOption>('best-value');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedCredit, setSelectedCredit] = useState<typeof DEMO_CARBON_CREDITS[0] | null>(null);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Get org emissions data
  const orgData = orgDemo as any;
  const scope1Emissions = orgData.thisYear?.scope1_tCO2e || 0;
  const scope2Emissions = orgData.thisYear?.scope2_location_tCO2e || 0;
  const scope3Emissions = orgData.thisYear?.scope3_cat4_upstream_tCO2e || 0;

  // Get available filter options
  const availableOptions = useMemo(() => {
    const unique = getUniqueValues(DEMO_CARBON_CREDITS);
    return {
      projectTypes: unique.projectTypes,
      standards: unique.standards,
      countries: unique.countries,
      priceRange: unique.priceRange,
      vintageRange: unique.vintageRange,
    };
  }, []);

  // Filter and sort credits
  const filteredAndSortedCredits = useMemo(() => {
    // Combine search query with filters (search input takes priority)
    const combinedFilters = {
      ...filters,
      ...(searchQuery && { searchQuery }),
    };
    
    let result = filterCredits(DEMO_CARBON_CREDITS, combinedFilters);
    
    // Apply column sorting if active, otherwise use dropdown sort
    if (sortColumn && sortDirection) {
      result = sortCreditsByColumn(result, sortColumn, sortDirection);
    } else {
      result = sortCredits(result, sortOption);
    }
    
    return result;
  }, [filters, sortOption, searchQuery, sortColumn, sortDirection]);

  // Find best credits for recommended offset (Scope 3 focused)
  const recommendedCredits = useMemo(() => {
    if (scope3Emissions > 0) {
      // Filter for Scope 3 relevant credits first
      const scope3Credits = DEMO_CARBON_CREDITS.filter(c => c.scope3Relevant);
      return findBestCredits(scope3Credits.length > 0 ? scope3Credits : DEMO_CARBON_CREDITS, scope3Emissions, undefined, 80);
    }
    return [];
  }, [scope3Emissions]);

  const handlePurchase = (credit: typeof DEMO_CARBON_CREDITS[0]) => {
    setSelectedCredit(credit);
    setPurchaseModalOpen(true);
  };

  const handleConfirmPurchase = async (credit: typeof DEMO_CARBON_CREDITS[0], tons: number) => {
    // In a real app, this would call an API to process the purchase
    // For now, we'll just simulate it
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update available tons (in real app, this would come from backend)
    const index = DEMO_CARBON_CREDITS.findIndex(c => c.id === credit.id);
    if (index > -1) {
      DEMO_CARBON_CREDITS[index].availableTons -= tons;
    }
  };

  const handleViewRecommended = () => {
    setFilters({
      ...filters,
      // Filter to show only recommended credits
    });
    // Scroll to credits section
    document.getElementById('credits-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Carbon Credit Marketplace</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Offset your Scope 3 emissions with verified carbon credits from leading providers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>

      {/* Best Value Credits Section */}
      {recommendedCredits.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <h2 className="text-sm font-medium text-muted-foreground">Best Value Credits</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {recommendedCredits.slice(0, 3).map((credit) => (
              <CompactCreditCard
                key={credit.id}
                credit={credit}
                onPurchase={handlePurchase}
              />
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="space-y-6">
        {/* Filters */}
        <MarketplaceFilters
          filters={filters}
          onFiltersChange={setFilters}
          availableOptions={availableOptions}
        />

        {/* Credits Section */}
        <div className="space-y-4" id="credits-section">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search credits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-11 rounded-full border border-white/20 dark:border-white/10 bg-white/60 dark:bg-slate-950/60 backdrop-blur text-sm shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40 transition"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CreditCountDisplay count={filteredAndSortedCredits.length} />
              {viewMode === 'grid' && (
                <select
                  value={sortOption}
                  onChange={(e) => {
                    setSortOption(e.target.value as SortOption);
                    setSortColumn(null);
                    setSortDirection(null);
                  }}
                  className="h-11 px-4 rounded-full border border-white/20 dark:border-white/10 bg-white/60 dark:bg-slate-950/60 backdrop-blur text-sm shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40 transition"
                >
                  <option value="best-value">Best Value</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="quality-high-low">Quality: High to Low</option>
                  <option value="vintage-new-old">Vintage: Newest</option>
                  <option value="available-high-low">Most Available</option>
                </select>
              )}
              <div className="flex rounded-full border border-white/20 dark:border-white/10 overflow-hidden bg-white/60 dark:bg-slate-950/60 backdrop-blur shadow-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={clsx(
                    "rounded-none px-3 py-2 h-10 transition-all duration-300",
                    viewMode === "grid"
                      ? "bg-emerald-600/90 text-white dark:shadow-[0_18px_38px_-24px_rgba(16,185,129,0.85)] hover:bg-emerald-600"
                      : "text-muted-foreground hover:bg-white/30 hover:dark:bg-slate-900/40"
                  )}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className={clsx(
                    "rounded-none px-3 py-2 h-10 transition-all duration-300",
                    viewMode === "table"
                      ? "bg-emerald-600/90 text-white dark:shadow-[0_18px_38px_-24px_rgba(16,185,129,0.85)] hover:bg-emerald-600"
                      : "text-muted-foreground hover:bg-white/30 hover:dark:bg-slate-900/40"
                  )}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Credits Display */}
          {filteredAndSortedCredits.length === 0 ? (
            <Card className="border border-white/20 dark:border-white/10 bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl dark:shadow-[0_35px_90px_-55px_rgba(16,185,129,0.55)] rounded-[28px]">
              <CardContent className="p-12 text-center space-y-4">
                <p className="text-muted-foreground">No carbon credits match your filters.</p>
                <Button
                  variant="outline"
                  onClick={() => setFilters({})}
                  className="rounded-full px-6 bg-white/70 hover:bg-white/80 dark:bg-slate-900/70 dark:hover:bg-slate-900/80 border-white/20 dark:border-white/10"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAndSortedCredits.map((credit) => (
                <CarbonCreditCard
                  key={credit.id}
                  credit={credit}
                  onPurchase={handlePurchase}
                />
              ))}
            </div>
          ) : (
            <CreditComparisonTable
              credits={filteredAndSortedCredits}
              onPurchase={handlePurchase}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={(column, direction) => {
                setSortColumn(column);
                setSortDirection(direction);
                // Clear dropdown sort when using column sort
                if (column) {
                  setSortOption('best-value');
                }
              }}
            />
          )}
        </div>
      </div>

      {/* Purchase Modal */}
      <PurchaseModal
        credit={selectedCredit}
        open={purchaseModalOpen}
        onClose={() => {
          setPurchaseModalOpen(false);
          setSelectedCredit(null);
        }}
        onConfirm={handleConfirmPurchase}
      />
    </div>
  );
}


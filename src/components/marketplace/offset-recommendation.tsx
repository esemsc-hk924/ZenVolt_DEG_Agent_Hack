"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingDown, ArrowRight, Leaf } from "lucide-react";
import { motion } from "framer-motion";

interface OffsetRecommendationProps {
  scope1Emissions?: number; // tCO2e
  scope2Emissions?: number; // tCO2e
  scope3Emissions?: number; // tCO2e
  onViewRecommended?: () => void;
}

export default function OffsetRecommendation({
  scope1Emissions = 0,
  scope2Emissions = 0,
  scope3Emissions = 0,
  onViewRecommended,
}: OffsetRecommendationProps) {
  // Focus on Scope 3 emissions for recommendations
  const recommendedOffset = scope3Emissions > 0 ? scope3Emissions : (scope1Emissions + scope2Emissions + scope3Emissions);

  if (recommendedOffset === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border border-white/20 dark:border-white/10 bg-gradient-to-br from-white/70 via-white/50 to-emerald-500/15 dark:from-slate-950/70 dark:via-slate-950/55 dark:to-emerald-500/20 backdrop-blur-2xl dark:shadow-[0_40px_90px_-50px_rgba(16,185,129,0.65)] rounded-[30px]">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Target className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold">Recommended Carbon Offset</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Offset your Scope 3 emissions with verified carbon credits from leading providers.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {scope3Emissions > 0 && (
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Scope 3 Emissions</div>
                    <div className="text-lg font-bold text-emerald-600">
                      {scope3Emissions.toLocaleString()} tCO2e
                    </div>
                  </div>
                )}
                {scope1Emissions > 0 && (
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Scope 1</div>
                    <div className="text-sm font-medium">
                      {scope1Emissions.toLocaleString()} tCO2e
                    </div>
                  </div>
                )}
                {scope2Emissions > 0 && (
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Scope 2</div>
                    <div className="text-sm font-medium">
                      {scope2Emissions.toLocaleString()} tCO2e
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="flex items-center gap-1 rounded-full bg-white/60 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-slate-900/60">
                  <TrendingDown className="h-3 w-3" />
                  Recommended offset
                </Badge>
                <span className="text-2xl font-bold text-emerald-600 tracking-tight">
                  {recommendedOffset.toLocaleString()} tons
                </span>
              </div>
            </div>

            {onViewRecommended && (
              <Button
                onClick={onViewRecommended}
                className="bg-emerald-600/90 hover:bg-emerald-600 text-white flex items-center gap-2 rounded-full h-11 px-6 dark:shadow-[0_25px_55px_-35px_rgba(16,185,129,0.8)] transition-all duration-300"
              >
                View Recommended Credits
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}


"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CarbonCredit, PROJECT_TYPE_LABELS, VERIFICATION_STANDARD_COLORS } from "@/lib/marketplace/carbon-credits-data";
import ProviderLogoBadge from "@/components/marketplace/provider-logo-badge";
import { Leaf, MapPin, PoundSterling, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCountUp } from "@/hooks/use-count-up";

interface CarbonCreditCardProps {
  credit: CarbonCredit;
  onPurchase: (credit: CarbonCredit) => void;
}

function PriceDisplay({ value }: { value: number }) {
  const { displayValue, ref } = useCountUp(value, { prefix: "£", decimals: 2, startOnView: true });
  return (
    <div className="flex items-center gap-1" ref={ref as React.RefObject<HTMLDivElement>}>
      <PoundSterling className="h-4 w-4 text-foreground" />
      <span className="text-lg md:text-xl font-semibold text-foreground">
        {displayValue.replace("£", "")}
      </span>
      <span className="text-sm text-muted-foreground">GBP</span>
    </div>
  );
}

export default function CarbonCreditCard({ credit, onPurchase }: CarbonCreditCardProps) {
  const [logoError, setLogoError] = useState(false);

  const getQualityColor = (score: number) => {
    if (score >= 90) return "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30";
    if (score >= 80) return "text-blue-600 bg-blue-50 dark:bg-blue-950/30";
    if (score >= 70) return "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30";
    return "text-gray-600 bg-gray-50 dark:bg-gray-950/30";
  };

  // Handle both single and array standards
  const standards = Array.isArray(credit.verificationStandard) 
    ? credit.verificationStandard 
    : [credit.verificationStandard];
  const primaryStandard = standards[0];

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <Card 
        onClick={() => onPurchase(credit)}
        className="border-2 border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl h-full flex flex-col shadow-sm dark:shadow-[0_35px_80px_-40px_rgba(16,185,129,0.55)] dark:hover:shadow-[0_45px_90px_-40px_rgba(16,185,129,0.65)] hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-500 rounded-[26px] cursor-pointer"
      >
        <CardContent className="p-6 flex flex-col flex-1 gap-3">
          {/* Header with verification standard badge and Scope 3 badge */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-wrap gap-2 flex-1">
              <Badge 
                className={`${VERIFICATION_STANDARD_COLORS[primaryStandard]} text-white text-xs font-medium`}
              >
                {standards.length > 1 ? `${primaryStandard} +${standards.length - 1}` : primaryStandard}
              </Badge>
              {credit.scope3Relevant && (
                <Badge 
                  variant="secondary" 
                  className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium flex items-center gap-1"
                >
                  <Target className="h-3 w-3" />
                  Scope 3
                </Badge>
              )}
            </div>
          </div>

          {/* Project name with logo */}
          <div className="flex items-start gap-2">
            <ProviderLogoBadge provider={credit.provider} size="md" />
            <h3 className="text-base md:text-lg font-semibold line-clamp-2 text-foreground tracking-tight flex-1">
              {credit.projectName}
            </h3>
          </div>

          {/* Provider */}
          <div className="text-sm text-muted-foreground font-medium">
            {credit.provider}
          </div>

          {/* Project type and location */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Leaf className="h-4 w-4" />
            <span>{PROJECT_TYPE_LABELS[credit.projectType]}</span>
            <span className="mx-1">•</span>
            <MapPin className="h-4 w-4" />
            <span>{credit.location}, {credit.country}</span>
          </div>

          {/* Price */}
          <div className="mt-auto pt-4 border-t border-white/20 dark:border-white/10">
            <div className="text-xs text-muted-foreground mb-1">Price per ton</div>
            <PriceDisplay value={credit.pricePerTon} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

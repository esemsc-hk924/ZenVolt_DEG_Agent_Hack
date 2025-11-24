"use client";

import { useState } from "react";
import Image from "next/image";
import { CarbonCredit, VERIFICATION_STANDARD_COLORS } from "@/lib/marketplace/carbon-credits-data";
import { getProviderLogoPath, getProviderInitials } from "@/lib/marketplace/provider-logos";
import ProviderLogoBadge from "@/components/marketplace/provider-logo-badge";
import { PoundSterling, Star, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useCountUp } from "@/hooks/use-count-up";

interface CompactCreditCardProps {
  credit: CarbonCredit;
  onPurchase: (credit: CarbonCredit) => void;
}

function QualityScoreDisplay({ value }: { value: number }) {
  const { displayValue, ref } = useCountUp(value, { decimals: 0, startOnView: true });
  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground" ref={ref as React.RefObject<HTMLDivElement>}>
      <Star className="h-3 w-3" />
      <span>{displayValue}</span>
    </div>
  );
}

function CompactPriceDisplay({ value }: { value: number }) {
  const { displayValue, ref } = useCountUp(value, { prefix: "£", decimals: 2, startOnView: true });
  return (
    <div className="text-right" ref={ref as React.RefObject<HTMLDivElement>}>
      <div className="flex items-center gap-1 justify-end">
        <PoundSterling className="h-4 w-4 text-foreground" />
        <span className="text-lg md:text-xl font-semibold text-foreground">
          {displayValue.replace("£", "")}
        </span>
      </div>
      <div className="text-xs text-muted-foreground mt-0.5">
        per ton
      </div>
    </div>
  );
}

export default function CompactCreditCard({ credit, onPurchase }: CompactCreditCardProps) {
  const [logoError, setLogoError] = useState(false);
  const logoPath = getProviderLogoPath(credit.provider);
  const showLogo = logoPath && !logoError;

  // Handle both single and array standards
  const standards = Array.isArray(credit.verificationStandard) 
    ? credit.verificationStandard 
    : [credit.verificationStandard];
  const primaryStandard = standards[0];

  return (
    <Card 
      onClick={() => onPurchase(credit)}
      className="border-2 border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl hover:bg-white/80 dark:hover:bg-slate-900/80 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm transition-all duration-200 rounded-lg cursor-pointer"
    >
      <div className="p-4 flex items-center justify-between gap-4">
        {/* Left: Project info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <Badge 
              className={`${VERIFICATION_STANDARD_COLORS[primaryStandard]} text-white text-xs font-medium px-2 py-0.5`}
            >
              {standards.length > 1 ? `${primaryStandard} +${standards.length - 1}` : primaryStandard}
            </Badge>
            {credit.scope3Relevant && (
              <Badge 
                variant="secondary" 
                className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium px-2 py-0.5"
              >
                <Target className="h-3 w-3 mr-1" />
                Scope 3
              </Badge>
            )}
            <QualityScoreDisplay value={credit.qualityScore} />
          </div>
          <div className="flex items-center gap-2">
            <ProviderLogoBadge provider={credit.provider} size="md" />
            <h3 className="text-base md:text-lg font-semibold truncate text-foreground flex-1">
              {credit.projectName}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground truncate mt-0.5">
            {credit.provider}
          </p>
        </div>

        {/* Right: Price */}
        <CompactPriceDisplay value={credit.pricePerTon} />
      </div>
    </Card>
  );
}


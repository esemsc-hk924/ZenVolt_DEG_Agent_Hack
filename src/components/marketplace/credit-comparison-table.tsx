"use client";

import { CarbonCredit, PROJECT_TYPE_LABELS, VERIFICATION_STANDARD_COLORS } from "@/lib/marketplace/carbon-credits-data";
import { SortColumn, SortDirection } from "@/lib/marketplace/aggregator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import ProviderLogoBadge from "@/components/marketplace/provider-logo-badge";
import { motion } from "framer-motion";
import { useCountUp } from "@/hooks/use-count-up";

interface CreditComparisonTableProps {
  credits: CarbonCredit[];
  onPurchase: (credit: CarbonCredit) => void;
  sortColumn?: SortColumn;
  sortDirection?: SortDirection;
  onSort?: (column: SortColumn, direction: SortDirection) => void;
}

function PriceCountUp({ value }: { value: number }) {
  const { displayValue, ref } = useCountUp(value, { prefix: "£", decimals: 2, startOnView: true });
  return (
    <div className="font-bold text-emerald-600 text-lg" ref={ref as React.RefObject<HTMLDivElement>}>
      {displayValue}
    </div>
  );
}

export default function CreditComparisonTable({
  credits,
  onPurchase,
  sortColumn = null,
  sortDirection = null,
  onSort
}: CreditComparisonTableProps) {
  // Animation variants for table rows
  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    }),
  };

  const handleSort = (column: SortColumn) => {
    if (!onSort) return;

    if (sortColumn === column) {
      // Toggle direction: asc -> desc -> null
      if (sortDirection === 'asc') {
        onSort(column, 'desc');
      } else if (sortDirection === 'desc') {
        onSort(null, null);
      } else {
        onSort(column, 'asc');
      }
    } else {
      // New column, start with ascending
      onSort(column, 'asc');
    }
  };

  const getSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="h-4 w-4 text-muted-foreground opacity-50" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="h-4 w-4 text-emerald-600" />;
    }
    if (sortDirection === 'desc') {
      return <ArrowDown className="h-4 w-4 text-emerald-600" />;
    }
    return <ArrowUpDown className="h-4 w-4 text-muted-foreground opacity-50" />;
  };

  if (credits.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6 text-center text-muted-foreground">
          No credits to compare. Select credits to compare them side-by-side.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-white/20 dark:border-white/10 bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl dark:shadow-[0_35px_90px_-50px_rgba(16,185,129,0.55)] rounded-[28px]">
      <CardHeader className="border-b border-white/10 dark:border-white/5">
        <CardTitle className="text-lg font-semibold tracking-tight">Compare Carbon Credits</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="overflow-x-auto rounded-3xl border border-white/10 dark:border-white/5 backdrop-blur">
          <Table className="[&_thead]:backdrop-blur [&_thead]:bg-white/30 [&_thead]:dark:bg-slate-950/40 [&_tbody_tr]:transition [&_tbody_tr:hover]:bg-white/45 [&_tbody_tr:hover]:dark:bg-slate-900/45">
            <TableHeader>
              <TableRow>
                <TableHead
                  className="w-[250px] cursor-pointer select-none hover:bg-white/20 dark:hover:bg-slate-900/20 transition-colors text-base font-semibold h-14"
                  onClick={() => handleSort('project')}
                >
                  <div className="flex items-center gap-2">
                    Project
                    {getSortIcon('project')}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none hover:bg-white/20 dark:hover:bg-slate-900/20 transition-colors text-base font-semibold h-14"
                  onClick={() => handleSort('type')}
                >
                  <div className="flex items-center gap-2">
                    Type
                    {getSortIcon('type')}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none hover:bg-white/20 dark:hover:bg-slate-900/20 transition-colors text-base font-semibold h-14"
                  onClick={() => handleSort('standard')}
                >
                  <div className="flex items-center gap-2">
                    Standard
                    {getSortIcon('standard')}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none hover:bg-white/20 dark:hover:bg-slate-900/20 transition-colors text-base font-semibold h-14"
                  onClick={() => handleSort('location')}
                >
                  <div className="flex items-center gap-2">
                    Location
                    {getSortIcon('location')}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none hover:bg-white/20 dark:hover:bg-slate-900/20 transition-colors text-base font-semibold h-14"
                  onClick={() => handleSort('vintage')}
                >
                  <div className="flex items-center gap-2">
                    Vintage
                    {getSortIcon('vintage')}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none hover:bg-white/20 dark:hover:bg-slate-900/20 transition-colors text-base font-semibold h-14"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center gap-2">
                    Price/Ton
                    {getSortIcon('price')}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {credits.map((credit, index) => (
                <motion.tr
                  key={credit.id}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={rowVariants}
                  onClick={() => onPurchase(credit)}
                  className="cursor-pointer border-b transition-colors hover:bg-white/45 hover:dark:bg-slate-900/45 [&>td]:py-6 md:[&>td]:py-7"
                >
                  <TableCell className="text-base">
                    <div className="flex items-center gap-4">
                      <ProviderLogoBadge provider={credit.provider} size="md" />
                      <div className="font-semibold text-base">{credit.projectName}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-base">
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                      {PROJECT_TYPE_LABELS[credit.projectType]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-base">
                    <div className="flex flex-wrap gap-2">
                      {(() => {
                        const standards = Array.isArray(credit.verificationStandard)
                          ? credit.verificationStandard
                          : [credit.verificationStandard];
                        return standards.map((standard, idx) => (
                          <Badge
                            key={idx}
                            className={`${VERIFICATION_STANDARD_COLORS[standard]} text-white text-sm px-3 py-1`}
                          >
                            {standard}
                          </Badge>
                        ));
                      })()}
                    </div>
                  </TableCell>
                  <TableCell className="text-base">
                    <div className="flex items-center gap-2 text-base">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{credit.country}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-base">
                    <div className="flex items-center gap-2 text-base">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{credit.vintageYear}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-base">
                    <PriceCountUp value={credit.pricePerTon} />
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}


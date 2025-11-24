"use client";

import { useState } from "react";
import { CarbonCredit, PROJECT_TYPE_LABELS, VERIFICATION_STANDARD_COLORS } from "@/lib/marketplace/carbon-credits-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { calculateTotalCost } from "@/lib/marketplace/aggregator";
import { PoundSterling, Leaf, MapPin, Calendar, Star, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PurchaseModalProps {
  credit: CarbonCredit | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (credit: CarbonCredit, tons: number) => Promise<void>;
}

export default function PurchaseModal({ credit, open, onClose, onConfirm }: PurchaseModalProps) {
  const [tons, setTons] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!credit) return null;

  const tonsNum = parseFloat(tons) || 0;
  const totalCost = calculateTotalCost(credit, tonsNum);
  const isValid = tonsNum > 0 && tonsNum <= credit.availableTons;

  const handlePurchase = async () => {
    if (!isValid) {
      toast.error("Please enter a valid quantity");
      return;
    }

    setIsProcessing(true);
    try {
      await onConfirm(credit, tonsNum);
      toast.success(`Purchased ${tonsNum.toLocaleString()} tons of carbon credits!`);
      setTons("");
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Purchase failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuickSelect = (value: number) => {
    const maxTons = Math.min(value, credit.availableTons);
    setTons(maxTons.toString());
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border border-white/20 dark:border-white/10 bg-white/70 dark:bg-slate-950/70 backdrop-blur-2xl dark:shadow-[0_55px_120px_-60px_rgba(16,185,129,0.55)] rounded-[32px] p-8 sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Purchase Carbon Credits</DialogTitle>
          <DialogDescription>
            Review your purchase details and confirm to complete the transaction.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Credit Details */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">{credit.projectName}</h3>
              <p className="text-sm text-muted-foreground">{credit.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{PROJECT_TYPE_LABELS[credit.projectType]}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{credit.location}, {credit.country}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Vintage {credit.vintageYear}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium">Quality: {credit.qualityScore}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {(() => {
                const standards = Array.isArray(credit.verificationStandard) 
                  ? credit.verificationStandard 
                  : [credit.verificationStandard];
                return standards.map((standard, idx) => (
                  <Badge 
                    key={idx}
                    className={`${VERIFICATION_STANDARD_COLORS[standard]} text-white`}
                  >
                    {standard}
                  </Badge>
                ));
              })()}
              {credit.additionality && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Additional
                </Badge>
              )}
              <Badge variant="secondary" className="capitalize">
                Permanence: {credit.permanence}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Quantity Selection */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Quantity (tons of CO2e)
              </label>
              <Input
                type="number"
                min="1"
                max={credit.availableTons}
                placeholder="Enter quantity"
                value={tons}
                onChange={(e) => setTons(e.target.value)}
                className="h-12 rounded-2xl border-white/20 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur px-4 text-base transition focus-visible:border-emerald-500/50 focus-visible:ring-emerald-400/30"
              />
              <div className="text-xs text-muted-foreground mt-1">
                Available: {credit.availableTons.toLocaleString()} tons
              </div>
            </div>

            {/* Quick select buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickSelect(100)}
                className="text-xs rounded-full border-white/30 bg-white/40 hover:bg-white/60 dark:bg-slate-900/50 dark:hover:bg-slate-900/70 dark:border-white/10"
              >
                100 tons
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickSelect(500)}
                className="text-xs rounded-full border-white/30 bg-white/40 hover:bg-white/60 dark:bg-slate-900/50 dark:hover:bg-slate-900/70 dark:border-white/10"
              >
                500 tons
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickSelect(1000)}
                className="text-xs rounded-full border-white/30 bg-white/40 hover:bg-white/60 dark:bg-slate-900/50 dark:hover:bg-slate-900/70 dark:border-white/10"
              >
                1,000 tons
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTons(credit.availableTons.toString())}
                className="text-xs rounded-full border-white/30 bg-white/40 hover:bg-white/60 dark:bg-slate-900/50 dark:hover:bg-slate-900/70 dark:border-white/10"
              >
                Max
              </Button>
            </div>
          </div>

          <Separator />

          {/* Cost Summary */}
          <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Price per ton:</span>
              <span className="font-medium">£{credit.pricePerTon.toFixed(2)} GBP</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Quantity:</span>
              <span className="font-medium">
                {tonsNum > 0 ? tonsNum.toLocaleString() : "0"} tons
              </span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total Cost:</span>
              <span className="text-emerald-600 flex items-center gap-1">
                <PoundSterling className="h-5 w-5" />
                £{totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} GBP
              </span>
            </div>
          </div>

          {/* Long Description */}
          {credit.longDescription && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2">Project Details</h4>
                <p className="text-sm text-muted-foreground">{credit.longDescription}</p>
              </div>
            </>
          )}

          {/* Co-benefits */}
          {credit.coBenefits && credit.coBenefits.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2">Co-benefits</h4>
                <div className="flex flex-wrap gap-2">
                  {credit.coBenefits.map((benefit, idx) => (
                    <Badge key={idx} variant="secondary">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-full border-white/20 bg-white/60 hover:bg-white/70 dark:bg-slate-900/60 dark:hover:bg-slate-900/70 dark:border-white/10"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePurchase}
              disabled={!isValid || isProcessing}
              className="flex-1 bg-emerald-600/90 hover:bg-emerald-600 text-white rounded-full h-12 dark:shadow-[0_25px_60px_-35px_rgba(16,185,129,0.75)] transition-all duration-300"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Purchase"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


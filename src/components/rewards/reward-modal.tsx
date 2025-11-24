"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { SpendReward, CATEGORY_LABELS } from "@/lib/spend-rewards-data";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    X,
    Coins,
    Calendar,
    Gift,
    FileText,
    Clock,
    AlertCircle
} from "lucide-react";

interface RewardModalProps {
    reward: SpendReward | null;
    isOpen: boolean;
    onClose: () => void;
    onRedeem: (reward: SpendReward) => void;
    userZvoltBalance: number;
}

export default function RewardModal({
    reward,
    isOpen,
    onClose,
    onRedeem,
    userZvoltBalance
}: RewardModalProps) {
    const [activeTab, setActiveTab] = useState("description");

    if (!reward) return null;

    const canAfford = userZvoltBalance >= reward.costInZvolt;
    const isOutOfStock = reward.availability.claimed >= reward.availability.total;

    const handleRedeem = () => {
        if (canAfford && !isOutOfStock) {
            onRedeem(reward);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-lg font-semibold pr-8">
                            {reward.name}
                        </DialogTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="h-8 w-8 p-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="description">Description</TabsTrigger>
                        <TabsTrigger value="how-to-use">How to use</TabsTrigger>
                    </TabsList>

                    <TabsContent value="description" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Visual Section - MUCH LARGER */}
                            <div className={`w-full h-56 rounded-2xl bg-gradient-to-br ${reward.gradient} flex items-center justify-center shadow-lg`}>
                                <div className="w-28 h-28 rounded-xl bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-sm">
                                    <reward.icon className="h-16 w-16" />
                                </div>
                            </div>

                            {/* Details Section */}
                            <div className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <div className="text-sm font-medium">Available</div>
                                            <div className="text-sm text-muted-foreground">
                                                {reward.availability.claimed}/{reward.availability.total}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Gift className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <div className="text-sm font-medium">Category</div>
                                            <div className="text-sm text-muted-foreground">
                                                {CATEGORY_LABELS[reward.category]}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Coins className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <div className="text-sm font-medium">Price</div>
                                            <div className="text-sm text-muted-foreground">
                                                {reward.costInZvolt} ZVOLT
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <div className="text-sm font-medium">Your Balance</div>
                                            <div className="text-sm text-muted-foreground">
                                                {userZvoltBalance.toLocaleString()} ZVOLT
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <div className="text-sm font-medium">Valid Until</div>
                                            <div className="text-sm text-muted-foreground">
                                                {new Date(reward.endDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description Text */}
                        <div className="space-y-3">
                            <h4 className="font-medium">About this reward</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {reward.longDescription}
                            </p>
                        </div>

                        {/* Support Link */}
                        <div className="pt-4 border-t">
                            <a
                                href="#"
                                className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
                            >
                                Faced any issues? Contact us on Discord
                            </a>
                        </div>
                    </TabsContent>

                    <TabsContent value="how-to-use" className="space-y-6">
                        <div className="space-y-4">
                            <h4 className="font-medium">How to redeem and use this reward</h4>
                            <div className="space-y-4">
                                {reward.howToUse.map((step, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-start gap-3"
                                    >
                                        <div className="flex-shrink-0 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                            {index + 1}
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {step}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="bg-muted/50 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <Clock className="h-4 w-4 text-emerald-600 mt-0.5" />
                                <div>
                                    <div className="text-sm font-medium">Processing Time</div>
                                    <div className="text-xs text-muted-foreground">
                                        Digital rewards are typically delivered within 5 minutes. Physical items may take 3-5 business days to ship.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Action Button */}
                <div className="pt-6 border-t">
                    <Button
                        onClick={handleRedeem}
                        disabled={!canAfford || isOutOfStock}
                        className="w-full h-12 text-base font-semibold"
                        size="lg"
                    >
                        {isOutOfStock ? (
                            <>
                                <AlertCircle className="h-4 w-4 mr-2" />
                                Out of Stock
                            </>
                        ) : !canAfford ? (
                            <>
                                <AlertCircle className="h-4 w-4 mr-2" />
                                Insufficient ZVOLT Balance
                            </>
                        ) : (
                            <>
                                <Coins className="h-4 w-4 mr-2" />
                                Redeem for {reward.costInZvolt} ZVOLT
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
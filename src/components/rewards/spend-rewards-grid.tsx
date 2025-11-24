"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { SPEND_REWARDS, SpendReward } from "@/lib/spend-rewards-data";
import RewardCard from "./reward-card";
import RewardModal from "./reward-modal";
import { Coins, Gift } from "lucide-react";

interface SpendRewardsGridProps {
    userZvoltBalance: number;
    onRedeem: (reward: SpendReward) => void;
}

export default function SpendRewardsGrid({ userZvoltBalance, onRedeem }: SpendRewardsGridProps) {
    const [selectedReward, setSelectedReward] = useState<SpendReward | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRewardClick = (reward: SpendReward) => {
        setSelectedReward(reward);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedReward(null);
    };

    const handleRedeem = (reward: SpendReward) => {
        onRedeem(reward);
        handleCloseModal();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                        <Gift className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">Spend Rewards</h2>
                        <p className="text-sm text-muted-foreground">
                            Use your ZVOLT tokens to redeem exclusive driver rewards
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 rounded-lg">
                    <Coins className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-600">
                        {userZvoltBalance.toLocaleString()} ZVOLT
                    </span>
                </div>
            </div>

            {/* Rewards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {SPEND_REWARDS.map((reward, index) => (
                    <motion.div
                        key={reward.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                        <RewardCard
                            reward={reward}
                            onClick={() => handleRewardClick(reward)}
                        />
                    </motion.div>
                ))}
            </div>

            {/* Empty State */}
            {SPEND_REWARDS.length === 0 && (
                <div className="text-center py-12">
                    <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                        <Gift className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No rewards available</h3>
                    <p className="text-muted-foreground">
                        Check back later for new rewards and offers.
                    </p>
                </div>
            )}

            {/* Modal */}
            <RewardModal
                reward={selectedReward}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onRedeem={handleRedeem}
                userZvoltBalance={userZvoltBalance}
            />
        </div>
    );
}

"use client";
import { motion } from "framer-motion";
import { SpendReward, CATEGORY_LABELS } from "@/lib/spend-rewards-data";
import { Coins, Clock, Gift, Key } from "lucide-react";

interface RewardCardProps {
    reward: SpendReward;
    onClick: () => void;
}

export default function RewardCard({ reward, onClick }: RewardCardProps) {
    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'fuel':
            case 'maintenance':
            case 'merchandise':
                return <Gift className="h-3 w-3" />;
            case 'premium':
            case 'eco':
            case 'offset':
                return <Key className="h-3 w-3" />;
            default:
                return <Gift className="h-3 w-3" />;
        }
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="relative cursor-pointer group"
            onClick={onClick}
        >
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden h-full flex flex-col shadow-md hover:shadow-xl transition-all duration-200">
                {/* Large Gradient Area covering header and icon section */}
                <div className={`w-full h-40 bg-gradient-to-br ${reward.gradient} p-6 flex flex-col`}>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg">
                            <div className="h-4 w-4 bg-gray-300 rounded-sm flex items-center justify-center">
                                <div className="h-2 w-2 bg-gray-500 rounded-sm"></div>
                            </div>
                            <div className="text-sm text-gray-600">
                                {reward.availability.claimed}/{reward.availability.total}
                            </div>
                        </div>
                        <div className="flex items-center gap-1 px-3 py-2 bg-white/90 text-gray-700 text-xs rounded-lg font-medium">
                            {getCategoryIcon(reward.category)}
                            <span>{CATEGORY_LABELS[reward.category]}</span>
                        </div>
                    </div>

                    {/* Icon Area */}
                    <div className="flex-1 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-xl bg-white flex items-center justify-center shadow-sm">
                            <reward.icon className="h-16 w-16 text-gray-800" />
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-1">
                    {/* Title */}
                    <h3 className="text-lg font-bold text-center mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                        {reward.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 text-center mb-6 line-clamp-2 flex-1">
                        {reward.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                        <div className="text-blue-600 text-sm font-medium hover:underline cursor-pointer">
                            Details
                        </div>
                        <div className="flex items-center gap-2 text-emerald-600">
                            <div className="h-5 w-5 bg-emerald-500 rounded-full flex items-center justify-center">
                                <Coins className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-sm font-semibold">{reward.costInZvolt} ZVOLT</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
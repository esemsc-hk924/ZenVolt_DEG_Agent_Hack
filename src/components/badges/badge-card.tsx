"use client";
import { motion } from "framer-motion";
import { Badge, BadgeTier } from "@/lib/badge-data";
import { BADGE_ICONS } from "./badge-icons";
import { Leaf, CheckCircle2, Lock } from "lucide-react";

interface BadgeCardProps {
    badge: Badge;
    tier: BadgeTier;
    onClick?: () => void;
}

export default function BadgeCard({ badge, tier, onClick }: BadgeCardProps) {
    const isEarned = badge.earned;
    const isLocked = !isEarned && badge.progress === 0;
    const BadgeIcon = BADGE_ICONS[badge.id as keyof typeof BADGE_ICONS];

    return (
        <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="relative cursor-pointer group"
            onClick={onClick}
        >
            {/* Complex Medal Badge Container */}
            <div className="relative w-40 h-40 flex items-center justify-center">
                {/* Complex Badge Icon */}
                <div className={`transition-all duration-300 ${!isEarned ? 'opacity-60' : ''}`}>
                    {BadgeIcon ? (
                        <BadgeIcon className="h-32 w-32" />
                    ) : (
                        <div className="h-32 w-32 bg-muted rounded-full flex items-center justify-center">
                            <Lock className="h-8 w-8 text-muted-foreground" />
                        </div>
                    )}
                </div>

                {/* Earned Checkmark */}
                {isEarned && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute -top-1 -right-1 h-6 w-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg"
                    >
                        <CheckCircle2 className="h-4 w-4 text-white" />
                    </motion.div>
                )}

                {/* Progress Ring for In-Progress Badges */}
                {!isEarned && !isLocked && (
                    <div className="absolute inset-0">
                        <svg className="w-full h-full" viewBox="0 0 64 64">
                            <circle
                                cx="32"
                                cy="32"
                                r="30"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="text-muted-foreground/20"
                            />
                            <circle
                                cx="32"
                                cy="32"
                                r="30"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeDasharray={`${2 * Math.PI * 30}`}
                                strokeDashoffset={`${2 * Math.PI * 30 * (1 - badge.progress / 100)}`}
                                className="text-emerald-500 transition-all duration-500"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>
                )}

                {/* Badge Name Overlay */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-md text-xs font-semibold text-center whitespace-nowrap shadow-lg border">
                    {badge.name}
                </div>

                {/* Tier Indicator */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs text-muted-foreground shadow-lg border">
                    {tier.name}
                </div>
            </div>

            {/* Badge Details Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-lg shadow-lg border opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                <div className="font-semibold">{badge.name}</div>
                <div className="text-muted-foreground">{badge.description}</div>
                {!isEarned && (
                    <div className="text-emerald-600 font-medium">
                        {badge.progress.toFixed(0)}% complete
                    </div>
                )}
                {isEarned && badge.earnedDate && (
                    <div className="text-muted-foreground">
                        Earned {new Date(badge.earnedDate).toLocaleDateString()}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

"use client";
import { motion } from "framer-motion";
import { Badge, BADGE_TIERS, generateUserBadges } from "@/lib/badge-data";
import BadgeCard from "./badge-card";
import { ChevronLeft, ChevronRight, Leaf, Trophy } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface BadgeShowcaseProps {
    co2Saved?: number; // kg CO2 saved by user
    onBadgeClick?: (badge: Badge) => void;
}

export default function BadgeShowcase({ co2Saved = 0, onBadgeClick }: BadgeShowcaseProps) {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [maxScroll, setMaxScroll] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Generate badges based on user's CO2 saved
    const badges = generateUserBadges(co2Saved);
    const earnedBadges = badges.filter(b => b.earned);
    const unearnedBadges = badges.filter(b => !b.earned);
    const totalBadges = badges.length;

    // Update max scroll when component mounts or badges change
    useEffect(() => {
        if (scrollRef.current) {
            const maxScrollValue = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
            setMaxScroll(maxScrollValue);
        }
    }, [badges]);

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;

        const scrollAmount = 200;
        const newPosition = direction === 'left'
            ? Math.max(0, scrollPosition - scrollAmount)
            : Math.min(maxScroll, scrollPosition + scrollAmount);

        scrollRef.current.scrollTo({
            left: newPosition,
            behavior: 'smooth'
        });
        setScrollPosition(newPosition);
    };

    const canScrollLeft = scrollPosition > 0;
    const canScrollRight = scrollPosition < maxScroll;

    // Handle scroll events to update position
    const handleScroll = () => {
        if (scrollRef.current) {
            setScrollPosition(scrollRef.current.scrollLeft);
        }
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                        <Trophy className="h-4 w-4 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Badge Collection</h3>
                        <p className="text-sm text-muted-foreground">
                            {earnedBadges.length} of {totalBadges} badges earned
                        </p>
                    </div>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center gap-2">
                    <div className="text-sm text-muted-foreground">
                        {co2Saved.toLocaleString()}kg CO₂ saved
                    </div>
                    <div className="h-2 w-20 bg-muted rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (co2Saved / 25000) * 100)}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        />
                    </div>
                </div>
            </div>

            {/* Horizontal Scroll Container */}
            <div className="relative h-52">
                {/* Scroll Buttons */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
                    <button
                        onClick={() => scroll('left')}
                        disabled={!canScrollLeft}
                        className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm border shadow-lg flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                </div>

                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
                    <button
                        onClick={() => scroll('right')}
                        disabled={!canScrollRight}
                        className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm border shadow-lg flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>

                {/* Badge Grid - Show earned badges first, then unearned */}
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex gap-16 overflow-x-auto scrollbar-hide pb-6 px-4 items-center h-full"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {/* Earned Badges - Full opacity */}
                    {earnedBadges.map((badge, index) => (
                        <motion.div
                            key={badge.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="flex-shrink-0"
                        >
                            <BadgeCard
                                badge={badge}
                                tier={BADGE_TIERS[badge.tier]}
                                onClick={() => onBadgeClick?.(badge)}
                            />
                        </motion.div>
                    ))}

                    {/* Unearned Badges - Faded and scrollable */}
                    {unearnedBadges.map((badge, index) => (
                        <motion.div
                            key={badge.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 0.6, y: 0 }}
                            transition={{ delay: (earnedBadges.length + index) * 0.1, duration: 0.5 }}
                            className="flex-shrink-0"
                        >
                            <BadgeCard
                                badge={badge}
                                tier={BADGE_TIERS[badge.tier]}
                                onClick={() => onBadgeClick?.(badge)}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Next Badge Progress */}
            {earnedBadges.length < totalBadges && (
                <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <Leaf className="h-3 w-3 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-medium">
                                Next: {unearnedBadges[0]?.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Save {((unearnedBadges[0]?.co2Threshold || 0) - co2Saved).toLocaleString()}kg more CO₂
                            </div>
                        </div>
                        <div className="text-sm font-semibold text-emerald-600">
                            {unearnedBadges[0]?.progress.toFixed(0)}%
                        </div>
                    </div>
                </div>
            )}

            {/* Achievement Summary */}
            {earnedBadges.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(BADGE_TIERS).map(([tierName, tier]) => {
                        const tierBadges = badges.filter(b => b.tier === tierName);
                        const earnedInTier = tierBadges.filter(b => b.earned).length;

                        return (
                            <div key={tierName} className="text-center">
                                <div className={`text-2xl mb-1 ${earnedInTier > 0 ? 'opacity-100' : 'opacity-30'}`}>
                                    {tier.icon}
                                </div>
                                <div className="text-xs font-medium capitalize">{tier.name}</div>
                                <div className="text-xs text-muted-foreground">
                                    {earnedInTier}/{tierBadges.length}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

import React from 'react';
import { BADGE_ICONS_SIMPLE } from '@/components/badges/badge-icons';

// Badge data structure and mock data for ZenVolt badge system
export interface Badge {
    id: string;
    name: string;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
    description: string;
    co2Threshold: number; // kg CO2 saved required
    icon: React.ReactNode;
    earned: boolean;
    earnedDate?: string;
    progress: number; // 0-100 percentage toward this badge
}

export interface BadgeTier {
    name: string;
    color: string;
    gradient: string;
    icon: React.ReactNode;
    co2Threshold: number;
}

export const BADGE_TIERS: Record<string, BadgeTier> = {
    bronze: {
        name: 'Bronze',
        color: 'from-amber-600 to-amber-800',
        gradient: 'from-amber-500/20 to-amber-700/20',
        icon: React.createElement(BADGE_ICONS_SIMPLE['eco-pioneer'], { className: "h-6 w-6" }),
        co2Threshold: 1000
    },
    silver: {
        name: 'Silver',
        color: 'from-gray-400 to-gray-600',
        gradient: 'from-gray-400/20 to-gray-600/20',
        icon: React.createElement(BADGE_ICONS_SIMPLE['green-silver'], { className: "h-6 w-6" }),
        co2Threshold: 5000
    },
    gold: {
        name: 'Gold',
        color: 'from-yellow-500 to-yellow-700',
        gradient: 'from-yellow-500/20 to-yellow-700/20',
        icon: React.createElement(BADGE_ICONS_SIMPLE['climate-gold'], { className: "h-6 w-6" }),
        co2Threshold: 10000
    },
    platinum: {
        name: 'Platinum',
        color: 'from-blue-400 to-blue-600',
        gradient: 'from-blue-400/20 to-blue-600/20',
        icon: React.createElement(BADGE_ICONS_SIMPLE['eco-platinum'], { className: "h-6 w-6" }),
        co2Threshold: 17000
    },
    diamond: {
        name: 'Diamond',
        color: 'from-purple-500 to-purple-700',
        gradient: 'from-purple-500/20 to-purple-700/20',
        icon: React.createElement(BADGE_ICONS_SIMPLE['green-diamond'], { className: "h-6 w-6" }),
        co2Threshold: 25000
    }
};

// Mock badge data for design and testing
export const MOCK_BADGES: Badge[] = [
    {
        id: 'eco-pioneer',
        name: 'Eco Pioneer',
        tier: 'bronze',
        description: 'Saved 1,000kg CO2 through efficient driving',
        co2Threshold: 1000,
        icon: React.createElement(BADGE_ICONS_SIMPLE['eco-pioneer'], { className: "h-6 w-6" }),
        earned: true,
        earnedDate: '2024-01-15',
        progress: 100
    },
    {
        id: 'green-silver',
        name: 'Green Silver',
        tier: 'silver',
        description: 'Saved 5,000kg CO2 through sustainable practices',
        co2Threshold: 5000,
        icon: React.createElement(BADGE_ICONS_SIMPLE['green-silver'], { className: "h-6 w-6" }),
        earned: true,
        earnedDate: '2024-02-20',
        progress: 100
    },
    {
        id: 'climate-gold',
        name: 'Climate Gold',
        tier: 'gold',
        description: 'Saved 10,000kg CO2 and became a climate champion',
        co2Threshold: 10000,
        icon: React.createElement(BADGE_ICONS_SIMPLE['climate-gold'], { className: "h-6 w-6" }),
        earned: false,
        progress: 75
    },
    {
        id: 'eco-platinum',
        name: 'Eco Platinum',
        tier: 'platinum',
        description: 'Saved 17,000kg CO2 and achieved eco excellence',
        co2Threshold: 17000,
        icon: React.createElement(BADGE_ICONS_SIMPLE['eco-platinum'], { className: "h-6 w-6" }),
        earned: false,
        progress: 45
    },
    {
        id: 'green-diamond',
        name: 'Green Diamond',
        tier: 'diamond',
        description: 'Saved 25,000kg CO2 and became a ZenVolt legend',
        co2Threshold: 25000,
        icon: React.createElement(BADGE_ICONS_SIMPLE['green-diamond'], { className: "h-6 w-6" }),
        earned: false,
        progress: 20
    }
];

// Calculate user's current tier based on CO2 saved
export function calculateUserTier(co2Saved: number): {
    currentTier: string;
    nextTier: string | null;
    progressToNext: number;
} {
    const tiers = Object.entries(BADGE_TIERS).sort((a, b) => a[1].co2Threshold - b[1].co2Threshold);

    let currentTier = 'bronze';
    let nextTier: string | null = null;
    let progressToNext = 0;

    for (let i = 0; i < tiers.length; i++) {
        const [tierName, tierData] = tiers[i];

        if (co2Saved >= tierData.co2Threshold) {
            currentTier = tierName;
            if (i < tiers.length - 1) {
                nextTier = tiers[i + 1][0];
                const currentThreshold = tierData.co2Threshold;
                const nextThreshold = tiers[i + 1][1].co2Threshold;
                progressToNext = Math.min(100, ((co2Saved - currentThreshold) / (nextThreshold - currentThreshold)) * 100);
            }
        } else {
            if (i === 0) {
                nextTier = tierName;
                progressToNext = Math.min(100, (co2Saved / tierData.co2Threshold) * 100);
            }
            break;
        }
    }

    return { currentTier, nextTier, progressToNext };
}

// Generate badges based on user's CO2 saved
export function generateUserBadges(co2Saved: number): Badge[] {
    return MOCK_BADGES.map(badge => {
        const earned = co2Saved >= badge.co2Threshold;
        const progress = earned ? 100 : Math.min(100, (co2Saved / badge.co2Threshold) * 100);

        return {
            ...badge,
            earned,
            progress,
            earnedDate: earned ? '2024-01-01' : undefined
        };
    });
}

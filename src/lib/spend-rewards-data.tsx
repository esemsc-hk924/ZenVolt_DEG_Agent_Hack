import React from 'react';
import {
    ShellLogo,
    PodPointLogo,
    HalfordsLogo,
    ZenVoltLogo,
    JohnLewisLogo,
    WoodlandTrustLogo,
    IvecoLogo,
    ASOSLogo
} from '@/components/rewards/company-logos';

// Icon component props
interface IconProps {
    className?: string;
}

export interface SpendReward {
    id: string;
    name: string;
    description: string;
    costInZvolt: number;
    icon: React.ComponentType<{ className?: string }>;
    category: 'fuel' | 'maintenance' | 'premium' | 'eco' | 'merchandise' | 'offset';
    availability: {
        claimed: number;
        total: number;
    };
    startDate: string;
    endDate: string;
    longDescription: string;
    howToUse: string[];
    gradient: string;
}

export const SPEND_REWARDS: SpendReward[] = [
    {
        id: 'fuel-discount-shell',
        name: '15% Off Shell Fuel',
        description: 'Get 15% discount on your next fuel purchase at Shell stations',
        costInZvolt: 50,
        icon: ShellLogo,
        category: 'fuel',
        availability: { claimed: 412, total: 500 },
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        longDescription: 'Save money on fuel while reducing your carbon footprint. This exclusive discount is valid at all Shell stations across the UK and can be combined with other Shell rewards programs.',
        howToUse: [
            'Redeem your ZVOLT tokens to claim this fuel discount voucher',
            'Receive a digital voucher in your wallet within 5 minutes',
            'Show the voucher at any Shell station when paying for fuel',
            'The 15% discount will be applied automatically at checkout'
        ],
        gradient: 'from-green-100 to-yellow-100'
    },
    {
        id: 'ev-charging-podpoint',
        name: 'Free Pod Point Charging Session',
        description: 'One free charging session at any Pod Point station',
        costInZvolt: 75,
        icon: PodPointLogo,
        category: 'fuel',
        availability: { claimed: 841, total: 1600 },
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        longDescription: 'Charge your electric vehicle for free! This voucher covers one complete charging session at any Pod Point station across the UK, helping you save money while driving green.',
        howToUse: [
            'Use ZVOLT tokens to redeem this free charging voucher',
            'Locate a Pod Point charging station near you',
            'Scan the QR code from your voucher at the charging station',
            'Enjoy your free charging session - no additional costs!'
        ],
        gradient: 'from-green-100 to-yellow-100'
    },
    {
        id: 'oil-change-halfords',
        name: '10% Off Halfords Oil Change',
        description: 'Get 10% discount on your next oil change service',
        costInZvolt: 100,
        icon: HalfordsLogo,
        category: 'maintenance',
        availability: { claimed: 123, total: 600 },
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        longDescription: 'Keep your vehicle running efficiently with this oil change discount. Valid at participating Halfords service centers across the UK, helping you maintain your car while saving money.',
        howToUse: [
            'Redeem ZVOLT tokens for this maintenance discount',
            'Book an appointment at your local Halfords service center',
            'Present your digital voucher when you arrive',
            'The 10% discount will be applied to your service bill'
        ],
        gradient: 'from-green-100 to-yellow-100'
    },
    {
        id: 'premium-ai-coach',
        name: 'Advanced AI Coach - 1 Month',
        description: 'Unlock premium AI coaching features for one month',
        costInZvolt: 200,
        icon: ZenVoltLogo,
        category: 'premium',
        availability: { claimed: 75, total: 351 },
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        longDescription: 'Experience the full power of ZenVolt\'s AI coaching with advanced features including personalized route optimization, real-time driving feedback, and detailed analytics.',
        howToUse: [
            'Redeem ZVOLT tokens to activate premium features',
            'Your premium access will be activated immediately',
            'Access advanced AI coaching through the ZenVolt app',
            'Enjoy premium features for 30 days from activation'
        ],
        gradient: 'from-green-100 to-yellow-100'
    },
    {
        id: 'eco-driving-kit-john-lewis',
        name: 'ZenVolt Eco-Driving Kit from John Lewis',
        description: 'Complete eco-driving starter kit with accessories',
        costInZvolt: 150,
        icon: JohnLewisLogo,
        category: 'merchandise',
        availability: { claimed: 239, total: 500 },
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        longDescription: 'Get everything you need to start your eco-driving journey! This kit includes a ZenVolt dashboard mount, eco-driving guide, and exclusive merchandise available through John Lewis.',
        howToUse: [
            'Redeem ZVOLT tokens for this merchandise bundle',
            'Provide your shipping address in the checkout process',
            'Your eco-driving kit will be shipped within 3-5 business days',
            'Track your shipment through the provided tracking number'
        ],
        gradient: 'from-green-100 to-yellow-100'
    },
    {
        id: 'carbon-offset-woodland-trust',
        name: 'Plant 5 Trees with Woodland Trust',
        description: 'Offset your carbon footprint by planting 5 trees',
        costInZvolt: 80,
        icon: WoodlandTrustLogo,
        category: 'offset',
        availability: { claimed: 266, total: 500 },
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        longDescription: 'Make a positive environmental impact by planting trees! Your contribution will help reforest areas across the UK and offset carbon emissions from your driving through the Woodland Trust.',
        howToUse: [
            'Use ZVOLT tokens to purchase this carbon offset',
            'Choose your preferred UK reforestation project',
            'Receive a certificate with your tree planting details',
            'Track the growth of your trees through the Woodland Trust platform'
        ],
        gradient: 'from-green-100 to-yellow-100'
    },
    {
        id: 'car-wash-iveco',
        name: 'Premium Car Wash at Iveco',
        description: 'Full-service car wash with eco-friendly products',
        costInZvolt: 60,
        icon: IvecoLogo,
        category: 'maintenance',
        availability: { claimed: 120, total: 600 },
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        longDescription: 'Keep your vehicle clean and shiny with our premium car wash service using eco-friendly, biodegradable products that are safe for the environment at Iveco locations.',
        howToUse: [
            'Redeem ZVOLT tokens for this car wash voucher',
            'Find a participating Iveco car wash location near you',
            'Present your voucher at the service counter',
            'Enjoy a premium eco-friendly car wash service'
        ],
        gradient: 'from-green-100 to-yellow-100'
    },
    {
        id: 'asos-merchandise',
        name: 'ASOS Fashion Credit',
        description: 'Exclusive ASOS apparel and accessories',
        costInZvolt: 120,
        icon: ASOSLogo,
        category: 'merchandise',
        availability: { claimed: 0, total: 45 },
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        longDescription: 'Show your commitment to sustainable driving with exclusive ASOS merchandise including eco-friendly clothing, accessories, and sustainable fashion items.',
        howToUse: [
            'Redeem ZVOLT tokens for ASOS merchandise credit',
            'Browse the ASOS merchandise catalog',
            'Select your preferred items and sizes',
            'Complete your order with free shipping included'
        ],
        gradient: 'from-green-100 to-yellow-100'
    }
];

export const CATEGORY_LABELS = {
    fuel: 'Fuel',
    maintenance: 'Maintenance',
    premium: 'Premium',
    eco: 'Eco',
    merchandise: 'Merchandise',
    offset: 'Carbon Offset'
} as const;
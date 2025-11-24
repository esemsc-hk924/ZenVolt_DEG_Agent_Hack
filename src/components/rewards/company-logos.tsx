import React from 'react';
import Image from 'next/image';

interface LogoProps {
    className?: string;
}

// UK Company Logos using real image files
export const ShellLogo = ({ className = "h-8 w-8" }: LogoProps) => (
    <div className={`${className} flex items-center justify-center`}>
        <Image
            src="/shell-logo.svg"
            alt="Shell"
            width={64}
            height={64}
            className="object-contain"
        />
    </div>
);

export const PodPointLogo = ({ className = "h-8 w-8" }: LogoProps) => (
    <div className={`${className} flex items-center justify-center`}>
        <Image
            src="/podpoint-logo.png"
            alt="Pod Point"
            width={64}
            height={64}
            className="object-contain"
        />
    </div>
);

export const HalfordsLogo = ({ className = "h-8 w-8" }: LogoProps) => (
    <div className={`${className} flex items-center justify-center`}>
        <Image
            src="/halfords-logo.svg"
            alt="Halfords"
            width={64}
            height={64}
            className="object-contain"
        />
    </div>
);

export const ZenVoltLogo = ({ className = "h-8 w-8" }: LogoProps) => (
    <div className={`${className} flex items-center justify-center`}>
        <div className="text-gray-800 font-bold text-3xl">ZV</div>
    </div>
);

export const JohnLewisLogo = ({ className = "h-8 w-8" }: LogoProps) => (
    <div className={`${className} flex items-center justify-center`}>
        <Image
            src="/john-lewis-logo.svg"
            alt="John Lewis"
            width={64}
            height={64}
            className="object-contain"
        />
    </div>
);

export const WoodlandTrustLogo = ({ className = "h-8 w-8" }: LogoProps) => (
    <div className={`${className} flex items-center justify-center`}>
        <Image
            src="/woodland-lgoo.svg"
            alt="Woodland Trust"
            width={64}
            height={64}
            className="object-contain"
        />
    </div>
);

export const IvecoLogo = ({ className = "h-8 w-8" }: LogoProps) => (
    <div className={`${className} flex items-center justify-center`}>
        <Image
            src="/iveco-logo.svg"
            alt="Iveco"
            width={64}
            height={64}
            className="object-contain"
        />
    </div>
);

export const ASOSLogo = ({ className = "h-8 w-8" }: LogoProps) => (
    <div className={`${className} flex items-center justify-center`}>
        <Image
            src="/asos-logo.svg"
            alt="ASOS"
            width={64}
            height={64}
            className="object-contain"
        />
    </div>
);
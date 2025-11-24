import React from 'react';

interface BadgeIconProps {
    className?: string;
}

// Complex Medal/Medallion Badge Designs (Large)
export const EcoPioneerIcon = ({ className = "h-16 w-16" }: BadgeIconProps) => (
    <div className={className}>
        <svg viewBox="0 0 64 64" className="w-full h-full">
            {/* Outer decorative ring */}
            <circle cx="32" cy="32" r="30" fill="none" stroke="url(#bronzeGradient)" strokeWidth="2" />
            <circle cx="32" cy="32" r="28" fill="none" stroke="url(#bronzeAccent)" strokeWidth="1" />

            {/* Inner medal background */}
            <circle cx="32" cy="32" r="24" fill="url(#bronzeMedal)" stroke="url(#bronzeBorder)" strokeWidth="2" />

            {/* Decorative border pattern */}
            <circle cx="32" cy="32" r="22" fill="none" stroke="url(#bronzePattern)" strokeWidth="1" strokeDasharray="2,2" />

            {/* Central icon area */}
            <circle cx="32" cy="32" r="18" fill="url(#bronzeCenter)" stroke="url(#bronzeInner)" strokeWidth="1" />

            {/* Leaf icon */}
            <path d="M32 20c-2 0-4 2-4 4 0 4 4 8 4 8s4-4 4-8c0-2-2-4-4-4z" fill="url(#leafGradient)" />
            <path d="M28 24c0-2 2-4 4-4s4 2 4 4c0 2-2 4-4 4s-4-2-4-4z" fill="url(#leafAccent)" />

            {/* Shine effect */}
            <ellipse cx="26" cy="26" rx="8" ry="6" fill="url(#shine)" opacity="0.3" />

            {/* Gradients */}
            <defs>
                <linearGradient id="bronzeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#CD7F32" />
                    <stop offset="50%" stopColor="#B8860B" />
                    <stop offset="100%" stopColor="#8B4513" />
                </linearGradient>
                <linearGradient id="bronzeAccent" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#DAA520" />
                    <stop offset="100%" stopColor="#B8860B" />
                </linearGradient>
                <linearGradient id="bronzeMedal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F4E4BC" />
                    <stop offset="50%" stopColor="#CD7F32" />
                    <stop offset="100%" stopColor="#8B4513" />
                </linearGradient>
                <linearGradient id="bronzeBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#DAA520" />
                    <stop offset="100%" stopColor="#8B4513" />
                </linearGradient>
                <linearGradient id="bronzePattern" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#DAA520" />
                    <stop offset="100%" stopColor="#CD7F32" />
                </linearGradient>
                <linearGradient id="bronzeCenter" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F5DEB3" />
                    <stop offset="100%" stopColor="#CD7F32" />
                </linearGradient>
                <linearGradient id="bronzeInner" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#DAA520" />
                    <stop offset="100%" stopColor="#B8860B" />
                </linearGradient>
                <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#32CD32" />
                    <stop offset="100%" stopColor="#228B22" />
                </linearGradient>
                <linearGradient id="leafAccent" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#90EE90" />
                    <stop offset="100%" stopColor="#32CD32" />
                </linearGradient>
                <radialGradient id="shine" cx="50%" cy="30%" r="50%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                </radialGradient>
            </defs>
        </svg>
        </div>
);

export const GreenSilverIcon = ({ className = "h-16 w-16" }: BadgeIconProps) => (
    <div className={className}>
        <svg viewBox="0 0 64 64" className="w-full h-full">
            {/* Outer decorative ring */}
            <circle cx="32" cy="32" r="30" fill="none" stroke="url(#silverGradient)" strokeWidth="2" />
            <circle cx="32" cy="32" r="28" fill="none" stroke="url(#silverAccent)" strokeWidth="1" />

            {/* Inner medal background */}
            <circle cx="32" cy="32" r="24" fill="url(#silverMedal)" stroke="url(#silverBorder)" strokeWidth="2" />

            {/* Decorative border pattern */}
            <circle cx="32" cy="32" r="22" fill="none" stroke="url(#silverPattern)" strokeWidth="1" strokeDasharray="3,1" />

            {/* Central icon area */}
            <circle cx="32" cy="32" r="18" fill="url(#silverCenter)" stroke="url(#silverInner)" strokeWidth="1" />

            {/* Lightning bolt icon */}
            <path d="M32 18l-6 8h4l-2 12 6-8h-4l2-12z" fill="url(#lightningGradient)" />
            <path d="M30 22l-2 4h2l-1 6 2-4h-2l1-6z" fill="url(#lightningAccent)" />

            {/* Shine effect */}
            <ellipse cx="26" cy="26" rx="8" ry="6" fill="url(#shine)" opacity="0.4" />

            {/* Gradients */}
            <defs>
                <linearGradient id="silverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#C0C0C0" />
                    <stop offset="50%" stopColor="#A8A8A8" />
                    <stop offset="100%" stopColor="#808080" />
                </linearGradient>
                <linearGradient id="silverAccent" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E6E6E6" />
                    <stop offset="100%" stopColor="#A8A8A8" />
                </linearGradient>
                <linearGradient id="silverMedal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F8F8FF" />
                    <stop offset="50%" stopColor="#C0C0C0" />
                    <stop offset="100%" stopColor="#808080" />
                </linearGradient>
                <linearGradient id="silverBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E6E6E6" />
                    <stop offset="100%" stopColor="#808080" />
                </linearGradient>
                <linearGradient id="silverPattern" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E6E6E6" />
                    <stop offset="100%" stopColor="#C0C0C0" />
                </linearGradient>
                <linearGradient id="silverCenter" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F0F0F0" />
                    <stop offset="100%" stopColor="#C0C0C0" />
                </linearGradient>
                <linearGradient id="silverInner" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E6E6E6" />
                    <stop offset="100%" stopColor="#A8A8A8" />
                </linearGradient>
                <linearGradient id="lightningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFD700" />
                    <stop offset="100%" stopColor="#FFA500" />
                </linearGradient>
                <linearGradient id="lightningAccent" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFF00" />
                    <stop offset="100%" stopColor="#FFD700" />
                </linearGradient>
                <radialGradient id="shine" cx="50%" cy="30%" r="50%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                </radialGradient>
            </defs>
        </svg>
    </div>
);

export const ClimateGoldIcon = ({ className = "h-16 w-16" }: BadgeIconProps) => (
    <div className={className}>
        <svg viewBox="0 0 64 64" className="w-full h-full">
            {/* Outer decorative ring */}
            <circle cx="32" cy="32" r="30" fill="none" stroke="url(#goldGradient)" strokeWidth="2" />
            <circle cx="32" cy="32" r="28" fill="none" stroke="url(#goldAccent)" strokeWidth="1" />

            {/* Inner medal background */}
            <circle cx="32" cy="32" r="24" fill="url(#goldMedal)" stroke="url(#goldBorder)" strokeWidth="2" />

            {/* Decorative border pattern */}
            <circle cx="32" cy="32" r="22" fill="none" stroke="url(#goldPattern)" strokeWidth="1" strokeDasharray="4,2" />

            {/* Central icon area */}
            <circle cx="32" cy="32" r="18" fill="url(#goldCenter)" stroke="url(#goldInner)" strokeWidth="1" />

            {/* Trophy icon */}
            <path d="M28 20h8v4h-8z" fill="url(#trophyGradient)" />
            <path d="M26 24h12v2H26z" fill="url(#trophyAccent)" />
            <path d="M30 26h4v8h-4z" fill="url(#trophyBase)" />
            <path d="M24 34h16v2H24z" fill="url(#trophyBase)" />

            {/* Shine effect */}
            <ellipse cx="26" cy="26" rx="8" ry="6" fill="url(#shine)" opacity="0.5" />

            {/* Gradients */}
            <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFD700" />
                    <stop offset="50%" stopColor="#FFA500" />
                    <stop offset="100%" stopColor="#FF8C00" />
                </linearGradient>
                <linearGradient id="goldAccent" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFF00" />
                    <stop offset="100%" stopColor="#FFD700" />
                </linearGradient>
                <linearGradient id="goldMedal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFF8DC" />
                    <stop offset="50%" stopColor="#FFD700" />
                    <stop offset="100%" stopColor="#FFA500" />
                </linearGradient>
                <linearGradient id="goldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFF00" />
                    <stop offset="100%" stopColor="#FF8C00" />
                </linearGradient>
                <linearGradient id="goldPattern" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFF00" />
                    <stop offset="100%" stopColor="#FFD700" />
                </linearGradient>
                <linearGradient id="goldCenter" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFACD" />
                    <stop offset="100%" stopColor="#FFD700" />
                </linearGradient>
                <linearGradient id="goldInner" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFF00" />
                    <stop offset="100%" stopColor="#FFA500" />
                </linearGradient>
                <linearGradient id="trophyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFD700" />
                    <stop offset="100%" stopColor="#FFA500" />
                </linearGradient>
                <linearGradient id="trophyAccent" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFF00" />
                    <stop offset="100%" stopColor="#FFD700" />
                </linearGradient>
                <linearGradient id="trophyBase" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#CD853F" />
                    <stop offset="100%" stopColor="#8B4513" />
                </linearGradient>
                <radialGradient id="shine" cx="50%" cy="30%" r="50%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                </radialGradient>
            </defs>
        </svg>
        </div>
);

export const EcoPlatinumIcon = ({ className = "h-16 w-16" }: BadgeIconProps) => (
    <div className={className}>
        <svg viewBox="0 0 64 64" className="w-full h-full">
            {/* Outer decorative ring */}
            <circle cx="32" cy="32" r="30" fill="none" stroke="url(#platinumGradient)" strokeWidth="2" />
            <circle cx="32" cy="32" r="28" fill="none" stroke="url(#platinumAccent)" strokeWidth="1" />

            {/* Inner medal background */}
            <circle cx="32" cy="32" r="24" fill="url(#platinumMedal)" stroke="url(#platinumBorder)" strokeWidth="2" />

            {/* Decorative border pattern */}
            <circle cx="32" cy="32" r="22" fill="none" stroke="url(#platinumPattern)" strokeWidth="1" strokeDasharray="2,3" />

            {/* Central icon area */}
            <circle cx="32" cy="32" r="18" fill="url(#platinumCenter)" stroke="url(#platinumInner)" strokeWidth="1" />

            {/* Gem icon */}
            <polygon points="32,18 26,26 32,34 38,26" fill="url(#gemGradient)" />
            <polygon points="32,18 26,26 20,26 26,18" fill="url(#gemAccent)" />
            <polygon points="32,18 38,26 44,26 38,18" fill="url(#gemAccent)" />
            <polygon points="26,26 32,34 38,26" fill="url(#gemBase)" />

            {/* Shine effect */}
            <ellipse cx="26" cy="26" rx="8" ry="6" fill="url(#shine)" opacity="0.6" />

            {/* Gradients */}
            <defs>
                <linearGradient id="platinumGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E5E4E2" />
                    <stop offset="50%" stopColor="#BCC6CC" />
                    <stop offset="100%" stopColor="#8A9BA8" />
                </linearGradient>
                <linearGradient id="platinumAccent" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F0F0F0" />
                    <stop offset="100%" stopColor="#BCC6CC" />
                </linearGradient>
                <linearGradient id="platinumMedal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F8F8FF" />
                    <stop offset="50%" stopColor="#E5E4E2" />
                    <stop offset="100%" stopColor="#BCC6CC" />
                </linearGradient>
                <linearGradient id="platinumBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F0F0F0" />
                    <stop offset="100%" stopColor="#8A9BA8" />
                </linearGradient>
                <linearGradient id="platinumPattern" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F0F0F0" />
                    <stop offset="100%" stopColor="#E5E4E2" />
                </linearGradient>
                <linearGradient id="platinumCenter" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F8F8FF" />
                    <stop offset="100%" stopColor="#E5E4E2" />
                </linearGradient>
                <linearGradient id="platinumInner" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F0F0F0" />
                    <stop offset="100%" stopColor="#BCC6CC" />
                </linearGradient>
                <linearGradient id="gemGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00BFFF" />
                    <stop offset="100%" stopColor="#0066CC" />
                </linearGradient>
                <linearGradient id="gemAccent" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#87CEEB" />
                    <stop offset="100%" stopColor="#00BFFF" />
                </linearGradient>
                <linearGradient id="gemBase" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4169E1" />
                    <stop offset="100%" stopColor="#0000CD" />
                </linearGradient>
                <radialGradient id="shine" cx="50%" cy="30%" r="50%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                </radialGradient>
            </defs>
        </svg>
    </div>
);

export const GreenDiamondIcon = ({ className = "h-16 w-16" }: BadgeIconProps) => (
    <div className={className}>
        <svg viewBox="0 0 64 64" className="w-full h-full">
            {/* Outer decorative ring */}
            <circle cx="32" cy="32" r="30" fill="none" stroke="url(#diamondGradient)" strokeWidth="2" />
            <circle cx="32" cy="32" r="28" fill="none" stroke="url(#diamondAccent)" strokeWidth="1" />

            {/* Inner medal background */}
            <circle cx="32" cy="32" r="24" fill="url(#diamondMedal)" stroke="url(#diamondBorder)" strokeWidth="2" />

            {/* Decorative border pattern */}
            <circle cx="32" cy="32" r="22" fill="none" stroke="url(#diamondPattern)" strokeWidth="1" strokeDasharray="1,4" />

            {/* Central icon area */}
            <circle cx="32" cy="32" r="18" fill="url(#diamondCenter)" stroke="url(#diamondInner)" strokeWidth="1" />

            {/* Star icon */}
            <path d="M32 18l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9z" fill="url(#starGradient)" />
            <path d="M32 20l2 6h6l-5 3 2 6-5-4-5 4 2-6-5-3h6z" fill="url(#starAccent)" />

            {/* Shine effect */}
            <ellipse cx="26" cy="26" rx="8" ry="6" fill="url(#shine)" opacity="0.7" />

            {/* Gradients */}
            <defs>
                <linearGradient id="diamondGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#9370DB" />
                    <stop offset="50%" stopColor="#8A2BE2" />
                    <stop offset="100%" stopColor="#4B0082" />
                </linearGradient>
                <linearGradient id="diamondAccent" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#DDA0DD" />
                    <stop offset="100%" stopColor="#9370DB" />
                </linearGradient>
                <linearGradient id="diamondMedal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F0E6FF" />
                    <stop offset="50%" stopColor="#9370DB" />
                    <stop offset="100%" stopColor="#8A2BE2" />
                </linearGradient>
                <linearGradient id="diamondBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#DDA0DD" />
                    <stop offset="100%" stopColor="#4B0082" />
                </linearGradient>
                <linearGradient id="diamondPattern" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#DDA0DD" />
                    <stop offset="100%" stopColor="#9370DB" />
                </linearGradient>
                <linearGradient id="diamondCenter" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F8F0FF" />
                    <stop offset="100%" stopColor="#9370DB" />
                </linearGradient>
                <linearGradient id="diamondInner" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#DDA0DD" />
                    <stop offset="100%" stopColor="#8A2BE2" />
                </linearGradient>
                <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFD700" />
                    <stop offset="100%" stopColor="#FFA500" />
                </linearGradient>
                <linearGradient id="starAccent" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFF00" />
                    <stop offset="100%" stopColor="#FFD700" />
                </linearGradient>
                <radialGradient id="shine" cx="50%" cy="30%" r="50%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                </radialGradient>
            </defs>
        </svg>
        </div>
);

// Simple/Small Badge Designs (for emoji replacement)
export const EcoPioneerSimple = ({ className = "h-6 w-6" }: BadgeIconProps) => (
    <div className={className}>
        <svg viewBox="0 0 24 24" className="w-full h-full">
            <circle cx="12" cy="12" r="10" fill="url(#bronzeSimple)" stroke="url(#bronzeBorderSimple)" strokeWidth="1" />
            <path d="M12 8c-1 0-2 1-2 2 0 2 2 4 2 4s2-2 2-4c0-1-1-2-2-2z" fill="url(#leafSimple)" />
            <defs>
                <linearGradient id="bronzeSimple" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#CD7F32" />
                    <stop offset="100%" stopColor="#8B4513" />
                </linearGradient>
                <linearGradient id="bronzeBorderSimple" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#DAA520" />
                    <stop offset="100%" stopColor="#B8860B" />
                </linearGradient>
                <linearGradient id="leafSimple" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#32CD32" />
                    <stop offset="100%" stopColor="#228B22" />
                </linearGradient>
            </defs>
        </svg>
    </div>
);

export const GreenSilverSimple = ({ className = "h-6 w-6" }: BadgeIconProps) => (
    <div className={className}>
        <svg viewBox="0 0 24 24" className="w-full h-full">
            <circle cx="12" cy="12" r="10" fill="url(#silverSimple)" stroke="url(#silverBorderSimple)" strokeWidth="1" />
            <path d="M12 6l-3 4h2l-1 6 3-4h-2l1-6z" fill="url(#lightningSimple)" />
            <defs>
                <linearGradient id="silverSimple" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#C0C0C0" />
                    <stop offset="100%" stopColor="#808080" />
                </linearGradient>
                <linearGradient id="silverBorderSimple" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E6E6E6" />
                    <stop offset="100%" stopColor="#A8A8A8" />
                </linearGradient>
                <linearGradient id="lightningSimple" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFD700" />
                    <stop offset="100%" stopColor="#FFA500" />
                </linearGradient>
            </defs>
        </svg>
        </div>
);

export const ClimateGoldSimple = ({ className = "h-6 w-6" }: BadgeIconProps) => (
    <div className={className}>
        <svg viewBox="0 0 24 24" className="w-full h-full">
            <circle cx="12" cy="12" r="10" fill="url(#goldSimple)" stroke="url(#goldBorderSimple)" strokeWidth="1" />
            <path d="M10 8h4v2h-4z" fill="url(#trophySimple)" />
            <path d="M9 10h6v1H9z" fill="url(#trophyAccentSimple)" />
            <path d="M11 11h2v3h-2z" fill="url(#trophyBaseSimple)" />
            <defs>
                <linearGradient id="goldSimple" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFD700" />
                    <stop offset="100%" stopColor="#FFA500" />
                </linearGradient>
                <linearGradient id="goldBorderSimple" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFF00" />
                    <stop offset="100%" stopColor="#FF8C00" />
                </linearGradient>
                <linearGradient id="trophySimple" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFD700" />
                    <stop offset="100%" stopColor="#FFA500" />
                </linearGradient>
                <linearGradient id="trophyAccentSimple" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFF00" />
                    <stop offset="100%" stopColor="#FFD700" />
                </linearGradient>
                <linearGradient id="trophyBaseSimple" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#CD853F" />
                    <stop offset="100%" stopColor="#8B4513" />
                </linearGradient>
            </defs>
        </svg>
    </div>
);

export const EcoPlatinumSimple = ({ className = "h-6 w-6" }: BadgeIconProps) => (
    <div className={className}>
        <svg viewBox="0 0 24 24" className="w-full h-full">
            <circle cx="12" cy="12" r="10" fill="url(#platinumSimple)" stroke="url(#platinumBorderSimple)" strokeWidth="1" />
            <polygon points="12,6 9,10 12,14 15,10" fill="url(#gemSimple)" />
            <defs>
                <linearGradient id="platinumSimple" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E5E4E2" />
                    <stop offset="100%" stopColor="#BCC6CC" />
                </linearGradient>
                <linearGradient id="platinumBorderSimple" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F0F0F0" />
                    <stop offset="100%" stopColor="#8A9BA8" />
                </linearGradient>
                <linearGradient id="gemSimple" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00BFFF" />
                    <stop offset="100%" stopColor="#0066CC" />
                </linearGradient>
            </defs>
        </svg>
        </div>
);

export const GreenDiamondSimple = ({ className = "h-6 w-6" }: BadgeIconProps) => (
    <div className={className}>
        <svg viewBox="0 0 24 24" className="w-full h-full">
            <circle cx="12" cy="12" r="10" fill="url(#diamondSimple)" stroke="url(#diamondBorderSimple)" strokeWidth="1" />
            <path d="M12 6l2 6h4l-3 2 1 4-4-3-4 3 1-4-3-2h4z" fill="url(#starSimple)" />
            <defs>
                <linearGradient id="diamondSimple" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#9370DB" />
                    <stop offset="100%" stopColor="#8A2BE2" />
                </linearGradient>
                <linearGradient id="diamondBorderSimple" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#DDA0DD" />
                    <stop offset="100%" stopColor="#4B0082" />
                </linearGradient>
                <linearGradient id="starSimple" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFD700" />
                    <stop offset="100%" stopColor="#FFA500" />
                </linearGradient>
            </defs>
        </svg>
    </div>
);

// Badge icon mapping for complex badges
export const BADGE_ICONS = {
    'eco-pioneer': EcoPioneerIcon,
    'green-silver': GreenSilverIcon,
    'climate-gold': ClimateGoldIcon,
    'eco-platinum': EcoPlatinumIcon,
    'green-diamond': GreenDiamondIcon,
} as const;

// Badge icon mapping for simple badges
export const BADGE_ICONS_SIMPLE = {
    'eco-pioneer': EcoPioneerSimple,
    'green-silver': GreenSilverSimple,
    'climate-gold': ClimateGoldSimple,
    'eco-platinum': EcoPlatinumSimple,
    'green-diamond': GreenDiamondSimple,
} as const;

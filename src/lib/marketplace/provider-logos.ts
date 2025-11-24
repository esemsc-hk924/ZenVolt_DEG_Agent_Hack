/**
 * Maps provider names to logo file paths
 * If a logo doesn't exist, we'll use a fallback with initials
 */
export function getProviderLogoPath(provider: string): string | null {
  const logoMap: Record<string, string> = {
    'South Pole': '/southpole-logo.png',
    'World Land Trust – Carbon Balanced': '/worldlandtrust-logo.png',
    'Climate Impact Partners': '/climateimpactpartners-logo.png',
    'Forest Carbon': '/forestcarbon-logo.png',
    'CarbonFootprint.com': '/carbonfootprint-logo.png',
    'Verra': '/verra-logo.png',
    'Gold Standard Marketplace': '/goldstandard-logo.png',
    'Patch': '/patch-logo.png',
    'Cloverly': '/cloverly-logo.png',
    'Nori': '/nori-logo.png',
    'Puro.earth': '/puroearth-logo.png',
    'Cool Effect': '/cooleffect-logo.png',
    'Terrapass': '/terrapass-logo.png',
    'ClimatePartner': '/climatepartner-logo.png',
    'Watershed': '/watershed-logo.png',
  };

  return logoMap[provider] || null;
}

/**
 * Gets provider initials for fallback display
 */
export function getProviderInitials(provider: string): string {
  const words = provider.split(' ');
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return provider.substring(0, 2).toUpperCase();
}

/**
 * Accent colors per provider for halo/ring
 * bg: base brand color
 * ring: darker accent for the inner ring border
 */
export function getProviderAccent(provider: string): { bg: string; ring: string } {
  const accentMap: Record<string, { bg: string; ring: string }> = {
    'South Pole': { bg: '#FF5533', ring: '#FF5533' },
    'World Land Trust – Carbon Balanced': { bg: '#2F855A', ring: '#276749' },
    'Climate Impact Partners': { bg: '#3B82F6', ring: '#2563EB' },
    'Forest Carbon': { bg: '#065F46', ring: '#064E3B' },
    'CarbonFootprint.com': { bg: '#10B981', ring: '#059669' },
    'Verra': { bg: '#1F2937', ring: '#111827' },
    'Gold Standard Marketplace': { bg: '#F59E0B', ring: '#D97706' },
    'Patch': { bg: '#111827', ring: '#111827' },
    'Cloverly': { bg: '#22C55E', ring: '#16A34A' },
    'Nori': { bg: '#1D4ED8', ring: '#1E40AF' },
    'Puro.earth': { bg: '#0EA5E9', ring: '#0284C7' },
    'Cool Effect': { bg: '#0EA5E9', ring: '#0284C7' },
    'Terrapass': { bg: '#059669', ring: '#047857' },
    'ClimatePartner': { bg: '#2563EB', ring: '#1D4ED8' },
    'Watershed': { bg: '#0EA5E9', ring: '#0284C7' },
  };
  return accentMap[provider] || { bg: '#94A3B8', ring: '#64748B' };
}


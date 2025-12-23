export * from './types';
export { cernTokens } from './cern';

import type { ThemeTokens } from './types';
import { cernTokens } from './cern';

// All themes use CERN for now - we'll add distinct themes later
export const themeTokensMap: Record<ThemeTokens['id'], ThemeTokens> = {
  cern: cernTokens,
  intel: cernTokens, // Placeholder
  pharma: cernTokens, // Placeholder
  materials: cernTokens, // Placeholder
};

export function getThemeTokens(themeId: ThemeTokens['id']): ThemeTokens {
  return themeTokensMap[themeId] || cernTokens;
}

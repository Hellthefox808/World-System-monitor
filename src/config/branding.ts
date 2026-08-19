/**
 * Centralized branding configuration for RAVI MONITOR.
 *
 * This module isolates all product branding, display names, and upstream
 * attribution metadata into a single, easily maintainable configuration layer.
 */

export const BRAND_CONFIG = {
  name: 'RAVI MONITOR',
  shortName: 'RAVI MONITOR',
  kicker: 'RAVI MONITOR',
  initials: 'RM',
  tagline: 'Global Intelligence & Signal Workspace',
  description:
    'Real-time global intelligence and signal workspace — AI-powered news aggregation, geopolitical monitoring, military tracking, and infrastructure analysis in a unified situational awareness interface.',
  author: 'Ravi Ranjan Singh',
  maintainerGithub: 'Hellthefox808',
  version: '2.10.0',
  repoUrl: 'https://github.com/Hellthefox808/World-System-monitor',
  legal: {
    license: 'AGPL-3.0',
    upstreamName: 'World Monitor',
    upstreamAuthor: 'Elie Habib',
    upstreamCopyright: 'Copyright (C) 2024-2026 Elie Habib',
    upstreamRepo: 'https://github.com/koala73/worldmonitor',
    derivativeNotice: 'Derived from World Monitor by Elie Habib under AGPL-3.0',
  },
} as const;

export type BrandConfig = typeof BRAND_CONFIG;

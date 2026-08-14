import { Zap, Shield, Trophy, Gem, Crown, Circle } from 'lucide-react';
import type { ComponentType } from 'react';

export const LEAGUES = ['wood', 'bronze', 'iron', 'gold', 'diamond', 'legendary'] as const;
export type League = typeof LEAGUES[number];

export const LEAGUE_NAMES: Record<League, { en: string; bn: string }> = {
  wood: { en: 'Wood', bn: 'কাঠ' },
  bronze: { en: 'Bronze', bn: 'ব্রোঞ্জ' },
  iron: { en: 'Iron', bn: 'লোহা' },
  gold: { en: 'Gold', bn: 'সোনা' },
  diamond: { en: 'Diamond', bn: 'হীরা' },
  legendary: { en: 'Legendary', bn: 'কিংবদন্তি' },
};

export const LEAGUE_ICONS: Record<League, ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  wood: Circle,
  bronze: Shield,
  iron: Zap,
  gold: Trophy,
  diamond: Gem,
  legendary: Crown,
};

export const LEAGUE_COLORS: Record<League, string> = {
  wood: '#92400e',
  bronze: '#b45309',
  iron: '#64748b',
  gold: '#d97706',
  diamond: '#06b6d4',
  legendary: '#a855f7',
};
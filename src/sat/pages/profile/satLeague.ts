import { Circle, Shield, Zap, Trophy, Gem, Sparkles, Crown } from 'lucide-react';
import type { ComponentType } from 'react';

export const SAT_LEAGUES = ['wood', 'bronze', 'silver', 'gold', 'sapphire', 'ruby', 'diamond'] as const;
export type SatLeague = typeof SAT_LEAGUES[number];

export const SAT_LEAGUE_NAMES: Record<SatLeague, { en: string; bn: string }> = {
  wood: { en: 'Novice Scholar', bn: 'নতুন স্কলার' },
  bronze: { en: 'Bronze Scholar', bn: 'ব্রোঞ্জ স্কলার' },
  silver: { en: 'Silver Scholar', bn: 'সিলভার স্কলার' },
  gold: { en: 'Gold Scholar', bn: 'গোল্ড স্কলার' },
  sapphire: { en: 'Sapphire Scholar', bn: 'স্যাফায়ার স্কলার' },
  ruby: { en: 'Ruby Scholar', bn: 'রুবি স্কলার' },
  diamond: { en: '1500+ Diamond Elite', bn: '১৫০০+ ডায়মন্ড এলিট' },
};

export const SAT_LEAGUE_ICONS: Record<SatLeague, ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  wood: Circle,
  bronze: Shield,
  silver: Zap,
  gold: Trophy,
  sapphire: Gem,
  ruby: Sparkles,
  diamond: Crown,
};

export const SAT_LEAGUE_COLORS: Record<SatLeague, string> = {
  wood: '#64748b',
  bronze: '#b45309',
  silver: '#94a3b8',
  gold: '#f59e0b',
  sapphire: '#3b82f6',
  ruby: '#ec4899',
  diamond: '#8b5cf6',
};

export function getSatLeagueFromScore(score: number): SatLeague {
  if (score >= 1520) return 'diamond';
  if (score >= 1450) return 'ruby';
  if (score >= 1350) return 'sapphire';
  if (score >= 1250) return 'gold';
  if (score >= 1150) return 'silver';
  if (score >= 1000) return 'bronze';
  return 'wood';
}

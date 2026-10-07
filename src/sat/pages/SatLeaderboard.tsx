import { useState, useEffect } from 'react';
import { Trophy, Zap, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import { loadSatUserState } from '../lib/satStorage';
import { calculatePredictedScore } from '../lib/scorePredictor';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import type { SatLeaderboardUser } from '../types';
import { play } from '../../lib/audio';

const MOCK_LEADERBOARD: SatLeaderboardUser[] = [
  {
    id: 'u-1',
    name: 'Tanvir Hossain',
    avatar: 'scholar',
    xp: 2450,
    solvedCount: 168,
    accuracy: 94,
    predictedScore: 1560,
    league: 'diamond',
    rank: 1
  },
  {
    id: 'u-2',
    name: 'Nafisa Rahman',
    avatar: 'astronaut',
    xp: 2180,
    solvedCount: 142,
    accuracy: 91,
    predictedScore: 1530,
    league: 'diamond',
    rank: 2
  },
  {
    id: 'u-3',
    name: 'Farhan Kabir',
    avatar: 'robot',
    xp: 1920,
    solvedCount: 125,
    accuracy: 88,
    predictedScore: 1490,
    league: 'diamond',
    rank: 3
  },
  {
    id: 'u-4',
    name: 'Ayesha Siddiqua',
    avatar: 'code',
    xp: 1750,
    solvedCount: 110,
    accuracy: 85,
    predictedScore: 1460,
    league: 'diamond',
    rank: 4
  },
  {
    id: 'u-6',
    name: 'Zubair Ahmed',
    avatar: 'cat',
    xp: 590,
    solvedCount: 38,
    accuracy: 79,
    predictedScore: 1380,
    league: 'diamond',
    rank: 6
  }
];

export default function SatLeaderboard() {
  const [activeTab, setActiveTab] = useState<'weekly' | 'allTime'>('weekly');
  const { user } = useAuthStore();
  const userStore = useUserStore();
  const [localName, setLocalName] = useState(() => {
    return (
      (typeof window !== 'undefined' ? (localStorage.getItem('cs_sat_user_name') || localStorage.getItem('cholosikhi_user_name')) : '') || ''
    );
  });

  useEffect(() => {
    const handleNameChange = (e: any) => {
      if (e?.detail?.name) {
        setLocalName(e.detail.name);
      }
    };
    window.addEventListener('cs_user_name_changed', handleNameChange);
    return () => window.removeEventListener('cs_user_name_changed', handleNameChange);
  }, []);

  const currentUserName = user?.name ||
                          (user as any)?.user_metadata?.full_name || 
                          userStore.name || 
                          localName || 
                          (user?.email ? user.email.split('@')[0] : (user?.mobile || 'Digital SAT Scholar'));

  const userState = loadSatUserState();
  const prediction = calculatePredictedScore(userState.attempts);
  const totalAttempts = userState.attempts.length;
  const correctAttempts = userState.attempts.filter((a) => a.isCorrect).length;
  const userAccuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 82;

  const currentUserData: SatLeaderboardUser = {
    id: user?.id || 'u-current-user',
    name: `${currentUserName} (You)`,
    avatar: 'hero',
    xp: userState.xp > 0 ? userState.xp : 2650,
    solvedCount: totalAttempts > 0 ? totalAttempts : 204,
    accuracy: userAccuracy,
    predictedScore: prediction.compositeScore || 1410,
    league: 'diamond',
    rank: 1,
    isCurrentUser: true
  };

  const displayList = [...MOCK_LEADERBOARD, currentUserData];
  displayList.sort((a, b) => b.xp - a.xp);
  displayList.forEach((u, i) => { u.rank = i + 1; });

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="glass p-8 sm:p-12 rounded-[3.5rem] border border-blue-500/20 text-center space-y-5 relative overflow-hidden">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-2xl">
          <Trophy size={42} />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-wider">
            <Sparkles size={12} />
            <span>Diamond League Tier</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-app-fg">
            SAT Global Leaderboard
          </h1>
          <p className="text-sm font-bold text-app-fg/60 max-w-lg mx-auto">
            Solve micro-types, conquer practice tests, and rank among the top SAT aspirants worldwide.
          </p>
        </div>

        {/* Tab switch */}
        <div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-panel border border-border-subtle">
          <button
            onClick={() => { play('toggle'); setActiveTab('weekly'); }}
            className={clsx(
              "px-5 py-2 rounded-xl text-xs font-black transition-all",
              activeTab === 'weekly'
                ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                : "text-app-fg/60 hover:text-app-fg"
            )}
          >
            Weekly XP League
          </button>
          <button
            onClick={() => { play('toggle'); setActiveTab('allTime'); }}
            className={clsx(
              "px-5 py-2 rounded-xl text-xs font-black transition-all",
              activeTab === 'allTime'
                ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                : "text-app-fg/60 hover:text-app-fg"
            )}
          >
            All-Time High Scores
          </button>
        </div>
      </div>

      {/* Leaderboard Table List */}
      <div className="glass rounded-[2.5rem] border border-border-subtle p-4 sm:p-6 space-y-2">
        {displayList.map((user) => {
          const isTop3 = user.rank <= 3;
          const rankColors = {
            1: 'bg-amber-400 text-slate-900 border-amber-300',
            2: 'bg-slate-300 text-slate-900 border-slate-200',
            3: 'bg-amber-700 text-white border-amber-600'
          };

          return (
            <div
              key={user.id}
              className={clsx(
                "p-4 sm:p-5 rounded-2xl border transition-all flex items-center justify-between gap-4",
                user.isCurrentUser
                  ? "bg-blue-500/10 border-blue-500 shadow-md"
                  : "bg-panel/40 border-border-subtle hover:bg-panel"
              )}
            >
              {/* Rank & User Info */}
              <div className="flex items-center gap-4">
                <span
                  className={clsx(
                    "w-9 h-9 rounded-xl font-black text-sm flex items-center justify-center shrink-0 border",
                    isTop3
                      ? rankColors[user.rank as 1 | 2 | 3]
                      : "bg-panel border-border-subtle text-app-fg/60"
                  )}
                >
                  {user.rank}
                </span>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-sm sm:text-base text-app-fg">
                      {user.name}
                    </h4>
                    {user.isCurrentUser && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-500 text-white">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-app-fg/50 font-bold mt-0.5">
                    <span>{user.solvedCount} questions solved</span>
                    <span>•</span>
                    <span>{user.accuracy}% accuracy</span>
                  </div>
                </div>
              </div>

              {/* XP & Predicted Score */}
              <div className="flex items-center gap-6 text-right">
                <div className="hidden sm:block">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 block">
                    Predicted Score
                  </span>
                  <span className="text-base font-black text-app-fg">
                    {user.predictedScore}
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-end gap-1.5 text-amber-400 font-black text-base sm:text-lg">
                    <Zap size={16} fill="currentColor" />
                    <span>{user.xp}</span>
                  </div>
                  <span className="text-[10px] font-bold text-app-fg/40 uppercase tracking-widest block">
                    Total XP
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

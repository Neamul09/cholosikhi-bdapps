import { useState } from 'react';
import { Target, Calendar, Clock, Save } from 'lucide-react';
import { loadSatUserState, saveRoutinePlan } from '../lib/satStorage';
import type { RoutinePlan } from '../types';
import { play } from '../../lib/audio';

export default function SatRoutinePage() {
  const userState = loadSatUserState();
  const [examDate, setExamDate] = useState(userState.routine?.examDate || '2026-11-07');
  const [targetScore, setTargetScore] = useState(userState.routine?.targetScore || 1520);
  const [weeklyHours, setWeeklyHours] = useState(userState.routine?.weeklyPacingGoalHours || 6);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Compute days left
  const daysLeft = Math.max(1, Math.round((new Date(examDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));

  const handleSavePlan = () => {
    play('correct');

    const updatedPlan: RoutinePlan = {
      examDate,
      targetScore,
      currentPredictedScore: 1380,
      daysRemaining: daysLeft,
      weeklyPacingGoalHours: weeklyHours,
      dailyTasks: [
        {
          id: 't-1',
          title: 'Master Nonlinear Functions & Vertex Form',
          description: '5 targeted questions in adv-quad-vertex',
          microTypeId: 'adv-quad-vertex',
          targetCount: 5,
          completedCount: 0,
          isCompleted: false,
          xpReward: 50,
          category: 'drill'
        },
        {
          id: 't-2',
          title: 'Vocab Vault: 10 Words in Context',
          description: 'Review secondary meanings and flashcards',
          targetCount: 10,
          completedCount: 0,
          isCompleted: false,
          xpReward: 30,
          category: 'vocab'
        },
        {
          id: 't-3',
          title: 'Clear Mistake Bank Items',
          description: 'Review previously missed questions',
          targetCount: 3,
          completedCount: 0,
          isCompleted: false,
          xpReward: 40,
          category: 'mistake_review'
        }
      ]
    };

    saveRoutinePlan(updatedPlan);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="glass p-8 sm:p-12 rounded-[3.5rem] border border-blue-500/20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto">
          <Target size={32} />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-wider text-blue-400">
            Adaptive Routine Engine
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-app-fg">
            Personalized SAT Study Routine
          </h1>
          <p className="text-sm font-bold text-app-fg/60">
            Tell us your official test date and dream score. We'll formulate your optimal daily checklist.
          </p>
        </div>
      </div>

      {/* Routine Configuration Form */}
      <div className="glass p-8 rounded-[2.5rem] border border-border-subtle space-y-8">
        <div className="space-y-6">
          {/* Target Exam Date */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-app-fg/60 flex items-center gap-1.5">
              <Calendar size={14} className="text-blue-400" />
              <span>Target Official SAT Test Date</span>
            </label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-panel border border-border-subtle text-app-fg font-bold text-base focus:outline-none focus:border-blue-500"
            />
            <p className="text-xs font-bold text-app-fg/40">
              Estimated <strong>{daysLeft} days</strong> remaining until exam day.
            </p>
          </div>

          {/* Target Score */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-app-fg/60 flex items-center gap-1.5">
              <Target size={14} className="text-blue-400" />
              <span>Target Composite Score (400 - 1600)</span>
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1000"
                max="1600"
                step="10"
                value={targetScore}
                onChange={(e) => setTargetScore(Number(e.target.value))}
                className="flex-1 accent-blue-500"
              />
              <span className="text-2xl font-black text-blue-400 font-mono w-20 text-right">
                {targetScore}
              </span>
            </div>
            <div className="flex justify-between text-[11px] font-bold text-app-fg/40">
              <span>Good (1200)</span>
              <span>Competitive (1400)</span>
              <span>Top 1% Ivy (1550+)</span>
            </div>
          </div>

          {/* Weekly Pacing */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-app-fg/60 flex items-center gap-1.5">
              <Clock size={14} className="text-blue-400" />
              <span>Weekly Dedicated Study Hours</span>
            </label>
            <select
              value={weeklyHours}
              onChange={(e) => setWeeklyHours(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-2xl bg-panel border border-border-subtle text-app-fg font-bold text-sm focus:outline-none"
            >
              <option value="3">Light: ~3 hours / week (25 mins / day)</option>
              <option value="6">Recommended: ~6 hours / week (50 mins / day)</option>
              <option value="10">Intensive: ~10 hours / week (1.5 hours / day)</option>
              <option value="15">Bootcamp: ~15 hours / week (2+ hours / day)</option>
            </select>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-border-subtle flex items-center justify-between">
          <span className="text-xs font-bold text-app-fg/50">
            {savedSuccess ? 'Plan saved and active!' : 'Updates sync with your Dashboard.'}
          </span>

          <button
            onClick={handleSavePlan}
            className="btn-duo btn-duo-green px-8 py-3.5 text-sm flex items-center gap-2"
          >
            <Save size={16} />
            <span>{savedSuccess ? 'Saved ✓' : 'Save Routine Plan'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

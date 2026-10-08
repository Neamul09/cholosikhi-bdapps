import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RotateCcw,
  CheckCircle2,
  Lightbulb,
  Clock,
  Sparkles,
  Calendar,
  Flame,
  Brain,
  Bot,
  Loader2,
  X
} from 'lucide-react';
import { clsx } from 'clsx';
import { loadSatUserState, getSrsMistakeStats } from '../lib/satStorage';
import { getQuestionById } from '../data/questionsRepo';
import { MICRO_TYPE_MAP } from '../data/microtypes';
import MathRenderer from '../components/MathRenderer';
import type { MistakeRecord, SatUserState } from '../types';
import { generateMistakeRemediationPlan } from '../services/satAiService';
import { play } from '../../lib/audio';

type SrsFilterTab = 'due_today' | 'upcoming' | 'mastered' | 'all';

export default function SatMistakeBank() {
  const navigate = useNavigate();
  const [userState, setUserState] = useState<SatUserState>(loadSatUserState);
  const [srsFilter, setSrsFilter] = useState<SrsFilterTab>('due_today');
  const [filterReason, setFilterReason] = useState<string>('all');
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiPlan, setAiPlan] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiLang, setAiLang] = useState<'bn' | 'en'>('en');

  useEffect(() => {
    setUserState(loadSatUserState());
    const handleUpdate = () => setUserState(loadSatUserState());
    window.addEventListener('sat_state_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('sat_state_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const srsStats = getSrsMistakeStats();

  const filteredMistakes = userState.mistakes.filter((m: MistakeRecord) => {
    const isMastered = m.resolved || (m.srsStage !== undefined && m.srsStage >= 4);
    const isDueToday = !isMastered && (!m.nextReviewDate || m.nextReviewDate <= todayStr);
    const isUpcoming = !isMastered && Boolean(m.nextReviewDate && m.nextReviewDate > todayStr);

    if (srsFilter === 'due_today' && !isDueToday) return false;
    if (srsFilter === 'upcoming' && !isUpcoming) return false;
    if (srsFilter === 'mastered' && !isMastered) return false;

    if (filterReason !== 'all' && m.errorReason !== filterReason) return false;
    return true;
  });

  const handleRetrySingle = (m: MistakeRecord) => {
    play('tap');
    navigate(`/sat/quiz?mode=drill&microType=${m.microType}&questionId=${m.questionId}`);
  };

  const getSrsStageInfo = (m: MistakeRecord) => {
    const stage = m.srsStage ?? (m.resolved ? 4 : 0);
    const isMastered = m.resolved || stage >= 4;

    if (isMastered) {
      return {
        stage: 4,
        label: 'Stage 4: Mastered',
        sublabel: 'Retained in Long-Term Memory',
        badgeClass: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
        dueText: 'Mastered & Archived'
      };
    }

    if (!m.nextReviewDate || m.nextReviewDate <= todayStr) {
      return {
        stage,
        label: stage === 0 ? 'Stage 0: New / Due Now' : `Stage ${stage}: Review Due`,
        sublabel: 'Scheduled for review today',
        badgeClass: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
        dueText: 'Due for Review Today!'
      };
    }

    // Upcoming review calculation
    const nextDate = new Date(m.nextReviewDate);
    const todayDate = new Date(todayStr);
    const diffDays = Math.max(1, Math.ceil((nextDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24)));

    if (stage === 1) {
      return {
        stage: 1,
        label: 'Stage 1 (+1 Day)',
        sublabel: `Next review in ${diffDays} day${diffDays > 1 ? 's' : ''}`,
        badgeClass: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
        dueText: diffDays === 1 ? 'Due Tomorrow' : `Due in ${diffDays} days (${m.nextReviewDate})`
      };
    }

    if (stage === 2) {
      return {
        stage: 2,
        label: 'Stage 2 (+3 Days)',
        sublabel: `Next review in ${diffDays} day${diffDays > 1 ? 's' : ''}`,
        badgeClass: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
        dueText: `Due in ${diffDays} days (${m.nextReviewDate})`
      };
    }

    return {
      stage: 3,
      label: 'Stage 3 (+7 Days)',
      sublabel: `Next review in ${diffDays} day${diffDays > 1 ? 's' : ''}`,
      badgeClass: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
      dueText: `Due in ${diffDays} days (${m.nextReviewDate})`
    };
  };

  const handleOpenAiPlan = async (lang = aiLang) => {
    play('tap');
    setShowAiModal(true);
    if (aiPlan && lang === aiLang) return;

    setIsAiLoading(true);
    try {
      const plan = await generateMistakeRemediationPlan(userState.mistakes, lang === 'en');
      setAiPlan(plan);
    } catch (err) {
      console.error(err);
      setAiPlan('Unable to generate AI mistake audit. Please try again.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleChangeAiLang = (newLang: 'bn' | 'en') => {
    setAiLang(newLang);
    handleOpenAiPlan(newLang);
  };

  return (
    <div className="space-y-10 pb-20">
      {/* ─── Hero Header & Spaced Repetition Mission ─────────────────── */}
      <div className="glass p-8 sm:p-12 rounded-[3.5rem] border border-amber-500/20 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-black uppercase tracking-wider">
            <Brain size={14} />
            <span>Spaced Repetition Mistake Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-app-fg">
            Turn your wrong answers <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400">
              into future points.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-app-fg/60 font-bold leading-relaxed">
            Every question you miss enters our SuperMemo-calibrated Leitner schedule (1-day, 3-day, and 7-day intervals). Review on schedule to permanently retain the traps in long-term memory.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs font-bold text-app-fg/70">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <span>Stage 0: Due Now</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-app-fg/70">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>Stage 1: +1d</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-app-fg/70">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
              <span>Stage 2: +3d</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-app-fg/70">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
              <span>Stage 3: +7d</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-app-fg/70">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>Stage 4: Mastered</span>
            </div>
          </div>
        </div>

        {/* SRS Action Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-center space-y-4 shrink-0 w-full lg:w-72 shadow-lg">
          <div className="grid grid-cols-3 gap-2 pb-2 border-b border-amber-500/20">
            <div>
              <span className="text-2xl sm:text-3xl font-black text-rose-400">{srsStats.dueToday}</span>
              <p className="text-[10px] font-black uppercase tracking-wider text-app-fg/50 mt-0.5">Due Today</p>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-blue-400">{srsStats.upcoming}</span>
              <p className="text-[10px] font-black uppercase tracking-wider text-app-fg/50 mt-0.5">Upcoming</p>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400">{srsStats.mastered}</span>
              <p className="text-[10px] font-black uppercase tracking-wider text-app-fg/50 mt-0.5">Mastered</p>
            </div>
          </div>

          {srsStats.dueToday > 0 ? (
            <button
              onClick={() => {
                play('tap');
                navigate('/sat/quiz?mode=mistakes_drill&dueOnly=true');
              }}
              className="w-full btn-duo btn-duo-red py-3.5 px-4 text-xs font-black flex items-center justify-center gap-2 shadow-none"
            >
              <Flame size={16} />
              <span>Daily Spaced Review ({srsStats.dueToday} Due)</span>
            </button>
          ) : srsStats.upcoming > 0 ? (
            <div className="space-y-2">
              <span className="text-xs font-black text-emerald-400 block flex items-center justify-center gap-1.5">
                <CheckCircle2 size={15} /> All Due Reviews Complete!
              </span>
              <button
                onClick={() => {
                  play('tap');
                  navigate('/sat/quiz?mode=mistakes_drill');
                }}
                className="w-full btn-duo btn-duo-blue py-3 px-4 text-xs font-black flex items-center justify-center gap-2 shadow-none"
              >
                <RotateCcw size={14} />
                <span>Drill Any Mistake Early</span>
              </button>
            </div>
          ) : (
            <span className="text-xs font-black text-emerald-400 block">Clean Sheet! 🎯 No Mistakes</span>
          )}
        </div>
      </div>

      {/* ─── Spaced Repetition Tabs & Filter Bar ─────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* SRS Stage Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              play('toggle');
              setSrsFilter('due_today');
            }}
            className={clsx(
              "px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2",
              srsFilter === 'due_today'
                ? "bg-rose-500 text-white shadow-md"
                : "bg-panel border border-border-subtle text-app-fg/70 hover:text-app-fg"
            )}
          >
            <Clock size={13} />
            <span>Due for Review Today ({srsStats.dueToday})</span>
          </button>

          <button
            onClick={() => {
              play('toggle');
              setSrsFilter('upcoming');
            }}
            className={clsx(
              "px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2",
              srsFilter === 'upcoming'
                ? "bg-blue-500 text-white shadow-md"
                : "bg-panel border border-border-subtle text-app-fg/70 hover:text-app-fg"
            )}
          >
            <Calendar size={13} />
            <span>Upcoming Schedule ({srsStats.upcoming})</span>
          </button>

          <button
            onClick={() => {
              play('toggle');
              setSrsFilter('mastered');
            }}
            className={clsx(
              "px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2",
              srsFilter === 'mastered'
                ? "bg-emerald-500 text-white shadow-md"
                : "bg-panel border border-border-subtle text-app-fg/70 hover:text-app-fg"
            )}
          >
            <Sparkles size={13} />
            <span>Mastered ({srsStats.mastered})</span>
          </button>

          <button
            onClick={() => {
              play('toggle');
              setSrsFilter('all');
            }}
            className={clsx(
              "px-4 py-2 rounded-xl text-xs font-black transition-all",
              srsFilter === 'all'
                ? "bg-amber-500 text-white shadow-md"
                : "bg-panel border border-border-subtle text-app-fg/70 hover:text-app-fg"
            )}
          >
            <span>All ({userState.mistakes.length})</span>
          </button>
        </div>

        {/* Reason Filter & AI Diagnosis CTA */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {userState.mistakes.length > 0 && (
            <button
              onClick={() => handleOpenAiPlan()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-black text-xs transition-all shadow-md flex items-center gap-2"
            >
              <Bot size={14} />
              <span>AI Mistake Audit</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 font-bold">Free AI</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <span className="font-bold text-app-fg/50">Root Cause:</span>
            <select
              value={filterReason}
              onChange={(e) => setFilterReason(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-panel border border-border-subtle text-app-fg font-bold text-xs focus:outline-none"
            >
              <option value="all">All Reasons</option>
              <option value="careless_calc">Careless / Calculation Error</option>
              <option value="time_pressure">Time Pressure / Rushed</option>
              <option value="misread_question">Misread Question / Trap</option>
              <option value="concept_gap">Concept Gap / Unfamiliar</option>
              <option value="vocab_unknown">Vocabulary Unknown</option>
            </select>
          </div>
        </div>
      </div>

      {/* ─── Mistakes List ─────────────────────────────────────────── */}
      {filteredMistakes.length === 0 ? (
        <div className="glass p-12 rounded-[2.5rem] text-center space-y-4 max-w-lg mx-auto">
          <CheckCircle2 size={48} className="text-emerald-400 mx-auto" />
          <h3 className="text-xl font-black text-app-fg">
            {srsFilter === 'due_today'
              ? 'No Reviews Due Today!'
              : srsFilter === 'upcoming'
              ? 'No Upcoming Reviews'
              : srsFilter === 'mastered'
              ? 'No Mastered Items Yet'
              : 'Clean Sheet!'}
          </h3>
          <p className="text-xs font-bold text-app-fg/50">
            {srsFilter === 'due_today'
              ? 'You have cleared all scheduled items for today. Check upcoming reviews or explore new practice questions!'
              : 'Keep practicing drills to identify and eliminate concept gaps.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredMistakes.map((m: MistakeRecord) => {
            const question = getQuestionById(m.questionId);
            const microInfo = MICRO_TYPE_MAP.get(m.microType);
            const stageInfo = getSrsStageInfo(m);

            return (
              <div
                key={m.id}
                className="glass p-6 sm:p-8 rounded-3xl border border-border-subtle hover:border-amber-500/30 transition-all space-y-5"
              >
                {/* Header row: Section, Skill, SRS Stage, User Answer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle/60 pb-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-500 text-xs font-black uppercase">
                      {m.section === 'math' ? 'Math' : 'Reading & Writing'}
                    </span>
                    <span className="text-xs font-black text-app-fg">
                      {microInfo?.title || m.skill}
                    </span>

                    {/* SRS Stage Badge */}
                    <span className={clsx("px-2.5 py-0.5 rounded-full border text-[11px] font-black flex items-center gap-1.5", stageInfo.badgeClass)}>
                      <Clock size={11} />
                      <span>{stageInfo.label}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-bold text-app-fg/60">
                    {/* 4-step progress dots */}
                    <div className="flex items-center gap-1" title={`Spaced Repetition Stage ${stageInfo.stage} of 4`}>
                      {[1, 2, 3, 4].map(s => (
                        <span
                          key={s}
                          className={clsx(
                            "w-2 h-2 rounded-full transition-all",
                            stageInfo.stage >= s ? "bg-emerald-400" : "bg-app-fg/20"
                          )}
                        />
                      ))}
                    </div>

                    <span>•</span>

                    <span>Your: <strong className="text-pink-400 font-mono">{m.userAnswer || 'None'}</strong></span>
                    <span>•</span>
                    <span>Correct: <strong className="text-emerald-400 font-mono">{m.correctAnswer}</strong></span>
                  </div>
                </div>

                {/* Question preview */}
                {question && (
                  <div className="space-y-3">
                    {question.stimulus && (
                      <div className="p-4 rounded-xl bg-panel border border-border-subtle/70 text-xs font-bluebook-serif italic text-app-fg/80 line-clamp-2">
                        <MathRenderer content={question.stimulus} isSerif={true} />
                      </div>
                    )}
                    <div className="text-sm font-bold text-app-fg">
                      <MathRenderer content={question.stem} />
                    </div>
                  </div>
                )}

                {/* Explanation Rationale snippet */}
                {question?.rationale && (
                  <div className="p-4 rounded-2xl bg-panel/60 border border-border-subtle text-xs space-y-1">
                    <span className="text-blue-400 font-black uppercase tracking-wider flex items-center gap-1.5">
                      <Lightbulb size={13} />
                      <span>Official Solution Key</span>
                    </span>
                    <div className="text-app-fg/80 font-bold leading-relaxed line-clamp-3">
                      <MathRenderer content={question.rationale} />
                    </div>
                  </div>
                )}

                {/* Bottom Actions & Schedule Details */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-xs text-app-fg/50 font-bold">
                    <span className="text-app-fg/80 font-black">
                      {stageInfo.dueText}
                    </span>
                    <span>•</span>
                    <span>Retried {m.timesRetried} time{m.timesRetried === 1 ? '' : 's'}</span>
                    <span>•</span>
                    <span>Logged {new Date(m.recordedAt).toLocaleDateString()}</span>
                  </div>

                  <button
                    onClick={() => handleRetrySingle(m)}
                    className="btn-duo btn-duo-green px-6 py-2.5 text-xs flex items-center gap-2 self-end sm:self-auto shadow-none"
                  >
                    <RotateCcw size={13} />
                    <span>Review & Retry Now</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── AI Mistake Remediation Modal ─────────────────────────────── */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="glass max-w-2xl w-full max-h-[85vh] rounded-3xl border border-amber-500/30 overflow-hidden flex flex-col shadow-2xl bg-panel">
            {/* Modal Header */}
            <div className="p-6 border-b border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-app-fg flex items-center gap-2">
                    <span>Nini AI Mistake Diagnosis</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold">Free AI</span>
                  </h3>
                  <p className="text-xs text-app-fg/60 font-medium">
                    Weakness pattern detection & 3-day targeted remediation roadmap
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Language Switcher */}
                <div className="flex items-center bg-app-bg rounded-xl p-0.5 border border-border-subtle text-xs font-bold">
                  <button
                    onClick={() => handleChangeAiLang('bn')}
                    className={clsx(
                      "px-2.5 py-1 rounded-lg transition-all",
                      aiLang === 'bn' ? "bg-amber-500 text-white shadow-sm" : "text-app-fg/60 hover:text-app-fg"
                    )}
                  >
                    বাংলা
                  </button>
                  <button
                    onClick={() => handleChangeAiLang('en')}
                    className={clsx(
                      "px-2.5 py-1 rounded-lg transition-all",
                      aiLang === 'en' ? "bg-amber-500 text-white shadow-sm" : "text-app-fg/60 hover:text-app-fg"
                    )}
                  >
                    English
                  </button>
                </div>

                <button
                  onClick={() => { play('tap'); setShowAiModal(false); }}
                  className="p-2 rounded-xl bg-app-bg hover:bg-white/10 text-app-fg/60 hover:text-app-fg transition-all"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4 font-hind text-sm leading-relaxed text-app-fg">
              {isAiLoading ? (
                <div className="p-12 flex flex-col items-center justify-center gap-3 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 animate-pulse">
                    <Loader2 size={26} className="animate-spin" />
                  </div>
                  <p className="text-sm font-bold text-app-fg/80">
                    Nini is auditing your recorded mistakes and formulating your remediation plan...
                  </p>
                </div>
              ) : aiPlan ? (
                <div className="sat-question-content space-y-3 p-4 rounded-2xl bg-app-bg/60 border border-border-subtle/70">
                  <MathRenderer content={aiPlan} />
                </div>
              ) : null}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border-subtle bg-app-bg/40 flex justify-end">
              <button
                onClick={() => { play('tap'); setShowAiModal(false); }}
                className="btn-duo btn-duo-blue px-6 py-2.5 text-xs font-bold shadow-none"
              >
                Close Diagnosis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

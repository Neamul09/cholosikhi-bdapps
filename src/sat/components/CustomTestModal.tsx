import { useState, useMemo, useEffect } from 'react';
import { X, Play, Sliders, Clock, Brain, Sparkles, BookOpen, Layers, Zap, Filter, CheckCircle2, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import { play } from '../../lib/audio';
import { ALL_QUESTIONS } from '../data/questionsRepo';
import type { SatTestSection } from '../types';

interface CustomTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomTestModal({ isOpen, onClose }: CustomTestModalProps) {
  const navigate = useNavigate();
  const [section, setSection] = useState<SatTestSection | 'full'>('full');
  const [quizType, setQuizType] = useState<'exam' | 'drill'>('drill');
  const [domain, setDomain] = useState<string>('all');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<string>('all');
  const [difficultyMix, setDifficultyMix] = useState<'balanced' | 'hard' | 'all'>('balanced');
  const [questionCount, setQuestionCount] = useState<number>(98);
  const [countInput, setCountInput] = useState<string>('98');
  const [isTimed, setIsTimed] = useState<boolean>(true);

  const mathDomains = [
    { id: 'all', label: 'All Math Domains' },
    { id: 'Algebra', label: 'Algebra' },
    { id: 'Advanced Math', label: 'Advanced Math' },
    { id: 'Problem-Solving and Data Analysis', label: 'Data Analysis & Stats' },
    { id: 'Geometry and Trigonometry', label: 'Geometry & Trig' }
  ];

  const rwDomains = [
    { id: 'all', label: 'All R&W Domains' },
    { id: 'Craft and Structure', label: 'Craft & Structure (Vocab)' },
    { id: 'Information and Ideas', label: 'Information & Ideas' },
    { id: 'Standard English Conventions', label: 'Grammar & Conventions' },
    { id: 'Expression of Ideas', label: 'Expression & Transitions' }
  ];

  const availableDomains = section === 'math' ? mathDomains : section === 'reading_writing' ? rwDomains : [];

  // Derived available topics based on section & domain
  const availableTopics = useMemo(() => {
    let pool = ALL_QUESTIONS;
    if (section !== 'full') {
      pool = pool.filter(q => q.test === section);
    }
    if (domain !== 'all') {
      pool = pool.filter(q => q.domain.toLowerCase() === domain.toLowerCase());
    }
    const set = new Set(pool.map(q => q.skill).filter(Boolean));
    return Array.from(set).sort();
  }, [section, domain]);

  // Real-time calculation: Number of questions available matching current active filters
  const matchingQuestions = useMemo(() => {
    return ALL_QUESTIONS.filter(q => {
      if (section !== 'full' && q.test !== section) return false;
      if (domain !== 'all' && q.domain.toLowerCase() !== domain.toLowerCase()) return false;
      if (selectedTopics.length > 0 && !selectedTopics.some(t => t.toLowerCase() === q.skill.toLowerCase())) return false;
      if (difficulty !== 'all' && q.difficulty !== difficulty) return false;
      if (difficultyMix === 'hard' && (!q.isHardest && q.difficulty !== 'Hard')) return false;
      return true;
    });
  }, [section, domain, selectedTopics, difficulty, difficultyMix]);

  const availableCount = matchingQuestions.length;

  // Presets depending on section & available questions
  const getPresets = () => {
    if (section === 'full') {
      return [
        { count: 98, label: 'Official Full Exam', desc: '134 min • 2 Sec' },
        { count: 49, label: 'Mini Full SAT', desc: '67 min • 1 Mod' },
        { count: 20, label: 'Standard Drill', desc: '25 min' },
        { count: 10, label: 'Quick Sprint', desc: '12 min' }
      ];
    }
    if (section === 'math') {
      return [
        { count: 44, label: 'Official Math Exam', desc: '70 min • 2 Mod' },
        { count: 22, label: 'Official Module', desc: '35 min • 1 Mod' },
        { count: 15, label: 'Target Drill', desc: '20 min' },
        { count: 5, label: 'Quick Sprint', desc: '7 min' }
      ];
    }
    return [
      { count: 54, label: 'Official R&W Exam', desc: '64 min • 2 Mod' },
      { count: 27, label: 'Official Module', desc: '32 min • 1 Mod' },
      { count: 15, label: 'Target Drill', desc: '18 min' },
      { count: 5, label: 'Quick Sprint', desc: '6 min' }
    ];
  };

  const countError = useMemo(() => {
    if (!countInput.trim()) {
      return 'Please enter the number of questions.';
    }
    const val = Number(countInput);
    if (isNaN(val) || !Number.isInteger(val)) {
      return 'Please enter a valid whole number.';
    }
    if (val < 1) {
      return 'Please enter at least 1 question.';
    }
    if (availableCount > 0 && val > availableCount) {
      return `Entered ${val} questions, but only ${availableCount} match the selected criteria (maximum: ${availableCount}).`;
    }
    return null;
  }, [countInput, availableCount]);

  // Adjust count if available questions change and selected is higher
  useEffect(() => {
    if (availableCount > 0 && questionCount > availableCount) {
      setQuestionCount(availableCount);
      setCountInput(String(availableCount));
    }
  }, [availableCount]);

  const handleLaunch = () => {
    if (countError || availableCount === 0) return;
    play('achievement');
    onClose();

    const targetMode = quizType === 'exam' ? 'practice_test' : 'custom_drill';
    const domainQuery = domain !== 'all' ? `&domain=${encodeURIComponent(domain)}` : '';
    const topicQuery = selectedTopics.length > 0 ? `&topics=${encodeURIComponent(selectedTopics.join(','))}` : '';
    const diffQuery = difficulty !== 'all' ? `&difficulty=${difficulty}` : '';
    const diffMixQuery = difficultyMix !== 'balanced' ? `&diffMix=${difficultyMix}` : '';
    const effectiveCount = Math.min(Number(countInput) || questionCount, availableCount);

    navigate(`/sat/quiz?mode=${targetMode}&section=${section}&count=${effectiveCount}${domainQuery}${topicQuery}${diffQuery}${diffMixQuery}&timed=${isTimed}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl max-h-[92vh] bg-panel-solid border-2 border-blue-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* High-Contrast Header */}
        <div className="p-5 sm:p-6 bg-slate-900 border-b border-border-subtle flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400">
              <Sliders size={20} />
            </div>
            <div>
              <h3 className="font-black text-lg text-white">Custom SAT Quiz & Practice Test</h3>
              <p className="text-xs text-blue-200/80 font-bold">Configure test section, domain, topic, difficulty & pacing</p>
            </div>
          </div>

          <button
            onClick={() => { play('tap'); onClose(); }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
          {/* 1. Mode Selection: Exam vs Practice Drill */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-app-fg/50 block">
              1. Quiz Pacing & Experience Mode
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => { play('tap'); setQuizType('exam'); }}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                  quizType === 'exam'
                    ? 'bg-blue-500/15 border-blue-500 text-blue-500 dark:text-blue-400 shadow-md'
                    : 'bg-panel border-border-subtle hover:border-app-fg/30 text-app-fg/70'
                }`}
              >
                <div className="font-black text-xs flex items-center gap-1.5">
                  <BookOpen size={14} />
                  <span>Simulated Exam Mode</span>
                </div>
                <div className="text-[10px] text-app-fg/50 font-semibold mt-1">
                  Official Bluebook style: No answer spoilers during test; full score report at end.
                </div>
              </button>

              <button
                type="button"
                onClick={() => { play('tap'); setQuizType('drill'); }}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                  quizType === 'drill'
                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-md'
                    : 'bg-panel border-border-subtle hover:border-app-fg/30 text-app-fg/70'
                }`}
              >
                <div className="font-black text-xs flex items-center gap-1.5">
                  <Layers size={14} />
                  <span>Practice Drill Mode</span>
                </div>
                <div className="text-[10px] text-app-fg/50 font-semibold mt-1">
                  Immediate feedback: Nini coaching, archetype breakdown & video resources after each question.
                </div>
              </button>
            </div>
          </div>

          {/* 2. Test Section */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-app-fg/50 block">
              2. Test Section
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'full' as const, label: 'Full Test', desc: 'R&W + Math (Official: 98 Qs)', defaultCount: 98 },
                { id: 'math' as const, label: 'Math Only', desc: 'Section 2 (Official: 44 Qs)', defaultCount: 44 },
                { id: 'reading_writing' as const, label: 'R & W Only', desc: 'Section 1 (Official: 54 Qs)', defaultCount: 54 }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    play('tap');
                    setSection(opt.id);
                    setDomain('all');
                    setSelectedTopics([]);
                    setQuestionCount(opt.defaultCount);
                  }}
                  className={`p-3 rounded-2xl border-2 text-left transition-all ${
                    section === opt.id
                      ? 'bg-blue-500/15 border-blue-500 text-blue-500 dark:text-blue-400 shadow-md'
                      : 'bg-panel border-border-subtle hover:border-app-fg/30 text-app-fg/70'
                  }`}
                >
                  <div className="font-black text-xs">{opt.label}</div>
                  <div className="text-[10px] text-app-fg/50 font-bold mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Domain Filter */}
          {availableDomains.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-app-fg/50 block">
                3. Target Domain
              </label>
              <div className="flex flex-wrap gap-1.5">
                {availableDomains.map(d => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => {
                      play('tap');
                      setDomain(d.id);
                      setSelectedTopics([]);
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                      domain === d.id
                        ? 'bg-blue-500/20 border-blue-500 text-blue-500 dark:text-blue-400 font-black'
                        : 'bg-panel border-border-subtle text-app-fg/70 hover:border-app-fg/30'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 4. Topic Filter (Multi-Select) */}
          {availableTopics.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-app-fg/50 flex items-center gap-1.5">
                  <Filter size={12} className="text-blue-400" />
                  <span>4. Specific Topics (Skills)</span>
                  <span className="text-[10px] text-cyan-400 font-bold lowercase">
                    {selectedTopics.length === 0
                      ? '• all topics included'
                      : `• ${selectedTopics.length} selected`}
                  </span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      play('tap');
                      setSelectedTopics(availableTopics);
                    }}
                    className="text-[10px] font-bold text-cyan-400 hover:underline"
                  >
                    Select All
                  </button>
                  <span className="text-app-fg/30 text-xs">•</span>
                  <button
                    type="button"
                    onClick={() => {
                      play('tap');
                      setSelectedTopics([]);
                    }}
                    className="text-[10px] font-bold text-app-fg/50 hover:underline"
                  >
                    Reset (All)
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1.5 border border-border-subtle/50 rounded-2xl bg-panel/30">
                {availableTopics.map(t => {
                  const isSelected = selectedTopics.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        play('tap');
                        setSelectedTopics(prev =>
                          prev.includes(t)
                            ? prev.filter(item => item !== t)
                            : [...prev, t]
                        );
                      }}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                        isSelected
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-black shadow-sm'
                          : 'bg-panel border-border-subtle text-app-fg/70 hover:border-app-fg/30'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-md flex items-center justify-center text-[10px] border ${
                        isSelected ? 'bg-cyan-500 text-black border-cyan-400 font-black' : 'border-border-subtle bg-app-bg/50'
                      }`}>
                        {isSelected ? '✓' : ''}
                      </span>
                      <span>{t}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. Difficulty Filter */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-app-fg/50 block">
              5. Difficulty Level
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'all', label: 'All Levels' },
                { id: 'Easy', label: 'Easy (400-550)' },
                { id: 'Medium', label: 'Medium (550-680)' },
                { id: 'Hard', label: 'Hard (680-800)' }
              ].map(d => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => { play('tap'); setDifficulty(d.id); }}
                  className={`p-2.5 rounded-2xl border-2 text-center transition-all ${
                    difficulty === d.id
                      ? 'bg-violet-500/15 border-violet-500 text-violet-500 dark:text-violet-400 font-black shadow-sm'
                      : 'bg-panel border-border-subtle text-app-fg/70 hover:border-app-fg/30'
                  }`}
                >
                  <div className="font-black text-xs">{d.label.split(' ')[0]}</div>
                  <div className="text-[9px] text-app-fg/40 font-bold">{d.label.split(' ').slice(1).join(' ')}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 6. Difficulty Mix Curve */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-app-fg/50 block">
              6. Difficulty Mix & Weighting
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { play('tap'); setDifficultyMix('balanced'); }}
                className={`p-3 rounded-2xl border-2 text-left transition-all ${
                  difficultyMix === 'balanced'
                    ? 'bg-blue-500/10 border-blue-500 text-blue-400'
                    : 'bg-panel border-border-subtle text-app-fg/70'
                }`}
              >
                <div className="font-black text-xs flex items-center gap-1.5">
                  <Brain size={14} />
                  <span>Standard SAT Curve</span>
                </div>
                <div className="text-[10px] text-app-fg/40 font-bold mt-0.5">
                  Adaptive mix: Easy (25%), Medium (45%) & Hard (30%)
                </div>
              </button>

              <button
                type="button"
                onClick={() => { play('tap'); setDifficultyMix('hard'); }}
                className={`p-3 rounded-2xl border-2 text-left transition-all ${
                  difficultyMix === 'hard'
                    ? 'bg-pink-500/10 border-pink-500 text-pink-400'
                    : 'bg-panel border-border-subtle text-app-fg/70'
                }`}
              >
                <div className="font-black text-xs flex items-center gap-1.5">
                  <Sparkles size={14} />
                  <span>Hardest (700-800 Band)</span>
                </div>
                <div className="text-[10px] text-app-fg/40 font-bold mt-0.5">
                  Only hardest items and college board trap questions
                </div>
              </button>
            </div>
          </div>

          {/* 7. No of Questions Available (Real-time dynamic counter badge) */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <div className="flex items-center gap-2 text-xs font-black">
              <Zap size={16} className="text-cyan-400 fill-cyan-400" />
              <span>Questions Available:</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 font-black text-sm border border-cyan-500/30">
                {availableCount} Qs
              </span>
            </div>
            <span className="text-[11px] font-bold text-app-fg/60">
              {availableCount === 0
                ? '⚠️ No questions match this combination'
                : `${matchingQuestions.filter(q => q.difficulty === 'Hard').length} Hard • ${matchingQuestions.filter(q => q.difficulty === 'Medium').length} Med • ${matchingQuestions.filter(q => q.difficulty === 'Easy').length} Easy`}
            </span>
          </div>

          {/* 8. Select No of Questions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-app-fg/50 block">
                8. Select Number of Questions: <strong className="text-cyan-400">{!countError ? `${Math.min(questionCount, Math.max(1, availableCount))} Qs` : 'Invalid'}</strong>
              </label>
              <button
                type="button"
                onClick={() => {
                  play('tap');
                  setQuestionCount(availableCount);
                  setCountInput(String(availableCount));
                }}
                className="text-[11px] font-bold text-cyan-400 hover:underline flex items-center gap-1"
              >
                <CheckCircle2 size={12} />
                <span>All Available ({availableCount})</span>
              </button>
            </div>

            {/* Direct Number Input Field + Quick All Available button */}
            <div className="flex items-center gap-2.5">
              <div className="relative flex-1">
                <input
                  type="number"
                  min={1}
                  max={Math.max(1, availableCount)}
                  value={countInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCountInput(val);
                    const num = Number(val);
                    if (!isNaN(num) && num >= 1 && num <= availableCount) {
                      setQuestionCount(num);
                    }
                  }}
                  placeholder={`1 to ${availableCount} questions`}
                  className={clsx(
                    "w-full px-4 py-2.5 rounded-2xl bg-panel border-2 text-app-fg font-black text-sm outline-none transition-all",
                    countError
                      ? "border-rose-500 bg-rose-500/10 text-rose-500 focus:border-rose-500"
                      : "border-border-subtle focus:border-cyan-400"
                  )}
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-app-fg/40 pointer-events-none">
                  Questions
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  play('tap');
                  setQuestionCount(availableCount);
                  setCountInput(String(availableCount));
                }}
                className="px-4 py-2.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 hover:bg-cyan-500/25 text-cyan-400 hover:text-cyan-300 font-black text-xs flex items-center gap-1.5 transition-all shrink-0"
              >
                <CheckCircle2 size={13} />
                <span>Max ({availableCount})</span>
              </button>
            </div>

            {/* Error Message if entered count exceeds available questions */}
            {countError && (
              <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-500 dark:text-rose-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <AlertTriangle size={15} className="shrink-0 text-rose-500" />
                <span>{countError}</span>
              </div>
            )}

            {/* Slider */}
            {availableCount > 1 && (
              <div className="px-1 pt-1">
                <input
                  type="range"
                  min={1}
                  max={Math.max(1, availableCount)}
                  value={Math.min(Math.max(1, Number(countInput) || 1), availableCount)}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setQuestionCount(val);
                    setCountInput(String(val));
                  }}
                  className="w-full h-2 bg-panel rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] font-bold text-app-fg/40 mt-1">
                  <span>1 Q</span>
                  <span>{Math.round(availableCount / 2)} Qs</span>
                  <span>{availableCount} Qs (Max)</span>
                </div>
              </div>
            )}

            {/* Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {getPresets().map(c => {
                const countVal = Math.min(c.count, availableCount);
                const isSelected = !countError && questionCount === c.count && questionCount <= availableCount;
                return (
                  <button
                    key={c.count}
                    type="button"
                    onClick={() => {
                      play('tap');
                      setQuestionCount(countVal);
                      setCountInput(String(countVal));
                    }}
                    className={`p-2.5 rounded-2xl border-2 text-center transition-all ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-500 text-cyan-600 dark:text-cyan-400 shadow-md font-black'
                        : 'bg-panel border-border-subtle hover:border-app-fg/30 text-app-fg/70'
                    }`}
                  >
                    <div className="font-black text-sm">{c.count} Qs</div>
                    <div className="text-[10px] text-app-fg/60 font-bold truncate">{c.label}</div>
                    <div className="text-[9px] text-app-fg/40 font-semibold">{c.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 9. Timed Bluebook Mode */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-panel border border-border-subtle">
            <div className="flex items-center gap-2.5">
              <Clock size={16} className="text-blue-400" />
              <div>
                <div className="text-xs font-black text-app-fg">9. Timed Bluebook Mode</div>
                <div className="text-[10px] font-bold text-app-fg/50">Simulates real exam clock countdown (~80s per question)</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => { play('toggle'); setIsTimed(!isTimed); }}
              className={`w-12 h-7 rounded-full transition-colors relative p-1 ${
                isTimed ? 'bg-blue-500' : 'bg-app-bg'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  isTimed ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-4 sm:p-5 bg-panel border-t border-border-subtle flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs font-bold text-app-fg/60 hidden sm:block">
            Estimated Duration: <strong className="text-app-fg">{Math.round((Math.min(questionCount, Math.max(1, availableCount)) * 80) / 60)} mins</strong>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-border-subtle text-xs font-bold text-app-fg/70 hover:text-app-fg hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={Boolean(countError) || availableCount === 0}
              onClick={handleLaunch}
              className="btn-duo btn-duo-green px-7 py-2.5 text-xs flex items-center gap-2 shadow-none disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Play size={14} />
              <span>
                {availableCount === 0
                  ? 'No Questions Match Criteria'
                  : countError
                  ? 'Enter Valid Count'
                  : `Launch ${quizType === 'exam' ? 'Exam' : 'Drill'} (${Math.min(Number(countInput) || questionCount, availableCount)} Qs)`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

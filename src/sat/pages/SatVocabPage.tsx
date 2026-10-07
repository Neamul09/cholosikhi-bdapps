import { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Star,
  Check,
  RotateCw,
  Sparkles,
  HelpCircle,
  ChevronRight,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Shuffle
} from 'lucide-react';
import { clsx } from 'clsx';
import { SAT_VOCAB_LIST } from '../data/vocabData';
import { getPairedQuestionForVocab } from '../data/vocabQuestions';
import { loadSatUserState, updateVocabMastery, recordSatAttempt } from '../lib/satStorage';
import type { SatVocabItem, SatQuestion } from '../types';
import MathRenderer from '../components/MathRenderer';
import { play } from '../../lib/audio';

export default function SatVocabPage() {
  const [userState, setUserState] = useState(loadSatUserState);
  const [viewMode, setViewMode] = useState<'flashcards' | 'quiz'>('flashcards');
  const [search, setSearch] = useState('');
  const [questionFilter, setQuestionFilter] = useState<'all' | 'with-questions'>('all');
  const [vocabList, setVocabList] = useState<SatVocabItem[]>(() => SAT_VOCAB_LIST);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filterMastery, setFilterMastery] = useState<'all' | 'learning' | 'mastered'>('all');

  // Quiz-specific state
  const [quizAnswer, setQuizAnswer] = useState('');
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

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

  const handleShuffle = () => {
    play('toggle');
    setVocabList(prev => {
      const copy = [...prev];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    });
    setActiveCardIndex(0);
    setIsFlipped(false);
    setQuizAnswer('');
    setIsQuizSubmitted(false);
  };

  const filteredList = useMemo(() => {
    return vocabList.filter(v => {
      if (questionFilter === 'with-questions' && !v.pairedQuestionId) return false;
      const status = userState.vocabMastery[v.id] || 'learning';
      if (filterMastery === 'mastered' && status !== 'mastered') return false;
      if (filterMastery === 'learning' && status === 'mastered') return false;
      if (search) {
        const q = search.toLowerCase();
        const matchWord = v.word.toLowerCase().includes(q);
        const matchDef = v.definition.toLowerCase().includes(q);
        const matchSyn = v.synonyms?.some(s => s.toLowerCase().includes(q));
        if (!matchWord && !matchDef && !matchSyn) return false;
      }
      return true;
    });
  }, [vocabList, questionFilter, userState.vocabMastery, filterMastery, search]);

  const currentCard: SatVocabItem | undefined = filteredList[activeCardIndex] || filteredList[0];
  const pairedQuestion: SatQuestion | undefined = useMemo(() => {
    if (!currentCard) return undefined;
    return getPairedQuestionForVocab(currentCard);
  }, [currentCard]);

  const handleNextCard = () => {
    play('tap');
    setIsFlipped(false);
    setQuizAnswer('');
    setIsQuizSubmitted(false);
    setActiveCardIndex(prev => (prev + 1 < filteredList.length ? prev + 1 : 0));
  };

  const handleNextQuestionCard = () => {
    play('tap');
    setIsFlipped(false);
    setQuizAnswer('');
    setIsQuizSubmitted(false);
    const nextIdx = filteredList.findIndex((v, i) => i > activeCardIndex && !!v.pairedQuestionId);
    if (nextIdx !== -1) {
      setActiveCardIndex(nextIdx);
    } else {
      const wrapIdx = filteredList.findIndex(v => !!v.pairedQuestionId);
      setActiveCardIndex(wrapIdx !== -1 ? wrapIdx : 0);
    }
  };

  const handleToggleFlip = () => {
    play('toggle');
    setIsFlipped(!isFlipped);
  };

  const handleMarkMastered = (item: SatVocabItem) => {
    play('correct');
    updateVocabMastery(item.id, 'mastered');
    setUserState(loadSatUserState());
    handleNextCard();
  };

  const handleCheckQuizAnswer = () => {
    if (!pairedQuestion || !quizAnswer.trim() || isQuizSubmitted) return;
    play('tap');
    setIsQuizSubmitted(true);

    const isCorrect = pairedQuestion.correctAnswers.includes(quizAnswer.trim());
    if (isCorrect) {
      play('correct');
      if (currentCard) {
        updateVocabMastery(currentCard.id, 'mastered');
      }
    } else {
      play('incorrect');
    }

    recordSatAttempt({
      questionId: pairedQuestion.id,
      selectedAnswer: quizAnswer.trim(),
      isCorrect,
      timeSpentSeconds: 35,
      section: pairedQuestion.test,
      microType: pairedQuestion.microType,
      difficulty: pairedQuestion.difficulty
    });

    setUserState(loadSatUserState());
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="glass p-8 sm:p-10 rounded-[3rem] border border-violet-500/20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/30 text-violet-400 flex items-center justify-center mx-auto">
          <BookOpen size={30} />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-wider text-violet-400">
            Digital SAT Words in Context
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-app-fg">
            Vocabulary Vault & Quiz
          </h1>
          <p className="text-xs sm:text-sm font-bold text-app-fg/60 max-w-lg mx-auto">
            Learn high-yield SAT vocabulary, second meanings, and immediately test your skills against real contextual questions from the question bank.
          </p>
        </div>

        {/* Mode Selector / Switcher Separator */}
        <div className="pt-3 flex flex-col items-center gap-2">
          <div
            role="tablist"
            aria-label="Vocabulary practice mode"
            className="p-1.5 sm:p-2 rounded-2xl sm:rounded-full bg-slate-900/90 dark:bg-black/90 border-2 border-violet-500/60 shadow-2xl shadow-violet-500/25 flex flex-col sm:flex-row items-center gap-2 backdrop-blur-xl"
          >
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'flashcards'}
              onClick={() => { play('toggle'); setViewMode('flashcards'); }}
              className={clsx(
                "w-full sm:w-auto px-6 py-3 rounded-xl sm:rounded-full text-xs sm:text-sm font-black transition-all duration-200 flex items-center justify-center gap-2.5 select-none",
                viewMode === 'flashcards'
                  ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-violet-600/50 border border-violet-300/40 scale-[1.02]"
                  : "text-slate-300 hover:text-white hover:bg-white/10 border border-transparent"
              )}
            >
              <RotateCw size={16} className={clsx("transition-transform duration-300", viewMode === 'flashcards' ? "text-amber-300 rotate-180" : "text-slate-400")} />
              <span>Spaced Flashcards</span>
              {viewMode === 'flashcards' ? (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/15 text-slate-300">
                  Study
                </span>
              )}
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'quiz'}
              onClick={() => { play('toggle'); setViewMode('quiz'); }}
              className={clsx(
                "w-full sm:w-auto px-6 py-3 rounded-xl sm:rounded-full text-xs sm:text-sm font-black transition-all duration-200 flex items-center justify-center gap-2.5 select-none",
                viewMode === 'quiz'
                  ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-violet-600/50 border border-violet-300/40 scale-[1.02]"
                  : "text-slate-300 hover:text-white hover:bg-white/10 border border-transparent"
              )}
            >
              <HelpCircle size={16} className={clsx("transition-transform duration-300", viewMode === 'quiz' ? "text-amber-300" : "text-slate-400")} />
              <span>Context Question Quiz</span>
              {viewMode === 'quiz' ? (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/15 text-slate-300">
                  Official Qs
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-app-fg/40" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setActiveCardIndex(0);
            }}
            placeholder="Search high-frequency words, synonyms, or definitions..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-panel border border-border-subtle text-app-fg font-bold text-xs focus:outline-none focus:border-violet-500"
          />
        </div>

        {/* Question Filter Toggle */}
        <div className="flex rounded-2xl bg-panel p-1 border border-border-subtle w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={() => {
              play('toggle');
              setQuestionFilter('all');
              setActiveCardIndex(0);
            }}
            className={clsx(
              "px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5",
              questionFilter === 'all'
                ? "bg-violet-600 text-white shadow-sm"
                : "text-app-fg/60 hover:text-app-fg"
            )}
          >
            <span>All Words</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/15">
              {vocabList.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              play('toggle');
              setQuestionFilter('with-questions');
              setActiveCardIndex(0);
            }}
            className={clsx(
              "px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5",
              questionFilter === 'with-questions'
                ? "bg-violet-600 text-white shadow-sm"
                : "text-app-fg/60 hover:text-app-fg"
            )}
          >
            <Sparkles size={12} className={questionFilter === 'with-questions' ? "text-amber-300" : "text-app-fg/40"} />
            <span>With SAT Qs</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/15">
              691
            </span>
          </button>
        </div>

        {/* Shuffle Button */}
        <button
          type="button"
          onClick={handleShuffle}
          title="Shuffle randomized practice order"
          className="px-3.5 py-2.5 rounded-2xl bg-panel border border-border-subtle hover:border-violet-500/50 text-app-fg/70 hover:text-app-fg transition-all text-xs font-black flex items-center justify-center gap-1.5 shrink-0"
        >
          <Shuffle size={14} className="text-violet-400" />
          <span className="hidden sm:inline">Shuffle</span>
        </button>

        <div className="flex gap-1.5 w-full sm:w-auto">
          {(['all', 'learning', 'mastered'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => {
                play('toggle');
                setFilterMastery(tab);
                setActiveCardIndex(0);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-black capitalize transition-all ${
                filterMastery === tab
                  ? 'bg-violet-500 text-white'
                  : 'bg-panel border border-border-subtle text-app-fg/60 hover:text-app-fg'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Mode 1: Spaced Flashcard Mode ───────────────────────────── */}
      {viewMode === 'flashcards' && currentCard && (
        <div className="max-w-xl mx-auto" style={{ perspective: '1200px' }}>
          <div
            onClick={handleToggleFlip}
            className="w-full h-84 sm:h-96 relative cursor-pointer select-none transition-transform duration-500 ease-out"
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
          >
            {/* Front Face */}
            <div
              className="absolute inset-0 rounded-[2.5rem] sm:rounded-[3rem] p-7 sm:p-9 border-2 flex flex-col justify-between shadow-2xl glass border-border-subtle hover:border-violet-500/40 transition-colors"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-violet-400">
                    Card {activeCardIndex + 1} of {filteredList.length}
                  </span>
                  {currentCard.pairedQuestionId ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-1">
                      <Sparkles size={10} className="text-emerald-400" /> SAT Question
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300">
                      High-Yield Vocab
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: currentCard.frequencyRating || 3 }).map((_, i) => (
                    <Star key={i} size={13} fill="currentColor" />
                  ))}
                </div>
              </div>

              <div className="text-center space-y-3 my-auto">
                <span className="text-xs px-2.5 py-1 rounded-full bg-panel border border-border-subtle uppercase font-black text-app-fg/60">
                  {currentCard.partOfSpeech}
                </span>
                <h2 className="text-4xl sm:text-5xl font-black capitalize text-app-fg tracking-tight">
                  {currentCard.word}
                </h2>
                <p className="text-sm font-bold text-violet-400 font-mono">
                  {currentCard.phonetic}
                </p>
                {currentCard.synonyms && currentCard.synonyms.length > 0 && (
                  <p className="text-xs font-medium text-app-fg/70 max-w-sm mx-auto">
                    Synonyms: <span className="font-bold text-app-fg">{currentCard.synonyms.join(', ')}</span>
                  </p>
                )}
                <p className="text-xs font-bold text-app-fg/40 pt-2 flex items-center justify-center gap-1.5">
                  <RotateCw size={13} />
                  <span>Click or tap to flip card</span>
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border-subtle/40">
                <span className="text-[11px] font-bold text-app-fg/40">Tap card to flip for definition & context</span>
                <span className="text-[11px] font-bold text-violet-400">Flip ↻</span>
              </div>
            </div>

            {/* Back Face */}
            <div
              className="absolute inset-0 rounded-[2.5rem] sm:rounded-[3rem] p-7 sm:p-9 border-2 flex flex-col justify-between shadow-2xl bg-gradient-to-br from-violet-950/60 via-panel-solid to-slate-900 border-violet-500/50"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="font-black text-lg capitalize text-app-fg">{currentCard.word}</span>
                  <span className="text-xs text-violet-400 font-bold">{currentCard.phonetic}</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-md bg-panel border border-border-subtle uppercase font-bold text-app-fg/60">
                  {currentCard.partOfSpeech}
                </span>
              </div>

              <div className="space-y-3.5 my-auto text-left">
                <div className="p-4 rounded-2xl bg-blue-500/15 border border-blue-500/30">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 block mb-1">
                    Definition & Core Meaning
                  </span>
                  <p className="text-sm sm:text-base font-bold text-app-fg leading-relaxed">
                    {currentCard.definition}
                  </p>
                </div>

                {currentCard.synonyms && currentCard.synonyms.length > 0 && (
                  <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-xs">
                    <span className="font-bold text-violet-400">Key Synonyms: </span>
                    <span className="font-bold text-app-fg">{currentCard.synonyms.join(', ')}</span>
                  </div>
                )}

                <div className="p-2.5 rounded-xl bg-panel border border-border-subtle text-[11px] italic font-bluebook-serif text-app-fg/90">
                  "{currentCard.contextSentence}"
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border-subtle/40">
                <span className="text-[11px] font-bold text-app-fg/40">Tap to flip back</span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkMastered(currentCard);
                  }}
                  className="btn-duo btn-duo-green px-4 py-1.5 text-xs flex items-center gap-1.5 shadow-none"
                >
                  <Check size={13} />
                  <span>Mark Mastered</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-6">
            <button
              onClick={handleToggleFlip}
              className="px-6 py-3 rounded-2xl bg-panel border border-border-subtle text-xs font-black text-app-fg hover:bg-white/10 transition-all"
            >
              Flip Card ↻
            </button>
            <button
              onClick={handleNextCard}
              className="btn-duo btn-duo-blue px-8 py-3 text-xs"
            >
              Next Word →
            </button>
          </div>
        </div>
      )}

      {/* ─── Mode 2: Context Question Quiz Mode ──────────────────────── */}
      {viewMode === 'quiz' && currentCard && (
        <div className="space-y-6">
          {/* Top Vocab Summary Card */}
          <div className="glass p-6 rounded-3xl border border-violet-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 uppercase">
                  Word {activeCardIndex + 1} of {filteredList.length}
                </span>
                {currentCard.pairedQuestionId ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-1">
                    <Sparkles size={10} className="text-emerald-400" /> Official SAT Match
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300">
                    Vocabulary Vault
                  </span>
                )}
                <span className="text-xs font-bold text-app-fg/50">{currentCard.partOfSpeech}</span>
              </div>
              <h2 className="text-3xl font-black capitalize text-app-fg tracking-tight">
                {currentCard.word}
              </h2>
              <p className="text-sm font-bold text-app-fg/80">
                {currentCard.definition}
              </p>
              {currentCard.synonyms && currentCard.synonyms.length > 0 && (
                <p className="text-xs font-semibold text-violet-400">
                  Synonyms: <span className="text-app-fg">{currentCard.synonyms.join(', ')}</span>
                </p>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-panel border border-border-subtle shrink-0 text-left sm:text-right">
              <span className="text-[10px] font-black uppercase tracking-wider text-violet-400 block">Phonetic</span>
              <p className="text-base font-bold text-app-fg mt-0.5">
                {currentCard.phonetic}
              </p>
            </div>
          </div>

          {/* ─── Highly Noticeable Flashcard / Question Separator ─── */}
          <div className="relative py-4 flex items-center justify-center my-1">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t-2 border-dashed border-violet-500/50" />
            </div>
            <div className="relative flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-panel-solid border-2 border-violet-500 shadow-xl shadow-violet-500/20 text-app-fg text-xs font-black tracking-wide uppercase">
              <Sparkles size={16} className="text-amber-400 animate-pulse" />
              <span>Official College Board Practice Question</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-extrabold">
                Authentic SAT ↓
              </span>
            </div>
          </div>

          {/* Paired Question from Question Bank */}
          {pairedQuestion ? (
            <div className="glass p-6 sm:p-8 rounded-[2.5rem] border border-border-subtle space-y-6">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3 gap-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-wider text-app-fg">
                    Official College Board Question
                  </span>
                  {pairedQuestion.vocabRelation?.matchType === 'direct_option' && (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      Direct Match: Tests <strong className="underline capitalize">{currentCard.word}</strong> in options
                    </span>
                  )}
                  {pairedQuestion.vocabRelation?.matchType === 'inflection_option' && (
                    <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                      Form Match: Tests <strong className="underline">"{pairedQuestion.vocabRelation.matchedTerm}"</strong>
                    </span>
                  )}
                  {pairedQuestion.vocabRelation?.matchType === 'synonym_option' && (
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                      Synonym Match: Tests <strong className="underline">"{pairedQuestion.vocabRelation.synonym || pairedQuestion.vocabRelation.matchedTerm}"</strong> (synonym of {currentCard.word})
                    </span>
                  )}
                  {pairedQuestion.vocabRelation?.matchType?.startsWith('passage') && (
                    <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/30">
                      Passage Context: <strong className="underline capitalize">{currentCard.word}</strong> in text
                    </span>
                  )}
                  {(!pairedQuestion.vocabRelation || pairedQuestion.vocabRelation?.matchType === 'wic_archetype') && (
                    <span className="text-xs font-bold text-violet-300 bg-violet-500/20 px-2.5 py-0.5 rounded-full border border-violet-500/30">
                      Words in Context Practice ({currentCard.difficulty || 'Medium'})
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-panel border border-border-subtle text-app-fg/50">
                    ID: {pairedQuestion.id}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-panel border border-border-subtle text-app-fg/60">
                    {pairedQuestion.difficulty}
                  </span>
                </div>
              </div>

              {/* Passage if present */}
              {pairedQuestion.stimulus && (
                <div className="p-4 sm:p-5 rounded-2xl bg-panel/50 border border-border-subtle font-bluebook-serif text-sm leading-relaxed text-app-fg/90">
                  <MathRenderer content={pairedQuestion.stimulus} />
                </div>
              )}

              {/* Question Stem */}
              <div className="font-bluebook-serif text-base sm:text-lg leading-relaxed text-app-fg font-medium">
                <MathRenderer content={pairedQuestion.stem} />
              </div>

              {/* Options */}
              {pairedQuestion.options && (
                <div className="space-y-3">
                  {pairedQuestion.options.map((opt) => {
                    const isSelected = quizAnswer === opt.id;
                    const isCorrectOpt = pairedQuestion.correctAnswers.includes(opt.id);

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          if (!isQuizSubmitted) {
                            play('tap');
                            setQuizAnswer(opt.id);
                          }
                        }}
                        disabled={isQuizSubmitted}
                        className={clsx(
                          "w-full p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3.5",
                          !isQuizSubmitted && isSelected && "bg-violet-500/10 border-violet-500 text-violet-400 shadow-md",
                          !isQuizSubmitted && !isSelected && "bg-panel border-border-subtle hover:border-app-fg/30 text-app-fg",
                          isQuizSubmitted && isCorrectOpt && "bg-emerald-500/15 border-emerald-500 text-emerald-400 font-bold",
                          isQuizSubmitted && isSelected && !isCorrectOpt && "bg-rose-500/15 border-rose-500 text-rose-400 font-bold",
                          isQuizSubmitted && !isSelected && !isCorrectOpt && "bg-panel border-border-subtle opacity-60"
                        )}
                      >
                        <span className={clsx(
                          "w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center shrink-0 border transition-colors",
                          isQuizSubmitted
                            ? isCorrectOpt
                              ? "bg-emerald-600 text-white border-emerald-600"
                              : isSelected
                              ? "bg-rose-600 text-white border-rose-600"
                              : "bg-slate-200 dark:bg-slate-800 text-slate-500 opacity-60"
                            : isSelected
                            ? "bg-violet-600 text-white border-violet-600"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                        )}>
                          {opt.id}
                        </span>
                        <div className="flex-1 font-bluebook-serif text-sm sm:text-base leading-snug">
                          <MathRenderer content={opt.content} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                {!isQuizSubmitted ? (
                  <button
                    onClick={handleCheckQuizAnswer}
                    disabled={!quizAnswer.trim()}
                    className="btn-duo btn-duo-blue px-6 py-3 text-xs font-black disabled:opacity-40"
                  >
                    Check Answer
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleNextCard}
                      className="btn-duo btn-duo-green px-6 py-3 text-xs font-black flex items-center gap-2"
                    >
                      <span>Next Word & Question</span>
                      <ChevronRight size={15} />
                    </button>

                    <button
                      onClick={() => {
                        play('tap');
                        setQuizAnswer('');
                        setIsQuizSubmitted(false);
                      }}
                      className="px-4 py-3 rounded-2xl bg-panel border border-border-subtle text-xs font-bold text-app-fg/70 hover:text-app-fg flex items-center gap-1.5"
                    >
                      <RotateCcw size={14} />
                      <span>Retry</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Rationale feedback */}
              {isQuizSubmitted && (
                <div className="p-5 rounded-3xl bg-panel border border-border-subtle space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-400">
                    {pairedQuestion.correctAnswers.includes(quizAnswer) ? (
                      <>
                        <CheckCircle2 size={16} />
                        <span>Correct! Word Mastered (+25 XP)</span>
                      </>
                    ) : (
                      <>
                        <XCircle size={16} className="text-rose-400" />
                        <span className="text-rose-400">Incorrect — Review the Context Below</span>
                      </>
                    )}
                  </div>
                  {pairedQuestion.rationale && (
                    <div className="text-xs sm:text-sm font-semibold text-app-fg/90 leading-relaxed font-bluebook-serif">
                      <MathRenderer content={pairedQuestion.rationale} />
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="glass p-8 sm:p-10 rounded-[2.5rem] border border-violet-500/25 text-center space-y-5 animate-fadeIn">
              <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/25 text-violet-400 flex items-center justify-center mx-auto">
                <BookOpen size={28} />
              </div>
              <div className="space-y-2 max-w-lg mx-auto">
                <span className="text-[10px] font-black uppercase tracking-wider text-violet-400">
                  Vocabulary Study Note
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-app-fg">
                  No Official Question Bank Item for "{currentCard.word}"
                </h3>
                <p className="text-xs sm:text-sm font-medium text-app-fg/70 leading-relaxed">
                  Only released official College Board questions containing this word are shown (no artificial or mismatched questions). Master <strong className="text-app-fg font-black">"{currentCard.word}"</strong> using its definition, synonyms, and context sentence on the flashcard!
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    play('toggle');
                    setViewMode('flashcards');
                  }}
                  className="btn-duo btn-duo-purple px-5 py-2.5 text-xs font-black flex items-center gap-2"
                >
                  <RotateCw size={14} />
                  <span>Study on Flashcard</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextQuestionCard}
                  className="btn-duo btn-duo-blue px-5 py-2.5 text-xs font-black flex items-center gap-2"
                >
                  <span>Next Word with SAT Question</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

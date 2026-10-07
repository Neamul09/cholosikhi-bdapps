import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Skull, Play, ShieldAlert, ChevronRight, Shuffle, CheckCircle2 } from 'lucide-react';
import { getHardestQuestions } from '../data/questionsRepo';
import { MICRO_TYPE_MAP } from '../data/microtypes';
import { getQuestionStatus } from '../lib/satStorage';
import MathRenderer from '../components/MathRenderer';
import { play } from '../../lib/audio';

export default function SatHardestVault() {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState<'all' | 'math' | 'reading_writing'>('all');
  const [shuffleKey, setShuffleKey] = useState(0);

  // Sync with storage updates when questions are solved
  const [storageCounter, setStorageCounter] = useState(0);
  useEffect(() => {
    const handleUpdate = () => setStorageCounter(prev => prev + 1);
    window.addEventListener('sat_state_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('sat_state_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const { unsolvedQuestions, solvedQuestions, totalHardest } = useMemo(() => {
    void storageCounter;
    const allHard = getHardestQuestions().filter(q =>
      selectedSection === 'all' ? true : q.test === selectedSection
    );

    const unsolved: typeof allHard = [];
    const solved: typeof allHard = [];

    for (const q of allHard) {
      const status = getQuestionStatus(q.id);
      if (status.status === 'solved') {
        solved.push(q);
      } else {
        unsolved.push(q);
      }
    }

    // Shuffle unsolved randomly on top using deterministic PRNG seeded by shuffleKey
    let seed = (shuffleKey + 1) * 2654435761;
    const nextRandom = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    const shuffledUnsolved = [...unsolved];
    for (let i = shuffledUnsolved.length - 1; i > 0; i--) {
      const j = Math.floor(nextRandom() * (i + 1));
      [shuffledUnsolved[i], shuffledUnsolved[j]] = [shuffledUnsolved[j], shuffledUnsolved[i]];
    }

    return {
      unsolvedQuestions: shuffledUnsolved,
      solvedQuestions: solved,
      totalHardest: allHard.length
    };
  }, [selectedSection, shuffleKey, storageCounter]);

  const displayedQuestions = useMemo(() => {
    return [...unsolvedQuestions, ...solvedQuestions];
  }, [unsolvedQuestions, solvedQuestions]);

  return (
    <div className="space-y-10 pb-20">
      {/* Header Banner */}
      <div className="glass p-8 sm:p-12 rounded-[3.5rem] border border-pink-500/30 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-black uppercase tracking-wider">
            <Skull size={14} />
            <span>The Hardest Questions Vault</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-app-fg">
            The Notorious 800-Level <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-rose-500">
              Trap Questions.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-app-fg/60 font-bold leading-relaxed">
            Not just questions with a generic "Hard" label, but the authentic high-complexity multi-step questions from the College Board Question Bank with low historical pass rates.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                play('tap');
                navigate('/sat/quiz?mode=hardest');
              }}
              className="btn-duo btn-duo-red px-8 py-3.5 text-sm flex items-center gap-2"
            >
              <Play size={16} fill="currentColor" />
              <span>Launch Hardest 10-Question Gauntlet</span>
            </button>

            <button
              onClick={() => {
                play('toggle');
                setShuffleKey(prev => prev + 1);
              }}
              className="px-4 py-3 rounded-2xl bg-panel border border-border-subtle hover:border-pink-500/40 text-xs font-black text-app-fg/80 hover:text-app-fg flex items-center gap-2 transition-all shadow-sm"
              title="Re-randomize unsolved hardest questions"
            >
              <Shuffle size={15} className="text-pink-400" />
              <span>Shuffle Unsolved</span>
            </button>
          </div>
        </div>

        <div className="w-32 h-32 rounded-3xl bg-pink-500/10 border-2 border-pink-500/30 flex items-center justify-center text-pink-400 shadow-2xl shrink-0">
          <Skull size={64} />
        </div>
      </div>

      {/* Filter Tabs & Counters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {(['all', 'math', 'reading_writing'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => {
                play('toggle');
                setSelectedSection(tab);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                selectedSection === tab
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'bg-panel border border-border-subtle text-app-fg/70 hover:text-app-fg'
              }`}
            >
              {tab === 'all' ? 'All Hardest' : tab === 'math' ? 'Math Gauntlet' : 'Reading & Writing'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5 text-xs font-bold text-app-fg/60">
          <span className="px-2.5 py-1 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-400 font-black">
            {unsolvedQuestions.length} Unsolved (Randomized)
          </span>
          {solvedQuestions.length > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-black flex items-center gap-1">
              <CheckCircle2 size={12} />
              <span>{solvedQuestions.length} Solved at Bottom</span>
            </span>
          )}
          <span className="hidden md:inline text-app-fg/40 font-medium">
            (Total: {totalHardest})
          </span>
        </div>
      </div>

      {/* Questions List: Unsolved randomized on top, solved at bottom */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedQuestions.map((q, idx) => {
          const microInfo = MICRO_TYPE_MAP.get(q.microType);
          const isSolved = getQuestionStatus(q.id).status === 'solved';

          return (
            <div
              key={q.id}
              className={`glass p-6 sm:p-8 rounded-3xl border transition-all flex flex-col justify-between space-y-5 ${
                isSolved
                  ? 'border-emerald-500/30 bg-emerald-950/5 hover:border-emerald-500/50 opacity-90'
                  : 'border-pink-500/20 hover:border-pink-500/40'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
                      <ShieldAlert size={13} />
                      <span>Band {q.scoreBand || 7} • {q.domain}</span>
                    </span>
                    {isSolved && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 size={11} />
                        <span>Solved</span>
                      </span>
                    )}
                  </div>

                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-panel border border-border-subtle font-black text-app-fg/50">
                    Q #{idx + 1}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-black text-app-fg mb-1">
                    {microInfo?.title || q.skill}
                  </h4>
                  <p className="text-xs text-app-fg/50 font-bold">
                    Skill: {q.skill}
                  </p>
                </div>

                {/* Stimulus preview if any */}
                {q.stimulus && (
                  <div className="p-4 rounded-xl bg-panel border border-border-subtle/70 text-xs font-bluebook-serif italic text-app-fg/80 max-h-48 overflow-y-auto">
                    <MathRenderer content={q.stimulus} isSerif={true} />
                  </div>
                )}

                {/* Stem preview */}
                <div className="p-4 rounded-xl bg-app-bg/60 border border-border-subtle/50 text-sm font-bold text-app-fg leading-relaxed">
                  <MathRenderer content={q.stem} />
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  play('tap');
                  navigate(`/sat/quiz?mode=hardest_drill&microType=${q.microType}&questionId=${q.id}`);
                }}
                className={`w-full py-3 text-xs flex items-center justify-center gap-2 ${
                  isSolved ? 'btn-duo btn-duo-green' : 'btn-duo btn-duo-red'
                }`}
              >
                <span>{isSolved ? 'Review / Retry Question' : 'Tackle This Question Now'}</span>
                <ChevronRight size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

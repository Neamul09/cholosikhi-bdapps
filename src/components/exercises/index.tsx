import React, { useState, useMemo, useEffect } from 'react';
import { Reorder } from 'framer-motion';
import { clsx } from 'clsx';
import { useSettingsStore } from '@/store/settingsStore';
import type {
  MCQExercise as MCQType,
  FillBlankExercise as FillType,
  OutputPredictExercise as OutputType,
  BugHuntExercise as BugType,
  CodeArrangeExercise as ArrangeType,
} from '@/content/schema';

// ── Shared colour tokens ───────────────────────────────────────
const C = {
  correct:   'bg-cyan-500/10  border-cyan-400  text-cyan-300',
  wrong:     'bg-pink-500/10  border-pink-400  text-pink-300  animate-shake',
  dimmed:    'opacity-30 grayscale',
  badge_c:   'border-cyan-400 text-cyan-400',
  badge_w:   'border-pink-400 text-pink-400',
  badge_dim: 'border-[var(--border-subtle)] text-[var(--app-fg-muted)]',
};

// ── MCQ ───────────────────────────────────────────────────────
export function MCQExercise({
  exercise, onAnswer,
}: { exercise: MCQType; onAnswer: (correct: boolean) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const { language } = useSettingsStore();

  const shuffledOptions = useMemo(() => {
    return exercise.options.map((opt, originalIndex) => ({ opt, originalIndex })).sort(() => Math.random() - 0.5);
  }, [exercise.id]);

  const handleSelect = (originalIndex: number) => {
    if (answered) return;
    setSelected(originalIndex);
    setAnswered(true);
    setTimeout(() => onAnswer(originalIndex === exercise.correctIndex), 600);
  };

  return (
    <div className="space-y-4">
      {exercise.code && (
        <div className="code-block mb-6 overflow-x-auto">
          <pre className="mono text-sm whitespace-pre-wrap">{exercise.code}</pre>
        </div>
      )}
      <div className="grid grid-cols-1 gap-3">
        {shuffledOptions.map(({ opt, originalIndex }, displayIdx) => {
          const isCorrect  = originalIndex === exercise.correctIndex;
          const isSelected = originalIndex === selected;
          return (
            <button
              key={originalIndex}
              onClick={() => handleSelect(originalIndex)}
              disabled={answered}
              className={clsx(
                'w-full text-left px-5 py-4 font-bold flex items-center gap-4 transition-all rounded-2xl border-2',
                !answered && !isSelected && 'bg-panel border-[var(--border-subtle)] hover:border-blue-400 hover:bg-blue-500/5',
                !answered &&  isSelected && 'bg-blue-500/10 border-blue-400',
                answered  &&  isCorrect  && C.correct,
                answered  &&  isSelected && !isCorrect && C.wrong,
                answered  && !isSelected && !isCorrect && C.dimmed,
              )}
            >
              <span className={clsx(
                'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black border-2 shrink-0',
                !answered && !isSelected && C.badge_dim,
                !answered &&  isSelected && 'border-blue-400 text-blue-400',
                answered  &&  isCorrect  && C.badge_c,
                answered  &&  isSelected && !isCorrect && C.badge_w,
                answered  && !isSelected && !isCorrect && C.badge_dim,
              )}>
                {displayIdx + 1}
              </span>
              <span className="text-lg">{typeof opt === 'string' ? opt : opt[language]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Fill in the Blank ─────────────────────────────────────────
export function FillBlankExercise({
  exercise, onAnswer,
}: { exercise: FillType; onAnswer: (correct: boolean) => void }) {
  const [values, setValues] = useState<string[]>(exercise.blanks.map(() => ''));
  const [submitted, setSubmitted] = useState(false);
  const { language } = useSettingsStore();

  const handleSubmit = () => {
    if (submitted) return;
    setSubmitted(true);
    const correct = exercise.blanks.every((ans, i) =>
      values[i].trim().toLowerCase() === ans.toLowerCase()
    );
    setTimeout(() => onAnswer(correct), 500);
  };

  const parts = exercise.codeTemplate.split('___');
    let inputIdx = 0;

    return (
      <div className="space-y-6">
        <div className="code-block p-6 rounded-2xl text-lg leading-loose">
          <pre className="mono whitespace-pre-wrap flex flex-wrap items-center gap-2">
            {parts.map((part, i) => (
              <React.Fragment key={i}>
                {/* Render code fragments as plain text — JSX escapes automatically,
                    eliminating any HTML/script injection sink. Newlines are
                    preserved naturally by `whitespace-pre-wrap` on the <pre>. */}
                <span>{part}</span>
                {i < parts.length - 1 && (() => {
                  const ci = inputIdx++;
                  const isRight = submitted && values[ci].trim().toLowerCase() === exercise.blanks[ci].toLowerCase();
                  const isWrong = submitted && !isRight;
                  return (
                    <input
                      value={values[ci]}
                      onChange={(e) => {
                        const nv = [...values]; nv[ci] = e.target.value; setValues(nv);
                      }}
                      disabled={submitted}
                      autoComplete="off"
                      spellCheck={false}
                      className={clsx(
                        'w-28 px-3 py-1 rounded-xl border-b-4 mono text-center outline-none bg-transparent transition-all font-bold text-base',
                        !submitted && 'border-[var(--border-subtle)] focus:border-blue-400 text-blue-300',
                        isRight    && 'border-cyan-400 text-cyan-300',
                        isWrong    && 'border-pink-400 text-pink-300',
                      )}
                    />
                  );
                })()}
              </React.Fragment>
            ))}
          </pre>
        </div>
      <button
        onClick={handleSubmit}
        disabled={submitted || values.some(v => !v.trim())}
        className="btn-duo btn-duo-blue w-full py-4 text-xl"
      >
        {language === 'bn' ? 'যাচাই করুন' : 'VERIFY'}
      </button>
    </div>
  );
}

// ── Output Prediction ─────────────────────────────────────────
export function OutputPredictExercise({
  exercise, onAnswer,
}: { exercise: OutputType; onAnswer: (correct: boolean) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const { language } = useSettingsStore();

  const shuffledOptions = useMemo(() => {
    return exercise.options.map((opt, originalIndex) => ({ opt, originalIndex })).sort(() => Math.random() - 0.5);
  }, [exercise.id]);

  const handleSelect = (originalIndex: number) => {
    if (answered) return;
    setSelected(originalIndex);
    setAnswered(true);
    setTimeout(() => onAnswer(originalIndex === exercise.correctIndex), 600);
  };

  return (
    <div className="space-y-6">
      {/* Code display */}
      <div className="relative code-block p-5 rounded-2xl">
        <div className="absolute top-3 left-4 flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-pink-400/60" />
          <div className="w-3 h-3 rounded-full bg-amber-400/60" />
          <div className="w-3 h-3 rounded-full bg-cyan-400/60" />
        </div>
        <pre className="mono whitespace-pre-wrap pt-4">{exercise.code}</pre>
      </div>
      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {shuffledOptions.map(({ opt, originalIndex }) => (
          <button
            key={originalIndex}
            onClick={() => handleSelect(originalIndex)}
            disabled={answered}
            className={clsx(
              'p-5 font-mono text-lg font-bold text-center transition-all rounded-2xl border-2',
              !answered && originalIndex !== selected && 'bg-panel border-[var(--border-subtle)] hover:border-blue-400 hover:bg-blue-500/5',
              !answered && originalIndex === selected && 'bg-blue-500/10 border-blue-400',
              answered  && originalIndex === exercise.correctIndex && C.correct,
              answered  && originalIndex === selected && originalIndex !== exercise.correctIndex && C.wrong,
              answered  && originalIndex !== selected && originalIndex !== exercise.correctIndex && C.dimmed,
            )}
          >
            {typeof opt === 'string' ? opt : opt[language]}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Bug Hunt ──────────────────────────────────────────────────
export function BugHuntExercise({
  exercise, onAnswer,
}: { exercise: BugType; onAnswer: (correct: boolean) => void }) {
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const { language } = useSettingsStore();
  const lines = exercise.code.split('\n');

  const handleSelect = (lineNum: number) => {
    if (answered) return;
    setSelectedLine(lineNum);
    setAnswered(true);
    setTimeout(() => onAnswer(lineNum === exercise.buggyLine), 600);
  };

  return (
    <div className="space-y-4">
      <p className="flex items-center gap-2 text-base font-bold text-blue-300">
        <span className="text-xl">🐞</span>
        {language === 'bn'
          ? "নিচের কোড থেকে 'বাগ' খুঁজে বের করুন!"
          : "Tap the buggy line!"}
      </p>
      <div className="bg-[#0d1b35] border-2 border-[var(--border-subtle)] rounded-2xl overflow-hidden py-2">
        {lines.map((line, idx) => {
          const lineNum  = idx + 1;
          const isBuggy  = lineNum === exercise.buggyLine;
          const isSelected = lineNum === selectedLine;
          return (
            <button
              key={idx}
              onClick={() => handleSelect(lineNum)}
              disabled={answered}
              className={clsx(
                'w-full text-left flex items-start gap-3 px-4 py-2 mono text-[15px] transition-colors group',
                !answered && !isSelected && 'hover:bg-blue-500/10 text-[#c7dff7]',
                !answered &&  isSelected && 'bg-blue-500/15 text-blue-300 font-bold',
                answered  &&  isBuggy    && 'bg-pink-500/20 text-pink-300 font-bold border-l-4 border-pink-400',
                answered  &&  isSelected && !isBuggy && 'bg-pink-500/10 text-pink-400/60 animate-shake',
                answered  && !isBuggy    && !isSelected && 'opacity-40 text-[#c7dff7]',
              )}
            >
              <span className="text-blue-800 select-none w-6 text-right flex-shrink-0 group-hover:text-blue-500 transition-colors">
                {lineNum}
              </span>
              <span className="whitespace-pre">{line}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Code Arrange ──────────────────────────────────────────────
export function CodeArrangeExercise({
  exercise, onAnswer,
}: { exercise: ArrangeType; onAnswer: (correct: boolean) => void }) {
  const [order, setOrder] = useState<number[]>(() => {
    let arr = exercise.blocks.map((_, i) => i).sort(() => Math.random() - 0.5);
    if (arr.length > 1 && arr.every((v, i) => v === exercise.correctOrder[i])) {
      [arr[0], arr[1]] = [arr[1], arr[0]];
    }
    return arr;
  });
  const [submitted, setSubmitted] = useState(false);
  const { language } = useSettingsStore();

  useEffect(() => {
    let arr = exercise.blocks.map((_, i) => i).sort(() => Math.random() - 0.5);
    if (arr.length > 1 && arr.every((v, i) => v === exercise.correctOrder[i])) {
      [arr[0], arr[1]] = [arr[1], arr[0]];
    }
    setOrder(arr);
    setSubmitted(false);
    // Depend on a stable identifier so the user's drag order isn't reset
    // when the parent re-renders with a fresh exercise object reference.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id]);

  const handleSubmit = () => {
    if (submitted) return;
    setSubmitted(true);
    const correct = order.every((v, i) => v === exercise.correctOrder[i]);
    setTimeout(() => onAnswer(correct), 500);
  };

  return (
    <div className="space-y-6">
      <Reorder.Group axis="y" values={order} onReorder={submitted ? () => {} : setOrder} className="space-y-3">
        {order.map((blockIdx, pos) => {
          const inPlace = submitted && order.indexOf(blockIdx) === exercise.correctOrder.indexOf(blockIdx);
          const wrong   = submitted && !inPlace;
          return (
            <Reorder.Item
              key={blockIdx}
              value={blockIdx}
              className={clsx(
                'px-5 py-4 cursor-grab active:cursor-grabbing flex items-center gap-4 select-none rounded-2xl border-2 transition-all',
                'bg-panel border-[var(--border-subtle)] hover:border-blue-400/50',
                inPlace  && C.correct,
                wrong    && 'bg-pink-500/10 border-pink-400 text-pink-300 animate-shake',
              )}
            >
              {/* Drag handle dots */}
              <div className="flex flex-col gap-1 opacity-40">
                {[0,1,2].map(d => <div key={d} className="w-1.5 h-1.5 rounded-full bg-blue-400" />)}
              </div>
              <pre className="mono text-[15px] font-bold flex-1 whitespace-pre-wrap">{exercise.blocks[blockIdx]}</pre>
              <span className="text-xs font-black text-[var(--app-fg-muted)] opacity-50">#{pos + 1}</span>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>
      <button
        onClick={handleSubmit}
        disabled={submitted}
        className="btn-duo btn-duo-blue w-full py-4 text-xl"
      >
        {language === 'bn' ? 'যাচাই করুন' : 'VERIFY'}
      </button>
    </div>
  );
}

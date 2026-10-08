import { useState, useMemo } from 'react';
import {
  Video,
  ExternalLink,
  FileText,
  Search,
  Layers,
  Calculator,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Award,
  RotateCcw,
  Target,
  Check,
  X,
  Compass,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { MICRO_TYPES } from '../data/microtypes';
import { SAT_FORMULA_SHEET, SAT_GRAMMAR_RULES, type FormulaItem, type GrammarRule } from '../data/formulaData';
import MathRenderer from '../components/MathRenderer';
import FormulaShapeDiagram from '../components/FormulaShapeDiagram';
import { play } from '../../lib/audio';

type ResourceTab = 'channels' | 'desmos' | 'microtypes' | 'formulas' | 'grammar';

const TOP_CHANNELS_AND_PLATFORMS = [
  {
    name: 'College Board Bluebook & Educator Bank',
    category: 'Official Benchmark',
    type: 'platform',
    url: 'https://bluebook.collegeboard.org/',
    description: 'The non-negotiable gold standard. Mirrors the actual testing environment, adaptive testing algorithms, and built-in Desmos graphing.',
    badge: 'OFFICIAL'
  },
  {
    name: 'Khan Academy SAT Official Practice',
    category: 'Official Practice',
    type: 'platform',
    url: 'https://www.khanacademy.org/sat',
    description: 'Developed in direct partnership with College Board. Essential for building foundational skills with diagnostic level-ups.',
    badge: 'OFFICIAL'
  },
  {
    name: 'Tutorllini Test Prep',
    category: 'Math & Desmos Master',
    type: 'youtube',
    url: 'https://www.youtube.com/@Tutorllini',
    description: 'The creator of the legendary Ottocento Course. Renowned for methodical Desmos calculator shortcuts that solve hard Module 2 questions in seconds.',
    badge: 'RECOMMENDED'
  },
  {
    name: 'Scalar Learning (Huzefa Kapasi)',
    category: 'Live Test Walkthroughs',
    type: 'youtube',
    url: 'https://www.youtube.com/@ScalarLearning',
    description: 'Real-time problem solving under test constraints. Incredible for learning pacing, mental math shortcuts, and high-pressure execution.',
    badge: 'RECOMMENDED'
  },
  {
    name: 'PrepPros',
    category: 'Math 150 Hardest & Advanced Topics',
    type: 'youtube',
    url: 'https://www.youtube.com/@PrepPros',
    description: 'Specializes in high-scoring students (700+ to 800). Comprehensive walkthroughs of the 150 hardest math questions and high-yield formula breakdowns.',
    badge: 'POPULAR'
  },
  {
    name: 'Strategic Test Prep',
    category: 'R&W Strategies & Pacing',
    type: 'youtube',
    url: 'https://www.youtube.com/@StrategicTestPrep',
    description: 'Focuses on test-taking tactics, transitions, rhetorical synthesis shortcuts, and eliminating wrong answers with ruthless precision.',
    badge: 'HIGH YIELD'
  },
  {
    name: 'Settele Tutoring',
    category: 'Reading & Writing Walkthroughs',
    type: 'youtube',
    url: 'https://www.youtube.com/@SetteleTutoring',
    description: 'Superb breakdown of Reading & Writing module questions, passage main ideas, author tone, and subtle College Board traps.',
    badge: 'HIGH YIELD'
  },
  {
    name: '1600.io',
    category: 'Deep Conceptual Mastery',
    type: 'platform',
    url: 'https://1600.io',
    description: 'Rigorous conceptual understanding by George. Unmatched explanations for question mechanics and identifying trick options.',
    badge: 'FOUNDATIONAL'
  }
];

const DESMOS_HACKS = [
  {
    title: 'Solving Systems of Equations Instantly',
    formula: 'y = 2x + 5 \\n y = -3x + 20',
    shortcut: 'Type both equations directly. Desmos calculates and highlights the exact coordinates of intersection with a gray clickable dot.',
    tip: 'Works even with non-linear systems like circles (x² + y² = 25) and parabolas!'
  },
  {
    title: 'Find Equations from Given Points (Regression ~)',
    formula: 'y_1 \\sim a x_1^2 + b x_1 + c',
    shortcut: 'Enter your given coordinates into a table (x1, y1). In the next line, type the regression equation with "~" instead of "=". Desmos instantly calculates a, b, and c with R² = 1!',
    tip: 'Eliminates having to solve 3-variable substitution systems by hand.'
  },
  {
    title: 'Number of Solutions with Sliders',
    formula: 'y = 3x + k \\n y = x^2 - 4x + 7',
    shortcut: 'Add a slider for "k". Drag or adjust the slider to see when the line becomes tangent to the parabola (1 solution / discriminant = 0) or misses it (0 solutions).',
    tip: 'Never guess whether discriminant b² - 4ac > 0 or = 0.'
  },
  {
    title: 'Instant Roots & Vertex of Any Quadratic',
    formula: 'y = a(x - h)^2 + k',
    shortcut: 'Type the polynomial. Click directly on the parabola: Desmos immediately displays gray dots at the vertex (max/min) and x-intercepts (zeros/roots).',
    tip: 'No quadratic formula needed for MCQ root-finding questions.'
  },
  {
    title: 'Evaluating Complex Expressions & Percentages',
    formula: 'mean(12, 18, 25, 40) \\quad 150 \\cdot (1 - 0.25)',
    shortcut: 'Use built-in functions: mean(), median(), stdev(), and factorial. Handles nested fractional powers with zero syntax errors.',
    tip: 'Parentheses and fraction bars auto-format cleanly.'
  }
];

export default function SatResourcesPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<ResourceTab>('channels');

  // Formula Mastery State
  const [formulaCategory, setFormulaCategory] = useState<'all' | 'official' | 'geometry' | 'coordinate_geometry' | 'algebra' | 'trigonometry' | 'statistics'>('all');
  const [formulaSearch, setFormulaSearch] = useState('');
  const [formulaQuestionIndices, setFormulaQuestionIndices] = useState<Record<string, number>>({});
  const [userFormulaAnswers, setUserFormulaAnswers] = useState<Record<string, Record<number, 'A' | 'B' | 'C' | 'D'>>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const stored = localStorage.getItem('cs_sat_formula_answers_v2');
      if (stored) return JSON.parse(stored);
      // Backwards compatible migration from older single-answer storage
      const oldStored = localStorage.getItem('cs_sat_formula_answers');
      if (oldStored) {
        const parsed = JSON.parse(oldStored);
        const migrated: Record<string, Record<number, 'A' | 'B' | 'C' | 'D'>> = {};
        for (const [k, v] of Object.entries(parsed)) {
          if (typeof v === 'string') migrated[k] = { 0: v as any };
          else if (typeof v === 'object' && v !== null) migrated[k] = v as any;
        }
        return migrated;
      }
      return {};
    } catch {
      return {};
    }
  });
  const [collapsedPracticeIds, setCollapsedPracticeIds] = useState<Record<string, boolean>>({});
  const [masteredFormulaIds, setMasteredFormulaIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('cs_sat_formula_mastery');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const getFormulaActiveIndex = (formulaId: string) => formulaQuestionIndices[formulaId] || 0;

  const handleSelectFormulaAnswer = (
    formula: FormulaItem,
    questionIndex: number,
    chosenOption: 'A' | 'B' | 'C' | 'D'
  ) => {
    const questions = formula.practiceQuestions || [formula.practiceQuestion];
    const currentQ = questions[questionIndex];
    if (!currentQ) return;
    const isCorrect = chosenOption === currentQ.correctAnswer;
    if (isCorrect) {
      play('correct');
    } else {
      play('incorrect');
    }

    setUserFormulaAnswers(prev => {
      const formulaMap = { ...(prev[formula.id] || {}), [questionIndex]: chosenOption };
      const next = { ...prev, [formula.id]: formulaMap };
      try {
        localStorage.setItem('cs_sat_formula_answers_v2', JSON.stringify(next));
      } catch {}

      // Check if ALL questions in the drill for this formula are now answered correctly
      const allMastered = questions.every(
        (q, idx) => formulaMap[idx] === q.correctAnswer
      );
      if (allMastered) {
        setMasteredFormulaIds(prevM => {
          if (prevM.includes(formula.id)) return prevM;
          const nextM = [...prevM, formula.id];
          try {
            localStorage.setItem('cs_sat_formula_mastery', JSON.stringify(nextM));
          } catch {}
          return nextM;
        });
      }
      return next;
    });
  };

  const handleSetFormulaQuestionIndex = (formulaId: string, idx: number) => {
    play('tap');
    setFormulaQuestionIndices(prev => ({ ...prev, [formulaId]: idx }));
  };

  const handlePrevFormulaQuestion = (formulaId: string) => {
    play('tap');
    setFormulaQuestionIndices(prev => {
      const current = prev[formulaId] || 0;
      return { ...prev, [formulaId]: Math.max(0, current - 1) };
    });
  };

  const handleNextFormulaQuestion = (formulaId: string, total: number) => {
    play('tap');
    setFormulaQuestionIndices(prev => {
      const current = prev[formulaId] || 0;
      return { ...prev, [formulaId]: Math.min(total - 1, current + 1) };
    });
  };

  const handleResetFormulaQuestion = (formulaId: string) => {
    play('tap');
    setUserFormulaAnswers(prev => {
      const copy = { ...prev };
      delete copy[formulaId];
      try {
        localStorage.setItem('cs_sat_formula_answers_v2', JSON.stringify(copy));
      } catch {}
      return copy;
    });
    setMasteredFormulaIds(prev => {
      const next = prev.filter(id => id !== formulaId);
      try {
        localStorage.setItem('cs_sat_formula_mastery', JSON.stringify(next));
      } catch {}
      return next;
    });
    setFormulaQuestionIndices(prev => ({ ...prev, [formulaId]: 0 }));
  };

  const handleResetAllMastery = () => {
    play('tap');
    setMasteredFormulaIds([]);
    setUserFormulaAnswers({});
    setFormulaQuestionIndices({});
    try {
      localStorage.removeItem('cs_sat_formula_mastery');
      localStorage.removeItem('cs_sat_formula_answers_v2');
      localStorage.removeItem('cs_sat_formula_answers');
    } catch {}
  };

  const togglePracticeCollapse = (formulaId: string) => {
    play('toggle');
    setCollapsedPracticeIds(prev => ({ ...prev, [formulaId]: !prev[formulaId] }));
  };

  const filteredFormulas = useMemo(() => {
    return SAT_FORMULA_SHEET.filter(f => {
      if (formulaCategory === 'official' && !f.officialReference) return false;
      if (formulaCategory !== 'all' && formulaCategory !== 'official' && f.category !== formulaCategory) return false;
      if (formulaSearch.trim()) {
        const q = formulaSearch.toLowerCase();
        return (
          f.name.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q) ||
          f.latex.toLowerCase().includes(q) ||
          (f.subcategory && f.subcategory.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [formulaCategory, formulaSearch]);

  const filteredMicroTypes = MICRO_TYPES.filter(m =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.domain.toLowerCase().includes(search.toLowerCase()) ||
    m.skill.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="glass p-8 sm:p-12 rounded-[3.5rem] border border-blue-500/20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto">
          <Layers size={32} />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-wider text-blue-400">
            Curated Knowledge Base
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-app-fg">
            SAT Theory & High-Yield Resources
          </h1>
          <p className="text-sm font-bold text-app-fg/60 max-w-xl mx-auto">
            Comprehensive formula sheets, grammar conventions, Desmos shortcuts, and vetted video lessons mapped directly to each micro-type.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-2xl bg-panel border border-border-subtle mt-2">
          <button
            onClick={() => { play('toggle'); setActiveTab('channels'); }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'channels'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-app-fg/60 hover:text-app-fg'
            }`}
          >
            Top Channels & Platforms
          </button>
          <button
            onClick={() => { play('toggle'); setActiveTab('desmos'); }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeTab === 'desmos'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                : 'text-app-fg/60 hover:text-app-fg'
            }`}
          >
            <Calculator size={13} />
            <span>Desmos 800 Hacks</span>
          </button>
          <button
            onClick={() => { play('toggle'); setActiveTab('microtypes'); }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'microtypes'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-app-fg/60 hover:text-app-fg'
            }`}
          >
            Micro-Type Guides
          </button>
          <button
            onClick={() => { play('toggle'); setActiveTab('formulas'); }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeTab === 'formulas'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-app-fg/60 hover:text-app-fg'
            }`}
          >
            <Compass size={13} />
            <span>Formula Mastery ({masteredFormulaIds.length}/{SAT_FORMULA_SHEET.length})</span>
          </button>
          <button
            onClick={() => { play('toggle'); setActiveTab('grammar'); }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'grammar'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-app-fg/60 hover:text-app-fg'
            }`}
          >
            Reading & Grammar
          </button>
        </div>
      </div>

      {/* Tab 1: Top Channels & Platforms */}
      {activeTab === 'channels' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TOP_CHANNELS_AND_PLATFORMS.map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="glass p-6 sm:p-8 rounded-3xl border border-border-subtle hover:border-blue-500/40 hover:shadow-xl transition-all space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-400">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-app-fg group-hover:text-blue-400 transition-colors flex items-center justify-between">
                    <span>{item.name}</span>
                    <ExternalLink size={16} className="text-app-fg/40 group-hover:text-blue-400 shrink-0 ml-2" />
                  </h3>

                  <p className="text-xs text-app-fg/70 font-medium leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 text-xs font-black text-blue-400 flex items-center gap-1.5">
                  {item.type === 'youtube' ? <Video size={14} /> : <BookOpen size={14} />}
                  <span>Visit {item.type === 'youtube' ? 'YouTube Channel' : 'Official Portal'} →</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Desmos 800 Hacks */}
      {activeTab === 'desmos' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-cyan-950/20 border border-cyan-500/30 flex items-center gap-4">
            <Calculator size={32} className="text-cyan-400 shrink-0" />
            <div>
              <h3 className="font-black text-app-fg text-lg">CollegeBoard Bluebook Desmos Engine</h3>
              <p className="text-xs text-app-fg/70 font-semibold mt-0.5">
                The built-in calculator on the Digital SAT is not just a computation tool—it is a superpower capable of solving over 70% of Math questions in under 45 seconds without algebraic expansion.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DESMOS_HACKS.map((hack, idx) => (
              <div
                key={idx}
                className="glass p-6 sm:p-8 rounded-3xl border border-border-subtle space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-black text-cyan-400 uppercase tracking-wider">
                    <Sparkles size={14} />
                    <span>Desmos Shortcut #{idx + 1}</span>
                  </div>

                  <h4 className="text-lg font-black text-app-fg">{hack.title}</h4>

                  <div className="p-4 rounded-2xl bg-panel border border-border-subtle text-center">
                    <MathRenderer content={`$$${hack.formula}$$`} />
                  </div>

                  <p className="text-xs font-bold text-app-fg/80 leading-relaxed">
                    <strong>How to execute:</strong> {hack.shortcut}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs font-bold text-cyan-300">
                  💡 <strong>Pro Tip:</strong> {hack.tip}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Micro-Type Video Guides & Strategy */}
      {activeTab === 'microtypes' && (
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-app-fg/40" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search micro-type or skill..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-panel border border-border-subtle text-app-fg font-bold text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredMicroTypes.map((mt) => (
              <div
                key={mt.id}
                className="glass p-6 sm:p-8 rounded-3xl border border-border-subtle space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-400">
                      {mt.domain}
                    </span>
                    <span className="text-xs font-bold text-app-fg/50">{mt.skill}</span>
                  </div>

                  <h3 className="text-lg font-black text-app-fg">{mt.title}</h3>
                  <p className="text-xs text-app-fg/60 font-bold leading-relaxed">{mt.theorySummary}</p>

                  {/* Rules / Formulas list */}
                  <div className="p-3.5 rounded-xl bg-app-bg/60 border border-border-subtle/60 space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-app-fg/40 block">Key Formula / Rule:</span>
                    <ul className="text-xs font-bold text-app-fg/80 list-disc list-inside space-y-0.5">
                      {mt.formulasOrRules.map((rule, idx) => (
                        <li key={idx}>{rule}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Best Resources Links */}
                <div className="pt-3 border-t border-border-subtle/60 space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-app-fg/40 block">
                    Curated Best Resources:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {mt.bestResources.map((res, i) => (
                      <a
                        key={i}
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-panel border border-border-subtle hover:bg-blue-500/10 hover:border-blue-500/30 text-xs font-bold text-blue-400 transition-all flex items-center gap-1.5"
                      >
                        {res.type === 'video' ? <Video size={13} /> : <FileText size={13} />}
                        <span>{res.provider}: {res.title}</span>
                        <ExternalLink size={11} className="opacity-60" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Math Formulas & Formula Mastery */}
      {activeTab === 'formulas' && (
        <div className="space-y-8">
          {/* Header Banner & Mastery Progress Tracker */}
          <div className="glass p-6 sm:p-8 rounded-3xl border border-blue-500/30 space-y-6 bg-gradient-to-br from-blue-950/20 via-panel to-panel">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
                    Interactive Formula Mastery
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                    <Layers size={10} /> 14 Official Bluebook
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-app-fg">
                  SAT Math Formula Mastery & Visual Vault
                </h3>
                <p className="text-xs text-app-fg/70 font-semibold max-w-2xl">
                  Inspect shape dimension indicators, review algebraic models, and solve targeted College Board practice problems to achieve 100% test-day formula recall.
                </p>
              </div>

              {/* Mastery Stats Pill */}
              <div className="p-4 rounded-2xl bg-panel border border-border-subtle shrink-0 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                  <Award size={24} />
                </div>
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-app-fg">{masteredFormulaIds.length}</span>
                    <span className="text-xs font-bold text-app-fg/50">/ {SAT_FORMULA_SHEET.length}</span>
                    <span className="text-xs font-black text-emerald-400 ml-1">
                      ({Math.round((masteredFormulaIds.length / SAT_FORMULA_SHEET.length) * 100)}%)
                    </span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-app-fg/40 block">Formulas Mastered</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden border border-border-subtle/80">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${(masteredFormulaIds.length / SAT_FORMULA_SHEET.length) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-bold text-app-fg/50">
                <span>Pass the challenge question below each formula to certify mastery</span>
                {masteredFormulaIds.length > 0 && (
                  <button
                    onClick={handleResetAllMastery}
                    className="text-xs font-bold text-app-fg/50 hover:text-rose-400 transition-colors flex items-center gap-1"
                  >
                    <RotateCcw size={11} />
                    <span>Reset Progress</span>
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Pills & Search */}
            <div className="pt-2 border-t border-border-subtle/60 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'all', label: `All (${SAT_FORMULA_SHEET.length})` },
                  { id: 'official', label: `Official Reference (14)` },
                  { id: 'geometry', label: 'Geometry' },
                  { id: 'coordinate_geometry', label: 'Coordinate Geometry' },
                  { id: 'algebra', label: 'Algebra' },
                  { id: 'trigonometry', label: 'Trigonometry' },
                  { id: 'statistics', label: 'Statistics' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { play('toggle'); setFormulaCategory(cat.id as any); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                      formulaCategory === cat.id
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-panel border border-border-subtle text-app-fg/60 hover:text-app-fg hover:border-blue-500/30'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative min-w-[220px]">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-app-fg/40" />
                <input
                  type="text"
                  value={formulaSearch}
                  onChange={(e) => setFormulaSearch(e.target.value)}
                  placeholder="Filter formulas..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-panel border border-border-subtle text-app-fg font-bold text-xs focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Formulas Grid */}
          {filteredFormulas.length === 0 ? (
            <div className="glass p-12 rounded-3xl border border-border-subtle text-center space-y-3">
              <Compass size={36} className="text-app-fg/30 mx-auto" />
              <h4 className="text-base font-black text-app-fg">No formulas match your filter</h4>
              <p className="text-xs text-app-fg/50 font-bold">Try searching for a different keyword or selecting "All".</p>
              <button
                onClick={() => { setFormulaCategory('all'); setFormulaSearch(''); }}
                className="px-4 py-2 rounded-xl bg-blue-500 text-white text-xs font-black hover:bg-blue-600 transition-all"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredFormulas.map((f) => {
                const questions = f.practiceQuestions && f.practiceQuestions.length > 0
                  ? f.practiceQuestions
                  : [f.practiceQuestion];
                const activeQIdx = getFormulaActiveIndex(f.id);
                const safeQIdx = Math.min(activeQIdx, questions.length - 1);
                const currentQ = questions[safeQIdx];

                const formulaAnswers = userFormulaAnswers[f.id] || {};
                const currentAnswer = formulaAnswers[safeQIdx];
                const isAnswered = typeof currentAnswer !== 'undefined';
                const isCorrect = isAnswered && currentAnswer === currentQ.correctAnswer;

                const solvedCount = questions.filter((q, idx) => formulaAnswers[idx] === q.correctAnswer).length;
                const isFullyMastered = masteredFormulaIds.includes(f.id) || (solvedCount === questions.length && questions.length > 0);
                const hasAnyAttempts = Object.keys(formulaAnswers).length > 0;
                const isPracticeCollapsed = !!collapsedPracticeIds[f.id];

                return (
                  <div
                    key={f.id}
                    className={`glass p-6 sm:p-7 rounded-3xl border transition-all flex flex-col justify-between space-y-5 ${
                      isFullyMastered
                        ? 'border-emerald-500/40 shadow-lg shadow-emerald-950/10'
                        : 'border-border-subtle hover:border-blue-500/30'
                    }`}
                  >
                    <div className="space-y-4">
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            f.category === 'geometry' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30' :
                            f.category === 'coordinate_geometry' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' :
                            f.category === 'algebra' ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30' :
                            f.category === 'trigonometry' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                            'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          }`}>
                            {f.category.replace('_', ' ')}
                          </span>

                          {f.officialReference && (
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                              <Layers size={10} /> Bluebook
                            </span>
                          )}

                          {f.subcategory && (
                            <span className="text-[10px] font-bold text-app-fg/40 px-1.5 py-0.5">
                              • {f.subcategory}
                            </span>
                          )}
                        </div>

                        {/* Mastered Badge */}
                        {isFullyMastered ? (
                          <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                            <CheckCircle2 size={12} /> Mastered ({questions.length}/{questions.length})
                          </span>
                        ) : solvedCount > 0 ? (
                          <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center gap-1">
                            <Target size={12} /> {solvedCount}/{questions.length} Solved
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-app-fg/5 text-app-fg/40 border border-border-subtle/60">
                            0/{questions.length} Drill
                          </span>
                        )}
                      </div>

                      {/* Formula Name */}
                      <h4 className="text-lg font-black text-app-fg">{f.name}</h4>

                      {/* Visual Shape Diagram with Indications */}
                      {f.visualizationType && (
                        <div className="space-y-2">
                          <FormulaShapeDiagram type={f.visualizationType} />

                          {/* Indicator Legend Badges */}
                          {f.diagramLabels && f.diagramLabels.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-0.5">
                              {f.diagramLabels.map((lbl, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-panel border border-border-subtle text-app-fg/70"
                                >
                                  <strong className="text-cyan-400 mr-1">{lbl.symbol}:</strong>
                                  <span>{lbl.label}</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Math Formula Display Box */}
                      <div className="p-3.5 rounded-2xl bg-panel border border-border-subtle text-center my-2 shadow-inner">
                        <MathRenderer content={`$$${f.latex}$$`} />
                      </div>

                      {/* Description & Key Takeaway */}
                      <p className="text-xs font-bold text-app-fg/70 leading-relaxed">
                        {f.description}
                      </p>

                      {f.keyTakeaway && (
                        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-app-fg/80 font-bold flex items-start gap-2">
                          <Sparkles size={14} className="text-blue-400 shrink-0 mt-0.5" />
                          <span>
                            <strong className="text-blue-400">SAT Takeaway: </strong>
                            {f.keyTakeaway}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* ─── Interactive Multi-Question Formula Drill Section ─── */}
                    <div className="pt-4 border-t border-border-subtle/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => togglePracticeCollapse(f.id)}
                          className="flex items-center gap-1.5 text-xs font-black text-app-fg hover:text-blue-400 transition-colors"
                        >
                          <Target size={14} className="text-cyan-400" />
                          <span>Formula Mastery Drill ({questions.length} Questions)</span>
                          {isPracticeCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                        </button>

                        {hasAnyAttempts && (
                          <button
                            onClick={() => handleResetFormulaQuestion(f.id)}
                            className="text-[11px] font-bold text-app-fg/40 hover:text-rose-400 transition-colors flex items-center gap-1"
                            title="Reset all questions for this formula"
                          >
                            <RotateCcw size={11} />
                            <span>Reset Drill</span>
                          </button>
                        )}
                      </div>

                      {!isPracticeCollapsed && (
                        <div className="p-4 rounded-2xl bg-slate-950/60 border border-border-subtle/80 space-y-4">
                          {/* Drill Stepper Header */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-border-subtle/50">
                            <span className="text-[11px] font-black text-blue-400 uppercase tracking-wider">
                              Question {safeQIdx + 1} of {questions.length}
                            </span>

                            {/* Stepper Dots & Navigation */}
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handlePrevFormulaQuestion(f.id)}
                                disabled={safeQIdx === 0}
                                className="p-1 rounded-lg bg-panel border border-border-subtle text-app-fg/60 hover:text-app-fg disabled:opacity-30 disabled:pointer-events-none transition-all"
                                title="Previous Question"
                              >
                                <ChevronLeft size={13} />
                              </button>

                              <div className="flex items-center gap-1">
                                {questions.map((q, qIndex) => {
                                  const qAns = formulaAnswers[qIndex];
                                  const isQAnswered = typeof qAns !== 'undefined';
                                  const isQCorrect = isQAnswered && qAns === q.correctAnswer;
                                  const isActive = qIndex === safeQIdx;

                                  let pillClass = 'bg-panel border-border-subtle text-app-fg/50 hover:text-app-fg';
                                  if (isActive) {
                                    pillClass = 'ring-2 ring-blue-500 bg-blue-500/20 text-blue-300 font-black';
                                  } else if (isQCorrect) {
                                    pillClass = 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 font-bold';
                                  } else if (isQAnswered) {
                                    pillClass = 'bg-rose-500/15 border-rose-500/30 text-rose-400 font-bold';
                                  }

                                  return (
                                    <button
                                      key={qIndex}
                                      onClick={() => handleSetFormulaQuestionIndex(f.id, qIndex)}
                                      className={`px-2 py-0.5 rounded-lg border text-[10px] transition-all flex items-center gap-0.5 ${pillClass}`}
                                      title={`Jump to Question ${qIndex + 1}`}
                                    >
                                      {isQCorrect ? (
                                        <Check size={10} className="text-emerald-400 shrink-0" />
                                      ) : isQAnswered ? (
                                        <X size={10} className="text-rose-400 shrink-0" />
                                      ) : null}
                                      <span>Q{qIndex + 1}</span>
                                    </button>
                                  );
                                })}
                              </div>

                              <button
                                onClick={() => handleNextFormulaQuestion(f.id, questions.length)}
                                disabled={safeQIdx === questions.length - 1}
                                className="p-1 rounded-lg bg-panel border border-border-subtle text-app-fg/60 hover:text-app-fg disabled:opacity-30 disabled:pointer-events-none transition-all"
                                title="Next Question"
                              >
                                <ChevronRight size={13} />
                              </button>
                            </div>
                          </div>

                          {/* Question Stem */}
                          <div className="text-xs font-bold text-app-fg/90 leading-relaxed">
                            <MathRenderer content={currentQ.stem} />
                          </div>

                          {/* Options Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {currentQ.options.map((opt) => {
                              const isSelected = currentAnswer === opt.label;
                              const isOptCorrect = opt.label === currentQ.correctAnswer;

                              let btnStyle = 'bg-panel border-border-subtle hover:border-blue-500/40 text-app-fg';
                              if (isAnswered) {
                                if (isSelected && isOptCorrect) {
                                  btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-black shadow-md shadow-emerald-950/20';
                                } else if (isSelected && !isOptCorrect) {
                                  btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300 font-black shadow-md shadow-rose-950/20';
                                } else if (isOptCorrect) {
                                  btnStyle = 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 font-bold';
                                } else {
                                  btnStyle = 'bg-panel/40 border-border-subtle/40 text-app-fg/40 opacity-60';
                                }
                              }

                              return (
                                <button
                                  key={opt.label}
                                  onClick={() => handleSelectFormulaAnswer(f, safeQIdx, opt.label)}
                                  className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between gap-2 ${btnStyle}`}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black shrink-0">
                                      {opt.label}
                                    </span>
                                    <span>{opt.text}</span>
                                  </div>
                                  {isAnswered && isOptCorrect && (
                                    <Check size={14} className="text-emerald-400 shrink-0" />
                                  )}
                                  {isAnswered && isSelected && !isOptCorrect && (
                                    <X size={14} className="text-rose-400 shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Step-by-Step Rationale */}
                          {isAnswered && (
                            <div className={`p-3.5 rounded-xl border text-xs space-y-2 animate-fadeIn ${
                              isCorrect
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                                : 'bg-rose-500/10 border-rose-500/30 text-app-fg/80'
                            }`}>
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <div className="flex items-center gap-1.5 font-black">
                                  {isCorrect ? (
                                    <>
                                      <CheckCircle2 size={14} className="text-emerald-400" />
                                      <span className="text-emerald-400">Correct!</span>
                                    </>
                                  ) : (
                                    <>
                                      <X size={14} className="text-rose-400" />
                                      <span className="text-rose-400">Review Formula Application:</span>
                                    </>
                                  )}
                                </div>

                                {/* Next Question Drill Action Button */}
                                {isCorrect && safeQIdx < questions.length - 1 && (
                                  <button
                                    onClick={() => handleNextFormulaQuestion(f.id, questions.length)}
                                    className="px-2.5 py-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-black text-[11px] flex items-center gap-1 transition-all shadow-sm"
                                  >
                                    <span>Next Drill Question</span>
                                    <ArrowRight size={12} />
                                  </button>
                                )}
                              </div>

                              <div className="text-app-fg/80 font-bold leading-relaxed">
                                <MathRenderer content={currentQ.explanation} />
                              </div>

                              {currentQ.tip && (
                                <div className="pt-2 border-t border-white/10 text-[11px] font-black text-amber-400">
                                  💡 {currentQ.tip}
                                </div>
                              )}

                              {/* All Questions Mastered Banner */}
                              {isFullyMastered && (
                                <div className="p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-black text-center flex items-center justify-center gap-1.5 mt-2">
                                  <Sparkles size={14} />
                                  <span>All {questions.length} Drill Questions Solved! Formula Mastered.</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Grammar & Conventions */}
      {activeTab === 'grammar' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-violet-950/20 border border-violet-500/30 flex items-center gap-4">
            <CheckCircle2 size={32} className="text-violet-400 shrink-0" />
            <div>
              <h3 className="font-black text-app-fg text-lg">Standard English Conventions & Rhetorical Synthesis</h3>
              <p className="text-xs text-app-fg/70 font-semibold mt-0.5">
                Every grammatical question on the SAT tests one of 8 strict, predictable rules. Never rely on "what sounds right"—use syntactic elimination.
              </p>
            </div>
          </div>

          {SAT_GRAMMAR_RULES.map((r: GrammarRule, i: number) => (
            <div key={i} className="glass p-6 sm:p-8 rounded-3xl border border-border-subtle space-y-3">
              <h3 className="text-lg font-black text-violet-400">{r.title}</h3>
              <p className="text-sm font-bold text-app-fg leading-relaxed">{r.rule}</p>
              <div className="p-4 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-xs font-mono text-app-fg">
                <strong className="text-violet-400 mr-2">Example:</strong>
                <span>{r.example}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

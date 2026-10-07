import { useState } from 'react';
import { Video, ExternalLink, FileText, Search, Layers, Calculator, Sparkles, BookOpen, CheckCircle2 } from 'lucide-react';
import { MICRO_TYPES } from '../data/microtypes';
import { SAT_FORMULA_SHEET, SAT_GRAMMAR_RULES } from '../data/formulaData';
import MathRenderer from '../components/MathRenderer';
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
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'formulas'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-app-fg/60 hover:text-app-fg'
            }`}
          >
            Math Formulas
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

      {/* Tab 4: Math Reference Sheet */}
      {activeTab === 'formulas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SAT_FORMULA_SHEET.map((f) => (
            <div
              key={f.id}
              className="glass p-6 rounded-3xl border border-border-subtle space-y-3"
            >
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-400">{f.category}</span>
              <h4 className="text-base font-black text-app-fg">{f.name}</h4>
              <div className="p-4 rounded-2xl bg-panel border border-border-subtle text-center my-2">
                <MathRenderer content={`$$${f.latex}$$`} />
              </div>
              <p className="text-xs font-bold text-app-fg/60">{f.description}</p>
            </div>
          ))}
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

          {SAT_GRAMMAR_RULES.map((r, i) => (
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

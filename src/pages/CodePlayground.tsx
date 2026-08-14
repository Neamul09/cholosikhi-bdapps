import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Play, RotateCcw, Copy, Code, Terminal, Sparkles, ChevronDown, AlertTriangle, Network, AlignLeft, Boxes, Layers, Type } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '@/store/settingsStore';
import {
  SortingVisualizer,
  TreeVisualizer,
  StackQueueVisualizer,
  GraphVisualizer,
  ArrayVisualizer,
} from '@/components/dsa';

// C++ hidden for beta release — entry kept so beta gate stays explicit
const LANGUAGES = [
  { id: 'python', name: 'Python', version: '3.10.0', icon: 'Py', judge0Id: 71, starter: 'print("Hello, py.cholosikhi!")\n\n# Try writing some code here\nfor i in range(5):\n    print(f"Step {i}")' }
] as const;

type LangId = typeof LANGUAGES[number]['id'];

// Judge0 endpoint comes from env so it can be rotated without code changes.
// Fallback to the public hosted endpoint only in dev; in prod the Vercel
// function proxy should be set via VITE_JUDGE0_URL.
const JUDGE0_URL =
  (import.meta.env.VITE_JUDGE0_URL as string | undefined)?.replace(/\/$/, '') ||
  'https://ce.judge0.com/submissions';

const t = {
  en: {
    title: 'Code Playground',
    subtitle: 'Sketch an idea. Run it in the cloud.',
    editor: 'EDITOR',
    codeTab: 'CODE',
    visualizerTab: 'VISUALIZER',
    sorting: 'Sorting',
    tree: 'Tree / BST',
    graph: 'Graphs',
    stackQueue: 'Stack/Queue',
    array: 'Arrays & Pointers',
    console: 'CONSOLE',
    run: 'RUN',
    running: 'Running…',
    reset: 'Reset',
    copy: 'Copy',
    resetTitle: 'Reset code?',
    resetBody: "We'll restore the starter snippet for this language.",
    resetConfirm: 'Reset',
    resetCancel: 'Keep',
    placeholder: 'Write your code here…',
    empty: '> Output will appear here',
    selectLang: 'Pick a language',
    networkErr: "Can't reach the runner. Check your connection and try again.",
    rateErr: 'Runner is busy right now. Give it a moment, then try again.',
    compileErr: 'Code did not compile.',
    runtimeErr: 'Code threw an error.',
    authErr: 'Runner rejected the request (auth/quota).',
    noOutput: '(No output)',
    copied: 'Copied!',
  },
  bn: {
    title: 'কোড প্লে�্রাউন্ড',
    subtitle: 'ভাবনাটা লিখুন, ক্লাউডে চালান।',
    editor: 'এডিটর',
    codeTab: 'কোড',
    visualizerTab: 'ভিজ্যুয়ালাইজার',
    sorting: 'সর্টিং',
    tree: 'ট্রি / BST',
    graph: 'গ্রাফ',
    stackQueue: 'স্ট্যাক/কিউ',
    array: 'অ্যারে ও পয়েন্টার',
    console: 'কনসোল',
    run: 'রান',
    running: 'চলছে…',
    reset: 'রিসেট',
    copy: 'কপি',
    resetTitle: 'কোড রিসেট করবেন?',
    resetBody: 'এই ভাষার স্টার্টার কোডটা আবার চলে আসবে।',
    resetConfirm: 'রিসেট',
    resetCancel: 'থাক',
    placeholder: 'এখানে কোড লিখুন…',
    empty: '> আউটপুট এখানে দেখা যাবে',
    selectLang: 'ভাষা বেছে নিন',
    networkErr: 'রানারের সাথে যোগাযোগ করা যাচ্ছে না। ইন্টারনেট চেক করে আবার চেষ্টা করুন।',
    rateErr: 'রানার এখন ব্যস্ত। একটু পর আবার চেষ্টা করুন।',
    compileErr: 'কোড কম্পাইল হয়নি।',
    runtimeErr: 'কোড চলতে গিয়ে এরর দিয়েছে।',
    authErr: 'রানার অনুরোধটা গ্রহণ করেনি (auth/quota)।',
    noOutput: '(কোনো আউটপুট নেই)',
    copied: 'কপি হয়েছে!',
  },
};

interface ResetConfirmProps {
  open: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ResetConfirm({ open, title, body, confirmLabel, cancelLabel, onConfirm, onCancel }: ResetConfirmProps) {
  // Esc to cancel, Enter to confirm — standard a11y for confirm dialogs
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Enter') onConfirm();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel, onConfirm]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onCancel}
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-title"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-panel border-2 border-border-subtle rounded-3xl p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400 shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 id="reset-title" className="text-lg font-black mb-1">{title}</h3>
                <p className="text-sm text-app-fg/60 font-medium">{body}</p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-xl font-bold text-app-fg/70 hover:bg-app-bg transition-colors"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-xl font-bold bg-amber-500 text-white hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20"
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function CodePlayground() {
  const { language: uiLang } = useSettingsStore();
  const location = useLocation();
  // `useLocation().state` returns a fresh object on every render — only read
  // the primitive fields once at mount to avoid clobbering user edits.
  const initialLang = useRef<LangId | null>(
    (location.state as { lang?: string } | null)?.lang as LangId | undefined ?? null
  );
  const initialCode = useRef<string | null>(
    (location.state as { code?: string } | null)?.code ?? null
  );
  // `?tab=visualizer` deep-link from AppShell — defaults to 'code' so a
  // hard refresh of /playground still lands in the editor.
  const initialTab = useRef<'code' | 'visualizer'>(
    new URLSearchParams(location.search).get('tab') === 'visualizer' ? 'visualizer' : 'code'
  );

  const dropdownRef = useRef<HTMLDivElement>(null);

  const [selectedLang, setSelectedLang] = useState(() => {
    const init = initialLang.current;
    if (init) {
      const found = LANGUAGES.find((l) => l.id === init);
      if (found) return found;
    }
    return LANGUAGES[0];
  });
  const [activeTab, setActiveTab] = useState<'code' | 'visualizer'>(initialTab.current);
  const [visualizerTab, setVisualizerTab] = useState<'sorting' | 'tree' | 'graph' | 'stack_queue' | 'array'>('sorting');
  const [code, setCode] = useState(() => initialCode.current ?? selectedLang.starter);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isError, setIsError] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const tr = t[uiLang];

  // Close dropdown on outside click/tap (works on mobile)
  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const runCode = useCallback(async () => {
    setIsRunning(true);
    setIsError(false);
    setOutput(tr.running);

    try {
      const response = await fetch(
        `${JUDGE0_URL}?base64_encoded=false&wait=true`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            source_code: code,
            // selectedLang.id is the typed LangId, never 'cpp' until we add it.
            language_id: selectedLang.judge0Id,
            stdin: '',
          }),
        },
      );

      // Branch on HTTP status before parsing. Judge0 returns 429 on rate-limit
      // and 401/403 on quota/auth issues — these need distinct messages.
      if (response.status === 429) {
        throw new Error('RATE_LIMITED');
      }
      if (response.status === 401 || response.status === 403) {
        throw new Error('AUTH');
      }
      if (!response.ok) {
        throw new Error('NETWORK');
      }

      const data = await response.json();

      if (data?.stdout !== undefined || data?.stderr !== undefined || data?.compile_output !== undefined) {
        if (data.compile_output) {
          setOutput(data.compile_output + (data.stderr || ''));
          setIsError(true);
        } else if (data.stderr) {
          setOutput(data.stderr + (data.stdout || ''));
          setIsError(true);
        } else {
          setOutput(data.stdout || tr.noOutput);
        }
      } else {
        // Unexpected shape — treat as runtime error
        setOutput(tr.runtimeErr);
        setIsError(true);
      }
    } catch (err) {
      const kind = err instanceof Error ? err.message : '';
      const msg =
        kind === 'RATE_LIMITED' ? tr.rateErr :
        kind === 'AUTH' ? tr.authErr :
        kind === 'NETWORK' ? tr.networkErr :
        // Catch "Failed to fetch" / "NetworkError" thrown by the browser when
        // the request can't reach the host (offline, DNS, CSP block).
        /failed to fetch|networkerror|load failed/i.test(kind) ? tr.networkErr :
        tr.runtimeErr;
      setOutput(msg);
      setIsError(true);
    } finally {
      setIsRunning(false);
    }
  }, [code, selectedLang, tr]);

  const confirmReset = () => {
    setCode(selectedLang.starter);
    setOutput('');
    setIsError(false);
    setResetOpen(false);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be blocked (insecure context, permissions). Fail silently
      // rather than throw — UI stays usable.
    }
  };

  const switchLang = (langId: string) => {
    const found = LANGUAGES.find((l) => l.id === langId);
    if (!found) return;
    setSelectedLang(found);
    setCode(found.starter);
    setOutput('');
    setIsError(false);
    setDropdownOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 h-[calc(100vh-120px)] flex flex-col gap-6">
      <ResetConfirm
        open={resetOpen}
        title={tr.resetTitle}
        body={tr.resetBody}
        confirmLabel={tr.resetConfirm}
        cancelLabel={tr.resetCancel}
        onConfirm={confirmReset}
        onCancel={() => setResetOpen(false)}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-3">
            <Code className="text-blue-500" size={32} />
            {tr.title}
            <Sparkles className="text-amber-400" size={24} />
          </h1>
          <p className="text-app-fg/60 font-bold mt-1">
            {tr.subtitle}
          </p>
        </div>

        {activeTab === 'code' ? (
          <div className="flex items-center gap-3">
            {/* State-based dropdown — works on mobile tap */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={dropdownOpen}
                aria-label={tr.selectLang}
                className="flex items-center gap-3 px-4 py-2 bg-panel border-2 border-border-subtle rounded-xl font-bold hover:border-blue-500/50 transition-all min-w-[140px]"
              >
                <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 text-xs font-black">
                  {selectedLang.icon}
                </span>
                {selectedLang.name}
                <ChevronDown size={16} className={clsx('ml-auto opacity-40 transition-transform', dropdownOpen && 'rotate-180')} />
              </button>

              {dropdownOpen && (
                <div role="listbox" className="absolute top-full left-0 right-0 mt-2 bg-panel border-2 border-border-subtle rounded-2xl shadow-2xl overflow-hidden z-50">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.id}
                      role="option"
                      aria-selected={selectedLang.id === lang.id}
                      onClick={() => switchLang(lang.id)}
                      className={clsx(
                        "w-full px-4 py-3 text-left font-bold flex items-center gap-3 hover:bg-blue-500/10 transition-colors",
                        selectedLang.id === lang.id ? "text-blue-400 bg-blue-500/5" : "text-app-fg/60"
                      )}
                    >
                      <span className="w-6 h-6 rounded-md bg-app-bg flex items-center justify-center text-[10px] font-black">
                        {lang.icon}
                      </span>
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={runCode}
              disabled={isRunning}
              aria-label={tr.run}
              className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-xl font-black shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isRunning ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Play size={20} fill="currentColor" />
              )}
              {tr.run}
            </button>
          </div>
        ) : (
          /* Placeholder so the header layout doesn't collapse on the visualizer tab */
          <div className="hidden md:block" />
        )}
      </div>

      {/* Top-level tab switcher (Code vs Visualizer) */}
      <div className="flex gap-2 border-b-2 border-border-subtle">
        <button
          onClick={() => setActiveTab('code')}
          className={clsx(
            'px-4 py-2 font-black text-sm uppercase tracking-widest border-b-4 transition-all',
            activeTab === 'code'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-app-fg/40 hover:text-app-fg'
          )}
        >
          {tr.codeTab}
        </button>
        <button
          onClick={() => setActiveTab('visualizer')}
          className={clsx(
            'px-4 py-2 font-black text-sm uppercase tracking-widest border-b-4 transition-all flex items-center gap-2',
            activeTab === 'visualizer'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-app-fg/40 hover:text-app-fg'
          )}
        >
          {tr.visualizerTab}
        </button>
      </div>

      {/* Body */}
      {activeTab === 'code' ? (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        {/* Editor Area */}
        <div className="flex flex-col bg-panel border-2 border-border-subtle rounded-3xl overflow-hidden shadow-xl">
          <div className="px-6 py-3 bg-app-bg/20 border-b-2 border-border-subtle flex items-center justify-between">
            <span className="text-xs font-black text-app-fg/40 uppercase tracking-widest">
              {tr.editor}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={copyCode}
                aria-label={tr.copy}
                title={copied ? tr.copied : tr.copy}
                className="p-2 hover:bg-app-bg rounded-lg text-app-fg/40 hover:text-app-fg transition-all"
              >
                <Copy size={16} />
              </button>
              <button
                onClick={() => setResetOpen(true)}
                aria-label={tr.reset}
                title={tr.reset}
                className="p-2 hover:bg-app-bg rounded-lg text-app-fg/40 hover:text-app-fg transition-all"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
          <div className="flex-1 relative">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              aria-label={tr.editor}
              className="absolute inset-0 w-full h-full p-6 font-mono text-base bg-transparent resize-none focus:outline-none custom-scrollbar"
              placeholder={tr.placeholder}
            />
          </div>
        </div>

        {/* Console Area */}
        <div className="flex flex-col bg-[#0d1117] border-2 border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <div className="px-6 py-3 bg-white/5 border-b border-white/10 flex items-center gap-2">
            <Terminal size={16} className="text-emerald-500" />
            <span className="text-xs font-black text-white/40 uppercase tracking-widest">
              {tr.console}
            </span>
          </div>
          <div
            aria-live="polite"
            aria-atomic="true"
            className={clsx(
              "flex-1 p-6 font-mono text-sm overflow-y-auto custom-scrollbar whitespace-pre-wrap",
              isError ? "text-rose-400" : "text-emerald-400"
            )}
          >
            {output || (
              <span className="text-white/20 italic">
                {tr.empty}
              </span>
            )}
          </div>
        </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-4 min-h-0">
          {/* Visualizer sub-tabs (former DSA Playground contents) */}
          <div className="flex overflow-x-auto gap-2 pb-2 shrink-0 hide-scrollbar">
            {(
              [
                { id: 'sorting', icon: AlignLeft, label: tr.sorting },
                { id: 'tree', icon: Network, label: tr.tree },
                { id: 'graph', icon: Boxes, label: tr.graph },
                { id: 'stack_queue', icon: Layers, label: tr.stackQueue },
                { id: 'array', icon: Type, label: tr.array },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setVisualizerTab(tab.id)}
                className={clsx(
                  'px-4 py-3 rounded-xl flex items-center gap-2 font-semibold whitespace-nowrap transition-all',
                  visualizerTab === tab.id
                    ? 'gradient-brand text-white shadow-lg shadow-brand-500/20'
                    : 'glass text-app-fg-muted hover:text-app-fg hover:bg-app-fg/5'
                )}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex-1 glass rounded-3xl p-6 relative overflow-hidden flex flex-col border border-brand-500/20 shadow-[0_8px_32px_rgba(108,61,232,0.1)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={visualizerTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 h-full"
              >
                {visualizerTab === 'sorting' && <SortingVisualizer />}
                {visualizerTab === 'tree' && <TreeVisualizer />}
                {visualizerTab === 'graph' && <GraphVisualizer />}
                {visualizerTab === 'stack_queue' && <StackQueueVisualizer />}
                {visualizerTab === 'array' && <ArrayVisualizer />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}

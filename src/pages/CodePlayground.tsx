import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Play, RotateCcw, Copy, Code, Terminal, Sparkles, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { useSettingsStore } from '@/store/settingsStore';

// C++ hidden for beta release — code kept for later
const LANGUAGES = [
  { id: 'python', name: 'Python', version: '3.10.0', icon: 'Py', starter: 'print("Hello, py.cholosikhi!")\n\n# Try writing some code here\nfor i in range(5):\n    print(f"Step {i}")' }
];

export default function CodePlayground() {
  const { language: uiLang } = useSettingsStore();
  const location = useLocation();
  const initialData = location.state as { code?: string; lang?: string } | null;
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [selectedLang, setSelectedLang] = useState(() => {
    if (initialData?.lang) {
      return LANGUAGES.find(l => l.id === initialData.lang) || LANGUAGES[0];
    }
    return LANGUAGES[0];
  });
  const [code, setCode] = useState(initialData?.code || selectedLang.starter);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (initialData?.code) setCode(initialData.code);
    if (initialData?.lang) {
      const lang = LANGUAGES.find(l => l.id === initialData.lang);
      if (lang) setSelectedLang(lang);
    }
  }, [initialData]);

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

  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isError, setIsError] = useState(false);

  const runCode = async () => {
    setIsRunning(true);
    setIsError(false);
    setOutput(uiLang === 'bn' ? 'চালানো হচ্ছে...' : 'Running...');

    try {
      const response = await fetch('https://ce.judge0.com/submissions?base64_encoded=false&wait=true', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_code: code,
          language_id: selectedLang.id === 'cpp' ? 54 : 71,
          stdin: ''
        })
      });

      const data = await response.json();

      if (data.stdout !== undefined || data.stderr !== undefined || data.compile_output !== undefined) {
        if (data.stderr || data.compile_output) {
          setOutput((data.stderr || data.compile_output) + (data.stdout || ''));
          setIsError(true);
        } else {
          setOutput(data.stdout || (uiLang === 'bn' ? '(কোন আউটপুট নেই)' : '(No output)'));
        }
      } else {
        throw new Error('Execution failed');
      }
    } catch {
      setOutput(uiLang === 'bn' ? 'কোড চালাতে সমস্যা হচ্ছে।' : 'Failed to run code.');
      setIsError(true);
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    if (confirm(uiLang === 'bn' ? 'আপনি কি কোডটি রিসেট করতে চান?' : 'Reset the code?')) {
      setCode(selectedLang.starter);
      setOutput('');
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 h-[calc(100vh-120px)] flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-3">
            <Code className="text-blue-500" size={32} />
            {uiLang === 'bn' ? 'কোড প্লেগ্রাউন্ড' : 'Code Playground'}
            <Sparkles className="text-amber-400" size={24} />
          </h1>
          <p className="text-app-fg/60 font-bold mt-1">
            {uiLang === 'bn' ? 'আপনার আইডিয়াগুলো এখানে টেস্ট করুন' : 'Test your ideas instantly in the cloud'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* State-based dropdown — works on mobile tap */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(prev => !prev)}
              className="flex items-center gap-3 px-4 py-2 bg-panel border-2 border-border-subtle rounded-xl font-bold hover:border-blue-500/50 transition-all min-w-[140px]"
            >
              <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 text-xs font-black">
                {selectedLang.icon}
              </span>
              {selectedLang.name}
              <ChevronDown size={16} className={clsx('ml-auto opacity-40 transition-transform', dropdownOpen && 'rotate-180')} />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-panel border-2 border-border-subtle rounded-2xl shadow-2xl overflow-hidden z-50">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.id}
                    onClick={() => {
                      setSelectedLang(lang);
                      setCode(lang.starter);
                      setOutput('');
                      setDropdownOpen(false);
                    }}
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
            className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-xl font-black shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all"
          >
            {isRunning ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Play size={20} fill="currentColor" />
            )}
            {uiLang === 'bn' ? 'রান করুন' : 'RUN'}
          </button>
        </div>
      </div>

      {/* Editor & Console Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        {/* Editor Area */}
        <div className="flex flex-col bg-panel border-2 border-border-subtle rounded-3xl overflow-hidden shadow-xl">
          <div className="px-6 py-3 bg-app-bg/20 border-b-2 border-border-subtle flex items-center justify-between">
            <span className="text-xs font-black text-app-fg/40 uppercase tracking-widest">
              {uiLang === 'bn' ? 'এডিটর' : 'EDITOR'}
            </span>
            <div className="flex items-center gap-2">
              <button onClick={copyCode} className="p-2 hover:bg-app-bg rounded-lg text-app-fg/40 hover:text-app-fg transition-all">
                <Copy size={16} />
              </button>
              <button onClick={resetCode} className="p-2 hover:bg-app-bg rounded-lg text-app-fg/40 hover:text-app-fg transition-all">
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
          <div className="flex-1 relative">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="absolute inset-0 w-full h-full p-6 font-mono text-base bg-transparent resize-none focus:outline-none custom-scrollbar"
              placeholder={uiLang === 'bn' ? 'এখানে আপনার কোড লিখুন...' : 'Write your code here...'}
            />
          </div>
        </div>

        {/* Console Area */}
        <div className="flex flex-col bg-[#0d1117] border-2 border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <div className="px-6 py-3 bg-white/5 border-b border-white/10 flex items-center gap-2">
            <Terminal size={16} className="text-emerald-500" />
            <span className="text-xs font-black text-white/40 uppercase tracking-widest">
              {uiLang === 'bn' ? 'কনসোল' : 'CONSOLE'}
            </span>
          </div>
          <div className={clsx(
            "flex-1 p-6 font-mono text-sm overflow-y-auto custom-scrollbar whitespace-pre-wrap",
            isError ? "text-rose-400" : "text-emerald-400"
          )}>
            {output || (
              <span className="text-white/20 italic">
                {uiLang === 'bn' ? '> আউটপুট এখানে দেখা যাবে' : '> Output will appear here'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

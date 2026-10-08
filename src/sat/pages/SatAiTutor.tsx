import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, Copy, Check, User, Calculator, BookOpen, Clock, HelpCircle, Compass } from 'lucide-react';
import { clsx } from 'clsx';
import { chatWithSatTutor, type SatChatMessage } from '../services/satAiService';
import MathRenderer from '../components/MathRenderer';
import { play } from '../../lib/audio';

// Code / Desmos formula block renderer
const CodeBlock = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    play('tap');
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-3 rounded-2xl overflow-hidden bg-slate-950/80 border border-border-subtle shadow-lg">
      <div className="flex justify-between items-center px-4 py-2 bg-panel border-b border-border-subtle">
        <span className="text-[11px] font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
          <Calculator size={12} />
          <span>Formula / Code</span>
        </span>
        <button
          onClick={handleCopy}
          className="p-1 hover:bg-white/10 rounded-lg text-app-fg/60 hover:text-white transition-colors"
          title="Copy to clipboard"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs sm:text-sm text-cyan-100 font-mono leading-relaxed select-text">
        <code>{code}</code>
      </pre>
    </div>
  );
};

// Message content parser with MathRenderer and code split
const SatMessageContent = ({ content }: { content: string }) => {
  if (!content.includes('```')) {
    return <MathRenderer content={content} className="text-sm sm:text-base leading-relaxed" />;
  }

  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const lines = part.slice(3, -3).split('\n');
          if (lines[0] && !lines[0].includes(' ') && !lines[0].includes('(')) {
            lines.shift();
          }
          const code = lines.join('\n').trim();
          return <CodeBlock key={index} code={code} />;
        }
        return part.trim() ? (
          <MathRenderer key={index} content={part} className="text-sm sm:text-base leading-relaxed" />
        ) : null;
      })}
    </div>
  );
};

export default function SatAiTutor() {
  const [messages, setMessages] = useState<SatChatMessage[]>([
    {
      role: 'assistant',
      content:
        "🦉 **Hello, Digital SAT Scholar!** I am **Nini**, your 24/7 AI Master Coach on CholoSikhi SAT Suite.\n\nAsk me about:\n- 📐 **Math & Desmos:** Equations, circle formulas, regression tricks, geometry proofs\n- 📖 **Reading & Writing:** Words in Context, Transition words, Rhetorical synthesis\n- ⏱️ **Exam Strategy:** 400–1600 pacing, eliminating traps, Bluebook calculator mastery\n\nYou can ask in English or Bengali (বাংলা)!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<'all' | 'math' | 'rw' | 'strategy'>('all');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (text: string = input) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    play('tap');
    const userMsg: SatChatMessage = { role: 'user', content: trimmed };
    const newMessages = [...messages, userMsg];

    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithSatTutor(newMessages, {
        section: activeSection === 'all' ? undefined : activeSection,
      });
      setMessages([...newMessages, { role: 'assistant', content: response }]);
      play('correct');
    } catch (error) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content:
            "🦉 I'm having a brief connection delay. Please ask again in a moment!"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (text: string, idx: number) => {
    play('tap');
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const suggestions = [
    { label: '📐 Desmos Tricks', prompt: 'Show me the top 3 Desmos calculator tricks for Digital SAT Math systems and roots.' },
    { label: '🎯 Quadratic Discriminant', prompt: 'Explain the quadratic formula and how discriminant b² - 4ac determines the number of solutions with an example.' },
    { label: '✍️ SAT Transition Rules', prompt: 'What are the rules for transition words on SAT Reading & Writing (However vs Furthermore vs Therefore)?' },
    { label: '📖 Vocab in Context', prompt: 'How should I approach "Words in Context" questions without memorizing the whole dictionary?' },
    { label: '⏱️ Module Pacing Strategy', prompt: 'What is the optimal pacing strategy for Digital SAT Module 1 and Module 2?' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* ─── Header Banner ────────────────────────────────────────────── */}
      <div className="glass p-6 sm:p-8 rounded-[2.5rem] border border-blue-500/20 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="relative shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-blue-500/10 border-2 border-blue-500/30 flex items-center justify-center shadow-xl overflow-hidden p-1.5">
              <img
                src="/mascot/nini-right.png"
                alt="Nini SAT Coach"
                className="w-full h-full object-contain drop-shadow-md"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-app-bg flex items-center justify-center shadow-md">
              <Sparkles size={10} className="text-white" />
            </span>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-wider mb-1">
              <Sparkles size={12} />
              <span>Digital SAT 24/7 AI Coach</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-app-fg tracking-tight">
              Nini AI SAT Tutor
            </h1>
            <p className="text-xs sm:text-sm text-app-fg/60 font-medium">
              Socratic breakdowns for College Board Math, Desmos graphing, and Reading & Writing
            </p>
          </div>
        </div>

        {/* Section Focus Pill Selector */}
        <div className="flex bg-panel border border-border-subtle p-1 rounded-2xl gap-1 shrink-0 flex-wrap justify-center">
          {[
            { id: 'all', label: 'All Topics', icon: Compass },
            { id: 'math', label: 'Math & Desmos', icon: Calculator },
            { id: 'rw', label: 'Reading & Writing', icon: BookOpen },
            { id: 'strategy', label: 'Test Strategy', icon: Clock }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  play('tap');
                  setActiveSection(tab.id as any);
                }}
                className={clsx(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs transition-all",
                  activeSection === tab.id
                    ? "bg-blue-500 text-white shadow-md shadow-blue-500/30"
                    : "text-app-fg/50 hover:text-app-fg hover:bg-white/5"
                )}
              >
                <Icon size={13} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Chat Conversation Stream ─────────────────────────────────── */}
      <div className="glass rounded-[2.5rem] border border-border-subtle p-4 sm:p-6 min-h-[460px] max-h-[620px] flex flex-col justify-between shadow-2xl relative">
        <div className="overflow-y-auto space-y-5 pr-2 flex-1 scrollbar-thin">
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={clsx(
                  "flex gap-3 max-w-[92%] sm:max-w-[85%]",
                  isUser ? "self-end ml-auto flex-row-reverse" : "self-start mr-auto"
                )}
              >
                {/* Avatar Icon */}
                <div
                  className={clsx(
                    "w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 shadow-md border",
                    isUser
                      ? "bg-blue-500 text-white border-blue-400/40"
                      : "bg-blue-500/10 border-blue-500/30 text-blue-400 overflow-hidden p-1"
                  )}
                >
                  {isUser ? (
                    <User size={18} />
                  ) : (
                    <img src="/mascot/nini-right.png" alt="Nini" className="w-full h-full object-contain" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={clsx(
                    "relative group px-5 py-4 rounded-3xl text-sm leading-relaxed border shadow-md",
                    isUser
                      ? "bg-blue-600 text-white border-blue-500 rounded-tr-sm font-semibold"
                      : "bg-panel-solid/90 border-border-subtle text-app-fg rounded-tl-sm"
                  )}
                >
                  <SatMessageContent content={msg.content} />

                  {!isUser && (
                    <button
                      onClick={() => handleCopyMessage(msg.content, idx)}
                      className="absolute -right-10 top-2 p-2 rounded-xl bg-panel border border-border-subtle text-app-fg/40 hover:text-app-fg opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Copy message"
                    >
                      {copiedIndex === idx ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 max-w-[85%] self-start"
            >
              <div className="w-9 h-9 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0 p-1">
                <img src="/mascot/nini-wrong.png" alt="Nini Thinking" className="w-full h-full object-contain animate-bounce" />
              </div>
              <div className="px-5 py-4 rounded-3xl bg-panel-solid border border-border-subtle rounded-tl-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse delay-150" />
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse delay-300" />
                <span className="text-xs font-bold text-app-fg/60 ml-2">Nini is preparing your SAT breakdown...</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ─── Suggestion Prompts ────────────────────────────────────────── */}
        {messages.length <= 2 && (
          <div className="pt-4 border-t border-border-subtle mt-4 space-y-2">
            <div className="text-[10px] font-black uppercase text-app-fg/40 tracking-wider flex items-center gap-1.5">
              <HelpCircle size={12} />
              <span>Suggested SAT Practice Inquiries:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(s.prompt)}
                  className="px-3.5 py-1.5 rounded-xl bg-app-bg hover:bg-blue-500/10 border border-border-subtle hover:border-blue-500/30 text-xs font-bold text-app-fg/80 hover:text-blue-400 transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ─── Message Input Bar ────────────────────────────────────────── */}
        <div className="pt-4 mt-3 border-t border-border-subtle flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Ask Nini about any SAT math problem, Desmos trick, or grammar rule..."
            className="flex-1 px-5 py-3.5 rounded-2xl bg-app-bg border border-border-subtle font-bold text-sm text-app-fg placeholder:text-app-fg/30 focus:outline-none focus:border-blue-500 transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="p-3.5 rounded-2xl bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white font-black shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center shrink-0"
            title="Send inquiry"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

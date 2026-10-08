import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, Copy, Check, User, Terminal, Code2, HelpCircle } from 'lucide-react';
import clsx from 'clsx';
import { useSettingsStore } from '@/store/settingsStore';
import { chatWithHistory, type ChatMessage } from '@/services/aiService';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { play } from '@/lib/audio';

// CodeBlock renderer component
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
          <Terminal size={12} />
          <span>Python Code</span>
        </span>
        <button 
          onClick={handleCopy}
          className="p-1 hover:bg-white/10 rounded-lg text-app-fg/60 hover:text-white transition-colors"
          title="Copy code"
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

// Message renderer that splits text and code with rich Markdown parsing
const MessageContent = ({ content }: { content: string }) => {
  if (!content.includes('```')) {
    return <MarkdownRenderer content={content} />;
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
          <MarkdownRenderer key={index} content={part} />
        ) : null;
      })}
    </div>
  );
};

export default function AiTutor() {
  const { language } = useSettingsStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const isBn = language === 'bn';

  useEffect(() => {
    // Initial welcome message (English primary, mentioning Bangla)
    setMessages([
      {
        role: 'assistant',
        content: isBn 
          ? '👋 **হ্যালো! আমি নিনি (Nini)**, চলোশিখির এআই প্রোগ্রামিং টিউটর!\n\nপাইথন সিনট্যাক্স, ভেরিয়েবল, লুপ, ফাংশন, অ্যালগরিদম বা কোড ডিবাগিং নিয়ে যেকোনো প্রশ্ন আমাকে করতে পারো।\n\nYou can also chat in **English**!'
          : '👋 **Hello! I am Nini**, your AI Programming Tutor on CholoSikhi Academy.\n\nI can help you master:\n- 🐍 **Python Syntax:** Variables, loops, functions, and OOP\n- 🧩 **Data Structures & Algorithms:** Lists, dicts, recursion, and sorting\n- 🐞 **Debugging & Code Review:** Finding syntax errors and logic flaws\n\nFeel free to ask in **English** or **বাংলা (Bengali)**!'
      }
    ]);
  }, [language, isBn]);

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
    const userMsg: ChatMessage = { role: 'user', content: trimmed };
    const newMessages = [...messages, userMsg];
    
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithHistory(newMessages, { language });
      setMessages([...newMessages, { role: 'assistant', content: response }]);
      play('correct');
    } catch (error) {
      setMessages([
        ...newMessages, 
        { 
          role: 'assistant', 
          content: isBn 
            ? '🦉 সংযোগে সামান্য বিলম্ব হচ্ছে। অনুগ্রহ করে কিছুক্ষণ পর আবার প্রশ্ন করুন।' 
            : "🦉 I'm having a brief connection delay. Please ask again in a moment!"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (text: string, index: number) => {
    play('tap');
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const suggestions = isBn 
    ? [
        { label: '🐍 পাইথন কী?', prompt: 'Python প্রোগ্রামিং ভাষার মূল বৈশিষ্ট্য এবং সুবিধা কী কী?' },
        { label: '🔁 লুপ কীভাবে কাজ করে?', prompt: 'Python-এ for loop এবং while loop কীভাবে কাজ করে উদাহরণসহ বুঝিয়ে দাও।' },
        { label: '📦 ফাংশন ও রিটার্ন', prompt: 'Python-এ ফাংশন কীভাবে ডিফাইন করতে হয় এবং return স্টেটমেন্ট কীভাবে কাজ করে?' },
        { label: '🐛 ডিবাগিং কৌশল', prompt: 'Python কোডে IndentationError বা SyntaxError হলে কীভাবে সমাধান করব?' }
      ]
    : [
        { label: '🐍 What is Python?', prompt: 'Explain the core features of Python and why it is great for beginners.' },
        { label: '🔁 How Loops Work', prompt: 'Explain the difference between for and while loops in Python with examples.' },
        { label: '📦 Functions & Return', prompt: 'How do functions and return statements work in Python?' },
        { label: '🐛 Debugging Guide', prompt: 'What are the top 3 techniques for debugging Python code and syntax errors?' }
      ];

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] pb-4 px-4 md:px-8 max-w-5xl mx-auto space-y-4">
      {/* Header Banner */}
      <div className="glass p-5 sm:p-6 rounded-[2.5rem] border border-purple-500/20 relative overflow-hidden shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="relative shrink-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-purple-500/10 border-2 border-purple-500/30 flex items-center justify-center shadow-xl overflow-hidden p-1">
              <img
                src="/mascot/nini-right.png"
                alt="Nini Code Tutor"
                className="w-full h-full object-contain drop-shadow-md"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-app-bg flex items-center justify-center shadow-md">
              <Sparkles size={8} className="text-white" />
            </span>
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-black uppercase tracking-wider mb-0.5">
              <Code2 size={12} />
              <span>Python & CS AI Tutor</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-app-fg">
              {isBn ? 'নিনি এআই টিউটর' : 'Nini AI Code Tutor'}
            </h1>
            <p className="text-xs sm:text-sm text-app-fg/60 font-medium">
              {isBn ? 'পাইথন প্রোগ্রামিং, অ্যালগরিদম ও কোড ডিবাগিং মেন্টর' : 'Interactive Python, algorithms, and debugging mentor'}
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto bg-panel border border-border-subtle rounded-[2.5rem] p-4 sm:p-6 flex flex-col gap-4 shadow-2xl relative">
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={idx}
              className={clsx(
                "flex gap-3 max-w-[92%] sm:max-w-[85%]",
                isUser ? "self-end ml-auto flex-row-reverse" : "self-start mr-auto"
              )}
            >
              <div className={clsx(
                "w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 shadow-md border",
                isUser 
                  ? "bg-purple-600 text-white border-purple-500" 
                  : "bg-purple-500/10 border-purple-500/30 text-purple-400 overflow-hidden p-1"
              )}>
                {isUser ? <User size={18} /> : <img src="/mascot/nini-right.png" alt="Nini" className="w-full h-full object-contain" />}
              </div>
              
              <div className={clsx(
                "px-5 py-4 rounded-3xl relative group text-sm leading-relaxed border shadow-md",
                isUser 
                  ? "bg-purple-600 text-white border-purple-500 rounded-tr-sm font-semibold" 
                  : "bg-panel-solid/90 border-border-subtle text-app-fg rounded-tl-sm"
              )}>
                <MessageContent content={msg.content} />
                
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
            <div className="w-9 h-9 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0 p-1">
              <img src="/mascot/nini-wrong.png" alt="Nini Thinking" className="w-full h-full object-contain animate-bounce" />
            </div>
            <div className="px-5 py-4 rounded-3xl bg-panel-solid border border-border-subtle rounded-tl-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="text-xs font-bold text-app-fg/60 ml-2">Nini is analyzing the code...</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Inquiries */}
      {messages.length <= 2 && (
        <div className="pt-2 shrink-0 space-y-1.5">
          <div className="text-[10px] font-black uppercase text-app-fg/40 tracking-wider flex items-center gap-1.5">
            <HelpCircle size={12} />
            <span>Suggested Coding Inquiries:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(s.prompt)}
                className="px-3.5 py-1.5 bg-app-bg hover:bg-purple-500/10 border border-border-subtle hover:border-purple-500/30 rounded-xl text-xs font-bold text-app-fg/80 hover:text-purple-400 transition-all active:scale-95 flex items-center gap-1.5"
              >
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="flex gap-2 shrink-0 pt-1">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder={isBn ? "নিনিকে পাইথন বা প্রোগ্রামিং সম্পর্কে প্রশ্ন করুন..." : "Ask Nini about Python syntax, loops, data structures, or debugging..."}
          className="flex-1 bg-app-bg border border-border-subtle rounded-2xl px-5 py-3.5 text-app-fg placeholder:text-app-fg/30 focus:outline-none focus:border-purple-500 font-bold text-sm transition-all"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white px-5 py-3.5 rounded-2xl transition-all shadow-lg shadow-purple-600/30 font-black shrink-0 flex items-center justify-center active:scale-95"
          title="Send message"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

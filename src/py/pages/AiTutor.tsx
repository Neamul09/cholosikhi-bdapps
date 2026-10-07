import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, Sparkles, Copy, Check, User } from 'lucide-react';
import clsx from 'clsx';
import { useSettingsStore } from '@/store/settingsStore';
import { chatWithHistory, type ChatMessage } from '@/services/aiService';

// CodeBlock renderer component
const CodeBlock = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-3 rounded-xl overflow-hidden bg-[#1e1e1e] border border-[#333]">
      <div className="flex justify-between items-center px-4 py-2 bg-[#2d2d2d] border-b border-[#333]">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Code</span>
        <button 
          onClick={handleCopy}
          className="p-1.5 hover:bg-[#3d3d3d] rounded-md text-gray-400 hover:text-white transition-colors"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm text-[#e4e4e4] font-mono leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
};

// Message renderer that splits text and code
const MessageContent = ({ content }: { content: string }) => {
  if (!content.includes('```')) {
    return <p className="whitespace-pre-wrap">{content}</p>;
  }

  const parts = content.split(/(```[\s\S]*?```)/g);
  
  return (
    <div className="space-y-2">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          // Extract code, removing the ```language and trailing ```
          const codeLines = part.slice(3, -3).split('\n');
          // Remove first line if it's just the language name (no spaces)
          if (codeLines[0] && !codeLines[0].includes(' ') && !codeLines[0].includes('(')) {
             codeLines.shift();
          }
          const code = codeLines.join('\n').trim();
          return <CodeBlock key={index} code={code} />;
        }
        
        return part.trim() ? (
          <p key={index} className="whitespace-pre-wrap">{part}</p>
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
    // Initial welcome message
    setMessages([
      {
        role: 'assistant',
        content: isBn 
          ? 'হ্যালো! আমি নিনি, আপনার এআই কোডিং টিউটর। আমি আপনাকে প্রোগ্রামিং শিখতে সাহায্য করতে পারি। আপনি আমাকে যেকোনো প্রশ্ন করতে পারেন!' 
          : 'Hello! I am Nini, your AI coding tutor. I can help you learn programming. Feel free to ask me any questions!'
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
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithHistory(newMessages, { language });
      setMessages([...newMessages, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages([
        ...newMessages, 
        { 
          role: 'assistant', 
          content: isBn 
            ? 'দুঃখিত, এই মুহূর্তে আমি উত্তর দিতে পারছি না। একটু পরে আবার চেষ্টা করুন।' 
            : 'Sorry, I cannot respond right now. Please try again later.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const suggestions = isBn 
    ? ['পাইথন কী?', 'ভেরিয়েবল কী?', 'লুপ কীভাবে কাজ করে?']
    : ['What is Python?', 'What is a variable?', 'How do loops work?'];

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] pb-4 px-4 md:px-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6 shrink-0 mt-4">
        <div className="p-3 bg-purple-500/20 text-purple-400 rounded-2xl">
          <Sparkles size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-app-fg">
            {isBn ? 'এআই টিউটর' : 'AI Tutor'}
          </h1>
          <p className="text-gray-400 font-medium text-sm">
            {isBn ? 'নিনির সাথে কোডিং শিখুন' : 'Learn coding with Nini'}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-panel border-2 border-border-subtle rounded-3xl p-4 flex flex-col gap-6 relative">
        {messages.map((msg, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={idx}
            className={clsx(
              "flex gap-3 max-w-[85%]",
              msg.role === 'user' ? "self-end flex-row-reverse" : "self-start"
            )}
          >
            <div className={clsx(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
              msg.role === 'user' ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"
            )}>
              {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
            </div>
            
            <div className={clsx(
              "px-4 py-3 rounded-2xl relative group font-medium text-sm md:text-base leading-relaxed",
              msg.role === 'user' 
                ? "bg-blue-600 text-white rounded-tr-sm" 
                : "bg-app-bg border-2 border-border-subtle text-gray-200 rounded-tl-sm"
            )}>
              <MessageContent content={msg.content} />
              
              {msg.role === 'assistant' && (
                <button
                  onClick={() => handleCopyMessage(msg.content, idx)}
                  className="absolute -right-12 top-2 p-2 rounded-xl bg-panel border-2 border-border-subtle text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Copy message"
                >
                  {copiedIndex === idx ? <Check size={16} /> : <Copy size={16} />}
                </button>
              )}
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 max-w-[85%] self-start"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-purple-500/20 text-purple-400 mt-1">
              <Bot size={18} />
            </div>
            <div className="px-4 py-4 rounded-2xl bg-app-bg border-2 border-border-subtle rounded-tl-sm flex items-center gap-1.5 h-12">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length === 1 && (
        <div className="flex flex-wrap gap-2 mt-4 shrink-0">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(suggestion)}
              className="px-4 py-2 bg-panel border-2 border-border-subtle rounded-xl text-sm font-bold text-gray-300 hover:bg-[#2d2f36] hover:border-gray-400 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 flex gap-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder={isBn ? "নিনিকে কিছু জিজ্ঞাসা করুন..." : "Ask Nini something..."}
          className="flex-1 bg-panel border-2 border-border-subtle rounded-2xl px-4 py-3 text-app-fg focus:outline-none focus:border-blue-500 font-bold"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white p-3 rounded-2xl transition-colors shrink-0 flex items-center justify-center"
        >
          <Send size={24} />
        </button>
      </div>
    </div>
  );
}

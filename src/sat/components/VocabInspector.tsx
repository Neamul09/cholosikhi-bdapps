import { useState } from 'react';
import { X, Search, BookOpen, Star, Sparkles, Check, Bot, Loader2, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';
import { SAT_VOCAB_LIST } from '../data/vocabData';
import type { SatVocabItem } from '../types';
import { updateVocabMastery } from '../lib/satStorage';
import { generateVocabMnemonic } from '../services/satAiService';
import MathRenderer from './MathRenderer';
import { play } from '../../lib/audio';

interface VocabInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  initialWord?: string;
}

export default function VocabInspector({ isOpen, onClose, initialWord = '' }: VocabInspectorProps) {
  const [searchQuery, setSearchQuery] = useState(initialWord);
  const [selectedWord, setSelectedWord] = useState<SatVocabItem | null>(() => {
    if (!initialWord) return SAT_VOCAB_LIST[0] || null;
    const clean = initialWord.toLowerCase().trim();
    return SAT_VOCAB_LIST.find(v => v.word.toLowerCase() === clean) || SAT_VOCAB_LIST[0];
  });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [aiMnemonic, setAiMnemonic] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  if (!isOpen) return null;

  const filteredWords = SAT_VOCAB_LIST.filter(v =>
    v.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.definition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (item: SatVocabItem) => {
    play('tap');
    setSelectedWord(item);
    setSavedSuccess(false);
    setAiMnemonic(null);
  };

  const handleGenerateAiMnemonic = async () => {
    if (!selectedWord) return;
    play('tap');
    setIsAiLoading(true);
    try {
      const result = await generateVocabMnemonic(selectedWord.word, selectedWord.definition);
      setAiMnemonic(result);
    } catch (e) {
      console.error(e);
      setAiMnemonic('Could not generate mnemonic. Please try again.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSaveToVault = (status: 'learning' | 'familiar' | 'mastered') => {
    if (!selectedWord) return;
    play('correct');
    updateVocabMastery(selectedWord.id, status);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-3xl h-[80vh] bg-panel-solid border-2 border-border-subtle rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between bg-panel">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <BookOpen size={20} />
            </div>
            <div>
              <h3 className="font-black text-base text-app-fg">SAT Reading Vocabulary Vault</h3>
              <p className="text-xs text-app-fg/50 font-bold">High-Frequency Context Terms & Definitions</p>
            </div>
          </div>

          <button
            onClick={() => {
              play('tap');
              onClose();
            }}
            className="p-2 rounded-2xl bg-panel border border-border-subtle hover:bg-white/10 text-app-fg transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search bar */}
        <div className="p-4 border-b border-border-subtle bg-app-bg">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-app-fg/40" size={17} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search high-frequency SAT words or definitions..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-panel border border-border-subtle text-app-fg font-bold text-sm focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        {/* Content split pane */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 overflow-hidden">
          {/* Words List */}
          <div className="sm:border-r border-border-subtle overflow-y-auto p-2 space-y-1 max-h-48 sm:max-h-full">
            {filteredWords.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                  selectedWord?.id === item.id
                    ? 'bg-violet-500 text-white shadow-md'
                    : 'hover:bg-panel text-app-fg/80'
                }`}
              >
                <div>
                  <span className="font-black capitalize">{item.word}</span>
                  <span className="text-[10px] ml-1.5 opacity-70 italic">{item.partOfSpeech}</span>
                </div>
                <div className="flex items-center gap-0.5 text-amber-300">
                  {Array.from({ length: item.frequencyRating || 3 }).map((_, i) => (
                    <Star key={i} size={10} fill="currentColor" />
                  ))}
                </div>
              </button>
            ))}
            {filteredWords.length === 0 && (
              <p className="p-4 text-center text-xs text-app-fg/40 font-bold">No matching SAT words found.</p>
            )}
          </div>

          {/* Word Detail */}
          <div className="sm:col-span-2 p-6 overflow-y-auto bg-panel/30 flex flex-col justify-between">
            {selectedWord ? (
              <div className="space-y-6">
                <div>
                  <div className="flex items-baseline gap-3">
                    <h2 className="text-3xl font-black capitalize text-app-fg">{selectedWord.word}</h2>
                    <span className="text-sm font-bold text-violet-400">{selectedWord.phonetic}</span>
                    <span className="text-xs px-2 py-0.5 rounded-lg bg-panel border border-border-subtle font-black uppercase text-app-fg/60">
                      {selectedWord.partOfSpeech}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-amber-400">
                    <span>SAT Frequency:</span>
                    <div className="flex">
                      {Array.from({ length: selectedWord.frequencyRating || 3 }).map((_, i) => (
                        <Star key={i} size={13} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                </div>


                {/* Definition */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-app-fg/50 mb-1">Definition in Context</h4>
                  <p className="text-base font-bold text-app-fg leading-relaxed">
                    {selectedWord.definition}
                  </p>
                </div>

                {/* Example sentence */}
                <div className="p-4 rounded-2xl bg-panel border border-border-subtle">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-app-fg/50 mb-1 flex items-center gap-1.5">
                    <Sparkles size={12} className="text-violet-400" />
                    <span>SAT Passage Context Example</span>
                  </h4>
                  <p className="text-sm font-bluebook-serif italic text-app-fg/90 leading-relaxed">
                    "{selectedWord.contextSentence}"
                  </p>
                </div>

                {/* Synonyms */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-app-fg/50 mb-2">High-Yield Synonyms</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedWord.synonyms?.map(syn => (
                      <span key={syn} className="px-3 py-1 rounded-xl bg-panel border border-border-subtle text-xs font-black text-violet-400">
                        {syn}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Nini AI Mnemonic & Memory Hook Generator */}
                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                        <Bot size={14} />
                      </div>
                      <span className="text-xs font-black text-app-fg">Nini AI Mnemonic & SAT Usage</span>
                    </div>

                    {!aiMnemonic ? (
                      <button
                        onClick={handleGenerateAiMnemonic}
                        disabled={isAiLoading}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <Sparkles size={12} />
                        <span>Generate Mnemonic</span>
                        <span className="text-[9px] px-1 rounded bg-white/20">Free</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleGenerateAiMnemonic}
                        disabled={isAiLoading}
                        className="p-1.5 rounded-lg bg-panel hover:bg-white/10 text-app-fg/60 hover:text-app-fg transition-all"
                        title="Regenerate"
                      >
                        <RefreshCw size={13} className={clsx(isAiLoading && "animate-spin")} />
                      </button>
                    )}
                  </div>

                  {isAiLoading ? (
                    <div className="p-4 flex items-center justify-center gap-2 text-xs font-bold text-indigo-400">
                      <Loader2 size={16} className="animate-spin" />
                      <span>Generating memory hook and SAT context...</span>
                    </div>
                  ) : aiMnemonic ? (
                    <div className="p-3 rounded-xl bg-app-bg/80 border border-border-subtle font-hind text-xs text-app-fg leading-relaxed sat-question-content space-y-2">
                      <MathRenderer content={aiMnemonic} />
                    </div>
                  ) : (
                    <p className="text-[11px] text-app-fg/60 font-medium">
                      Generate easy Bangla & English memory tricks to never forget this SAT word!
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm font-bold text-app-fg/40">Select a word from the list to view its details.</p>
            )}

            {/* Action Buttons */}
            {selectedWord && (
              <div className="pt-6 border-t border-border-subtle flex items-center justify-between gap-3">
                <span className="text-xs font-bold text-app-fg/50">Save to My Vocabulary Vault:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveToVault('familiar')}
                    className="px-4 py-2 rounded-xl bg-panel border border-border-subtle hover:bg-white/10 text-xs font-black transition-all text-app-fg"
                  >
                    Mark Familiar
                  </button>
                  <button
                    onClick={() => handleSaveToVault('mastered')}
                    className="btn-duo btn-duo-green px-4 py-2 text-xs flex items-center gap-1.5"
                  >
                    {savedSuccess ? <Check size={14} /> : null}
                    <span>{savedSuccess ? 'Mastered!' : 'Mark Mastered'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

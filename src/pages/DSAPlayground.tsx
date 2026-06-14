import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, AlignLeft, ArrowRightLeft, Layers, Type, Boxes } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import {
  SortingVisualizer,
  TreeVisualizer,
  StackQueueVisualizer,
  GraphVisualizer,
  ArrayVisualizer
} from '@/components/dsa';
import { clsx } from 'clsx';

export default function DSAPlayground() {
  const { language } = useSettingsStore();
  const [activeTab, setActiveTab] = useState('sorting');

  const t = (en: string, bn: string) => (language === 'bn' ? bn : en);

  const TABS = [
    { id: 'sorting', icon: AlignLeft, label: { en: 'Sorting', bn: 'সর্টিং' } },
    { id: 'tree', icon: Network, label: { en: 'Tree / BST', bn: 'ট্রি / BST' } },
    { id: 'graph', icon: Boxes, label: { en: 'Graphs', bn: 'গ্রাফ' } },
    { id: 'stack_queue', icon: Layers, label: { en: 'Stack/Queue', bn: 'স্ট্যাক/কিউ' } },
    { id: 'array', icon: Type, label: { en: 'Arrays & Pointers', bn: 'অ্যারে ও পয়েন্টার' } },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6 shrink-0">
        <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center text-white shadow-lg">
          <ArrowRightLeft size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black">{t('DSA Playground', 'ডিএসএ প্লেগ্রাউন্ড')}</h1>
          <p className="text-app-fg-muted text-sm">
            {t('Interactive visualizations for Data Structures & Algorithms', 'ডেটা স্ট্রাকচার ও অ্যালগরিদমের ইন্টারেক্টিভ ভিজুয়ালাইজেশন')}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 mb-6 pb-2 shrink-0 hide-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              'px-4 py-3 rounded-xl flex items-center gap-2 font-semibold whitespace-nowrap transition-all',
              activeTab === tab.id
                ? 'gradient-brand text-white shadow-lg shadow-brand-500/20'
                : 'glass text-app-fg-muted hover:text-app-fg hover:bg-app-fg/5'
            )}
          >
            <tab.icon size={18} />
            {t(tab.label.en, tab.label.bn)}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 glass rounded-3xl p-6 relative overflow-hidden flex flex-col border border-brand-500/20 shadow-[0_8px_32px_rgba(108,61,232,0.1)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 h-full"
          >
            {activeTab === 'sorting' && <SortingVisualizer />}
            {activeTab === 'tree' && <TreeVisualizer />}
            {activeTab === 'graph' && <GraphVisualizer />}
            {activeTab === 'stack_queue' && <StackQueueVisualizer />}
            {activeTab === 'array' && <ArrayVisualizer />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

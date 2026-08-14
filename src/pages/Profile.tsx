import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ShoppingBag, Settings as SettingsIcon, BarChart3 } from 'lucide-react';
import { clsx } from 'clsx';
import { useUserStore } from '@/store/userStore';
import { useSettingsStore } from '@/store/settingsStore';

import OverviewTab from './profile/OverviewTab';
import ShopTab from './profile/ShopTab';
import SettingsTab from './profile/SettingsTab';

type TabId = 'overview' | 'shop' | 'settings';

const TABS: Array<{
  id: TabId;
  Icon: typeof User;
  labelEn: string;
  labelBn: string;
}> = [
  { id: 'overview', Icon: BarChart3, labelEn: 'Overview', labelBn: 'ওভারভিউ' },
  { id: 'shop', Icon: ShoppingBag, labelEn: 'Shop', labelBn: 'দোকান' },
  { id: 'settings', Icon: SettingsIcon, labelEn: 'Settings', labelBn: 'সেটিংস' },
];

export default function ProfileView() {
  const { name } = useUserStore();
  const { language } = useSettingsStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // Tab comes from the URL so deep-links, refreshes and back/forward all work.
  const initialTab = (() => {
    const t = searchParams.get('tab');
    return t === 'shop' || t === 'settings' ? t : 'overview';
  })();
  const [tab, setTab] = useState<TabId>(initialTab);

  // Keep the URL in sync without pushing history entries for every tab click.
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (tab === 'overview') next.delete('tab');
    else next.set('tab', tab);
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-8 space-y-6 pb-24">
      {/* Profile mini-header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-400 border-2 border-blue-500/30 flex items-center justify-center">
          <User size={26} />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-black truncate">
            {name || (language === 'bn' ? 'কোডার' : 'Coder')}
          </h1>
          <p className="text-xs text-app-fg/50 font-bold uppercase tracking-widest">
            {language === 'bn' ? 'প্রোফাইল • সেটিংস • দোকান' : 'PROFILE • SETTINGS • SHOP'}
          </p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="sticky top-16 z-30 -mx-4 px-4 md:mx-0 md:px-0 bg-app-bg/80 backdrop-blur-md py-2">
        <div
          className="flex bg-panel border-2 border-border-subtle p-1 rounded-2xl gap-1 shadow-lg shadow-black/20"
          role="tablist"
          aria-label={language === 'bn' ? 'প্রোফাইল সেকশন' : 'Profile sections'}
        >
          {TABS.map(({ id, Icon, labelEn, labelBn }) => {
            const isActive = tab === id;
            return (
              <button
                key={id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tab-panel-${id}`}
                id={`tab-${id}`}
                onClick={() => setTab(id)}
                className={clsx(
                  'flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-black uppercase tracking-widest text-xs transition-all',
                  isActive
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : 'text-app-fg/50 hover:text-app-fg hover:bg-white/5',
                )}
              >
                <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                <span>{language === 'bn' ? labelBn : labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab panels */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          id={`tab-panel-${tab}`}
          role="tabpanel"
          aria-labelledby={`tab-${tab}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {tab === 'overview' && <OverviewTab />}
          {tab === 'shop' && <ShopTab />}
          {tab === 'settings' && <SettingsTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

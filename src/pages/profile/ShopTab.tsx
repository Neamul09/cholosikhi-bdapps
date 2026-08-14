import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Shield, Zap, Sparkles, Gem } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { useSettingsStore } from '@/store/settingsStore';
import { clsx } from 'clsx';

export default function ShopTab() {
  const { gems, hearts, refillHearts, buyStreakShield, streakShield, buyXPBoost, xpBoostUntil } = useUserStore();
  const { language } = useSettingsStore();

  // Tick every 30s so the boost countdown updates without re-deriving from
  // Date.now() inside the render body.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const isBoosted = now < xpBoostUntil;
  const boostTimeLeft = Math.max(0, Math.ceil((xpBoostUntil - now) / 1000 / 60));

  const shopItems = [
    {
      id: 'heart_refill',
      icon: Heart,
      iconColor: 'text-pink-500',
      iconFill: 'fill-pink-500',
      name: language === 'bn' ? 'হার্ট রিফিল ' : 'Heart Refill',
      desc: language === 'bn' ? '৫ টি হার্ট পূরণ ' : 'Refill your hearts to 5',
      cost: 400,
      action: refillHearts,
      disabled: hearts >= 5 || gems < 400,
    },
    {
      id: 'streak_shield',
      icon: Shield,
      iconColor: 'text-blue-500',
      iconFill: 'fill-blue-500',
      name: language === 'bn' ? 'স্ট্রিক শিল্ড' : 'Streak Shield',
      desc: language === 'bn' ? 'একদিন মিস করলেও স্ট্রিক থাকবে' : 'Protect your streak for one day',
      cost: 1000,
      action: buyStreakShield,
      disabled: streakShield || gems < 1000,
    },
    {
      id: 'xp_boost',
      icon: Zap,
      iconColor: 'text-amber-500',
      iconFill: 'fill-amber-500',
      name: language === 'bn' ? 'এক্সপি বুস্ট' : 'XP Boost',
      desc: language === 'bn' ? '৩০ মিনিটের জন্য ডাবল এক্সপি' : 'Double XP for 30 minutes',
      cost: 600,
      action: buyXPBoost,
      disabled: gems < 600,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center shadow-lg">
              <ShoppingBag size={28} strokeWidth={2.5} />
            </div>
            <h2 className="text-3xl font-black">{language === 'bn' ? 'শপ' : 'SHOP'}</h2>
          </div>
          <p className="text-app-fg/60 font-bold ml-1">
            {language === 'bn' ? 'আপনার রত্ন ব্যবহার করে নতুন কিছু কিনুন' : 'Spend your gems on powerful items'}
          </p>
        </div>

        <div className="bg-panel border-2 border-border-subtle px-6 py-3 rounded-2xl flex items-center gap-4 shadow-xl">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-app-fg/40 uppercase tracking-widest">
              {language === 'bn' ? 'আপনার রত্ন' : 'YOUR GEMS'}
            </span>
            <div className="flex items-center gap-2 text-2xl font-black text-blue-400">
              <Gem size={24} className="fill-blue-400" />
              {gems}
            </div>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shopItems.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={clsx(
              'group relative bg-panel border-2 rounded-[2.5rem] p-6 flex flex-col items-center text-center transition-all',
              item.disabled
                ? 'opacity-60 border-border-subtle'
                : 'border-blue-500/20 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer',
            )}
            onClick={() => !item.disabled && item.action()}
          >
            <div
              className={clsx(
                'w-20 h-20 rounded-3xl bg-app-bg border-2 border-border-subtle flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner',
                item.iconColor,
              )}
            >
              <item.icon size={40} strokeWidth={2.5} className={item.iconFill} />
            </div>

            <h3 className="text-xl font-black mb-2">{item.name}</h3>
            <p className="text-sm font-bold text-app-fg/60 mb-8 px-4 leading-snug">{item.desc}</p>

            <div className="mt-auto w-full">
              <div
                className={clsx(
                  'w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all',
                  item.disabled
                    ? 'bg-app-bg text-app-fg/30 border-2 border-border-subtle'
                    : 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-600 active:scale-95',
                )}
              >
                {item.id === 'heart_refill' && hearts >= 5
                  ? language === 'bn'
                    ? 'পূর্ণ'
                    : 'FULL'
                  : item.id === 'streak_shield' && streakShield
                  ? language === 'bn'
                    ? 'অ্যাক্টিভ'
                    : 'ACTIVE'
                  : item.id === 'xp_boost' && isBoosted
                  ? language === 'bn'
                    ? `${boostTimeLeft} মিনিট বাকি`
                    : `${boostTimeLeft}m LEFT`
                  : (
                    <>
                      <Gem size={20} className="fill-white" />
                      {item.cost}
                    </>
                  )}
              </div>
            </div>

            {!item.disabled && (
              <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
                <motion.div
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Daily Specials / Coming Soon */}
      <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
              <Sparkles size={24} className="text-amber-300" />
              <span className="font-black uppercase tracking-widest text-xs opacity-80">
                {language === 'bn' ? 'শীঘ্রই আসছে' : 'COMING SOON'}
              </span>
            </div>
            <h2 className="text-3xl font-black mb-4">
              {language === 'bn' ? 'বিশেষ আইটেম এবং ব্যাজ' : 'Special Items & Badges'}
            </h2>
            <p className="font-bold opacity-80 max-w-md">
              {language === 'bn'
                ? 'আপনার প্রোফাইল কাস্টমাইজ করতে বিশেষ ব্যাজ এবং থিম আনলক করুন।'
                : 'Unlock unique profile badges and themes to show off your skills.'}
            </p>
          </div>
          <div className="w-40 h-40 bg-white/20 rounded-[2.5rem] flex items-center justify-center border-2 border-white/30 backdrop-blur-md rotate-6 shadow-2xl">
            <ShoppingBag size={80} strokeWidth={2.5} className="text-white drop-shadow-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
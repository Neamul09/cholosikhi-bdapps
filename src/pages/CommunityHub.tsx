import { motion } from 'framer-motion';
import {
  Users,
  Trophy,
  Calendar,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Github,
  Heart,
} from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import { clsx } from 'clsx';

interface Contributor {
  name: string;
  xp: number;
  streak: number;
  badge: string;
}

const TOP_CONTRIBUTORS: Contributor[] = [
  { name: 'নাফিসা রহমান', xp: 4820, streak: 47, badge: '🥇' },
  { name: 'Arif Mahmud', xp: 3950, streak: 31, badge: '🥈' },
  { name: 'তানভীর হাসান', xp: 3210, streak: 28, badge: '🥉' },
  { name: 'Sadia Karim', xp: 2880, streak: 22, badge: '⭐' },
  { name: 'রাহুল দেব', xp: 2640, streak: 19, badge: '⭐' },
];

interface Activity {
  who: string;
  what: { en: string; bn: string };
  when: { en: string; bn: string };
  tone: 'gold' | 'green' | 'blue' | 'violet';
}

const RECENT_ACTIVITY: Activity[] = [
  {
    who: 'নাফিসা রহমান',
    what: { en: 'hit a 45-day streak', bn: '৪৫ দিনের স্ট্রিকে পৌঁছেছে' },
    when: { en: '2 minutes ago', bn: '২ মিনিট আগে' },
    tone: 'gold',
  },
  {
    who: 'Arif Mahmud',
    what: { en: 'finished Unit 7 (Functions)', bn: 'ইউনিট ৭ (ফাংশন) শেষ করেছে' },
    when: { en: '14 minutes ago', bn: '১৪ মিনিট আগে' },
    tone: 'green',
  },
  {
    who: 'তানভীর হাসান',
    what: { en: 'joined a study group', bn: 'একটি স্টাডি গ্রুপে যোগ দিয়েছে' },
    when: { en: '38 minutes ago', bn: '৩৮ মিনিট আগে' },
    tone: 'blue',
  },
  {
    who: 'Sadia Karim',
    what: { en: 'earned the "Loop Master" badge', bn: '"লুপ মাস্টার" ব্যাজ অর্জন করেছে' },
    when: { en: '1 hour ago', bn: '১ ঘণ্টা আগে' },
    tone: 'violet',
  },
];

interface Group {
  title: { en: string; bn: string };
  members: number;
  tag: { en: string; bn: string };
}

const WORKING_GROUPS: Group[] = [
  {
    title: { en: 'Python for beginners', bn: 'শুরু করছি যারা — পাইথন' },
    members: 1284,
    tag: { en: 'Weekly', bn: 'সাপ্তাহিক' },
  },
  {
    title: { en: 'C++ DSA grind', bn: 'C++ DSA প্র্যাকটিস' },
    members: 612,
    tag: { en: 'Daily', bn: 'প্রতিদিন' },
  },
  {
    title: { en: 'Build with us', bn: 'একসাথে বানাই' },
    members: 487,
    tag: { en: 'Project', bn: 'প্রজেক্ট' },
  },
];

interface Meetup {
  city: string;
  date: { en: string; bn: string };
  topic: { en: string; bn: string };
}

const UPCOMING_MEETUPS: Meetup[] = [
  {
    city: 'Dhaka',
    date: { en: 'Sat, Nov 23 · 4:00 PM', bn: 'শনি, ২৩ নভে · বিকাল ৪টা' },
    topic: { en: 'Intro to algorithms', bn: 'অ্যালগরিদমের ভিত্তি' },
  },
  {
    city: 'Chattogram',
    date: { en: 'Sun, Nov 24 · 11:00 AM', bn: 'রবি, ২৪ নভে · সকাল ১১টা' },
    topic: { en: 'Hackathon kickoff', bn: 'হ্যাকাথনের সূচনা' },
  },
];

export default function CommunityHub() {
  const { language } = useSettingsStore();
  const isBn = language === 'bn';

  const t = {
    eyebrow: isBn ? 'কমিউনিটি' : 'COMMUNITY',
    title: isBn ? 'একসাথে শিখি, একসাথে গড়ি' : 'Learn together. Build together.',
    sub: isBn
      ? 'বাংলাদেশ ও বিশ্বজুড়ে শিক্ষার্থীদের একটি ছোট কিন্তু প্রাণবন্ত কমিউনিটি। পরস্পরকে সাহায্য করি, একসাথে প্রজেক্ট করি, একসাথে বড় হই।'
      : 'A small but lively community of learners from Bangladesh and beyond. We help each other, build projects, and grow together.',
    ctaPrimary: isBn ? 'ডিসকর্ডে যোগ দিন' : 'Join the Discord',
    ctaSecondary: isBn ? 'স্টাডি গ্রুপ দেখুন' : 'See study groups',
    sectionLeaders: isBn ? 'শীর্ষ কন্ট্রিবিউটর' : 'Top contributors this week',
    sectionActivity: isBn ? 'সাম্প্রতিক কার্যকলাপ' : 'Recent activity',
    sectionGroups: isBn ? 'চলমান স্টাডি গ্রুপ' : 'Active study groups',
    sectionMeetups: isBn ? 'আসন্ন মিটআপ' : 'Upcoming meetups',
    members: isBn ? 'জন সদস্য' : 'members',
    join: isBn ? 'যোগ দিন' : 'Join',
    rsvp: isBn ? 'আমি যাব' : 'RSVP',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12 pb-24">
      {/* Hero */}
      <section className="text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black text-xs uppercase tracking-[0.3em]">
          <Sparkles size={14} />
          {t.eyebrow}
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight">
          {t.title}
        </h1>
        <p className="text-app-fg/60 font-bold text-lg max-w-2xl mx-auto leading-relaxed">
          {t.sub}
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <a
            href="https://discord.gg/cholosikhi"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-2xl bg-blue-500 text-white font-black inline-flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20"
          >
            <MessageSquare size={18} />
            {t.ctaPrimary}
            <ArrowRight size={16} />
          </a>
          <a
            href="#groups"
            className="px-6 py-3 rounded-2xl bg-panel border-2 border-border-subtle font-black inline-flex items-center gap-2 hover:border-blue-500/40 transition-colors"
          >
            {t.ctaSecondary}
          </a>
        </div>
      </section>

      {/* Top contributors */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Trophy className="text-amber-400" size={22} />
          <h2 className="text-2xl font-black">{t.sectionLeaders}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {TOP_CONTRIBUTORS.map((c, idx) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-panel border-2 border-border-subtle rounded-2xl p-4 text-center space-y-2"
            >
              <div className="text-3xl">{c.badge}</div>
              <div className="font-black text-sm truncate">{c.name}</div>
              <div className="text-xs text-app-fg/50 font-bold">
                {c.xp.toLocaleString()} XP · 🔥 {c.streak}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Activity feed */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="text-blue-400" size={22} />
          <h2 className="text-2xl font-black">{t.sectionActivity}</h2>
        </div>
        <div className="space-y-2">
          {RECENT_ACTIVITY.map((a, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="bg-panel border-2 border-border-subtle rounded-2xl p-4 flex items-center gap-4"
            >
              <div
                className={clsx(
                  'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                  a.tone === 'gold' && 'bg-amber-500/15 text-amber-400',
                  a.tone === 'green' && 'bg-emerald-500/15 text-emerald-400',
                  a.tone === 'blue' && 'bg-blue-500/15 text-blue-400',
                  a.tone === 'violet' && 'bg-violet-500/15 text-violet-400',
                )}
              >
                {a.tone === 'gold' ? <Trophy size={18} /> : <Heart size={18} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm">
                  <span className="font-black">{a.who}</span>{' '}
                  <span className="text-app-fg/70">{a.what[language]}</span>
                </div>
                <div className="text-xs text-app-fg/40 mt-0.5">{a.when[language]}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Study groups */}
      <section id="groups" className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="text-emerald-400" size={22} />
          <h2 className="text-2xl font-black">{t.sectionGroups}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {WORKING_GROUPS.map((g) => (
            <div
              key={g.title.en}
              className="bg-panel border-2 border-border-subtle rounded-2xl p-5 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="font-black leading-tight">{g.title[language]}</div>
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {g.tag[language]}
                </span>
              </div>
              <div className="text-xs text-app-fg/50 font-bold">
                {g.members.toLocaleString()} {t.members}
              </div>
              <button className="w-full py-2 rounded-xl bg-blue-500/10 text-blue-400 font-black text-sm hover:bg-blue-500 hover:text-white transition-colors">
                {t.join}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Meetups */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="text-rose-400" size={22} />
          <h2 className="text-2xl font-black">{t.sectionMeetups}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {UPCOMING_MEETUPS.map((m) => (
            <div
              key={m.city}
              className="bg-panel border-2 border-border-subtle rounded-2xl p-5 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-black shrink-0">
                {m.city.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="font-black">{m.city}</div>
                <div className="text-xs text-app-fg/50 font-bold">{m.date[language]}</div>
                <div className="text-sm text-app-fg/70 mt-1">{m.topic[language]}</div>
              </div>
              <button className="px-4 py-2 rounded-xl bg-rose-500/10 text-rose-400 font-black text-sm hover:bg-rose-500 hover:text-white transition-colors">
                {t.rsvp}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* GitHub / open source footer */}
      <section className="bg-panel/50 border border-border-subtle rounded-3xl p-8 text-center space-y-3">
        <Github className="mx-auto text-app-fg/40" size={32} />
        <div className="font-black text-lg">
          {isBn ? 'ওপেন সোর্স, সবার জন্য' : 'Open source, for everyone'}
        </div>
        <p className="text-sm text-app-fg/50 max-w-md mx-auto">
          {isBn
            ? 'প্ল্যাটফর্মটি MIT লাইসেন্সে ওপেন সোর্স। কন্ট্রিবিউট করতে GitHub-এ আসুন।'
            : 'The platform is MIT-licensed and open source. Drop by GitHub to contribute.'}
        </p>
        <a
          href="https://github.com/Neamul09/py.cholosikhi"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border-subtle font-black hover:bg-white/5 transition-colors"
        >
          <Github size={16} />
          GitHub
          <ArrowRight size={14} />
        </a>
      </section>
    </div>
  );
}
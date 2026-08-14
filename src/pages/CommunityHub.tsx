import { motion } from 'framer-motion';
import {
  Users,
  Calendar,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Github,
  Mail,
  Heart,
  Code2,
  Trophy,
  Bell,
  Clock,
} from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import {
  DISCORD_URL,
  GITHUB_REPO_URL,
  isDiscordPlaceholder,
  contactMailto,
} from '@/lib/links';

export default function CommunityHub() {
  const { language } = useSettingsStore();
  const isBn = language === 'bn';

  const t = {
    eyebrow: isBn ? 'কমিউনিটি' : 'COMMUNITY',
    title: isBn ? 'একসাথে শিখি, একসাথে গড়ি' : 'Learn together. Build together.',
    sub: isBn
      ? 'বাংলাদেশ ও বিশ্বজুড়ে শিক্ষার্থীদের একটি ছোট কিন্তু প্রাণবন্ত কমিউনিটি। পরস্পরকে সাহায্য করি, একসাথে প্রজেক্ট করি, একসাথে বড় হই।'
      : 'A small but lively community of learners from Bangladesh and beyond. We help each other, build projects, and grow together.',
    comingTag: isBn ? 'শীঘ্রই আসছে' : 'COMING SOON',
    comingTitle: isBn ? 'স্টাডি গ্রুপ, মিটআপ ও ফোরাম — সব এক জায়গায়' : 'Study groups, meetups & forums — all in one place',
    comingDesc: isBn
      ? 'আমরা এখন ডিসকর্ড, স্টাডি গ্রুপ এবং লাইভ মিটআপের জন্য একটি পূর্ণাঙ্গ কমিউনিটি হাব তৈরি করছি। এর মধ্যে আপনি পাবেন লিডারবোর্ড, ফলো/আনফলো, থ্রেডেড পোস্ট, ইভেন্ট RSVP এবং আরও অনেক কিছু।'
      : 'We are building a full community hub with Discord integration, study groups, and live meetups. Until then, you can find top contributors on the leaderboard and follow learners from your profile.',
    notifyTitle: isBn ? 'লঞ্চের খবর পান' : 'Get notified when it launches',
    notifyDesc: isBn
      ? 'ডিসকর্ডে যোগ দিন অথবা আমাদের ফলো করুন — লঞ্চের সাথে সাথে জানতে পারবেন।'
      : 'Join our Discord or follow along on GitHub — you will be the first to know when it goes live.',
    ctaPrimary: isBn ? 'ডিসকর্ডে যোগ দিন' : 'Join the Discord',
    ctaSecondary: isBn ? 'লিডারবোর্ড দেখুন' : 'View the leaderboard',
    ctaGithub: isBn ? 'গিটহাবে ফলো করুন' : 'Follow on GitHub',
    ctaEmail: isBn ? 'যোগাযোগ' : 'Contact us',
    sectionLeads: isBn ? 'আপাতত এখানে সক্রিয় থাকুন' : 'Where you can be active right now',
    leadLeaderboard: {
      title: isBn ? 'লিডারবোর্ড' : 'Leaderboard',
      desc: isBn
        ? 'প্রতি সপ্তাহে লীগে উঠুন, বন্ধুদের সাথে প্রতিদ্বন্দ্বিতা করুন।'
        : 'Climb the leagues every week and compete with friends.',
    },
    leadProfile: {
      title: isBn ? 'প্রোফাইল ও ফলো' : 'Profile & follow',
      desc: isBn
        ? 'অন্য শিক্ষার্থীদের ফলো করুন, তাদের অগ্রগতি দেখুন।'
        : 'Follow other learners and watch their progress in real time.',
    },
    leadLessons: {
      title: isBn ? 'লেসন ও স্ট্রিক' : 'Lessons & streaks',
      desc: isBn
        ? 'প্রতিদিন শিখুন, স্ট্রিক ধরে রাখুন, পাশের শিক্ষার্থীদের সাথে এগিয়ে যান।'
        : 'Learn daily, keep your streak, and grow alongside other learners.',
    },
    footerTitle: isBn ? 'ওপেন সোর্স, সবার জন্য' : 'Open source, for everyone',
    footerDesc: isBn
      ? 'প্ল্যাটফর্মটি MIT লাইসেন্সে ওপেন সোর্স। কন্ট্রিবিউট করতে GitHub-এ আসুন।'
      : 'The platform is MIT-licensed and open source. Drop by GitHub to contribute.',
  };

  const leads = [
    {
      icon: Trophy,
      tone: 'amber',
      title: t.leadLeaderboard.title,
      desc: t.leadLeaderboard.desc,
      href: '/leaderboard',
    },
    {
      icon: Users,
      tone: 'blue',
      title: t.leadProfile.title,
      desc: t.leadProfile.desc,
      href: '/profile',
    },
    {
      icon: Code2,
      tone: 'emerald',
      title: t.leadLessons.title,
      desc: t.leadLessons.desc,
      href: '/',
    },
  ];

  const toneClass = (tone: string) => {
    switch (tone) {
      case 'amber':
        return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      case 'blue':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
      case 'emerald':
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      default:
        return 'bg-white/5 border-white/10 text-app-fg/60';
    }
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
          {isDiscordPlaceholder ? (
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="px-6 py-3 rounded-2xl bg-blue-500/40 text-white font-black inline-flex items-center gap-2 cursor-not-allowed"
            >
              <Clock size={18} />
              {isBn ? 'শীঘ্রই আসছে' : 'Coming soon'}
            </button>
          ) : (
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-2xl bg-blue-500 text-white font-black inline-flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20"
            >
              <MessageSquare size={18} />
              {t.ctaPrimary}
              <ArrowRight size={16} />
            </a>
          )}
          <a
            href="/leaderboard"
            className="px-6 py-3 rounded-2xl bg-panel border-2 border-border-subtle font-black inline-flex items-center gap-2 hover:border-blue-500/40 transition-colors"
          >
            {t.ctaSecondary}
          </a>
        </div>
      </section>

      {/* Placeholder banner — only shows when Discord URL is unset. */}
      {isDiscordPlaceholder && (
        <div
          role="status"
          className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-bold"
        >
          <Clock size={16} />
          <span>
            {isBn
              ? 'ডিসকর্ড সার্ভার শীঘ্রই চালু হবে। এই মুহূর্তে গিটহাবে ফলো করুন অথবা ইমেইল করুন।'
              : 'Discord server launching soon. In the meantime, follow on GitHub or reach out via email.'}
          </span>
        </div>
      )}

      {/* Coming Soon card */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-3xl border-2 border-border-subtle bg-gradient-to-br from-blue-500/10 via-violet-500/5 to-transparent p-8 md:p-12"
      >
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/20 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-violet-500/15 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start gap-6">
          <div className="shrink-0 w-16 h-16 rounded-2xl bg-blue-500/15 border-2 border-blue-500/30 flex items-center justify-center">
            <Calendar className="text-blue-400" size={28} />
          </div>

          <div className="flex-1 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-black text-[10px] uppercase tracking-[0.25em]">
              <Bell size={12} />
              {t.comingTag}
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">
              {t.comingTitle}
            </h2>
            <p className="text-app-fg/60 font-bold leading-relaxed max-w-2xl">
              {t.comingDesc}
            </p>
          </div>
        </div>
      </motion.section>

      {/* Where you can be active right now */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Heart className="text-rose-400" size={22} />
          <h2 className="text-2xl font-black">{t.sectionLeads}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {leads.map((l, idx) => (
            <motion.a
              key={l.title}
              href={l.href}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group bg-panel border-2 border-border-subtle rounded-2xl p-5 space-y-3 hover:border-blue-500/40 transition-colors"
            >
              <div
                className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center ${toneClass(l.tone)}`}
              >
                <l.icon size={20} />
              </div>
              <div className="font-black leading-tight">{l.title}</div>
              <div className="text-xs text-app-fg/50 font-bold leading-relaxed">
                {l.desc}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-black text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {isBn ? 'যান' : 'Go'}
                <ArrowRight size={14} />
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* Notify footer */}
      <section className="bg-panel/50 border border-border-subtle rounded-3xl p-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black text-[10px] uppercase tracking-[0.25em]">
          <Bell size={12} />
          {isBn ? 'নোটিফাই' : 'NOTIFY'}
        </div>
        <h3 className="text-2xl md:text-3xl font-black">{t.notifyTitle}</h3>
        <p className="text-sm text-app-fg/50 max-w-md mx-auto leading-relaxed">
          {t.notifyDesc}
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          {!isDiscordPlaceholder && (
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-blue-500 text-white font-black text-sm inline-flex items-center gap-2 hover:bg-blue-600 transition-colors"
            >
              <MessageSquare size={16} />
              {t.ctaPrimary}
            </a>
          )}
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl border border-border-subtle font-black text-sm inline-flex items-center gap-2 hover:bg-white/5 transition-colors"
          >
            <Github size={16} />
            {t.ctaGithub}
          </a>
          <a
            href={contactMailto('Community inquiry')}
            className="px-5 py-2.5 rounded-xl border border-border-subtle font-black text-sm inline-flex items-center gap-2 hover:bg-white/5 transition-colors"
          >
            <Mail size={16} />
            {t.ctaEmail}
          </a>
        </div>
      </section>

      {/* Open source footer */}
      <section className="bg-panel/50 border border-border-subtle rounded-3xl p-8 text-center space-y-3">
        <Github className="mx-auto text-app-fg/40" size={32} />
        <div className="font-black text-lg">{t.footerTitle}</div>
        <p className="text-sm text-app-fg/50 max-w-md mx-auto">{t.footerDesc}</p>
        <a
          href={GITHUB_REPO_URL}
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
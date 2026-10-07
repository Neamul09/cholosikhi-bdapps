import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, CheckCircle2, AlertTriangle, ShieldCheck, HeartHandshake } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';

export default function Terms() {
  const navigate = useNavigate();
  const { language } = useSettingsStore();
  const isBn = language === 'bn';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 pb-32">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label={isBn ? 'ফিরে যান' : 'Go back'}
          className="p-3 bg-panel border-2 border-border-subtle rounded-2xl hover:border-blue-500/40 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-black text-blue-400 uppercase tracking-widest mb-1">
            <FileText size={14} />
            {isBn ? 'শর্তাবলী' : 'TERMS OF SERVICE'}
          </div>
          <h1 className="text-3xl md:text-4xl font-black">
            {isBn ? 'চলোশিখি ব্যবহারের শর্তাবলী' : 'CholoSikhi Terms of Service'}
          </h1>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-panel border-2 border-border-subtle rounded-3xl p-6 md:p-10 space-y-8 font-medium leading-relaxed text-app-fg/80"
      >
        <div className="text-xs text-app-fg/40 uppercase tracking-widest font-black">
          {isBn ? 'সর্বশেষ আপডেট: মার্চ ২০২৬' : 'Last Updated: March 2026'}
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-app-fg flex items-center gap-2">
            <CheckCircle2 size={18} className="text-blue-400" />
            {isBn ? '১. সেবার সাধারণ শর্ত' : '1. General Terms'}
          </h2>
          <p>
            {isBn
              ? 'চলোশিখি প্ল্যাটফর্মে যোগ দিয়ে তুমি প্রোগ্রামিং ও প্রযুক্তি শিক্ষার একটি ইতিবাচক কমিউনিটির সদস্য হচ্ছো। এই প্ল্যাটফর্ম শুধুমাত্র শিক্ষামূলক উদ্দেশ্যে তৈরি।'
              : 'By using CholoSikhi, you join a supportive learning community. The platform is designed exclusively for tech education and personal development.'}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-app-fg flex items-center gap-2">
            <HeartHandshake size={18} className="text-blue-400" />
            {isBn ? '২. শিক্ষার্থী আচরণবিধি' : '2. Community Code of Conduct'}
          </h2>
          <p>
            {isBn
              ? 'লিডারবোর্ড বা কমিউনিটিতে অন্য শিক্ষার্থীদের সাথে সম্মানজনক আচরণ বজায় রাখতে হবে। ক্ষতিকর কোড চালানো, লিডারবোর্ডে স্ক্রিপ্ট দিয়ে কৃত্রিম XP বাড়ানো বা স্প্যামিং সম্পূর্ণ নিষিদ্ধ।'
              : 'Learners must respect peers. Cheating on leaderboards with automated scripts, running malicious code in playgrounds, or harassing others is strictly prohibited.'}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-app-fg flex items-center gap-2">
            <ShieldCheck size={18} className="text-blue-400" />
            {isBn ? '৩. মেধা সম্পত্তি ও কনটেন্ট' : '3. Intellectual Property'}
          </h2>
          <p>
            {isBn
              ? 'চলোশিখির সমস্ত লেসন, ব্যায়াম এবং পাঠ্যক্রম আমাদের স্বত্বাধিকারী কনটেন্ট। তুমি ব্যক্তিগত শিক্ষার জন্য এগুলো ব্যবহার করতে পারো, কিন্তু বাণিজ্যিক উদ্দেশ্যে পুনঃপ্রকাশ করতে পারবে না।'
              : 'All curriculum, lessons, and visual assets are proprietary. You are free to practice and learn, but copying curriculum for commercial re-sale is not permitted.'}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-app-fg flex items-center gap-2">
            <AlertTriangle size={18} className="text-blue-400" />
            {isBn ? '৪. দায়বদ্ধতার সীমাবদ্ধতা' : '4. Limitation of Liability'}
          </h2>
          <p>
            {isBn
              ? 'চলোশিখি তার সেবা নিরবচ্ছিন্ন রাখার সর্বোচ্চ চেষ্টা করে। আমরা শিক্ষার্থীদের কোড অনুশীলনের জন্য নিরাপদ স্যান্ডবক্স সরবরাহ করি। যেকোনো সহায়তার জন্য contact@cholosikhi.com-এ যোগাযোগ করো।'
              : 'CholoSikhi provides an interactive sandbox for coding practice. For any inquiries, reach our team at contact@cholosikhi.com.'}
          </p>
        </section>
      </motion.div>
    </div>
  );
}

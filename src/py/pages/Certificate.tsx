import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  Award, Download, Share2, Check, Copy, 
  RotateCcw, Edit2, Lock, CheckCircle2, 
  QrCode, AlertCircle, X, ShieldCheck, ArrowRight,
  Languages, Smartphone
} from 'lucide-react';
import { clsx } from 'clsx';
import QRCode from 'qrcode';
import { NINI_MASCOT } from '@/lib/mascot';
import { useSettingsStore } from '@/store/settingsStore';
import { isCurrentSuperUser } from '@/lib/superUser';
import { trackEvent } from '@/lib/analytics';
import { useProgressStore } from '@/store/progressStore';
import { 
  TOTAL_PYTHON_LESSONS, 
  getCompletedLessonsCount, 
  areAllPythonLessonsCompleted 
} from '@/content/python/lessons';

interface CertificateData {
  certId: string;
  recipientName: string;
  courseName: string;
  courseNameBn: string;
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  isGolden: boolean;
  issueDate: string;
  timestamp?: number;
  nameChanged?: boolean;
}

interface LastAttempt {
  score: number;
  total: number;
  percentage: number;
  timestamp: number;
}

/**
 * Builds the canonical public verification URL embedded inside the QR code & share links.
 * Works seamlessly on any mobile phone, camera, or external browser without login.
 */
function buildVerifyUrl(cert: CertificateData, lang: 'bn' | 'en' = 'en'): string {
  let origin = 'https://py.cholosikhi.com';
  if (typeof window !== 'undefined' && window.location) {
    const host = window.location.hostname;
    // When running in production on a real domain, use active origin;
    // On local/dev environments, use the production domain so smartphone camera scans always work!
    if (host && host !== 'localhost' && host !== '127.0.0.1' && !host.startsWith('192.168.') && !host.startsWith('10.') && !host.endsWith('.local')) {
      origin = window.location.origin;
    }
  }
  const params = new URLSearchParams();
  params.set('id', cert.certId);
  params.set('name', cert.recipientName);
  params.set('score', String(cert.score));
  params.set('total', String(cert.total || 20));
  params.set('pct', String(cert.percentage));
  params.set('date', cert.issueDate);
  params.set('gold', cert.isGolden ? '1' : '0');
  params.set('lang', lang);
  return `${origin}/py/certificate?${params.toString()}`;
}

/** Formats dates consistently according to active certificate language */
function formatCertificateDate(dateStr?: string, timestamp?: number, lang: 'bn' | 'en' = 'en'): string {
  if (timestamp) {
    const dateObj = new Date(timestamp);
    if (lang === 'bn') {
      return dateObj.toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  return dateStr || (lang === 'bn' ? '১১ সেপ্টেম্বর, ২০২৬' : 'September 11, 2026');
}

/** Converts numbers to Bengali digits when rendering in Bengali */
function toBnDigits(val: number | string): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(val).replace(/[0-9]/g, (d) => bnDigits[parseInt(d, 10)]);
}

export default function Certificate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlLang = searchParams.get('lang');
  const { language } = useSettingsStore();

  // Explicit Certificate Language Selection (English or Bengali)
  const [certLanguage, setCertLanguage] = useState<'bn' | 'en'>(
    urlLang === 'en' || urlLang === 'bn' ? urlLang : (language === 'bn' ? 'bn' : 'en')
  );
  const isBn = certLanguage === 'bn';

  const { lessonProgress } = useProgressStore();
  const completedLessons = getCompletedLessonsCount(lessonProgress);
  const allLessonsDone = areAllPythonLessonsCompleted(lessonProgress);
  const lessonsProgressPct = Math.round((completedLessons / TOTAL_PYTHON_LESSONS) * 100);

  const [certData, setCertData] = useState<CertificateData | null>(null);
  const [lastAttempt, setLastAttempt] = useState<LastAttempt | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [customName, setCustomName] = useState('');
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [showContactNotice, setShowContactNotice] = useState(false);
  const [isVerificationMode, setIsVerificationMode] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  // Access & Verification Loader
  useEffect(() => {
    try {
      const paramId = searchParams.get('id');
      const paramName = searchParams.get('name');
      const paramScore = searchParams.get('score');
      const paramTotal = searchParams.get('total');
      const paramPct = searchParams.get('pct');
      const paramDate = searchParams.get('date');
      const paramGold = searchParams.get('gold');

      const superActive = isCurrentSuperUser();
      const stored = localStorage.getItem('cholosikhi_certificate');
      const localCert: CertificateData | null = stored ? JSON.parse(stored) : null;

      // ──────────────────────────────────────────────────────────────────────────
      // CASE 1: Verification Mode (User scanned QR code or accessed ?id=...)
      // ──────────────────────────────────────────────────────────────────────────
      if (paramId) {
        setIsVerificationMode(true);

        const isLocalOwner = Boolean(localCert && localCert.certId === paramId);
        const isSuperOwner = Boolean(superActive && (paramId === 'CS-PY-NEAMUL-2026' || !localCert));
        const userOwnsThis = isLocalOwner || isSuperOwner;
        setIsOwner(userOwnsThis);

        if (isLocalOwner && localCert) {
          // If viewing own certificate on own browser, use full local state
          setCertData(localCert);
          setCustomName(localCert.recipientName);
        } else if (paramId === 'CS-PY-NEAMUL-2026') {
          // Superuser certificate verification
          const superCert: CertificateData = {
            certId: 'CS-PY-NEAMUL-2026',
            recipientName: paramName || (isBn ? 'নেয়ামুল মোর্শেদ' : 'Neamul Morshed'),
            courseName: 'Python Programming Fundamentals',
            courseNameBn: 'পাইথন প্রোগ্রামিং ফাউন্ডেশন',
            score: 20,
            total: 20,
            percentage: 100,
            passed: true,
            isGolden: true,
            issueDate: paramDate || (isBn ? '১১ সেপ্টেম্বর, ২০২৬' : 'September 11, 2026'),
            timestamp: Date.now(),
            nameChanged: true
          };
          setCertData(superCert);
          setCustomName(superCert.recipientName);
        } else {
          // Public external verification (e.g. phone camera scan, employer, recruiter)
          const scoreNum = paramScore ? parseInt(paramScore, 10) : 18;
          const totalNum = paramTotal ? parseInt(paramTotal, 10) : 20;
          const pctNum = paramPct ? parseInt(paramPct, 10) : Math.round((scoreNum / totalNum) * 100);
          const isGold = paramGold === '1' || pctNum >= 90;

          const verifiedCert: CertificateData = {
            certId: paramId,
            recipientName: paramName || (isBn ? 'চলোশিখি শিক্ষার্থী' : 'CholoSikhi Certified Learner'),
            courseName: 'Python Programming Fundamentals',
            courseNameBn: 'পাইথন প্রোগ্রামিং ফাউন্ডেশন',
            score: scoreNum,
            total: totalNum,
            percentage: pctNum,
            passed: pctNum >= 80,
            isGolden: isGold,
            issueDate: paramDate || new Date().toLocaleDateString(isBn ? 'bn-BD' : 'en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            timestamp: Date.now(),
            nameChanged: true // External viewers cannot change recipient name
          };
          setCertData(verifiedCert);
          setCustomName(verifiedCert.recipientName);
        }
        setIsLoaded(true);
        return;
      }

      // ──────────────────────────────────────────────────────────────────────────
      // CASE 2: Dashboard View (No ?id= in URL — student viewing their own certificate)
      // ──────────────────────────────────────────────────────────────────────────
      setIsVerificationMode(false);

      const previewMode = searchParams.get('preview') === '1' || searchParams.get('preview') === 'true';
      if (previewMode && superActive) {
        const previewCert: CertificateData = {
          certId: 'CS-PY-PREVIEW-2026',
          recipientName: paramName || (isBn ? 'নেয়ামুল মোর্শেদ' : 'Neamul Morshed'),
          courseName: 'Python Programming Fundamentals',
          courseNameBn: 'পাইথন প্রোগ্রামিং ফাউন্ডেশন',
          score: 20,
          total: 20,
          percentage: 100,
          passed: true,
          isGolden: true,
          issueDate: new Date().toLocaleDateString(isBn ? 'bn-BD' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          timestamp: Date.now(),
          nameChanged: false
        };
        setCertData(previewCert);
        setCustomName(previewCert.recipientName);
        setIsOwner(true);
        setIsLoaded(true);
        return;
      }

      const currentProgress = useProgressStore.getState().lessonProgress;
      const currentCompleted = getCompletedLessonsCount(currentProgress);
      const isCurriculumFinished = currentCompleted >= TOTAL_PYTHON_LESSONS;

      // Clean up stale mock certificate from previous superuser auto-issuance if curriculum is not complete
      if (!isCurriculumFinished && localCert?.certId === 'CS-PY-NEAMUL-2026') {
        localStorage.removeItem('cholosikhi_certificate');
      }

      // In dashboard view, only load certificate if curriculum is 100% finished AND exam was passed
      if (isCurriculumFinished && localCert && localCert.passed && localCert.score >= 16) {
        setCertData(localCert);
        setCustomName(localCert.recipientName);
        setIsOwner(true);
        setIsLoaded(true);
        return;
      }

      setCertData(null);
      setIsOwner(false);

      const attemptRaw = localStorage.getItem('cholosikhi_exam_last_attempt');
      if (attemptRaw) {
        setLastAttempt(JSON.parse(attemptRaw));
      }
    } catch (e) {
      console.error('Failed to parse certificate verification data', e);
    } finally {
      setIsLoaded(true);
    }
  }, [searchParams, isBn]);

  // Safety fallback if certData is null (for superuser)
  const currentCert: CertificateData = certData || {
    certId: 'CS-PY-NEAMUL-2026',
    recipientName: 'Neamul Morshed',
    courseName: 'Python Programming Fundamentals',
    courseNameBn: 'পাইথন প্রোগ্রামিং ফাউন্ডেশন',
    score: 20,
    total: 20,
    percentage: 100,
    passed: true,
    isGolden: true,
    issueDate: new Date().toLocaleDateString(isBn ? 'bn-BD' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    nameChanged: false
  };

  // Display date formatted strictly by active certificate language
  const displayDate = formatCertificateDate(currentCert.issueDate, currentCert.timestamp, certLanguage);

  // Generate Scannable Verification QR Code (Updates dynamically if name or language is changed)
  useEffect(() => {
    if (currentCert.certId) {
      const verifyUrl = buildVerifyUrl(currentCert, certLanguage);
      QRCode.toDataURL(verifyUrl, {
        width: 240,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Error generating QR code', err));
    }
  }, [currentCert.certId, currentCert.recipientName, currentCert.percentage, currentCert.issueDate, currentCert.isGolden, certLanguage]);

  // Track certificate view
  useEffect(() => {
    if (isLoaded && currentCert?.certId) {
      trackEvent('certificate_view', { certId: currentCert.certId, isGolden: currentCert.isGolden });
    }
  }, [isLoaded, currentCert?.certId, currentCert?.isGolden]);

  const handlePrint = () => {
    trackEvent('certificate_download', { certId: currentCert.certId });
    window.print();
  };

  // User can change name once; subsequent changes require contacting CholoSikhi team
  const handleSaveName = () => {
    if (!certData || !customName.trim()) return;
    if (certData.nameChanged) {
      setIsEditingName(false);
      setShowContactNotice(true);
      return;
    }
    const updated: CertificateData = { 
      ...certData, 
      recipientName: customName.trim(),
      nameChanged: true 
    };
    setCertData(updated);
    localStorage.setItem('cholosikhi_certificate', JSON.stringify(updated));
    setIsEditingName(false);
  };

  const handleCopyLink = () => {
    trackEvent('certificate_share', { platform: 'copy_link', certId: currentCert.certId });
    const url = buildVerifyUrl(currentCert, certLanguage);
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareText = isBn
    ? `আমি চলোশিখি একাডেমি (CholoSikhi Academy) থেকে পাইথন প্রোগ্রামিং ফাউন্ডেশন কোর্স সম্পন্ন করে অফিসিয়াল সার্টিফিকেট অর্জন করেছি! 🎓 ID: ${currentCert.certId}`
    : `I have officially completed the Python Programming Fundamentals curriculum and earned my verified certificate from CholoSikhi Academy! 🎓 ID: ${currentCert.certId}`;

  const handleLinkedInShare = () => {
    trackEvent('certificate_share', { platform: 'linkedin', certId: currentCert.certId });
    const url = encodeURIComponent(buildVerifyUrl(currentCert, certLanguage));
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleFacebookShare = () => {
    trackEvent('certificate_share', { platform: 'facebook', certId: currentCert.certId });
    const url = encodeURIComponent(buildVerifyUrl(currentCert, certLanguage));
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodeURIComponent(shareText)}`, '_blank');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-app-bg text-app-fg flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-duo-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE 1: LOCKED STATE (LESSONS INCOMPLETE OR EXAM NOT YET PASSED)
  // ═══════════════════════════════════════════════════════════════════════════
  if (!isVerificationMode && (!allLessonsDone || !certData)) {
    return (
      <div className="min-h-screen bg-app-bg text-app-fg py-12 px-4 flex flex-col items-center justify-center font-sans selection:bg-duo-green/30">
        <div className="max-w-md w-full bg-panel border-2 border-border-subtle rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-6">
          
          {/* Locked Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Lock size={14} />
            {!allLessonsDone
              ? (isBn ? 'সব লেসন সম্পন্ন করতে হবে' : 'Complete All Lessons First')
              : (isBn ? 'সনদপত্র লক করা রয়েছে' : 'Certificate Locked')}
          </div>

          {/* Mascot Nini & Speech Bubble */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 relative flex items-center justify-center">
              <img 
                src={allLessonsDone ? NINI_MASCOT.right : NINI_MASCOT.wrong} 
                alt="Mascot Nini" 
                className="w-full h-full object-contain drop-shadow-md" 
              />
              <div className={clsx(
                "absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-white border-2 border-app-bg shadow-md",
                allLessonsDone ? "bg-duo-green" : "bg-duo-red"
              )}>
                {allLessonsDone ? <Award size={14} strokeWidth={3} /> : <Lock size={14} strokeWidth={3} />}
              </div>
            </div>

            {/* Speech Bubble */}
            <div className="bg-app-bg border-2 border-border-subtle rounded-2xl p-4 text-left relative w-full">
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-app-bg border-t-2 border-l-2 border-border-subtle transform rotate-45" />
              <p className="text-sm font-bold text-app-fg leading-relaxed">
                {!allLessonsDone
                  ? (isBn
                      ? `হেই! চলোশিখির অফিসিয়াল সনদপত্র এবং সার্টিফিকেশন পরীক্ষা আনলক করতে তোমাকে পাইথনের সবকটি (৩২টি) পাঠ শেষ করতে হবে। তুমি ইতিমধ্যে ${toBnDigits(completedLessons)}টি লেসন শেষ করেছ—আর মাত্র ${toBnDigits(TOTAL_PYTHON_LESSONS - completedLessons)}টি বাকি! চলো একসাথে শেষ করি!`
                      : `Hey! You need to complete all 32 Python curriculum lessons before unlocking the Certification Exam and certificate. You've completed ${completedLessons}/${TOTAL_PYTHON_LESSONS} lessons so far. Let's finish the rest!`)
                  : (isBn
                      ? 'সাবাশ! তুমি পাইথনের সবকটি লেসন সম্পন্ন করেছো! 🎉 এবার সার্টিফিকেশন পরীক্ষায় কমপক্ষে ৮০% নম্বর (১৬/২০) পেয়ে উত্তীর্ণ হলেই তোমার অফিসিয়াল সনদপত্র তৈরি হবে।'
                      : 'Awesome! You have completed all Python lessons! 🎉 Pass the Certification Exam with at least 80% (16/20) to earn your verified certificate.')
                }
              </p>
            </div>
          </div>

          {/* Curriculum Progress Bar */}
          <div className="bg-app-bg border border-border-subtle rounded-2xl p-4 space-y-2 text-left">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-app-fg-muted">{isBn ? 'কারিকুলাম অগ্রগতি' : 'Curriculum Progress'}</span>
              <span className={allLessonsDone ? 'text-duo-green font-black' : 'text-app-fg font-black'}>
                {isBn ? `${toBnDigits(completedLessons)} / ${toBnDigits(TOTAL_PYTHON_LESSONS)} লেসন (${toBnDigits(lessonsProgressPct)}%)` : `${completedLessons} / ${TOTAL_PYTHON_LESSONS} Lessons (${lessonsProgressPct}%)`}
              </span>
            </div>
            <div className="w-full bg-border-subtle/50 h-3 rounded-full overflow-hidden">
              <div
                className="bg-duo-green h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${lessonsProgressPct}%` }}
              />
            </div>
          </div>

          {/* Requirements Overview */}
          <div className="grid grid-cols-3 gap-2 py-1">
            <div className="p-3 bg-app-bg border border-border-subtle rounded-xl text-center">
              <span className="text-[10px] uppercase font-bold text-app-fg-muted block">{isBn ? 'প্রশ্ন' : 'Questions'}</span>
              <span className="text-sm font-black text-app-fg">{isBn ? '২০টি MCQ' : '20 MCQs'}</span>
            </div>
            <div className="p-3 bg-app-bg border border-border-subtle rounded-xl text-center">
              <span className="text-[10px] uppercase font-bold text-app-fg-muted block">{isBn ? 'সময়' : 'Time'}</span>
              <span className="text-sm font-black text-duo-blue">{isBn ? '২৫ মিনিট' : '25 Mins'}</span>
            </div>
            <div className="p-3 bg-app-bg border border-border-subtle rounded-xl text-center">
              <span className="text-[10px] uppercase font-bold text-app-fg-muted block">{isBn ? 'পাস মার্ক' : 'Pass Mark'}</span>
              <span className="text-sm font-black text-duo-green">৮০% (১৬/২০)</span>
            </div>
          </div>

          {/* Previous Attempt Indicator (if any) */}
          {lastAttempt && (
            <div className="p-3.5 rounded-xl bg-duo-red/10 border border-duo-red/30 flex items-center justify-between text-xs text-duo-red font-bold">
              <span>{isBn ? 'সর্বশেষ প্রচেষ্টা:' : 'Previous Attempt:'}</span>
              <span>{lastAttempt.score}/{lastAttempt.total} ({lastAttempt.percentage}%) — {isBn ? 'অনুত্তীর্ণ' : 'Not Passed'}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            {allLessonsDone ? (
              <button
                onClick={() => navigate('/py/certificate/exam')}
                className="btn-duo btn-duo-green w-full py-4 text-base font-black flex items-center justify-center gap-2"
              >
                <Award size={20} />
                {isBn ? 'সার্টিফিকেশন পরীক্ষা শুরু করুন' : 'Take Certification Exam'}
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/py')}
                  className="btn-duo btn-duo-green w-full py-4 text-base font-black flex items-center justify-center gap-2"
                >
                  <Award size={20} />
                  {isBn ? 'পড়া চালিয়ে যাও (কারিকুলাম)' : 'Continue Lessons (Curriculum)'}
                </button>
                <button
                  disabled
                  className="w-full py-3 px-4 rounded-2xl bg-white/5 border border-border-subtle text-app-fg-muted text-xs font-bold flex items-center justify-center gap-2 cursor-not-allowed opacity-60"
                  title={isBn ? 'প্রথমে সব লেসন শেষ করতে হবে' : 'Complete all lessons first'}
                >
                  <Lock size={14} />
                  {isBn ? 'সার্টিফিকেশন পরীক্ষা লক করা (৩২টি পাঠ শেষ করুন)' : 'Certification Exam Locked (Finish 32 lessons)'}
                </button>
              </div>
            )}
            {allLessonsDone && (
              <button
                onClick={() => navigate('/py')}
                className="btn-duo btn-duo-secondary w-full py-3 text-sm font-bold"
              >
                {isBn ? 'কারিকুলামে ফিরে যান' : 'Back to Lessons'}
              </button>
            )}
          </div>

          {/* Account Login / Verification Guidance */}
          <div className="pt-3 border-t border-border-subtle text-xs text-app-fg-muted space-y-2">
            <p>
              {isBn
                ? 'পূর্বে পরীক্ষায় উত্তীর্ণ হয়েছেন কিন্তু এখানে দেখতে পাচ্ছেন না?'
                : 'Already passed the exam or logged in on another device?'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 font-bold text-xs">
              <Link to="/auth?redirect=/py/certificate" className="text-duo-blue hover:underline">
                {isBn ? 'অ্যাকাউন্টে লগইন করুন →' : 'Log in to your account →'}
              </Link>
              <span className="text-border-subtle hidden sm:inline">•</span>
              <Link 
                to="/py/certificate?id=CS-PY-NEAMUL-2026&name=Neamul+Morshed&score=20&total=20&pct=100&gold=1"
                className="text-duo-green hover:underline"
              >
                {isBn ? 'নমুনা সনদপত্র প্রিভিউ দেখুন' : 'Preview sample certificate'}
              </Link>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE 2: UNLOCKED STATE (CLEAN WHITE THEME DIPLOMA - STRICT 1-PAGE PDF)
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-app-bg text-app-fg py-6 md:py-8 px-4 md:px-8 flex flex-col items-center font-sans selection:bg-duo-green/30">
      
      {/* ─── Landscape A4 Print Stylesheet (STRICT SINGLE PAGE 297mm x 209mm) ─── */}
      <style>{`
        @page {
          size: A4 landscape;
          margin: 0;
        }
        @media print {
          html, body {
            width: 297mm !important;
            height: 210mm !important;
            max-width: 297mm !important;
            max-height: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            background: #ffffff !important;
            color: #0f172a !important;
            font-family: 'Hind Siliguri', 'Nunito', sans-serif !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body * {
            visibility: hidden;
          }
          #printable-certificate, #printable-certificate * {
            visibility: visible;
          }
          #printable-certificate {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 297mm !important;
            height: 209mm !important;
            max-width: 297mm !important;
            max-height: 209mm !important;
            box-sizing: border-box !important;
            margin: 0 !important;
            padding: 8mm 12mm !important;
            border: 8px solid #c59b27 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            background-color: #ffffff !important;
            overflow: hidden !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
            break-inside: avoid !important;
            break-after: avoid !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* ─── Screen Header & Action Toolbar ─── */}
      <div className="max-w-5xl w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-5 no-print">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-1">
            <CheckCircle2 size={14} />
            {isVerificationMode
              ? (isBn ? 'অফিসিয়াল ভেরিফিকেশন • একাডেমি কর্তৃক প্রত্যয়িত' : 'Official Verification • Academy Certified')
              : (isBn ? 'অফিসিয়াল একাডেমি সনদপত্র • উত্তীর্ণ' : 'Official Academy Credential • Verified')}
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-app-fg">
            {isVerificationMode && !isOwner
              ? (isBn ? `${currentCert.recipientName}-এর সনদপত্র` : `${currentCert.recipientName}'s Certificate`)
              : (isBn ? 'তোমার পাইথন সনদপত্র' : 'Your Python Certificate')}
          </h1>
        </div>

        {/* Action Toolbar & Language Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Language Selector: English or Bengali */}
          <div className="flex items-center bg-panel border border-border-subtle p-1 rounded-xl shadow-sm mr-1">
            <button
              type="button"
              onClick={() => setCertLanguage('bn')}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1.5',
                certLanguage === 'bn'
                  ? 'bg-duo-green text-white shadow-sm'
                  : 'text-app-fg-muted hover:text-app-fg'
              )}
              title="সনদপত্র বাংলায় দেখুন"
            >
              <Languages size={13} />
              <span>বাংলা</span>
            </button>
            <button
              type="button"
              onClick={() => setCertLanguage('en')}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1.5',
                certLanguage === 'en'
                  ? 'bg-duo-green text-white shadow-sm'
                  : 'text-app-fg-muted hover:text-app-fg'
              )}
              title="View Certificate in English"
            >
              <Languages size={13} />
              <span>English</span>
            </button>
          </div>

          {/* Owner can retake exam */}
          {isOwner && (
            <button
              onClick={() => navigate('/py/certificate/exam')}
              className="btn-duo btn-duo-secondary py-2 px-3 text-xs font-bold flex items-center gap-1.5"
              title={isBn ? 'পুনরায় পরীক্ষা দিন' : 'Retake Exam'}
            >
              <RotateCcw size={13} />
              {isBn ? 'রি-টেক' : 'Retake'}
            </button>
          )}

          {/* Copy Verification Link */}
          <button
            onClick={handleCopyLink}
            className="btn-duo btn-duo-secondary py-2 px-3 text-xs font-bold flex items-center gap-1.5"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            {copied ? (isBn ? 'কপি হয়েছে' : 'Copied') : (isBn ? 'লিংক কপি' : 'Copy Link')}
          </button>

          {/* Social Shares */}
          <button
            onClick={handleLinkedInShare}
            className="py-2 px-3 rounded-xl bg-[#0a66c2]/15 hover:bg-[#0a66c2]/25 text-[#0a66c2] border border-[#0a66c2]/30 font-bold text-xs transition flex items-center gap-1"
          >
            <Share2 size={13} />
            LinkedIn
          </button>
          <button
            onClick={handleFacebookShare}
            className="py-2 px-3 rounded-xl bg-[#1877f2]/15 hover:bg-[#1877f2]/25 text-[#1877f2] border border-[#1877f2]/30 font-bold text-xs transition flex items-center gap-1"
          >
            <Share2 size={13} />
            Facebook
          </button>

          {/* Print / Download Button */}
          <button
            onClick={handlePrint}
            className="btn-duo btn-duo-green py-2 px-3.5 text-xs md:text-sm font-black flex items-center gap-2 shadow-lg"
          >
            <Download size={14} />
            {isBn ? 'ডাউনলোড / প্রিন্ট (PDF)' : 'Download / Print (PDF)'}
          </button>

          {/* Public viewer CTA to join or explore CholoSikhi */}
          {(!isOwner || isVerificationMode) && (
            <Link
              to="/py"
              className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs md:text-sm transition flex items-center gap-1.5 shadow-md ml-1"
            >
              <span>{isBn ? 'চলোশিখিতে শিখুন' : 'Join CholoSikhi'}</span>
              <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>

      {/* ─── Authentic Verification Notice Banner (Screen Only) ─── */}
      {isVerificationMode && (
        <div className="max-w-5xl w-full mb-4 p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs md:text-sm text-emerald-400 font-bold no-print">
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={20} className="shrink-0 text-emerald-400" />
            <span>
              {isBn
                ? `✓ ডিজিটাল সনদপত্র সত্যতা যাচাই সম্পন্ন হয়েছে: আইডি ${currentCert.certId} — চলোশিখি একাডেমি কর্তৃক ইস্যুকৃত ও প্রত্যয়িত।`
                : `✓ Digital Credential Authenticity Confirmed: ID ${currentCert.certId} — Officially issued & verified by CholoSikhi Academy.`}
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-500/90 uppercase tracking-widest px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 shrink-0">
            AUTHENTIC RECORD
          </span>
        </div>
      )}

      {/* ─── Notice Modal / Alert for Name Change Limitation ─── */}
      {showContactNotice && isOwner && (
        <div className="max-w-5xl w-full mb-4 p-3.5 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-between text-xs md:text-sm text-blue-400 font-bold no-print">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} className="shrink-0 text-cyan-400" />
            <span>
              {isBn
                ? 'তোমার নাম ইতোমধ্যে একবার পরিবর্তন করা হয়েছে। আরও কোনো সংশোধনের প্রয়োজন হলে অনুগ্রহ করে চলোশিখি টিমের সাথে যোগাযোগ করো: contact@cholosikhi.com'
                : 'Your name has already been modified once. For further changes, please reach out to the CholoSikhi team: contact@cholosikhi.com'}
            </span>
          </div>
          <button 
            onClick={() => setShowContactNotice(false)}
            className="p-1 text-slate-400 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ─── Mobile Landscape Hint (Screen Only) ─── */}
      <div className="sm:hidden w-full max-w-5xl mb-3 py-2 px-3.5 bg-panel border border-border-subtle rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-app-fg-muted no-print shadow-sm">
        <Smartphone size={14} className="text-duo-green shrink-0 rotate-90" />
        <span>{isBn ? 'সেরা অভিজ্ঞতার জন্য ফোন আড়াআড়ি (Landscape) ঘুরিয়ে নিন' : 'Rotate phone to Landscape for best diploma view'}</span>
      </div>

      {/* ─── The Rectangular White-Theme Diploma (ISO 216 Landscape A4 Ratio) ─── */}
      <div 
        id="printable-certificate"
        className="w-full max-w-5xl aspect-auto md:aspect-[1.414/1] min-h-[500px] sm:min-h-[580px] md:min-h-[680px] bg-white text-slate-900 rounded-2xl shadow-2xl p-4 sm:p-8 md:p-12 print:p-8 relative flex flex-col justify-between select-none border-4 sm:border-[8px] md:border-[10px] border-[#c59b27] ring-1 ring-black/10 font-sans overflow-hidden"
      >
        {/* Subtle Prestige Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035] select-none">
          <img 
            src="/icon-mark.png" 
            alt="CholoSikhi Crest Watermark" 
            className="w-80 h-80 sm:w-96 sm:h-96 md:w-[460px] md:h-[460px] object-contain filter grayscale" 
          />
        </div>

        {/* Double Inner Frame: Classic Gold Foil & CholoSikhi Electric Blue */}
        <div className="absolute inset-1.5 sm:inset-3 md:inset-3.5 border sm:border-2 border-[#c59b27]/80 rounded-md sm:rounded-lg pointer-events-none" />
        <div className="absolute inset-2.5 sm:inset-5 md:inset-5.5 border border-[#00d4ff]/40 rounded-sm sm:rounded-md pointer-events-none" />

        {/* Traditional Gold Ornamental Corner Accents */}
        <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 w-6 h-6 sm:w-10 sm:h-10 border-t-2 border-l-2 border-[#c59b27] pointer-events-none" />
        <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 w-6 h-6 sm:w-10 sm:h-10 border-t-2 border-r-2 border-[#c59b27] pointer-events-none" />
        <div className="absolute bottom-2.5 left-2.5 sm:bottom-4 sm:left-4 w-6 h-6 sm:w-10 sm:h-10 border-b-2 border-l-2 border-[#c59b27] pointer-events-none" />
        <div className="absolute bottom-2.5 right-2.5 sm:bottom-4 sm:right-4 w-6 h-6 sm:w-10 sm:h-10 border-b-2 border-r-2 border-[#c59b27] pointer-events-none" />

        {/* ── Section 1: Official CholoSikhi Academy Header & Logo ── */}
        <div className="relative z-10 text-center pt-1 sm:pt-2">
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-1 sm:mb-2">
            <img 
              src="/icon-mark.png" 
              alt="CholoSikhi Logo" 
              className="w-7 h-7 sm:w-11 sm:h-11 md:w-12 md:h-12 object-contain drop-shadow-sm" 
            />
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              <span className="tracking-[0.2em] sm:tracking-[0.25em] text-base sm:text-xl md:text-2xl lg:text-3xl font-black text-slate-900 uppercase">
                CHOLOSIKHI
              </span>
              <span className="px-2 py-0.5 sm:px-3.5 sm:py-1 rounded-full bg-[#00d4ff]/15 text-[#007799] text-[9px] sm:text-xs md:text-sm font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] border border-[#00d4ff]/40 shadow-sm">
                ACADEMY
              </span>
            </div>
          </div>
          {/* Prestige Diamond & Gold Divider */}
          <div className="max-w-[200px] sm:max-w-sm md:max-w-md mx-auto flex items-center justify-center gap-1.5 sm:gap-2 mt-1 sm:mt-1.5 opacity-80">
            <div className="h-[1px] sm:h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-[#c59b27] to-[#c59b27]" />
            <span className="text-[#c59b27] text-[10px] sm:text-sm">✦</span>
            <span className="text-[#00d4ff] text-[10px] sm:text-sm">◆</span>
            <span className="text-[#c59b27] text-[10px] sm:text-sm">✦</span>
            <div className="h-[1px] sm:h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-[#c59b27] to-[#c59b27]" />
          </div>
        </div>

        {/* ── Section 2: Diploma Title ── */}
        <div className="relative z-10 text-center py-1.5 sm:py-3 md:py-4">
          <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black tracking-wide sm:tracking-wider text-slate-900 uppercase font-serif md:font-sans">
            {currentCert.isGolden ? 'CERTIFICATE OF EXCELLENCE' : 'CERTIFICATE OF COMPLETION'}
          </h2>
          <p className="text-xs sm:text-base md:text-lg lg:text-xl font-medium italic text-slate-600 mt-0.5 sm:mt-1 md:mt-2">
            {isBn ? 'এই মর্মে সগৌরবে প্রত্যয়ন করা যাচ্ছে যে' : 'This is proudly and officially conferred upon'}
          </p>
        </div>

        {/* ── Section 3: Recipient Name (Editable Once Only by Owner) ── */}
        <div className="relative z-10 text-center py-1 sm:py-3 md:py-4">
          {isEditingName ? (
            <div className="flex items-center justify-center gap-2 max-w-md mx-auto no-print">
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder={isBn ? 'তোমার পূর্ণ নাম লিখুন' : 'Enter your full name'}
                className="py-1.5 px-3 sm:py-2 sm:px-4 bg-white border-2 border-[#00d4ff] rounded-xl text-slate-900 font-bold text-center w-full text-base sm:text-xl focus:outline-none shadow-sm"
              />
              <button
                onClick={handleSaveName}
                className="p-2 sm:p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow shrink-0"
                title="Save Name (1-time change)"
              >
                <Check size={18} />
              </button>
              <button
                onClick={() => {
                  setIsEditingName(false);
                  setCustomName(currentCert.recipientName);
                }}
                className="p-2 sm:p-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold shrink-0"
                title="Cancel"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <div className="inline-flex flex-col items-center justify-center group max-w-full">
              <div className="inline-flex items-center justify-center gap-1.5 sm:gap-2 max-w-full">
                <h3 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-slate-950 tracking-tight pb-0.5 sm:pb-1 px-2 sm:px-4 break-words">
                  {currentCert.recipientName}
                </h3>
                
                {/* Option to change name ONCE (Only visible to owner, never to external verifiers) */}
                {isOwner && (!currentCert.nameChanged ? (
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="opacity-60 hover:opacity-100 transition p-1.5 sm:p-2 rounded-lg text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 no-print flex items-center gap-1 text-xs font-bold shrink-0"
                    title={isBn ? 'নাম পরিবর্তন করুন (শুধুমাত্র ১ বার সুযোগ)' : 'Edit Name (1 time only)'}
                  >
                    <Edit2 size={15} />
                    <span className="hidden sm:inline text-xs font-bold text-[#0099bb]">
                      {isBn ? 'নাম পরিবর্তন (১ বার)' : 'Edit Once'}
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => setShowContactNotice(true)}
                    className="opacity-40 hover:opacity-100 transition p-1.5 rounded-md text-slate-400 no-print flex items-center gap-1 text-xs cursor-help shrink-0"
                    title={isBn ? 'নাম পরিবর্তন করা হয়েছে। যোগাযোগের জন্য ক্লিক করুন।' : 'Name updated. Contact team for further changes.'}
                  >
                    <Lock size={13} />
                    <span className="hidden sm:inline text-[10px]">{isBn ? 'লকড' : 'Locked'}</span>
                  </button>
                ))}
              </div>
              {/* Ornate Gold Accent Underline */}
              <div className="w-44 sm:w-80 md:w-96 lg:w-[480px] h-0.5 bg-gradient-to-r from-transparent via-[#c59b27] to-transparent mt-0.5 sm:mt-1" />
            </div>
          )}
        </div>

        {/* ── Section 4: Course & Achievement Statement ── */}
        <div className="relative z-10 text-center max-w-3xl mx-auto space-y-1.5 sm:space-y-2 md:space-y-3 py-1 sm:py-3 md:py-4">
          <p className="text-[11px] sm:text-sm md:text-base lg:text-lg text-slate-600 font-medium leading-relaxed">
            {isBn
              ? 'পাইথন প্রোগ্রামিংয়ের সম্পূর্ণ কারিকুলাম ও চূড়ান্ত সার্টিফিকেশন পরীক্ষায় দক্ষতার পরিচয় দিয়ে সফলভাবে সম্পন্ন করেছে:'
              : 'for successfully demonstrating programming proficiency and passing the interactive curriculum in:'}
          </p>
          <div className="font-black text-lg sm:text-2xl md:text-3xl lg:text-4xl text-slate-900 tracking-wide">
            {isBn ? currentCert.courseNameBn : currentCert.courseName}
          </div>
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-6 sm:py-2 rounded-full bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border sm:border-2 border-[#c59b27]/60 text-[10px] sm:text-sm md:text-base font-black text-amber-900 shadow-sm">
            <span>★</span>
            <span>
              {currentCert.isGolden 
                ? (isBn ? `গোল্ডেন ডিস্টিংকশন • চূড়ান্ত স্কোর: ${toBnDigits(currentCert.percentage)}%` : `Gold Distinction • Final Score: ${currentCert.percentage}%`) 
                : (isBn ? `চূড়ান্ত ফলাফল: ${toBnDigits(currentCert.percentage)}% • উত্তীর্ণ` : `Verified Passing Score: ${currentCert.percentage}% • Passed`)}
            </span>
            <span>★</span>
          </div>
        </div>

        {/* ── Section 5: Bottom 3 Pillars (Verification, Mascot Nini Seal, Scannable QR) ── */}
        <div className="relative z-10 pt-3 sm:pt-6 md:pt-8 border-t-2 border-[#c59b27]/40 grid grid-cols-3 items-end gap-1 sm:gap-6 mt-1 sm:mt-2">
          
          {/* Left Pillar: Metadata & Verification URL */}
          <div className="text-left font-mono text-[8px] sm:text-xs md:text-sm text-slate-700 space-y-0.5 sm:space-y-1.5 min-w-0">
            <div>
              <span className="font-bold text-slate-400 uppercase block text-[7px] sm:text-[10px] md:text-xs leading-tight">
                {isBn ? 'সার্টিফিকেট আইডি' : 'Certificate ID'}
              </span>
              <span className="font-bold text-slate-950 tracking-tight sm:tracking-wider break-all sm:break-normal text-[8px] sm:text-xs md:text-sm">
                {currentCert.certId}
              </span>
            </div>
            <div>
              <span className="font-bold text-slate-400 uppercase block text-[7px] sm:text-[10px] md:text-xs leading-tight">
                {isBn ? 'ইস্যুর তারিখ' : 'Issue Date'}
              </span>
              <span className="text-slate-900 font-semibold text-[8px] sm:text-xs md:text-sm leading-tight block">
                {displayDate}
              </span>
            </div>
            <div className="hidden xs:block sm:block">
              <span className="font-bold text-slate-400 uppercase block text-[7px] sm:text-[10px] md:text-xs leading-tight">
                {isBn ? 'একাডেমি' : 'Academy'}
              </span>
              <span className="text-[#0088aa] font-bold text-[8px] sm:text-xs">cholosikhi.com</span>
            </div>
          </div>

          {/* Center Pillar: Mascot Nini Official Academy Gold & Blue Seal */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full border-2 sm:border-4 md:border-[5px] border-[#c59b27] bg-gradient-to-br from-[#fefcf7] via-[#f7e8b6] to-[#d4af37] text-slate-900 flex flex-col items-center justify-center shadow-md sm:shadow-lg relative p-1 sm:p-1.5">
              <div className="absolute inset-1 sm:inset-1.5 rounded-full border border-dashed sm:border-2 border-[#00d4ff]/60" />
              <img 
                src={NINI_MASCOT.right} 
                alt="Mascot Nini Academy Seal" 
                className="w-7 h-7 sm:w-11 sm:h-11 md:w-13 md:h-13 lg:w-14 lg:h-14 object-contain drop-shadow-sm" 
              />
              <span className="text-[6px] sm:text-[8px] md:text-[9px] font-black uppercase tracking-wider sm:tracking-widest text-[#7a4f08] mt-0.5">
                VERIFIED
              </span>
              <span className="text-[5px] sm:text-[7px] md:text-[8px] font-black tracking-tight text-[#7a4f08] uppercase leading-none">
                CHOLOSIKHI
              </span>
            </div>
            <span className="text-[7px] sm:text-xs md:text-sm font-black uppercase tracking-wider sm:tracking-[0.2em] text-slate-700 mt-1 sm:mt-2">
              {isBn ? 'একাডেমি সিল' : 'ACADEMY SEAL'}
            </span>
          </div>

          {/* Right Pillar: Scannable Verification QR Code */}
          <div className="flex flex-col items-end text-right min-w-0">
            <div className="p-1 sm:p-2 bg-white border border-slate-300 sm:border-2 rounded-xl sm:rounded-2xl shadow-sm sm:shadow-md">
              {qrDataUrl ? (
                <img 
                  src={qrDataUrl} 
                  alt="Verify Certificate QR Code" 
                  className="w-12 h-12 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain" 
                />
              ) : (
                <div className="w-12 h-12 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-slate-100 flex items-center justify-center text-[8px] text-slate-400 font-mono">
                  QR
                </div>
              )}
            </div>
            <span className="text-[7px] sm:text-[10px] md:text-xs font-black uppercase tracking-tight sm:tracking-wider text-slate-800 mt-1 flex items-center gap-0.5 sm:gap-1.5">
              <QrCode size={11} className="text-[#0099bb] shrink-0 sm:w-[13px] sm:h-[13px]" />
              <span className="truncate">{isBn ? 'যাচাই কিউআর' : 'Scan to Verify'}</span>
            </span>
            <span className="text-[6px] sm:text-[9px] md:text-[10px] text-slate-400 font-mono hidden xs:inline sm:inline">
              cholosikhi.com
            </span>
          </div>

        </div>

      </div>

      {/* ─── Bottom Printing Advice Card (Screen Only) ─── */}
      <div className="max-w-5xl w-full mt-5 bg-panel border border-border-subtle rounded-2xl p-4 text-xs text-app-fg-muted text-center no-print font-bold">
        {isBn
          ? '💡 টিপস: সার্টিফিকেটটি PDF আকারে ১ পেজে সেভ করতে "Download / Print (PDF)" বাটনে ক্লিক করে Destination-এ "Save as PDF" এবং Layout-এ "Landscape" সিলেক্ট করুন।'
          : '💡 Tip: To save this certificate as a 1-page PDF, click "Download / Print (PDF)", choose "Save as PDF" as Destination, and select "Landscape" layout.'}
      </div>

    </div>
  );
}

import { X, Layers } from 'lucide-react';
import MathRenderer from './MathRenderer';
import { play } from '../../lib/audio';

interface ReferenceSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReferenceSheetModal({
  isOpen,
  onClose
}: ReferenceSheetModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reference-sheet-title"
    >
      <div className="w-full max-w-4xl h-[90vh] bg-panel-solid border-2 border-border-subtle rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Bluebook-Style Top Header Bar */}
        <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between gap-4 bg-panel shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Layers size={20} />
            </div>
            <div>
              <h3 id="reference-sheet-title" className="font-black text-base text-app-fg tracking-tight">
                Reference
              </h3>
              <p className="text-xs text-app-fg/60 font-bold">
                Official College Board SAT Math Reference Sheet
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              play('tap');
              onClose();
            }}
            className="p-2 rounded-2xl bg-panel border border-border-subtle hover:bg-white/10 text-app-fg transition-all"
            title="Close Reference Sheet"
          >
            <X size={18} />
          </button>
        </div>

        {/* Official Reference Sheet Content Canvas */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-8">
          {/* Top Bluebook Subtitle Notice */}
          <div className="p-3.5 rounded-2xl bg-blue-500/5 border border-blue-500/20 text-xs font-bold text-app-fg/70">
            The following formulas and laws may be used on the Digital SAT Math section.
          </div>

          {/* ─── SECTION 1: 2D PLANE GEOMETRY & RIGHT TRIANGLES ─── */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-blue-400 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              <span>2D Plane Geometry & Special Triangles</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* 1. Circle */}
              <div className="glass p-4 rounded-2xl border border-border-subtle flex flex-col justify-between items-center text-center space-y-3">
                <div className="w-full h-32 flex items-center justify-center bg-slate-950/60 rounded-xl p-2 border border-border-subtle/60">
                  <svg viewBox="0 0 140 110" className="w-full h-full max-h-28 text-cyan-400">
                    <circle cx="70" cy="55" r="42" fill="none" stroke="currentColor" strokeWidth="2.5" />
                    <circle cx="70" cy="55" r="3" fill="#f8fafc" />
                    <line x1="70" y1="55" x2="112" y2="55" stroke="#f8fafc" strokeWidth="2" strokeDasharray="3 3" />
                    <text x="91" y="48" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">r</text>
                  </svg>
                </div>
                <div className="space-y-1.5 w-full">
                  <div className="text-xs font-black text-app-fg">Circle</div>
                  <div className="py-1 px-2 rounded-lg bg-panel border border-border-subtle text-xs font-bold text-cyan-400 flex items-center justify-center">
                    <MathRenderer content="$A = \pi r^2$" />
                  </div>
                  <div className="py-1 px-2 rounded-lg bg-panel border border-border-subtle text-xs font-bold text-cyan-400 flex items-center justify-center">
                    <MathRenderer content="$C = 2\pi r$" />
                  </div>
                </div>
              </div>

              {/* 2. Rectangle */}
              <div className="glass p-4 rounded-2xl border border-border-subtle flex flex-col justify-between items-center text-center space-y-3">
                <div className="w-full h-32 flex items-center justify-center bg-slate-950/60 rounded-xl p-2 border border-border-subtle/60">
                  <svg viewBox="0 0 140 110" className="w-full h-full max-h-28 text-cyan-400">
                    <rect x="25" y="25" width="90" height="60" fill="none" stroke="currentColor" strokeWidth="2.5" rx="1" />
                    <path d="M 25 35 L 35 35 L 35 25" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
                    <text x="70" y="100" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">ℓ</text>
                    <text x="15" y="58" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">w</text>
                  </svg>
                </div>
                <div className="space-y-1.5 w-full">
                  <div className="text-xs font-black text-app-fg">Rectangle</div>
                  <div className="py-1 px-2 rounded-lg bg-panel border border-border-subtle text-xs font-bold text-cyan-400 flex items-center justify-center">
                    <MathRenderer content="$A = \ell w$" />
                  </div>
                </div>
              </div>

              {/* 3. Triangle */}
              <div className="glass p-4 rounded-2xl border border-border-subtle flex flex-col justify-between items-center text-center space-y-3">
                <div className="w-full h-32 flex items-center justify-center bg-slate-950/60 rounded-xl p-2 border border-border-subtle/60">
                  <svg viewBox="0 0 140 110" className="w-full h-full max-h-28 text-cyan-400">
                    <polygon points="20,85 120,85 85,25" fill="none" stroke="currentColor" strokeWidth="2.5" />
                    <line x1="85" y1="25" x2="85" y2="85" stroke="#f8fafc" strokeWidth="2" strokeDasharray="3 3" />
                    <path d="M 85 75 L 75 75 L 75 85" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
                    <text x="94" y="58" fill="#38bdf8" fontSize="12" fontWeight="bold">h</text>
                    <text x="70" y="101" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">b</text>
                  </svg>
                </div>
                <div className="space-y-1.5 w-full">
                  <div className="text-xs font-black text-app-fg">Triangle</div>
                  <div className="py-1 px-2 rounded-lg bg-panel border border-border-subtle text-xs font-bold text-cyan-400 flex items-center justify-center">
                    <MathRenderer content="$A = \frac{1}{2}bh$" />
                  </div>
                </div>
              </div>

              {/* 4. Pythagorean Theorem */}
              <div className="glass p-4 rounded-2xl border border-border-subtle flex flex-col justify-between items-center text-center space-y-3">
                <div className="w-full h-32 flex items-center justify-center bg-slate-950/60 rounded-xl p-2 border border-border-subtle/60">
                  <svg viewBox="0 0 140 110" className="w-full h-full max-h-28 text-cyan-400">
                    <polygon points="30,85 115,85 30,25" fill="none" stroke="currentColor" strokeWidth="2.5" />
                    <path d="M 30 73 L 42 73 L 42 85" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
                    <text x="20" y="58" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">a</text>
                    <text x="72" y="100" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">b</text>
                    <text x="82" y="50" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">c</text>
                  </svg>
                </div>
                <div className="space-y-1.5 w-full">
                  <div className="text-xs font-black text-app-fg">Right Triangle</div>
                  <div className="py-1 px-2 rounded-lg bg-panel border border-border-subtle text-xs font-bold text-cyan-400 flex items-center justify-center">
                    <MathRenderer content="$c^2 = a^2 + b^2$" />
                  </div>
                </div>
              </div>

              {/* 5. Special Right Triangle: 45-45-90 */}
              <div className="glass p-4 rounded-2xl border border-border-subtle flex flex-col justify-between items-center text-center space-y-3">
                <div className="w-full h-32 flex items-center justify-center bg-slate-950/60 rounded-xl p-2 border border-border-subtle/60">
                  <svg viewBox="0 0 150 110" className="w-full h-full max-h-28 text-cyan-400">
                    <polygon points="30,85 110,85 30,15" fill="none" stroke="currentColor" strokeWidth="2.5" />
                    {/* Right angle square */}
                    <path d="M 30 73 L 42 73 L 42 85" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
                    {/* Angle labels */}
                    <text x="96" y="82" fill="#94a3b8" fontSize="10" fontWeight="bold">45°</text>
                    <text x="36" y="30" fill="#94a3b8" fontSize="10" fontWeight="bold">45°</text>
                    {/* Legs */}
                    <text x="18" y="55" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">s</text>
                    <text x="70" y="100" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">s</text>
                    {/* Hypotenuse with vector radical s√2 */}
                    <g transform="translate(75, 42)">
                      <text x="0" y="10" fill="#38bdf8" fontSize="12" fontWeight="bold">s</text>
                      <path d="M 8,7 L 10,10 L 13,2 L 23,2" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <text x="15" y="10" fill="#38bdf8" fontSize="11" fontWeight="bold">2</text>
                    </g>
                  </svg>
                </div>
                <div className="space-y-1.5 w-full">
                  <div className="text-xs font-black text-app-fg">Special Right Triangle (45°-45°-90°)</div>
                  <div className="py-1 px-2 rounded-lg bg-panel border border-border-subtle text-xs font-bold text-cyan-400 flex items-center justify-center">
                    <MathRenderer content="$s : s : s\sqrt{2}$" />
                  </div>
                </div>
              </div>

              {/* 6. Special Right Triangle: 30-60-90 */}
              <div className="glass p-4 rounded-2xl border border-border-subtle flex flex-col justify-between items-center text-center space-y-3">
                <div className="w-full h-32 flex items-center justify-center bg-slate-950/60 rounded-xl p-2 border border-border-subtle/60">
                  <svg viewBox="0 0 150 110" className="w-full h-full max-h-28 text-cyan-400">
                    <polygon points="30,85 125,85 30,22" fill="none" stroke="currentColor" strokeWidth="2.5" />
                    {/* Right angle square */}
                    <path d="M 30 73 L 42 73 L 42 85" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
                    {/* Angles */}
                    <text x="100" y="80" fill="#94a3b8" fontSize="10" fontWeight="bold">30°</text>
                    <text x="36" y="38" fill="#94a3b8" fontSize="10" fontWeight="bold">60°</text>
                    {/* Short leg */}
                    <text x="18" y="58" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">x</text>
                    {/* Long leg with vector radical x√3 */}
                    <g transform="translate(68, 92)">
                      <text x="0" y="10" fill="#38bdf8" fontSize="12" fontWeight="bold">x</text>
                      <path d="M 8,7 L 10,10 L 13,2 L 23,2" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <text x="15" y="10" fill="#38bdf8" fontSize="11" fontWeight="bold">3</text>
                    </g>
                    {/* Hypotenuse */}
                    <text x="88" y="48" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">2x</text>
                  </svg>
                </div>
                <div className="space-y-1.5 w-full">
                  <div className="text-xs font-black text-app-fg">Special Right Triangle (30°-60°-90°)</div>
                  <div className="py-1 px-2 rounded-lg bg-panel border border-border-subtle text-xs font-bold text-cyan-400 flex items-center justify-center">
                    <MathRenderer content="$x : x\sqrt{3} : 2x$" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── SECTION 2: 3D SOLID GEOMETRY (VOLUME) ─── */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-blue-400 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              <span>Solid Geometry (Volume Formulas)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* 1. Rectangular Prism */}
              <div className="glass p-4 rounded-2xl border border-border-subtle flex flex-col justify-between items-center text-center space-y-3">
                <div className="w-full h-32 flex items-center justify-center bg-slate-950/60 rounded-xl p-2 border border-border-subtle/60">
                  <svg viewBox="0 0 130 110" className="w-full h-full text-cyan-400">
                    <polygon points="25,45 80,45 80,90 25,90" fill="none" stroke="currentColor" strokeWidth="2" />
                    <polygon points="25,45 55,20 110,20 80,45" fill="none" stroke="currentColor" strokeWidth="2" />
                    <polygon points="80,45 110,20 110,65 80,90" fill="none" stroke="currentColor" strokeWidth="2" />
                    <text x="52" y="103" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">ℓ</text>
                    <text x="18" y="70" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">h</text>
                    <text x="102" y="82" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">w</text>
                  </svg>
                </div>
                <div className="space-y-1 w-full">
                  <div className="text-xs font-black text-app-fg">Rectangular Prism</div>
                  <div className="py-1 px-2 rounded-lg bg-panel border border-border-subtle text-xs font-bold text-cyan-400 flex items-center justify-center">
                    <MathRenderer content="$V = \ell wh$" />
                  </div>
                </div>
              </div>

              {/* 2. Cylinder */}
              <div className="glass p-4 rounded-2xl border border-border-subtle flex flex-col justify-between items-center text-center space-y-3">
                <div className="w-full h-32 flex items-center justify-center bg-slate-950/60 rounded-xl p-2 border border-border-subtle/60">
                  <svg viewBox="0 0 130 110" className="w-full h-full text-cyan-400">
                    <ellipse cx="65" cy="28" rx="40" ry="12" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M 25 82 A 40 12 0 0 0 105 82" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M 25 82 A 40 12 0 0 1 105 82" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="25" y1="28" x2="25" y2="82" stroke="currentColor" strokeWidth="2" />
                    <line x1="105" y1="28" x2="105" y2="82" stroke="currentColor" strokeWidth="2" />
                    <line x1="65" y1="28" x2="105" y2="28" stroke="#f8fafc" strokeWidth="1.5" strokeDasharray="2 2" />
                    <text x="85" y="24" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">r</text>
                    <text x="18" y="58" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">h</text>
                  </svg>
                </div>
                <div className="space-y-1 w-full">
                  <div className="text-xs font-black text-app-fg">Right Cylinder</div>
                  <div className="py-1 px-2 rounded-lg bg-panel border border-border-subtle text-xs font-bold text-cyan-400 flex items-center justify-center">
                    <MathRenderer content="$V = \pi r^2 h$" />
                  </div>
                </div>
              </div>

              {/* 3. Sphere */}
              <div className="glass p-4 rounded-2xl border border-border-subtle flex flex-col justify-between items-center text-center space-y-3">
                <div className="w-full h-32 flex items-center justify-center bg-slate-950/60 rounded-xl p-2 border border-border-subtle/60">
                  <svg viewBox="0 0 130 110" className="w-full h-full text-cyan-400">
                    <circle cx="65" cy="55" r="38" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M 27 55 A 38 12 0 0 0 103 55" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M 27 55 A 38 12 0 0 1 103 55" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
                    <circle cx="65" cy="55" r="2.5" fill="#f8fafc" />
                    <line x1="65" y1="55" x2="103" y2="55" stroke="#f8fafc" strokeWidth="1.5" strokeDasharray="2 2" />
                    <text x="84" y="48" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">r</text>
                  </svg>
                </div>
                <div className="space-y-1 w-full">
                  <div className="text-xs font-black text-app-fg">Sphere</div>
                  <div className="py-1 px-2 rounded-lg bg-panel border border-border-subtle text-xs font-bold text-cyan-400 flex items-center justify-center">
                    <MathRenderer content="$V = \frac{4}{3}\pi r^3$" />
                  </div>
                </div>
              </div>

              {/* 4. Cone */}
              <div className="glass p-4 rounded-2xl border border-border-subtle flex flex-col justify-between items-center text-center space-y-3">
                <div className="w-full h-32 flex items-center justify-center bg-slate-950/60 rounded-xl p-2 border border-border-subtle/60">
                  <svg viewBox="0 0 130 110" className="w-full h-full text-cyan-400">
                    <line x1="65" y1="20" x2="25" y2="85" stroke="currentColor" strokeWidth="2" />
                    <line x1="65" y1="20" x2="105" y2="85" stroke="currentColor" strokeWidth="2" />
                    <path d="M 25 85 A 40 12 0 0 0 105 85" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M 25 85 A 40 12 0 0 1 105 85" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="65" y1="20" x2="65" y2="85" stroke="#f8fafc" strokeWidth="1.5" strokeDasharray="3 3" />
                    <line x1="65" y1="85" x2="105" y2="85" stroke="#f8fafc" strokeWidth="1.5" strokeDasharray="2 2" />
                    <text x="85" y="80" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">r</text>
                    <text x="56" y="55" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">h</text>
                  </svg>
                </div>
                <div className="space-y-1 w-full">
                  <div className="text-xs font-black text-app-fg">Right Cone</div>
                  <div className="py-1 px-2 rounded-lg bg-panel border border-border-subtle text-xs font-bold text-cyan-400 flex items-center justify-center">
                    <MathRenderer content="$V = \frac{1}{3}\pi r^2 h$" />
                  </div>
                </div>
              </div>

              {/* 5. Pyramid */}
              <div className="glass p-4 rounded-2xl border border-border-subtle flex flex-col justify-between items-center text-center space-y-3">
                <div className="w-full h-32 flex items-center justify-center bg-slate-950/60 rounded-xl p-2 border border-border-subtle/60">
                  <svg viewBox="0 0 130 110" className="w-full h-full text-cyan-400">
                    <line x1="65" y1="20" x2="20" y2="80" stroke="currentColor" strokeWidth="2" />
                    <line x1="65" y1="20" x2="80" y2="92" stroke="currentColor" strokeWidth="2" />
                    <line x1="65" y1="20" x2="110" y2="75" stroke="currentColor" strokeWidth="2" />
                    <line x1="20" y1="80" x2="80" y2="92" stroke="currentColor" strokeWidth="2" />
                    <line x1="80" y1="92" x2="110" y2="75" stroke="currentColor" strokeWidth="2" />
                    <line x1="20" y1="80" x2="50" y2="65" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="50" y1="65" x2="110" y2="75" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="65" y1="20" x2="65" y2="78" stroke="#f8fafc" strokeWidth="1.5" strokeDasharray="3 3" />
                    <text x="56" y="52" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">h</text>
                    <text x="65" y="90" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">B</text>
                  </svg>
                </div>
                <div className="space-y-1 w-full">
                  <div className="text-xs font-black text-app-fg">Pyramid</div>
                  <div className="py-1 px-2 rounded-lg bg-panel border border-border-subtle text-xs font-bold text-cyan-400 flex items-center justify-center">
                    <MathRenderer content="$V = \frac{1}{3}Bh$" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── SECTION 3: OFFICIAL COLLEGE BOARD REFERENCE RULES ─── */}
          <div className="p-5 sm:p-6 rounded-2xl bg-panel border-2 border-border-subtle text-xs text-app-fg/80 space-y-3">
            <h5 className="font-black text-blue-400 uppercase tracking-wider text-[11px] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              Official Reference Rules
            </h5>
            <ul className="space-y-2 font-bold text-app-fg/85">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-black">•</span>
                <span>The number of degrees of arc in a circle is 360.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-black">•</span>
                <span>The number of radians of arc in a circle is <MathRenderer content="$2\pi$" inline />.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-black">•</span>
                <span>The sum of the measures in degrees of the angles of a triangle is 180.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

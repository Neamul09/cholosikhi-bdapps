import { X, Layers } from 'lucide-react';
import { SAT_FORMULA_SHEET } from '../data/formulaData';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-4xl h-[85vh] bg-panel-solid border-2 border-border-subtle rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between bg-panel shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Layers size={20} />
            </div>
            <div>
              <h3 className="font-black text-base text-app-fg">Official SAT Math Reference Sheet</h3>
              <p className="text-xs text-app-fg/50 font-bold">Provided by College Board on all Math sections</p>
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

        {/* Formulas Grid */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SAT_FORMULA_SHEET.map((f, i) => (
              <div
                key={i}
                className="glass p-5 rounded-2xl border border-border-subtle flex flex-col justify-between hover:border-blue-500/30 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-400">
                      {f.category}
                    </span>
                    <span className="text-xs font-black text-app-fg">{f.name}</span>
                  </div>
                  <div className="py-2 px-3 rounded-xl bg-app-bg/60 border border-border-subtle text-center">
                    <MathRenderer content={`$${f.latex}$`} />
                  </div>
                </div>
                <p className="text-xs text-app-fg/60 font-bold mt-3 leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>

          {/* Official College Board Reference Notes */}
          <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/20 text-xs text-app-fg/70 space-y-2">
            <h5 className="font-black text-blue-400 uppercase tracking-wider text-[11px]">
              Official Reference Rules
            </h5>
            <ul className="list-disc list-inside space-y-1 font-bold">
              <li>The number of degrees of arc in a circle is 360.</li>
              <li>The number of radians of arc in a circle is \(2\pi\).</li>
              <li>The sum of the measures in degrees of the angles of a triangle is 180.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

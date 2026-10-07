import { useState, useRef, useEffect } from 'react';
import { X, Maximize2, Minimize2, RotateCcw, Calculator } from 'lucide-react';
import { play } from '../../lib/audio';

interface DesmosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DesmosModal({ isOpen, onClose }: DesmosModalProps) {
  const [sizeMode, setSizeMode] = useState<'standard' | 'expanded' | 'fullscreen'>('standard');
  const [iframeKey, setIframeKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Position state for floating window (drag support)
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const isDragging = useRef(false);
  const dragStart = useRef<{ mouseX: number; mouseY: number; posX: number; posY: number }>({
    mouseX: 0,
    mouseY: 0,
    posX: 0,
    posY: 0
  });

  // Reset position when reopened
  useEffect(() => {
    if (isOpen) {
      // Default to right side on desktop
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setPosition(null);
      } else {
        const defaultX = Math.max(20, window.innerWidth - 840);
        const defaultY = 70;
        setPosition({ x: defaultX, y: defaultY });
      }
      setIsLoading(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleReset = () => {
    play('tap');
    setIsLoading(true);
    setIframeKey(prev => prev + 1);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (sizeMode === 'fullscreen') return;
    isDragging.current = true;
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posX: position?.x || 50,
      posY: position?.y || 70
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = moveEvent.clientX - dragStart.current.mouseX;
      const dy = moveEvent.clientY - dragStart.current.mouseY;
      const newX = Math.max(10, Math.min(window.innerWidth - 380, dragStart.current.posX + dx));
      const newY = Math.max(10, Math.min(window.innerHeight - 300, dragStart.current.posY + dy));
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Dimensions based on mode — wide enough for expressions list + graph
  const sizeClasses = {
    standard: 'w-[95vw] sm:w-[760px] md:w-[820px] h-[560px] max-h-[85vh]',
    expanded: 'w-[96vw] sm:w-[940px] h-[660px] max-h-[90vh]',
    fullscreen: 'fixed inset-2 sm:inset-4 w-auto h-auto rounded-2xl'
  };

  const isFloating = sizeMode !== 'fullscreen' && position !== null;

  return (
    <div
      style={
        isFloating
          ? {
              position: 'fixed',
              left: `${position.x}px`,
              top: `${position.y}px`,
              zIndex: 100
            }
          : undefined
      }
      className={
        !isFloating
          ? 'fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/40 backdrop-blur-sm pointer-events-auto'
          : 'pointer-events-auto'
      }
    >
      <div
        style={isFloating ? { resize: 'both', overflow: 'hidden', minWidth: '400px', minHeight: '420px' } : undefined}
        className={`bg-panel-solid border-2 border-blue-500/50 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-shadow ${
          sizeMode === 'fullscreen' ? sizeClasses.fullscreen : sizeClasses[sizeMode]
        }`}
      >
        {/* Header — Draggable title bar */}
        <div
          onMouseDown={handleMouseDown}
          className="px-4 py-2.5 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white flex items-center justify-between select-none cursor-move shrink-0 shadow-md"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
              <Calculator size={16} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-black text-xs sm:text-sm tracking-wide">Desmos Graphing Calculator</h3>
                <span className="hidden sm:inline-block text-[9px] px-1.5 py-0.2 bg-white/20 rounded font-black uppercase">
                  Digital SAT
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5">
            <button
              onClick={handleReset}
              className="p-1.5 sm:px-2 sm:py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-xs font-bold flex items-center gap-1 active:scale-95"
              title="Reset calculator to blank state"
            >
              <RotateCcw size={13} />
              <span className="hidden sm:inline text-[11px]">Reset</span>
            </button>

            <button
              onClick={() => {
                play('toggle');
                if (sizeMode === 'standard') setSizeMode('expanded');
                else if (sizeMode === 'expanded') setSizeMode('fullscreen');
                else setSizeMode('standard');
              }}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all active:scale-95"
              title={sizeMode === 'fullscreen' ? 'Exit Fullscreen' : 'Toggle Size'}
            >
              {sizeMode === 'fullscreen' ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>

            <button
              onClick={() => {
                play('tap');
                onClose();
              }}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500 transition-all active:scale-95 ml-1"
              title="Close calculator"
            >
              <X size={15} />
            </button>
          </div>
        </div>



        {/* Embedded Desmos Calculator — Official SAT Testing Mode */}
        <div className="relative flex-1 w-full bg-white overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-slate-900/90 text-white z-10">
              <div className="w-8 h-8 border-3 border-blue-400 border-t-transparent rounded-full animate-spin" />
              <p className="font-bold text-xs">Loading Official SAT Desmos...</p>
            </div>
          )}
          <iframe
            key={iframeKey}
            src="https://www.desmos.com/testing/cb-digital-sat/graphing"
            className="w-full h-full border-0"
            title="Official Desmos Graphing Calculator"
            onLoad={() => setIsLoading(false)}
            allow="fullscreen"
          />
        </div>
      </div>
    </div>
  );
}

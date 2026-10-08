export type ShapeVisualizationType =
  | 'circle-area'
  | 'circle-circ'
  | 'circle-equation'
  | 'circle-sector'
  | 'arc-length'
  | 'rectangle-area'
  | 'triangle-area'
  | 'pythagorean'
  | 'triangle-30-60-90'
  | 'triangle-45-45-90'
  | 'rect-prism'
  | 'cylinder'
  | 'sphere'
  | 'cone'
  | 'pyramid'
  | 'circle-angles'
  | 'triangle-sum'
  | 'quadratic-parabola'
  | 'vertex-form'
  | 'slope-rise-run'
  | 'distance-midpoint'
  | 'parallel-perpendicular'
  | 'trig-ratios'
  | 'cofunction-identity'
  | 'trig-pythagorean'
  | 'radians-degrees'
  | 'exponential-growth'
  | 'compound-interest'
  | 'percent-change'
  | 'mean-average'
  | 'standard-deviation'
  | 'probability';

interface FormulaShapeDiagramProps {
  type: ShapeVisualizationType;
  className?: string;
}

export default function FormulaShapeDiagram({ type, className = '' }: FormulaShapeDiagramProps) {
  return (
    <div className={`relative w-full aspect-[16/9] max-h-48 rounded-2xl bg-slate-950/80 border border-border-subtle/80 flex items-center justify-center p-2 overflow-hidden shadow-inner ${className}`}>
      {/* Background subtle grid pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-pattern" width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M 16 0 L 0 0 0 16" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-cyan-400" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      </svg>

      {/* SVG Diagram Canvas */}
      <svg viewBox="0 0 320 180" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cyan-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="amber-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.2" />
          </linearGradient>
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#06b6d4" />
          </marker>
          <marker id="arrow-blue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#3b82f6" />
          </marker>
          <marker id="arrow-amber" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#fbbf24" />
          </marker>
        </defs>

        {/* ─── 1. Circle Area ─── */}
        {type === 'circle-area' && (
          <g>
            <circle cx="160" cy="90" r="60" fill="url(#cyan-glow)" stroke="#06b6d4" strokeWidth="2.5" />
            {/* Center dot */}
            <circle cx="160" cy="90" r="3.5" fill="#f8fafc" />
            {/* Radius line */}
            <line x1="160" y1="90" x2="220" y2="90" stroke="#f8fafc" strokeWidth="2" strokeDasharray="3 3" />
            <circle cx="220" cy="90" r="3" fill="#06b6d4" />
            {/* Radius label */}
            <text x="190" y="82" fill="#38bdf8" fontSize="13" fontWeight="900" textAnchor="middle">r</text>
            <text x="160" y="125" fill="#e2e8f0" fontSize="13" fontWeight="800" textAnchor="middle">Area = π r²</text>
            {/* Shaded indicator badge */}
            <rect x="236" y="22" width="70" height="24" rx="6" fill="#082f49" stroke="#0284c7" strokeWidth="1" />
            <text x="271" y="38" fill="#38bdf8" fontSize="10" fontWeight="800" textAnchor="middle">Total Surface</text>
          </g>
        )}

        {/* ─── 2. Circle Circumference ─── */}
        {type === 'circle-circ' && (
          <g>
            <circle cx="160" cy="90" r="58" fill="none" stroke="#38bdf8" strokeWidth="3" strokeDasharray="6 3" />
            {/* Diameter line */}
            <line x1="102" y1="90" x2="218" y2="90" stroke="#f59e0b" strokeWidth="2.5" markerEnd="url(#arrow-amber)" markerStart="url(#arrow-amber)" />
            <circle cx="160" cy="90" r="3.5" fill="#f8fafc" />
            {/* Labels */}
            <text x="160" y="80" fill="#fbbf24" fontSize="13" fontWeight="900" textAnchor="middle">d (diameter)</text>
            <text x="160" y="125" fill="#38bdf8" fontSize="13" fontWeight="800" textAnchor="middle">C = 2πr = πd</text>
            <path d="M 226 80 A 70 70 0 0 1 226 100" fill="none" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrow)" />
            <text x="245" y="94" fill="#38bdf8" fontSize="10" fontWeight="800">Perimeter</text>
          </g>
        )}

        {/* ─── 3. Rectangle Area ─── */}
        {type === 'rectangle-area' && (
          <g>
            <rect x="70" y="45" width="180" height="90" rx="4" fill="url(#blue-grad)" stroke="#60a5fa" strokeWidth="2.5" />
            {/* Length label (bottom) */}
            <line x1="70" y1="145" x2="250" y2="145" stroke="#93c5fd" strokeWidth="1.5" markerStart="url(#arrow-blue)" markerEnd="url(#arrow-blue)" />
            <text x="160" y="162" fill="#93c5fd" fontSize="13" fontWeight="900" textAnchor="middle">ℓ (length)</text>
            {/* Width label (right) */}
            <line x1="262" y1="45" x2="262" y2="135" stroke="#93c5fd" strokeWidth="1.5" markerStart="url(#arrow-blue)" markerEnd="url(#arrow-blue)" />
            <text x="282" y="95" fill="#93c5fd" fontSize="13" fontWeight="900" textAnchor="middle">w</text>
            {/* Center Formula */}
            <text x="160" y="95" fill="#ffffff" fontSize="14" fontWeight="900" textAnchor="middle">A = ℓ · w</text>
          </g>
        )}

        {/* ─── 4. Triangle Area ─── */}
        {type === 'triangle-area' && (
          <g>
            {/* Triangle shape */}
            <polygon points="60,135 170,35 250,135" fill="url(#cyan-glow)" stroke="#06b6d4" strokeWidth="2.5" />
            {/* Perpendicular height line */}
            <line x1="170" y1="35" x2="170" y2="135" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 3" />
            {/* Right angle indicator box */}
            <rect x="170" y="123" width="12" height="12" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
            {/* Base dimension */}
            <line x1="60" y1="147" x2="250" y2="147" stroke="#38bdf8" strokeWidth="1.5" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
            <text x="155" y="165" fill="#38bdf8" fontSize="13" fontWeight="900" textAnchor="middle">b (base)</text>
            {/* Height label */}
            <text x="185" y="85" fill="#fbbf24" fontSize="13" fontWeight="900">h</text>
            <text x="110" y="95" fill="#ffffff" fontSize="12" fontWeight="800">A = ½ b h</text>
          </g>
        )}

        {/* ─── 5. Pythagorean Theorem ─── */}
        {type === 'pythagorean' && (
          <g>
            {/* Right triangle */}
            <polygon points="70,140 230,140 230,40" fill="url(#blue-grad)" stroke="#3b82f6" strokeWidth="2.5" />
            {/* Right angle box */}
            <rect x="216" y="126" width="14" height="14" fill="none" stroke="#f8fafc" strokeWidth="1.5" />
            {/* Side a (bottom) */}
            <text x="150" y="158" fill="#60a5fa" fontSize="14" fontWeight="900" textAnchor="middle">a (leg)</text>
            {/* Side b (right) */}
            <text x="246" y="95" fill="#60a5fa" fontSize="14" fontWeight="900">b (leg)</text>
            {/* Side c (hypotenuse) */}
            <text x="135" y="80" fill="#a78bfa" fontSize="14" fontWeight="900">c (hypotenuse)</text>
            <text x="145" y="115" fill="#ffffff" fontSize="13" fontWeight="900">a² + b² = c²</text>
          </g>
        )}

        {/* ─── 6. 30-60-90 Triangle ─── */}
        {type === 'triangle-30-60-90' && (
          <g>
            {/* Right triangle 30-60-90 */}
            <polygon points="60,140 240,140 240,36" fill="url(#cyan-glow)" stroke="#06b6d4" strokeWidth="2.5" />
            <rect x="226" y="126" width="14" height="14" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
            {/* Angles */}
            <text x="88" y="134" fill="#38bdf8" fontSize="11" fontWeight="800">30°</text>
            <text x="224" y="60" fill="#38bdf8" fontSize="11" fontWeight="800">60°</text>
            {/* Short leg */}
            <text x="255" y="92" fill="#f8fafc" fontSize="13" fontWeight="900">x</text>
            {/* Long leg with vector radical x√3 */}
            <g transform="translate(138, 146)">
              <text x="0" y="12" fill="#38bdf8" fontSize="13" fontWeight="900">x</text>
              <path d="M 9,8 L 11,12 L 15,2 L 26,2" fill="none" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <text x="17" y="12" fill="#38bdf8" fontSize="12" fontWeight="900">3</text>
            </g>
            {/* Hypotenuse */}
            <text x="135" y="75" fill="#fbbf24" fontSize="14" fontWeight="900">2x (hyp)</text>
          </g>
        )}

        {/* ─── 7. 45-45-90 Triangle ─── */}
        {type === 'triangle-45-45-90' && (
          <g>
            <polygon points="80,140 200,140 200,20" fill="url(#blue-grad)" stroke="#818cf8" strokeWidth="2.5" />
            <rect x="186" y="126" width="14" height="14" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
            {/* Angles */}
            <text x="105" y="132" fill="#c084fc" fontSize="11" fontWeight="800">45°</text>
            <text x="185" y="45" fill="#c084fc" fontSize="11" fontWeight="800">45°</text>
            {/* Equal leg ticks */}
            <line x1="138" y1="136" x2="138" y2="144" stroke="#f8fafc" strokeWidth="2" />
            <line x1="196" y1="78" x2="204" y2="78" stroke="#f8fafc" strokeWidth="2" />
            {/* Sides */}
            <text x="140" y="158" fill="#f8fafc" fontSize="13" fontWeight="900" textAnchor="middle">s</text>
            <text x="215" y="85" fill="#f8fafc" fontSize="13" fontWeight="900">s</text>
            {/* Hypotenuse with vector radical s√2 */}
            <g transform="translate(108, 58)">
              <text x="0" y="12" fill="#fbbf24" fontSize="14" fontWeight="900">s</text>
              <path d="M 9,8 L 11,12 L 15,2 L 26,2" fill="none" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <text x="17" y="12" fill="#fbbf24" fontSize="12" fontWeight="900">2</text>
            </g>
          </g>
        )}

        {/* ─── 8. Rectangular Prism Volume ─── */}
        {type === 'rect-prism' && (
          <g>
            {/* Isometric 3D Box */}
            <polygon points="70,95 180,95 180,145 70,145" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
            <polygon points="70,95 120,55 230,55 180,95" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
            <polygon points="180,95 230,55 230,105 180,145" fill="#334155" stroke="#38bdf8" strokeWidth="2" />
            {/* Dimension labels */}
            <text x="125" y="160" fill="#38bdf8" fontSize="13" fontWeight="900" textAnchor="middle">ℓ (length)</text>
            <text x="215" y="135" fill="#818cf8" fontSize="13" fontWeight="900">w</text>
            <text x="52" y="125" fill="#fbbf24" fontSize="13" fontWeight="900">h</text>
            <text x="125" y="125" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle">V = ℓ · w · h</text>
          </g>
        )}

        {/* ─── 9. Right Cylinder Volume ─── */}
        {type === 'cylinder' && (
          <g>
            {/* Top ellipse */}
            <ellipse cx="160" cy="45" rx="55" ry="18" fill="url(#cyan-glow)" stroke="#06b6d4" strokeWidth="2" />
            {/* Body */}
            <path d="M 105 45 L 105 130 A 55 18 0 0 0 215 130 L 215 45" fill="#082f49" fillOpacity="0.4" stroke="#06b6d4" strokeWidth="2" />
            {/* Bottom ellipse dashed back */}
            <path d="M 105 130 A 55 18 0 0 1 215 130" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="3 3" />
            {/* Radius on top */}
            <line x1="160" y1="45" x2="215" y2="45" stroke="#f8fafc" strokeWidth="2" strokeDasharray="2 2" />
            <circle cx="160" cy="45" r="3" fill="#f8fafc" />
            <text x="185" y="40" fill="#38bdf8" fontSize="12" fontWeight="900">r</text>
            {/* Height */}
            <line x1="225" y1="45" x2="225" y2="130" stroke="#fbbf24" strokeWidth="1.5" markerStart="url(#arrow-amber)" markerEnd="url(#arrow-amber)" />
            <text x="240" y="90" fill="#fbbf24" fontSize="13" fontWeight="900">h</text>
            <text x="160" y="105" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle">V = π r² h</text>
          </g>
        )}

        {/* ─── 10. Sphere Volume ─── */}
        {type === 'sphere' && (
          <g>
            <circle cx="160" cy="90" r="55" fill="url(#blue-grad)" stroke="#3b82f6" strokeWidth="2.5" />
            {/* Equator ellipse */}
            <ellipse cx="160" cy="90" rx="55" ry="18" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4 3" />
            <circle cx="160" cy="90" r="3.5" fill="#f8fafc" />
            {/* Radius line */}
            <line x1="160" y1="90" x2="208" y2="65" stroke="#fbbf24" strokeWidth="2" />
            <text x="186" y="70" fill="#fbbf24" fontSize="13" fontWeight="900">r</text>
            <text x="160" y="125" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle">V = ⁴⁄₃ π r³</text>
          </g>
        )}

        {/* ─── 11. Right Cone Volume ─── */}
        {type === 'cone' && (
          <g>
            {/* Base ellipse */}
            <ellipse cx="160" cy="135" rx="55" ry="16" fill="url(#cyan-glow)" stroke="#06b6d4" strokeWidth="2" />
            {/* Cone sides */}
            <line x1="105" y1="135" x2="160" y2="35" stroke="#06b6d4" strokeWidth="2" />
            <line x1="215" y1="135" x2="160" y2="35" stroke="#06b6d4" strokeWidth="2" />
            {/* Altitude height */}
            <line x1="160" y1="35" x2="160" y2="135" stroke="#fbbf24" strokeWidth="2" strokeDasharray="3 3" />
            <rect x="160" y="125" width="10" height="10" fill="none" stroke="#fbbf24" strokeWidth="1" />
            {/* Radius */}
            <line x1="160" y1="135" x2="215" y2="135" stroke="#f8fafc" strokeWidth="2" strokeDasharray="2 2" />
            <text x="185" y="150" fill="#38bdf8" fontSize="12" fontWeight="900">r</text>
            <text x="145" y="85" fill="#fbbf24" fontSize="13" fontWeight="900">h</text>
            <text x="210" y="75" fill="#ffffff" fontSize="12" fontWeight="900">V = ⅓ π r² h</text>
          </g>
        )}

        {/* ─── 12. Pyramid Volume ─── */}
        {type === 'pyramid' && (
          <g>
            {/* Square base isometric */}
            <polygon points="110,140 210,140 240,115 140,115" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
            {/* Edges to apex */}
            <line x1="110" y1="140" x2="175" y2="35" stroke="#38bdf8" strokeWidth="2" />
            <line x1="210" y1="140" x2="175" y2="35" stroke="#38bdf8" strokeWidth="2" />
            <line x1="240" y1="115" x2="175" y2="35" stroke="#38bdf8" strokeWidth="2" />
            {/* Altitude */}
            <line x1="175" y1="35" x2="175" y2="128" stroke="#fbbf24" strokeWidth="2" strokeDasharray="3 3" />
            <text x="185" y="85" fill="#fbbf24" fontSize="13" fontWeight="900">h</text>
            <text x="175" y="152" fill="#38bdf8" fontSize="12" fontWeight="900" textAnchor="middle">Base Area B</text>
            <text x="90" y="75" fill="#ffffff" fontSize="13" fontWeight="900">V = ⅓ B h</text>
          </g>
        )}

        {/* ─── 13. Circle Degrees & Radians ─── */}
        {type === 'circle-angles' && (
          <g>
            <circle cx="160" cy="90" r="55" fill="none" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="160" cy="90" r="3" fill="#f8fafc" />
            {/* Axis cross */}
            <line x1="100" y1="90" x2="220" y2="90" stroke="#64748b" strokeWidth="1" />
            <line x1="160" y1="30" x2="160" y2="150" stroke="#64748b" strokeWidth="1" />
            {/* Circular angle arrow */}
            <path d="M 185 90 A 25 25 0 1 1 184.9 89" fill="none" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrow-amber)" />
            <text x="160" y="70" fill="#fbbf24" fontSize="13" fontWeight="900" textAnchor="middle">360° = 2π rad</text>
            <text x="228" y="94" fill="#38bdf8" fontSize="11" fontWeight="800">0 / 2π</text>
            <text x="160" y="24" fill="#38bdf8" fontSize="11" fontWeight="800" textAnchor="middle">90° (π/2)</text>
            <text x="82" y="94" fill="#38bdf8" fontSize="11" fontWeight="800">180° (π)</text>
          </g>
        )}

        {/* ─── 14. Triangle Angle Sum ─── */}
        {type === 'triangle-sum' && (
          <g>
            <polygon points="70,135 160,35 250,135" fill="url(#cyan-glow)" stroke="#06b6d4" strokeWidth="2.5" />
            {/* Angle arcs */}
            <path d="M 85 135 A 15 15 0 0 0 78 120" fill="none" stroke="#fbbf24" strokeWidth="2" />
            <path d="M 235 135 A 15 15 0 0 1 242 120" fill="none" stroke="#fbbf24" strokeWidth="2" />
            <path d="M 152 46 A 15 15 0 0 0 168 46" fill="none" stroke="#fbbf24" strokeWidth="2" />
            <text x="100" y="128" fill="#fbbf24" fontSize="11" fontWeight="800">∠A</text>
            <text x="218" y="128" fill="#fbbf24" fontSize="11" fontWeight="800">∠B</text>
            <text x="160" y="65" fill="#fbbf24" fontSize="11" fontWeight="800" textAnchor="middle">∠C</text>
            <text x="160" y="105" fill="#ffffff" fontSize="14" fontWeight="900" textAnchor="middle">∠A + ∠B + ∠C = 180°</text>
          </g>
        )}

        {/* ─── 15. Circle Equation in Standard Form ─── */}
        {type === 'circle-equation' && (
          <g>
            {/* Coordinate Grid Axes */}
            <line x1="40" y1="90" x2="280" y2="90" stroke="#475569" strokeWidth="1.5" markerEnd="url(#arrow-blue)" />
            <line x1="160" y1="160" x2="160" y2="20" stroke="#475569" strokeWidth="1.5" markerEnd="url(#arrow-blue)" />
            {/* Circle shifted to (h, k) */}
            <circle cx="190" cy="65" r="45" fill="url(#blue-grad)" stroke="#60a5fa" strokeWidth="2" />
            {/* Center point */}
            <circle cx="190" cy="65" r="3.5" fill="#f8fafc" />
            <line x1="190" y1="65" x2="235" y2="65" stroke="#fbbf24" strokeWidth="2" />
            <text x="210" y="58" fill="#fbbf24" fontSize="12" fontWeight="900">r</text>
            <text x="190" y="82" fill="#f8fafc" fontSize="12" fontWeight="900" textAnchor="middle">(h, k)</text>
            <text x="100" y="130" fill="#38bdf8" fontSize="12" fontWeight="900">(x - h)² + (y - k)² = r²</text>
          </g>
        )}

        {/* ─── 16. Arc Length & Sector Area ─── */}
        {(type === 'arc-length' || type === 'circle-sector') && (
          <g>
            <circle cx="160" cy="90" r="60" fill="#0f172a" stroke="#334155" strokeWidth="2" />
            {/* Shaded sector pie */}
            <path d="M 160 90 L 220 90 A 60 60 0 0 0 190 38 Z" fill="url(#cyan-glow)" stroke="#06b6d4" strokeWidth="2" />
            {/* Arc highlight */}
            <path d="M 220 90 A 60 60 0 0 0 190 38" fill="none" stroke="#fbbf24" strokeWidth="3.5" />
            <circle cx="160" cy="90" r="3" fill="#f8fafc" />
            {/* Labels */}
            <text x="180" y="75" fill="#fbbf24" fontSize="12" fontWeight="900">θ</text>
            <text x="180" y="105" fill="#38bdf8" fontSize="12" fontWeight="900">r</text>
            <text x="225" y="58" fill="#fbbf24" fontSize="13" fontWeight="900">arc s</text>
            <text x="95" y="115" fill="#ffffff" fontSize="11" fontWeight="800">
              {type === 'arc-length' ? 's = (θ/360) · 2πr' : 'Sector = (θ/360) · πr²'}
            </text>
          </g>
        )}

        {/* ─── 17. Slope Formula (Rise / Run) ─── */}
        {type === 'slope-rise-run' && (
          <g>
            {/* Coordinate grid */}
            <line x1="50" y1="140" x2="270" y2="140" stroke="#475569" strokeWidth="1.5" />
            <line x1="70" y1="160" x2="70" y2="20" stroke="#475569" strokeWidth="1.5" />
            {/* Line through (100, 120) and (230, 45) */}
            <line x1="80" y1="130" x2="250" y2="35" stroke="#38bdf8" strokeWidth="3" />
            {/* Points */}
            <circle cx="110" cy="115" r="4" fill="#fbbf24" />
            <circle cx="210" cy="58" r="4" fill="#fbbf24" />
            {/* Rise and run triangle */}
            <line x1="110" y1="115" x2="210" y2="115" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
            <line x1="210" y1="115" x2="210" y2="58" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 3" />
            <text x="160" y="132" fill="#94a3b8" fontSize="12" fontWeight="900" textAnchor="middle">Run = Δx</text>
            <text x="235" y="90" fill="#f43f5e" fontSize="12" fontWeight="900">Rise = Δy</text>
            <text x="110" y="105" fill="#fbbf24" fontSize="10" fontWeight="800">(x₁, y₁)</text>
            <text x="210" y="48" fill="#fbbf24" fontSize="10" fontWeight="800">(x₂, y₂)</text>
            <text x="135" y="30" fill="#ffffff" fontSize="13" fontWeight="900">m = (y₂ - y₁) / (x₂ - x₁)</text>
          </g>
        )}

        {/* ─── 18. Distance & Midpoint ─── */}
        {type === 'distance-midpoint' && (
          <g>
            <line x1="70" y1="130" x2="250" y2="50" stroke="#818cf8" strokeWidth="3" />
            <circle cx="70" cy="130" r="4" fill="#38bdf8" />
            <circle cx="250" cy="50" r="4" fill="#38bdf8" />
            {/* Midpoint in center */}
            <circle cx="160" cy="90" r="5" fill="#f59e0b" />
            <text x="70" y="148" fill="#38bdf8" fontSize="11" fontWeight="800">A(x₁, y₁)</text>
            <text x="250" y="42" fill="#38bdf8" fontSize="11" fontWeight="800">B(x₂, y₂)</text>
            <text x="160" y="112" fill="#fbbf24" fontSize="12" fontWeight="900" textAnchor="middle">Midpoint M</text>
            <text x="160" y="72" fill="#ffffff" fontSize="12" fontWeight="900" textAnchor="middle">d = √((Δx)² + (Δy)²)</text>
          </g>
        )}

        {/* ─── 19. Parallel & Perpendicular ─── */}
        {type === 'parallel-perpendicular' && (
          <g>
            {/* Line 1 */}
            <line x1="70" y1="130" x2="250" y2="50" stroke="#06b6d4" strokeWidth="2.5" />
            {/* Perpendicular Line 2 */}
            <line x1="120" y1="20" x2="200" y2="160" stroke="#f43f5e" strokeWidth="2.5" />
            {/* Right angle box at intersection */}
            <rect x="155" y="80" width="12" height="12" transform="rotate(-24 160 90)" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
            <text x="230" y="40" fill="#06b6d4" fontSize="12" fontWeight="900">m₁</text>
            <text x="210" y="160" fill="#f43f5e" fontSize="12" fontWeight="900">m₂ = -1/m₁</text>
            <text x="70" y="40" fill="#fbbf24" fontSize="12" fontWeight="900">Perpendicular ⊥</text>
          </g>
        )}

        {/* ─── 20. Quadratic Parabola & Vertex Form ─── */}
        {(type === 'quadratic-parabola' || type === 'vertex-form') && (
          <g>
            {/* Coordinate Grid */}
            <line x1="40" y1="120" x2="280" y2="120" stroke="#475569" strokeWidth="1.5" />
            <line x1="160" y1="160" x2="160" y2="20" stroke="#475569" strokeWidth="1.5" />
            {/* Parabola curve */}
            <path d="M 80 40 Q 160 160 240 40" fill="url(#cyan-glow)" stroke="#06b6d4" strokeWidth="3" />
            {/* Vertex point */}
            <circle cx="160" cy="130" r="4.5" fill="#f59e0b" />
            {/* Axis of symmetry dashed line */}
            <line x1="160" y1="20" x2="160" y2="160" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" />
            {/* Roots */}
            <circle cx="106" cy="120" r="3.5" fill="#f8fafc" />
            <circle cx="214" cy="120" r="3.5" fill="#f8fafc" />
            <text x="160" y="148" fill="#fbbf24" fontSize="12" fontWeight="900" textAnchor="middle">Vertex (h, k)</text>
            <text x="160" y="16" fill="#fbbf24" fontSize="10" fontWeight="800" textAnchor="middle">x = -b / 2a</text>
            <text x="106" y="112" fill="#f8fafc" fontSize="10" fontWeight="800" textAnchor="middle">x₁</text>
            <text x="214" y="112" fill="#f8fafc" fontSize="10" fontWeight="800" textAnchor="middle">x₂</text>
            <text x="240" y="30" fill="#38bdf8" fontSize="11" fontWeight="800">y = a(x - h)² + k</text>
          </g>
        )}

        {/* ─── 21. SOH CAH TOA Trig Ratios ─── */}
        {type === 'trig-ratios' && (
          <g>
            <polygon points="70,140 230,140 230,40" fill="url(#cyan-glow)" stroke="#06b6d4" strokeWidth="2.5" />
            <rect x="216" y="126" width="14" height="14" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
            {/* Angle theta */}
            <path d="M 100 140 A 30 30 0 0 0 95 125" fill="none" stroke="#fbbf24" strokeWidth="2" />
            <text x="110" y="132" fill="#fbbf24" fontSize="14" fontWeight="900">θ</text>
            {/* Labels */}
            <text x="150" y="158" fill="#38bdf8" fontSize="13" fontWeight="900" textAnchor="middle">Adjacent</text>
            <text x="245" y="90" fill="#f43f5e" fontSize="13" fontWeight="900">Opposite</text>
            <text x="130" y="80" fill="#a855f7" fontSize="13" fontWeight="900">Hypotenuse</text>
            <text x="145" y="115" fill="#ffffff" fontSize="12" fontWeight="900">sin = O/H · cos = A/H · tan = O/A</text>
          </g>
        )}

        {/* ─── 22. Co-Function Identity ─── */}
        {type === 'cofunction-identity' && (
          <g>
            <polygon points="70,140 230,140 230,40" fill="url(#blue-grad)" stroke="#3b82f6" strokeWidth="2.5" />
            <rect x="216" y="126" width="14" height="14" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
            <text x="105" y="134" fill="#fbbf24" fontSize="13" fontWeight="900">θ</text>
            <text x="210" y="65" fill="#38bdf8" fontSize="12" fontWeight="900">90° - θ</text>
            <text x="150" y="95" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle">sin(θ) = cos(90° - θ)</text>
          </g>
        )}

        {/* ─── 23. Pythagorean Trig Identity ─── */}
        {type === 'trig-pythagorean' && (
          <g>
            {/* Unit circle */}
            <circle cx="160" cy="90" r="55" fill="url(#cyan-glow)" stroke="#06b6d4" strokeWidth="2" />
            <line x1="90" y1="90" x2="230" y2="90" stroke="#475569" strokeWidth="1" />
            <line x1="160" y1="25" x2="160" y2="155" stroke="#475569" strokeWidth="1" />
            {/* Triangle inside circle */}
            <polygon points="160,90 205,90 205,52" fill="#1e293b" stroke="#fbbf24" strokeWidth="1.5" />
            <circle cx="205" cy="52" r="3.5" fill="#f8fafc" />
            <text x="215" y="48" fill="#f8fafc" fontSize="11" fontWeight="800">(cos θ, sin θ)</text>
            <text x="180" y="105" fill="#38bdf8" fontSize="11" fontWeight="800">cos θ</text>
            <text x="215" y="75" fill="#f43f5e" fontSize="11" fontWeight="800">sin θ</text>
            <text x="160" y="130" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle">sin²θ + cos²θ = 1</text>
          </g>
        )}

        {/* ─── 24. Radians & Degrees ─── */}
        {type === 'radians-degrees' && (
          <g>
            <circle cx="160" cy="90" r="50" fill="none" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="160" cy="90" r="3" fill="#f8fafc" />
            <line x1="160" y1="90" x2="210" y2="90" stroke="#f8fafc" strokeWidth="2" />
            <line x1="160" y1="90" x2="195" y2="55" stroke="#fbbf24" strokeWidth="2" />
            <text x="175" y="80" fill="#fbbf24" fontSize="12" fontWeight="900">θ</text>
            <text x="160" y="160" fill="#38bdf8" fontSize="12" fontWeight="900" textAnchor="middle">deg · (π/180) = rad</text>
            <text x="220" y="70" fill="#f8fafc" fontSize="11" fontWeight="800">π rad = 180°</text>
          </g>
        )}

        {/* ─── 25. Exponential Growth & Decay ─── */}
        {type === 'exponential-growth' && (
          <g>
            <line x1="60" y1="140" x2="270" y2="140" stroke="#475569" strokeWidth="1.5" markerEnd="url(#arrow-blue)" />
            <line x1="80" y1="160" x2="80" y2="30" stroke="#475569" strokeWidth="1.5" markerEnd="url(#arrow-blue)" />
            {/* Growth curve */}
            <path d="M 80 120 Q 180 115 250 40" fill="none" stroke="#10b981" strokeWidth="3" />
            <circle cx="80" cy="120" r="4" fill="#fbbf24" />
            <text x="95" y="125" fill="#fbbf24" fontSize="12" fontWeight="900">(0, a) Initial</text>
            <text x="220" y="45" fill="#10b981" fontSize="12" fontWeight="900">Growth</text>
            <text x="160" y="162" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle">f(t) = a · (1 ± r)ᵗ</text>
          </g>
        )}

        {/* ─── 26. Compound Interest ─── */}
        {type === 'compound-interest' && (
          <g>
            <line x1="60" y1="140" x2="270" y2="140" stroke="#475569" strokeWidth="1.5" />
            <line x1="80" y1="160" x2="80" y2="30" stroke="#475569" strokeWidth="1.5" />
            <path d="M 80 125 Q 160 120 250 45" fill="none" stroke="#f59e0b" strokeWidth="3" />
            <circle cx="80" cy="125" r="4" fill="#f8fafc" />
            <text x="95" y="130" fill="#f8fafc" fontSize="11" fontWeight="800">P (Principal)</text>
            <text x="165" y="90" fill="#fbbf24" fontSize="13" fontWeight="900" textAnchor="middle">A = P · (1 + r/n)ⁿᵗ</text>
            <text x="160" y="160" fill="#94a3b8" fontSize="11" fontWeight="800" textAnchor="middle">t (years), n (compounding periods)</text>
          </g>
        )}

        {/* ─── 27. Percent Change ─── */}
        {type === 'percent-change' && (
          <g>
            {/* Two comparison bars */}
            <rect x="90" y="70" width="40" height="70" fill="#334155" rx="3" />
            <rect x="180" y="40" width="40" height="100" fill="url(#cyan-glow)" stroke="#06b6d4" strokeWidth="2" rx="3" />
            <text x="110" y="155" fill="#94a3b8" fontSize="12" fontWeight="900" textAnchor="middle">Original</text>
            <text x="200" y="155" fill="#38bdf8" fontSize="12" fontWeight="900" textAnchor="middle">New</text>
            {/* Change arrow */}
            <line x1="135" y1="70" x2="175" y2="40" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow)" />
            <text x="160" y="50" fill="#10b981" fontSize="12" fontWeight="900">Δ Difference</text>
            <text x="160" y="25" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle">% Δ = (New - Old) / Old × 100%</text>
          </g>
        )}

        {/* ─── 28. Mean / Average ─── */}
        {type === 'mean-average' && (
          <g>
            {/* Balance beam scale */}
            <polygon points="160,110 150,140 170,140" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="70" y1="110" x2="250" y2="110" stroke="#38bdf8" strokeWidth="3" />
            <circle cx="100" cy="100" r="10" fill="#f59e0b" />
            <circle cx="130" cy="100" r="10" fill="#f59e0b" />
            <circle cx="190" cy="100" r="10" fill="#f59e0b" />
            <circle cx="220" cy="100" r="10" fill="#f59e0b" />
            <circle cx="160" cy="110" r="4" fill="#f8fafc" />
            <text x="160" y="130" fill="#fbbf24" fontSize="12" fontWeight="900" textAnchor="middle">Mean (Balance point)</text>
            <text x="160" y="55" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle">Mean = (Sum of Values) / n</text>
            <text x="160" y="75" fill="#38bdf8" fontSize="11" fontWeight="800" textAnchor="middle">Total Sum = Mean × n</text>
          </g>
        )}

        {/* ─── 29. Standard Deviation & Range ─── */}
        {type === 'standard-deviation' && (
          <g>
            {/* Bell curve / distribution */}
            <path d="M 60 140 Q 120 140 140 90 Q 160 30 180 90 Q 200 140 260 140" fill="url(#cyan-glow)" stroke="#06b6d4" strokeWidth="2.5" />
            <line x1="160" y1="30" x2="160" y2="140" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="160" y="24" fill="#fbbf24" fontSize="11" fontWeight="900" textAnchor="middle">Mean</text>
            {/* Spread arrows */}
            <line x1="130" y1="100" x2="190" y2="100" stroke="#f8fafc" strokeWidth="1.5" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
            <text x="160" y="94" fill="#f8fafc" fontSize="10" fontWeight="800" textAnchor="middle">Spread (σ)</text>
            <text x="160" y="160" fill="#ffffff" fontSize="12" fontWeight="900" textAnchor="middle">Range = Max - Min</text>
          </g>
        )}

        {/* ─── 30. Probability ─── */}
        {type === 'probability' && (
          <g>
            {/* Venn / sample space box */}
            <rect x="60" y="35" width="200" height="100" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="2" />
            <circle cx="160" cy="85" r="35" fill="url(#cyan-glow)" stroke="#06b6d4" strokeWidth="2" />
            <text x="160" y="88" fill="#38bdf8" fontSize="12" fontWeight="900" textAnchor="middle">Event A</text>
            <text x="75" y="52" fill="#94a3b8" fontSize="10" fontWeight="800">Sample Space S</text>
            <text x="160" y="155" fill="#ffffff" fontSize="12" fontWeight="900" textAnchor="middle">P(A) = Favorable / Total</text>
          </g>
        )}
      </svg>
    </div>
  );
}

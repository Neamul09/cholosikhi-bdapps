import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { clsx } from 'clsx';
import { useUserStore } from '@/store/userStore';

// ===========================
// SORTING VISUALIZER
// ===========================
type SortStep = { array: number[]; comparing: number[]; sorted: number[] };

function generateSortSteps(arr: number[], algo: string): SortStep[] {
  const steps: SortStep[] = [];
  const a = [...arr];

  if (algo === 'bubble') {
    const sorted: number[] = [];
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < a.length - i - 1; j++) {
        steps.push({ array: [...a], comparing: [j, j + 1], sorted: [...sorted] });
        if (a[j] > a[j + 1]) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; }
      }
      sorted.unshift(a.length - 1 - i);
    }
    steps.push({ array: [...a], comparing: [], sorted: a.map((_, i) => i) });
  } else if (algo === 'selection') {
    const sorted: number[] = [];
    for (let i = 0; i < a.length; i++) {
      let minIdx = i;
      for (let j = i + 1; j < a.length; j++) {
        steps.push({ array: [...a], comparing: [minIdx, j], sorted: [...sorted] });
        if (a[j] < a[minIdx]) minIdx = j;
      }
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      sorted.push(i);
      steps.push({ array: [...a], comparing: [], sorted: [...sorted] });
    }
  } else if (algo === 'insertion') {
    for (let i = 1; i < a.length; i++) {
      let j = i;
      while (j > 0 && a[j - 1] > a[j]) {
        steps.push({ array: [...a], comparing: [j - 1, j], sorted: [] });
        [a[j - 1], a[j]] = [a[j], a[j - 1]];
        j--;
      }
    }
    steps.push({ array: [...a], comparing: [], sorted: a.map((_, i) => i) });
  }

  return steps;
}

export function SortingVisualizer() {
  const [algo, setAlgo] = useState('bubble');
  const [size, setSize] = useState(15);
  const [arr, setArr] = useState(() => Array.from({ length: 15 }, () => Math.floor(Math.random() * 90) + 10));
  const [currentArr, setCurrentArr] = useState([...arr]);
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(300);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const generateNewArray = (newSize = size) => {
    const newArr = Array.from({ length: newSize }, () => Math.floor(Math.random() * 90) + 10);
    setArr(newArr);
    setCurrentArr(newArr);
    const s = generateSortSteps([...newArr], algo);
    setSteps(s);
    setStep(0);
    setPlaying(false);
  };

  useEffect(() => {
    generateNewArray(size);
  }, [algo, size]);

  useEffect(() => {
    if (step < steps.length) {
      setCurrentArr(steps[step].array);
    }
  }, [step, steps]);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setStep((s) => {
          if (s >= steps.length - 1) { setPlaying(false); return s; }
          return s + 1;
        });
      }, speed);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, steps.length, speed]);

  const current = steps[step] || { array: currentArr, comparing: [], sorted: [] };
  const maxVal = Math.max(...currentArr, 1);

  const reset = () => {
    setStep(0);
    setPlaying(false);
    setCurrentArr([...arr]);
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex gap-2">
          {['bubble', 'selection', 'insertion'].map((a) => (
            <button
              key={a}
              onClick={() => setAlgo(a)}
              className={clsx(
                'px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all',
                algo === a ? 'gradient-brand text-white' : 'glass text-app-fg-muted hover:text-app-fg'
              )}
            >
              {a === 'bubble' ? 'বাবল' : a === 'selection' ? 'সিলেকশন' : 'ইনসার্টশন'} সর্ট
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-3 bg-app-fg/5 px-4 py-2 rounded-xl border border-white/5">
          <span className="text-xs font-bold text-app-fg-muted">সাইজ: {size}</span>
          <input 
            type="range" min={5} max={30} value={size}
            onChange={(e) => setSize(+e.target.value)}
            className="w-24 accent-brand-500"
          />
        </div>

        <button 
          onClick={() => generateNewArray(size)}
          className="glass px-4 py-2 rounded-xl text-sm font-bold text-blue-400 hover:text-blue-500 transition-all flex items-center gap-2"
        >
          <RotateCcw size={16} />
          নতুন অ্যারে
        </button>
      </div>

      {/* Bars */}
      <div className="glass rounded-2xl p-4 h-48 flex items-end gap-1">
        {currentArr.map((val, idx) => {
          const isComparing = current.comparing.includes(idx);
          const isSorted = current.sorted.includes(idx);
          return (
            <motion.div
              key={idx}
              layout
              animate={{ height: `${(val / maxVal) * 100}%` }}
              transition={{ duration: 0.1 }}
              className={clsx(
                'flex-1 rounded-t-sm transition-colors',
                isSorted ? 'bg-emerald-500' : isComparing ? 'bg-amber-400' : 'bg-brand-500'
              )}
              style={{ minWidth: 4 }}
              title={String(val)}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-brand-500" /> সাধারণ</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-amber-400" /> তুলনা</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-emerald-500" /> সর্ট করা</div>
      </div>

      {/* Steps */}
      <div className="text-center text-sm text-gray-400">
        ধাপ {step} / {steps.length}
      </div>
      <input
        type="range" min={0} max={steps.length - 1} value={step}
        onChange={(e) => { setStep(+e.target.value); setPlaying(false); }}
        className="w-full accent-brand-500"
      />

      {/* Playback controls */}
      <div className="flex gap-2 justify-center">
        <button onClick={reset} className="glass p-3 rounded-xl text-app-fg-muted hover:text-app-fg transition-colors">
          <RotateCcw size={18} />
        </button>
        <button
          onClick={() => {
            if (!playing) {
              useUserStore.getState().interactWithVisualizer();
            }
            setPlaying(!playing);
          }}
          className="gradient-brand px-6 py-3 rounded-xl text-white font-bold flex items-center gap-2 hover-lift press-effect"
        >
          {playing ? <Pause size={18} /> : <Play size={18} />}
          {playing ? 'বন্ধ করুন' : 'চালান'}
        </button>
        <button
          onClick={() => setStep((s) => Math.min(s + 1, steps.length - 1))}
          className="glass p-3 rounded-xl text-app-fg-muted hover:text-app-fg transition-colors"
        >
          <SkipForward size={18} />
        </button>
      </div>

      {/* Speed */}
      <div className="flex items-center gap-3 text-sm text-gray-400">
        <span>ধীর</span>
        <input type="range" min={50} max={800} step={50}
          value={800 - speed + 50}
          onChange={(e) => setSpeed(800 - +e.target.value + 50)}
          className="flex-1 accent-brand-500"
        />
        <span>দ্রুত</span>
      </div>
    </div>
  );
}

// ===========================
// BINARY TREE VISUALIZER
// ===========================
interface TreeNode { val: number; left?: TreeNode; right?: TreeNode; }

function insertBST(root: TreeNode | null, val: number): TreeNode {
  if (!root) return { val };
  if (val < root.val) return { ...root, left: insertBST(root.left || null, val) };
  return { ...root, right: insertBST(root.right || null, val) };
}

interface TreeNodePos { val: number; x: number; y: number; id: string; }
interface TreeEdge { x1: number; y1: number; x2: number; y2: number; }

function layoutTree(node: TreeNode | null, x: number, y: number, dx: number, result: { nodes: TreeNodePos[]; edges: TreeEdge[] }, parentX?: number, parentY?: number) {
  if (!node) return;
  const id = `${x}-${y}`;
  result.nodes.push({ val: node.val, x, y, id });
  if (parentX !== undefined && parentY !== undefined) {
    result.edges.push({ x1: parentX, y1: parentY, x2: x, y2: y });
  }
  layoutTree(node.left || null, x - dx, y + 70, dx / 1.7, result, x, y);
  layoutTree(node.right || null, x + dx, y + 70, dx / 1.7, result, x, y);
}

export function TreeVisualizer() {
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [highlighted, setHighlighted] = useState<number[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [traversalMode, setTraversalMode] = useState<'inorder' | 'preorder' | 'postorder'>('inorder');
  const [traversalStep, setTraversalStep] = useState(-1);
  const [traversalOrder, setTraversalOrder] = useState<number[]>([]);

  const resetTree = () => {
    setRoot(null);
    setHighlighted([]);
    setTraversalStep(-1);
    setTraversalOrder([]);
  };

  const addRandom = () => {
    const v = Math.floor(Math.random() * 90) + 10;
    setRoot(prev => insertBST(prev, v));
  };

  useEffect(() => {
    let r: TreeNode | null = null;
    [50, 30, 70, 20, 40].forEach(v => r = insertBST(r, v));
    setRoot(r);
  }, []);

  const layout = { nodes: [] as TreeNodePos[], edges: [] as TreeEdge[] };
  if (root) layoutTree(root, 200, 30, 100, layout);

  const getTraversal = (node: TreeNode | null, mode: string): number[] => {
    if (!node) return [];
    if (mode === 'inorder') return [...getTraversal(node.left || null, mode), node.val, ...getTraversal(node.right || null, mode)];
    if (mode === 'preorder') return [node.val, ...getTraversal(node.left || null, mode), ...getTraversal(node.right || null, mode)];
    return [...getTraversal(node.left || null, mode), ...getTraversal(node.right || null, mode), node.val];
  };

  const startTraversal = () => {
    const order = getTraversal(root, traversalMode);
    setTraversalOrder(order);
    setTraversalStep(0);
    setHighlighted([order[0]]);
  };

  const nextStep = () => {
    const next = traversalStep + 1;
    setTraversalStep(next);
    setHighlighted(traversalOrder.slice(0, next + 1));
  };

  const insertNode = () => {
    const v = parseInt(inputVal);
    if (!isNaN(v)) {
      setRoot(prev => insertBST(prev, v));
      setInputVal('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-2 items-center">
        {(['inorder', 'preorder', 'postorder'] as const).map(m => (
          <button key={m} onClick={() => setTraversalMode(m)}
            className={clsx('px-3 py-1.5 rounded-lg text-sm capitalize font-bold', traversalMode === m ? 'gradient-brand text-white' : 'glass text-app-fg-muted hover:text-app-fg hover:bg-app-fg/5')}>
            {m === 'inorder' ? 'ইন-অর্ডার' : m === 'preorder' ? 'প্রি-অর্ডার' : 'পোস্ট-অর্ডার'}
          </button>
        ))}
        <div className="w-px h-6 bg-white/10 mx-2" />
        <button onClick={startTraversal} className="px-3 py-1.5 rounded-lg text-sm font-bold bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white transition-all">
          চালান
        </button>
        <button onClick={nextStep} disabled={traversalStep >= traversalOrder.length - 1}
          className="px-3 py-1.5 rounded-lg text-sm font-bold glass text-app-fg-muted disabled:opacity-30">
          ধাপ →
        </button>
        <button onClick={resetTree} className="p-1.5 rounded-lg glass text-app-fg-muted hover:text-rose-400">
          <RotateCcw size={18} />
        </button>
        <button onClick={addRandom} className="px-3 py-1.5 rounded-lg text-sm font-bold bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white transition-all">
          র্যান্ডম +
        </button>
      </div>

      {/* SVG Tree */}
      <div className="glass rounded-2xl overflow-hidden">
        <svg width="100%" height="260" viewBox="0 0 400 260">
          {layout.edges.map((e, i) => (
            <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
              stroke="rgba(124,77,255,0.4)" strokeWidth="2" />
          ))}
          {layout.nodes.map((n) => (
            <g key={n.id}>
              <motion.circle
                cx={n.x} cy={n.y} r={20}
                fill={highlighted.includes(n.val) ? '#10b981' : '#6c3de8'}
                stroke={highlighted[highlighted.length - 1] === n.val ? '#f59e0b' : 'rgba(255,255,255,0.2)'}
                strokeWidth={highlighted[highlighted.length - 1] === n.val ? 3 : 1}
                animate={{ scale: highlighted[highlighted.length - 1] === n.val ? 1.2 : 1 }}
              />
              <text x={n.x} y={n.y + 5} textAnchor="middle" className="mono fill-app-fg"
                fontSize="12" fontWeight="bold">
                {n.val}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Traversal sequence */}
      {traversalOrder.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {traversalOrder.map((v, i) => (
            <span key={i}
              className={clsx('w-8 h-8 rounded-lg flex items-center justify-center mono text-sm font-bold',
                i <= traversalStep ? 'gradient-brand text-white' : 'glass text-app-fg-muted')}>
              {v}
            </span>
          ))}
        </div>
      )}

      {/* Insert node */}
      <div className="flex gap-2">
        <input value={inputVal} onChange={e => setInputVal(e.target.value)} type="number"
          placeholder="সংখ্যা লিখুন…"
          className="glass flex-1 px-3 py-2 rounded-xl text-sm outline-none border border-white/10 focus:border-brand-500" />
        <button onClick={insertNode} className="gradient-brand text-white px-4 py-2 rounded-xl text-sm font-bold">
          যুক্ত করুন
        </button>
      </div>
    </div>
  );
}

// ===========================
// STACK / QUEUE VISUALIZER
// ===========================
export function StackQueueVisualizer() {
  const [mode, setMode] = useState<'stack' | 'queue'>('stack');
  const [items, setItems] = useState<string[]>(['10', '20', '30']);
  const [inputVal, setInputVal] = useState('');
  const [lastAction, setLastAction] = useState('');

  const push = () => {
    if (!inputVal) return;
    setItems(prev => mode === 'stack' ? [...prev, inputVal] : [...prev, inputVal]);
    setLastAction(`${mode === 'stack' ? 'Pushed' : 'Enqueued'} "${inputVal}"`);
    setInputVal('');
  };

  const pop = () => {
    if (!items.length) return;
    if (mode === 'stack') {
      setLastAction(`Popped "${items[items.length - 1]}"`);
      setItems(prev => prev.slice(0, -1));
    } else {
      setLastAction(`Dequeued "${items[0]}"`);
      setItems(prev => prev.slice(1));
    }
  };

  const topIdx = mode === 'stack' ? items.length - 1 : 0;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['stack', 'queue'] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); setItems(['10', '20', '30']); }}
            className={clsx('px-4 py-2 rounded-xl font-semibold capitalize text-sm',
              mode === m ? 'gradient-brand text-white' : 'glass text-gray-400')}>
            {m === 'stack' ? 'স্ট্যাক' : 'কিউ'}
          </button>
        ))}
      </div>

      {/* Visual */}
      <div className={clsx('glass rounded-2xl p-4 min-h-32 flex',
        mode === 'stack' ? 'flex-col-reverse items-center gap-2' : 'flex-row items-center gap-2 overflow-x-auto')}>
        {items.length === 0 && <div className="text-gray-500 text-sm m-auto">{mode === 'stack' ? 'স্ট্যাক' : 'কিউ'} খালি</div>}
        {items.map((item, i) => (
          <motion.div key={`${i}-${item}`}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className={clsx('px-6 py-3 rounded-xl font-mono font-bold text-white min-w-[60px] text-center relative',
              i === topIdx ? 'gradient-brand scale-105' : 'bg-brand-700/50 border border-brand-500/20')}>
            {item}
            {i === topIdx && (
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-amber-400 font-sans whitespace-nowrap">
                {mode === 'stack' ? '← টপ (Top)' : 'ফ্রন্ট (Front) →'}
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {lastAction && <div className="text-sm text-emerald-400 font-mono">{lastAction}</div>}

      <div className="flex gap-2">
        <input value={inputVal} onChange={e => setInputVal(e.target.value)} placeholder="মান…"
          className="glass flex-1 px-3 py-2 rounded-xl text-sm outline-none border border-white/10 focus:border-brand-500" />
        <button onClick={push} className="gradient-brand text-white px-4 py-2 rounded-xl text-sm font-bold">
          {mode === 'stack' ? 'পুশ (Push)' : 'এনকিউ (Enqueue)'}
        </button>
        <button onClick={pop} className="gradient-danger text-white px-4 py-2 rounded-xl text-sm font-bold">
          {mode === 'stack' ? 'পপ (Pop)' : 'ডিকিউ (Dequeue)'}
        </button>
      </div>
    </div>
  );
}

// ===========================
// GRAPH VISUALIZER (BFS/DFS)
// ===========================
const GRAPH_NODES = [
  { id: 0, x: 200, y: 50 },
  { id: 1, x: 80,  y: 140 },
  { id: 2, x: 320, y: 140 },
  { id: 3, x: 40,  y: 240 },
  { id: 4, x: 160, y: 240 },
  { id: 5, x: 250, y: 240 },
  { id: 6, x: 360, y: 240 },
];
const GRAPH_EDGES = [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]];
const ADJACENCY: Record<number, number[]> = {
  0:[1,2], 1:[0,3,4], 2:[0,5,6], 3:[1], 4:[1], 5:[2], 6:[2]
};

export function GraphVisualizer() {
  const [algo, setAlgo] = useState<'bfs'|'dfs'>('bfs');
  const [visited, setVisited] = useState<number[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runAlgo = async () => {
    setVisited([]); setActive(null); setIsRunning(true);
    const visitOrder: number[] = [];

    if (algo === 'bfs') {
      const queue = [0]; const seen = new Set([0]);
      while (queue.length) {
        const node = queue.shift()!;
        visitOrder.push(node);
        for (const nb of ADJACENCY[node]) {
          if (!seen.has(nb)) { seen.add(nb); queue.push(nb); }
        }
      }
    } else {
      const seen = new Set<number>();
      const dfs = (n: number) => {
        seen.add(n); visitOrder.push(n);
        for (const nb of ADJACENCY[n]) { if (!seen.has(nb)) dfs(nb); }
      };
      dfs(0);
    }

    for (let i = 0; i < visitOrder.length; i++) {
      setActive(visitOrder[i]);
      setVisited(visitOrder.slice(0, i + 1));
      await new Promise(r => setTimeout(r, 700));
    }
    setActive(null); setIsRunning(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['bfs','dfs'] as const).map(a => (
          <button key={a} onClick={() => setAlgo(a)}
            className={clsx('px-4 py-2 rounded-xl font-semibold uppercase text-sm',
              algo === a ? 'gradient-brand text-white' : 'glass text-app-fg-muted hover:text-app-fg hover:bg-app-fg/5')}>
            {a}
          </button>
        ))}
        <button onClick={runAlgo} disabled={isRunning}
          className="btn-duo btn-duo-green px-6 py-2">
          {isRunning ? 'চলছে…' : '▶ শুরু করুন'}
        </button>
        <button onClick={() => { setVisited([]); setActive(null); }}
          className="glass text-app-fg-muted hover:text-rose-400 px-3 py-2 rounded-xl text-sm font-bold transition-all">
          রিসেট
        </button>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <svg width="100%" height="300" viewBox="0 0 400 300">
          {GRAPH_EDGES.map(([a, b], i) => {
            const na = GRAPH_NODES[a], nb = GRAPH_NODES[b];
            const edgeVisited = visited.includes(a) && visited.includes(b);
            return (
              <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                stroke={edgeVisited ? '#10b981' : 'rgba(124,77,255,0.3)'}
                strokeWidth={edgeVisited ? 3 : 2} />
            );
          })}
          {GRAPH_NODES.map(n => (
            <g key={n.id}>
              <motion.circle cx={n.x} cy={n.y} r={22}
                fill={active === n.id ? '#f59e0b' : visited.includes(n.id) ? '#10b981' : '#6c3de8'}
                stroke="rgba(255,255,255,0.2)" strokeWidth="2"
                animate={{ scale: active === n.id ? 1.3 : 1 }}
                transition={{ type: 'spring', stiffness: 400 }}
              />
              <text x={n.x} y={n.y + 5} textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">
                {n.id}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="flex gap-3 text-xs text-gray-400 flex-wrap">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-brand-600" /> দেখা হয়নি</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-500" /> দেখা হয়েছে</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-amber-400" /> বর্তমান</div>
      </div>

      {visited.length > 0 && (
        <div className="glass rounded-xl p-3 text-sm font-mono">
          <span className="text-gray-400">ভ্রমণের ক্রম: </span>
          {visited.map((v, i) => (
            <span key={i} className="text-emerald-400">{v}{i < visited.length - 1 ? ' → ' : ''}</span>
          ))}
        </div>
      )}
    </div>
  );
}

// ===========================
// ARRAY / MEMORY VISUALIZER
// ===========================
export function ArrayVisualizer() {
  const [arr, setArr] = useState([10, 25, 7, 42, 18, 33]);
  const [ptr, setPtr] = useState(0);
  const [inputVal, setInputVal] = useState('');

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-400">মেমরি লেআউট — প্রতিটি ঘর ৪ বাইট (int)</div>
      <div className="glass rounded-2xl p-6 overflow-x-auto">
        <div className="flex gap-0 min-w-max">
          {arr.map((val, i) => (
            <div key={i} className="flex flex-col items-center">
              {/* Pointer indicator */}
              <div className={clsx('h-5 w-full flex justify-center', ptr === i ? 'visible' : 'invisible')}>
                <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 1 }}>
                  <span className="text-amber-400 text-lg">↓</span>
                </motion.div>
              </div>
              {/* Memory cell */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                onClick={() => setPtr(i)}
                className={clsx(
                  'w-16 h-16 border-2 flex items-center justify-center mono font-bold text-lg cursor-pointer transition-all',
                  i === 0 ? 'rounded-l-xl' : '',
                  i === arr.length - 1 ? 'rounded-r-xl' : '',
                   ptr === i ? 'bg-brand-600 border-brand-400 text-white' : 'bg-app-fg/5 border-app-fg/10 text-app-fg-muted',
                )}
              >
                {val}
              </motion.div>
              {/* Address */}
              <div className="text-xs text-gray-600 mt-1 mono">0x{(1000 + i * 4).toString(16)}</div>
              <div className="text-xs text-gray-700">arr[{i}]</div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-xl p-4 mono text-sm">
        <span className="text-cyan-400">int*</span>
        <span className="text-app-fg"> ptr = &arr[{ptr}]; </span>
        <span className="text-app-fg-muted">// *ptr = {arr[ptr]}, address = 0x{(1000 + ptr * 4).toString(16)}</span>
      </div>

      <div className="flex gap-2">
        <input value={inputVal} onChange={e => setInputVal(e.target.value)} type="number"
          placeholder="এলিমেন্ট যোগ করুন…"
          className="glass flex-1 px-3 py-2 rounded-xl text-sm outline-none border border-white/10 focus:border-brand-500" />
        <button onClick={() => { if (inputVal) { setArr(p => [...p, +inputVal]); setInputVal(''); } }}
          className="gradient-brand text-white px-4 py-2 rounded-xl text-sm font-bold">
          যোগ করুন
        </button>
        <button onClick={() => setArr(p => p.slice(0, -1))}
          className="gradient-danger text-white px-4 py-2 rounded-xl text-sm font-bold">
          মুছুন
        </button>
      </div>
    </div>
  );
}

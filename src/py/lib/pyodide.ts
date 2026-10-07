/**
 * Pyodide In-Browser WebAssembly Python Runner (P3)
 *
 * Runs Python 100% locally in the browser via WebAssembly.
 * Benefits:
 * - 0 Server costs
 * - 0 Rate limits (No HTTP 429)
 * - Instant execution latency (<10ms after load)
 * - Works offline once cached
 */

export interface PyodideResult {
  stdout: string;
  stderr: string;
  isError: boolean;
  executionTimeMs: number;
}

interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>;
  setStdout: (options: { batched: (output: string) => void }) => void;
  setStderr: (options: { batched: (output: string) => void }) => void;
}

declare global {
  interface Window {
    loadPyodide?: (config: { indexURL: string }) => Promise<PyodideInterface>;
  }
}

let pyodideInstance: PyodideInterface | null = null;
let loadPromise: Promise<PyodideInterface> | null = null;

const PYODIDE_CDN_VERSION = '0.26.2';
const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_CDN_VERSION}/full/`;

/**
 * Loads the Pyodide runtime script dynamically from CDN.
 */
export async function getPyodide(): Promise<PyodideInterface> {
  if (pyodideInstance) return pyodideInstance;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    if (!window.loadPyodide) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `${PYODIDE_INDEX_URL}pyodide.js`;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Pyodide script from CDN'));
        document.head.appendChild(script);
      });
    }

    if (!window.loadPyodide) {
      throw new Error('Pyodide loader function unavailable');
    }

    const pyodide = await window.loadPyodide({
      indexURL: PYODIDE_INDEX_URL,
    });

    pyodideInstance = pyodide;
    return pyodide;
  })();

  return loadPromise;
}

/**
 * Executes Python code locally using Pyodide WebAssembly.
 */
export async function runPythonWebAssembly(code: string): Promise<PyodideResult> {
  const startTime = performance.now();
  const stdoutChunks: string[] = [];
  const stderrChunks: string[] = [];

  try {
    const pyodide = await getPyodide();

    // Intercept stdout & stderr
    pyodide.setStdout({
      batched: (text: string) => {
        stdoutChunks.push(text);
      },
    });

    pyodide.setStderr({
      batched: (text: string) => {
        stderrChunks.push(text);
      },
    });

    await pyodide.runPythonAsync(code);

    const executionTimeMs = Math.round(performance.now() - startTime);

    return {
      stdout: stdoutChunks.join('\n'),
      stderr: stderrChunks.join('\n'),
      isError: false,
      executionTimeMs,
    };
  } catch (err: unknown) {
    const executionTimeMs = Math.round(performance.now() - startTime);
    const errorMessage = err instanceof Error ? err.message : String(err);

    // Clean up python traceback to be beginner friendly
    let friendlyError = errorMessage;
    if (friendlyError.includes('File "<exec>"')) {
      friendlyError = friendlyError.split('File "<exec>"').pop()?.trim() || friendlyError;
    }

    return {
      stdout: stdoutChunks.join('\n'),
      stderr: friendlyError || stderrChunks.join('\n'),
      isError: true,
      executionTimeMs,
    };
  }
}

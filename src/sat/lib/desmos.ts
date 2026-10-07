// Desmos Graphing Calculator API Integration
// Official SAT configuration (radian/degree toggle, standard keypads)

declare global {
  interface Window {
    Desmos?: {
      GraphingCalculator: (
        element: HTMLElement,
        options?: Record<string, unknown>
      ) => DesmosCalculatorInstance;
    };
  }
}

export interface DesmosCalculatorInstance {
  setExpression: (expr: { id?: string; latex?: string; color?: string }) => void;
  getExpressions: () => Array<{ id: string; latex: string }>;
  destroy: () => void;
  getState: () => Record<string, unknown>;
  setState: (state: Record<string, unknown>) => void;
  updateSettings: (settings: Record<string, unknown>) => void;
}

let desmosLoadPromise: Promise<boolean> | null = null;

export function loadDesmosApi(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (window.Desmos) return Promise.resolve(true);

  if (desmosLoadPromise) return desmosLoadPromise;

  desmosLoadPromise = new Promise((resolve) => {
    // Check if script already exists
    const existingScript = document.getElementById('desmos-api-script');
    if (existingScript) {
      if (window.Desmos) return resolve(true);
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.id = 'desmos-api-script';
    // Desmos public API key for development/education
    script.src = 'https://www.desmos.com/api/v1.9/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6';
    script.async = true;

    script.onload = () => {
      resolve(Boolean(window.Desmos));
    };

    script.onerror = () => {
      console.warn('[Desmos] Failed to load Desmos script from CDN.');
      resolve(false);
    };

    document.head.appendChild(script);
  });

  return desmosLoadPromise;
}

export function createSatDesmosCalculator(
  element: HTMLElement,
  options: Record<string, unknown> = {}
): DesmosCalculatorInstance | null {
  if (!window.Desmos) return null;

  const defaultSatOptions = {
    keypad: true,
    graphpaper: true,
    expressions: true,
    settingsMenu: true,
    zoomButtons: true,
    fontSize: 16,
    language: 'en',
    border: false,
    ...options
  };

  return window.Desmos.GraphingCalculator(element, defaultSatOptions);
}

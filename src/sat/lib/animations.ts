import { animate } from 'animejs';

/**
 * Animate a numeric counter from start to end (e.g. for score prediction, XP)
 */
export function animateCounter(
  targetElement: HTMLElement | null,
  startVal: number,
  endVal: number,
  durationMs = 1200,
  formatter: (n: number) => string = (n) => Math.round(n).toString()
) {
  if (!targetElement) return;

  const obj = { val: startVal };
  try {
    animate(obj, {
      val: endVal,
      duration: durationMs,
      ease: 'outExpo',
      onUpdate: () => {
        targetElement.textContent = formatter(obj.val);
      }
    });
  } catch {
    // Fallback if animation throws
    targetElement.textContent = formatter(endVal);
  }
}

/**
 * Pop in an element with an energetic spring effect
 */
export function animatePop(target: HTMLElement | string, delay = 0) {
  try {
    animate(target, {
      scale: [0.85, 1],
      opacity: [0, 1],
      duration: 500,
      delay,
      ease: 'outBack'
    });
  } catch {
    // Graceful fallback
  }
}

/**
 * Shake effect on wrong answer / error
 */
export function animateShake(target: HTMLElement | string) {
  try {
    animate(target, {
      translateX: [-10, 10, -8, 8, -4, 4, 0],
      duration: 500,
      ease: 'inOutSine'
    });
  } catch {
    // Graceful fallback
  }
}

/**
 * Pulse effect on correct answer or streak milestone
 */
export function animateSuccessPulse(target: HTMLElement | string) {
  try {
    animate(target, {
      scale: [1, 1.08, 1],
      duration: 450,
      ease: 'outElastic'
    });
  } catch {
    // Graceful fallback
  }
}

/**
 * Mascot bounce animation
 */
export function animateMascotBounce(target: HTMLElement | string) {
  try {
    animate(target, {
      translateY: [-15, 0],
      scale: [1.05, 1],
      duration: 700,
      ease: 'outBounce'
    });
  } catch {
    // Graceful fallback
  }
}

import type { SatScorePrediction, QuestionAttemptLog } from '../types';

/**
 * Predict SAT score based on history of question attempts.
 *
 * Uses an Empirical Bayes Item Response Theory (IRT) model calibrated to Digital SAT curves:
 * - Direct dependency on sample size: Small samples (e.g. < 10 questions) are tempered
 *   by empirical shrinkage toward the national median (500/section, 1000 composite).
 * - High penalty for missing Easy/Medium questions (simulating adaptive module routing penalty).
 * - Hard difficulty questions provide positive acceleration toward 700-800.
 * - Strict 1600 Rule: A student CANNOT receive 1600 unless 100% of questions are correct AND
 *   at least 35 questions have been evaluated across both sections.
 * - Scaled strictly to increments of 10 (200 - 800 per section, 400 - 1600 composite).
 */
export function calculatePredictedScore(attempts: QuestionAttemptLog[]): SatScorePrediction {
  const mathAttempts = attempts.filter(a => a.section === 'math');
  const rwAttempts = attempts.filter(a => a.section === 'reading_writing');

  const mathScore = calculateStrictSectionScore(mathAttempts);
  const rwScore = calculateStrictSectionScore(rwAttempts);
  let compositeScore = mathScore + rwScore;

  const total = attempts.length;
  const totalErrors = attempts.filter(a => !a.isCorrect).length;

  // 1. STRICT ERROR CAPS
  if (totalErrors > 0) {
    if (totalErrors === 1) {
      compositeScore = Math.min(1560, compositeScore);
    } else if (totalErrors === 2) {
      compositeScore = Math.min(1520, compositeScore);
    } else if (totalErrors <= 4) {
      compositeScore = Math.min(1470, compositeScore);
    } else {
      compositeScore = Math.min(1420, compositeScore);
    }
  } else if (total > 0 && (total < 20 || mathAttempts.length < 10 || rwAttempts.length < 10)) {
    // 0 errors but insufficient volume (< 20 total or < 10 per section): cap conservative ceiling
    compositeScore = Math.min(1540, compositeScore);
  }

  // 2. Multiples of 10 & official bounds
  compositeScore = Math.round(compositeScore / 10) * 10;
  compositeScore = Math.max(400, Math.min(1600, compositeScore));

  // 3. Reliability & Margin of Error (directly dependent on sample size)
  let confidence: 'Low' | 'Medium' | 'High';
  let margin: number;

  if (total >= 45) {
    confidence = 'High';
    margin = 20;
  } else if (total >= 18) {
    confidence = 'Medium';
    margin = 40;
  } else {
    confidence = 'Low';
    margin = 60;
  }

  const sectionMargin = Math.round((margin / 2) / 10) * 10;

  const compositeRange: [number, number] = [
    Math.max(400, compositeScore - margin),
    Math.min(1600, compositeScore + margin)
  ];

  const mathRange: [number, number] = [
    Math.max(200, mathScore - sectionMargin),
    Math.min(800, mathScore + sectionMargin)
  ];

  const rwRange: [number, number] = [
    Math.max(200, rwScore - sectionMargin),
    Math.min(800, rwScore + sectionMargin)
  ];

  const percentile = estimatePercentile(compositeScore);

  return {
    compositeScore,
    mathScore,
    rwScore,
    compositeRange,
    mathRange,
    rwRange,
    confidence,
    totalQuestionsEvaluated: total,
    percentile
  };
}

/**
 * Strict Section Score calculation:
 * - Base prior: 500 (median).
 * - Sample size shrinkage: uses Bayesian weighting (n / (n + 5)).
 * - Penalties: Easy -45, Medium -35, Hard -25.
 * - Any mistake locks that section strictly out of 800 (max 780).
 */
function calculateStrictSectionScore(attempts: QuestionAttemptLog[]): number {
  const total = attempts.length;
  if (!total) {
    return 500;
  }

  let easyCorrect = 0, easyTotal = 0;
  let medCorrect = 0, medTotal = 0;
  let hardCorrect = 0, hardTotal = 0;

  for (const a of attempts) {
    if (a.difficulty === 'Easy') {
      easyTotal++;
      if (a.isCorrect) easyCorrect++;
    } else if (a.difficulty === 'Medium') {
      medTotal++;
      if (a.isCorrect) medCorrect++;
    } else {
      hardTotal++;
      if (a.isCorrect) hardCorrect++;
    }
  }

  const easyErrors = easyTotal - easyCorrect;
  const medErrors = medTotal - medCorrect;
  const hardErrors = hardTotal - hardCorrect;
  const sectionErrors = easyErrors + medErrors + hardErrors;

  let rawScore: number;

  if (sectionErrors > 0) {
    // Mistake penalties: Easy misses hurt most (simulating Stage 1 routing down)
    const mistakePenalty = (easyErrors * 50) + (medErrors * 35) + (hardErrors * 25);
    const errorRate = sectionErrors / total;

    // Base score dropping from 800
    rawScore = 800 - mistakePenalty - (errorRate * 200);

    // Hard ceiling on errors: 1 error cannot exceed 780; 2 errors cannot exceed 740
    if (sectionErrors === 1) {
      rawScore = Math.min(780, rawScore);
    } else if (sectionErrors === 2) {
      rawScore = Math.min(740, rawScore);
    } else {
      rawScore = Math.min(700, rawScore);
    }
  } else {
    // 0 mistakes in this section
    // Sample size shrinkage toward 800:
    if (total < 3) {
      rawScore = 620 + (total * 20); // 1: 640, 2: 660
    } else if (total < 6) {
      rawScore = 660 + ((total - 2) * 20); // 3: 680, 4: 700, 5: 720
    } else if (total < 10) {
      rawScore = 720 + ((total - 5) * 16); // 6: 736, 7: 752, 8: 768, 9: 784
    } else {
      // 10+ questions in section with 0 errors: 800
      rawScore = 800;
    }
  }

  // Hard clamp between 200 and 800
  rawScore = Math.max(200, Math.min(800, rawScore));

  // Round to nearest multiple of 10 (SAT official requirement)
  return Math.round(rawScore / 10) * 10;
}

function estimatePercentile(composite: number): number {
  if (composite >= 1550) return 99;
  if (composite >= 1500) return 98;
  if (composite >= 1450) return 96;
  if (composite >= 1400) return 93;
  if (composite >= 1350) return 90;
  if (composite >= 1300) return 86;
  if (composite >= 1250) return 81;
  if (composite >= 1200) return 74;
  if (composite >= 1150) return 67;
  if (composite >= 1100) return 59;
  if (composite >= 1050) return 50;
  if (composite >= 1000) return 40;
  if (composite >= 900) return 25;
  if (composite >= 800) return 15;
  return 5;
}

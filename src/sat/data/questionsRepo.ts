import rawQuestions from './questionsData.json';
import type { SatQuestion, QuizFilterOptions, SatTestSection } from '../types';

// Cast and export raw questions with defensive option content fallback
export const ALL_QUESTIONS: SatQuestion[] = (rawQuestions as unknown as Array<Record<string, unknown>>).map(raw => {
  const options = Array.isArray(raw.options)
    ? raw.options.map((opt: Record<string, unknown>) => ({
        id: String(opt.id || ''),
        content: String(opt.content || opt.text || '').trim()
      }))
    : undefined;

  return {
    ...raw,
    options
  } as unknown as SatQuestion;
});

/**
 * Get all questions
 */
export function getAllQuestions(): SatQuestion[] {
  return ALL_QUESTIONS;
}

/**
 * Get question by ID
 */
export function getQuestionById(id: string): SatQuestion | undefined {
  return ALL_QUESTIONS.find(q => q.id === id || q.externalId === id);
}

/**
 * Filter questions with multi-faceted criteria
 */
export function getQuestionsByFilter(filter: QuizFilterOptions): SatQuestion[] {
  let pool = [...ALL_QUESTIONS];

  if (filter.section && filter.section !== 'all') {
    pool = pool.filter(q => q.test === filter.section);
  }

  if (filter.domain) {
    pool = pool.filter(q => q.domain.toLowerCase() === filter.domain?.toLowerCase());
  }

  if (filter.skill) {
    pool = pool.filter(q => q.skill.toLowerCase() === filter.skill?.toLowerCase());
  }

  if (filter.skills && filter.skills.length > 0) {
    const skillSet = new Set(filter.skills.map(s => s.toLowerCase()));
    pool = pool.filter(q => skillSet.has(q.skill.toLowerCase()));
  }

  if (filter.microType) {
    pool = pool.filter(q => q.microType === filter.microType);
  }

  if (filter.difficulty && filter.difficulty !== 'all') {
    pool = pool.filter(q => q.difficulty === filter.difficulty);
  }

  if (filter.onlyHardest) {
    pool = pool.filter(q => q.isHardest || q.difficulty === 'Hard');
  }

  // Shuffle pool randomly
  pool = shuffleArray(pool);

  if (filter.limit && filter.limit > 0) {
    return pool.slice(0, filter.limit);
  }

  return pool;
}

/**
 * Get only the truly hardest questions from the question bank
 */
export function getHardestQuestions(limit?: number): SatQuestion[] {
  const hardest = ALL_QUESTIONS.filter(q => q.isHardest || q.difficulty === 'Hard');
  return limit ? shuffleArray(hardest).slice(0, limit) : hardest;
}

/**
 * Quick Hardest Drill: Gets only the benchmark hardest question for a given microtype.
 */
export function getHardestQuestionForMicroType(microTypeId: string): SatQuestion | undefined {
  const candidates = ALL_QUESTIONS.filter(q => q.microType === microTypeId);
  if (!candidates.length) return undefined;

  // Prioritize isHardest, then Hard, then highest scoreBand
  const sorted = [...candidates].sort((a, b) => {
    if (a.isHardest && !b.isHardest) return -1;
    if (!a.isHardest && b.isHardest) return 1;
    if (a.difficulty === 'Hard' && b.difficulty !== 'Hard') return -1;
    if (a.difficulty !== 'Hard' && b.difficulty === 'Hard') return 1;
    return (b.scoreBand || 4) - (a.scoreBand || 4);
  });

  return sorted[0];
}

/**
 * Get all hardest/hard questions for a given microtype.
 * If no explicitly Hard questions exist, returns all questions for the microtype sorted by scoreBand.
 */
export function getAllHardestQuestionsForMicroType(microTypeId: string): SatQuestion[] {
  const candidates = ALL_QUESTIONS.filter(q => q.microType === microTypeId);
  if (!candidates.length) return [];
  const hard = candidates.filter(q => q.isHardest || q.difficulty === 'Hard');
  if (hard.length > 0) return hard;
  return [...candidates].sort((a, b) => (b.scoreBand || 4) - (a.scoreBand || 4));
}

/**
 * Get unshown questions for a microtype when user clicks "Practice More"
 */
export function getRemainingQuestionsForMicroType(microTypeId: string, excludeIds: string[] = []): SatQuestion[] {
  const excludeSet = new Set(excludeIds);
  return ALL_QUESTIONS.filter(q => q.microType === microTypeId && !excludeSet.has(q.id));
}

/**
 * Generate standard SAT Practice Test
 * Follows Digital SAT module standards
 */
export function generateSatPracticeTest(section: SatTestSection | 'full', count?: number): SatQuestion[] {
  if (section === 'math') {
    const mathPool = ALL_QUESTIONS.filter(q => q.test === 'math');
    const targetCount = count && count > 0 ? Math.min(count, mathPool.length) : 22;
    const easy = mathPool.filter(q => q.difficulty === 'Easy');
    const med = mathPool.filter(q => q.difficulty === 'Medium');
    const hard = mathPool.filter(q => q.difficulty === 'Hard');

    const easyCount = Math.round(targetCount * 0.25);
    const medCount = Math.round(targetCount * 0.45);
    const hardCount = targetCount - easyCount - medCount;

    const selected = [
      ...shuffleArray(easy).slice(0, easyCount),
      ...shuffleArray(med).slice(0, medCount),
      ...shuffleArray(hard).slice(0, hardCount)
    ];

    if (selected.length < targetCount) {
      const remaining = mathPool.filter(q => !selected.some(s => s.id === q.id));
      selected.push(...shuffleArray(remaining).slice(0, targetCount - selected.length));
    }

    return shuffleArray(selected).slice(0, targetCount);
  }

  if (section === 'reading_writing') {
    const rwPool = ALL_QUESTIONS.filter(q => q.test === 'reading_writing');
    const targetCount = count && count > 0 ? Math.min(count, rwPool.length) : 27;
    const easy = rwPool.filter(q => q.difficulty === 'Easy');
    const med = rwPool.filter(q => q.difficulty === 'Medium');
    const hard = rwPool.filter(q => q.difficulty === 'Hard');

    const easyCount = Math.round(targetCount * 0.25);
    const medCount = Math.round(targetCount * 0.45);
    const hardCount = targetCount - easyCount - medCount;

    const selected = [
      ...shuffleArray(easy).slice(0, easyCount),
      ...shuffleArray(med).slice(0, medCount),
      ...shuffleArray(hard).slice(0, hardCount)
    ];

    if (selected.length < targetCount) {
      const remaining = rwPool.filter(q => !selected.some(s => s.id === q.id));
      selected.push(...shuffleArray(remaining).slice(0, targetCount - selected.length));
    }

    return shuffleArray(selected).slice(0, targetCount);
  }

  // Full test
  const targetCount = count && count > 0 ? count : 49;
  if (targetCount === 98) {
    const rw = generateSatPracticeTest('reading_writing', 54);
    const math = generateSatPracticeTest('math', 44);
    return [...rw, ...math];
  }
  if (targetCount === 49) {
    const rw = generateSatPracticeTest('reading_writing', 27);
    const math = generateSatPracticeTest('math', 22);
    return [...rw, ...math];
  }

  const rwPortion = Math.round(targetCount * (54 / 98));
  const mathPortion = targetCount - rwPortion;
  const rw = generateSatPracticeTest('reading_writing', rwPortion);
  const math = generateSatPracticeTest('math', mathPortion);
  return [...rw, ...math];
}

/**
 * Aggregate question counts per microtype
 */
export function getMicroTypeStats() {
  const counts: Record<string, { total: number; hardCount: number }> = {};
  for (const q of ALL_QUESTIONS) {
    if (!counts[q.microType]) counts[q.microType] = { total: 0, hardCount: 0 };
    counts[q.microType].total++;
    if (q.difficulty === 'Hard' || q.isHardest) {
      counts[q.microType].hardCount++;
    }
  }
  return counts;
}

function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

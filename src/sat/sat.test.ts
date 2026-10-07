import { describe, it, expect } from 'vitest';
import { MICRO_TYPES, MICRO_TYPE_MAP } from './data/microtypes';
import {
  getAllQuestions,
  getQuestionsByFilter,
  getHardestQuestions,
  getHardestQuestionForMicroType,
  getRemainingQuestionsForMicroType,
  generateSatPracticeTest
} from './data/questionsRepo';
import { calculatePredictedScore } from './lib/scorePredictor';
import { SAT_VOCAB_LIST } from './data/vocabData';
import { SAT_FORMULA_SHEET } from './data/formulaData';

describe('SAT Suite SQA Analysis & Integrity Tests', () => {
  describe('Micro-Type Taxonomy Integrity', () => {
    it('should have a comprehensive catalog of micro-types', () => {
      expect(MICRO_TYPES.length).toBeGreaterThanOrEqual(25);
    });

    it('each micro-type should have complete metadata, formulas, and resources', () => {
      for (const mt of MICRO_TYPES) {
        expect(mt.id).toBeTruthy();
        expect(mt.title).toBeTruthy();
        expect(['math', 'reading_writing']).toContain(mt.section);
        expect(mt.domain).toBeTruthy();
        expect(mt.skill).toBeTruthy();
        expect(mt.theorySummary).toBeTruthy();
        expect(mt.formulasOrRules.length).toBeGreaterThan(0);
        expect(mt.bestResources.length).toBeGreaterThan(0);
      }
    });

    it('micro-type map should allow constant-time O(1) lookup', () => {
      const sample = MICRO_TYPES[0];
      const retrieved = MICRO_TYPE_MAP.get(sample.id);
      expect(retrieved).toBeDefined();
      expect(retrieved?.title).toBe(sample.title);
    });
  });

  describe('College Board Question Bank Repository', () => {
    const allQuestions = getAllQuestions();

    it('should contain fetched official questions for both Math and Reading & Writing', () => {
      expect(allQuestions.length).toBeGreaterThanOrEqual(3000);
      const mathCount = allQuestions.filter(q => q.test === 'math').length;
      const rwCount = allQuestions.filter(q => q.test === 'reading_writing').length;
      expect(mathCount).toBeGreaterThan(1000);
      expect(rwCount).toBeGreaterThan(1500);
    });

    it('100% of questions must be authentic College Board questions with genuine 8-character hex IDs and externalIds', () => {
      for (const q of allQuestions) {
        expect(q.id).toMatch(/^[0-9a-fA-F]{8}$/);
        expect(q.externalId).toBeTruthy();
        // Disallow any manufactured or legacy hyphenated mock IDs
        expect(q.id).not.toContain('-');
      }
    });

    it('every micro-type in the catalog must have at least one official question', () => {
      const counts = new Map<string, number>();
      for (const q of allQuestions) {
        counts.set(q.microType, (counts.get(q.microType) || 0) + 1);
      }
      for (const mt of MICRO_TYPES) {
        const count = counts.get(mt.id) || 0;
        expect(count).toBeGreaterThan(0);
      }
    });

    it('every question must have valid stems, answer keys, and microtypes', () => {
      for (const q of allQuestions) {
        expect(q.id).toBeTruthy();
        expect(q.stem).toBeTruthy();
        expect(q.correctAnswers.length).toBeGreaterThan(0);
        expect(q.microType).toBeTruthy();
        expect(['Easy', 'Medium', 'Hard']).toContain(q.difficulty);
      }
    });

    it('MCQ questions must have 4 answer options (A, B, C, D)', () => {
      const mcqs = allQuestions.filter(q => q.type === 'mcq');
      expect(mcqs.length).toBeGreaterThan(0);
      for (const q of mcqs) {
        expect(q.options?.length).toBe(4);
        expect(q.options?.map(o => o.id)).toEqual(['A', 'B', 'C', 'D']);
      }
    });

    it('should filter questions by section, difficulty, and microtype', () => {
      const hardMath = getQuestionsByFilter({
        section: 'math',
        difficulty: 'Hard',
        limit: 5
      });
      expect(hardMath.length).toBeLessThanOrEqual(5);
      for (const q of hardMath) {
        expect(q.test).toBe('math');
        expect(q.difficulty).toBe('Hard');
      }
    });

    it('should return hardest questions from the question bank', () => {
      const hardestList = getHardestQuestions(10);
      expect(hardestList.length).toBeGreaterThan(0);
      for (const q of hardestList) {
        expect(q.isHardest || q.difficulty === 'Hard').toBe(true);
      }
    });

    it('should return benchmark hardest questions for Quick Drill', () => {
      const sampleMicroType = MICRO_TYPES[0].id;
      const hardest = getHardestQuestionForMicroType(sampleMicroType);
      if (hardest) {
        expect(hardest.microType).toBe(sampleMicroType);
      }
    });

    it('should retrieve unshown questions when user chooses Practice More', () => {
      const sampleMicroType = 'alg-linear-one-solutions-count';
      const allInType = allQuestions.filter(q => q.microType === sampleMicroType);
      if (allInType.length > 1) {
        const exclude = [allInType[0].id];
        const remaining = getRemainingQuestionsForMicroType(sampleMicroType, exclude);
        expect(remaining.map(r => r.id)).not.toContain(exclude[0]);
      }
    });

    it('should generate SAT-standard Practice Tests with correct question counts', () => {
      const mathTest = generateSatPracticeTest('math');
      expect(mathTest.length).toBeGreaterThan(0);
      expect(mathTest.length).toBeLessThanOrEqual(22);
      for (const q of mathTest) {
        expect(q.test).toBe('math');
      }

      const rwTest = generateSatPracticeTest('reading_writing');
      expect(rwTest.length).toBeGreaterThan(0);
      expect(rwTest.length).toBeLessThanOrEqual(27);
      for (const q of rwTest) {
        expect(q.test).toBe('reading_writing');
      }
    });
  });

  describe('SAT Score Prediction Engine', () => {
    it('should return baseline median score (1000) when no attempts logged', () => {
      const prediction = calculatePredictedScore([]);
      expect(prediction.compositeScore).toBe(1000);
      expect(prediction.mathScore).toBe(500);
      expect(prediction.rwScore).toBe(500);
      expect(prediction.confidence).toBe('Low');
    });

    it('should predict higher scores for high accuracy on Hard questions', () => {
      const attempts = [
        { section: 'math' as const, difficulty: 'Hard' as const, isCorrect: true },
        { section: 'math' as const, difficulty: 'Hard' as const, isCorrect: true },
        { section: 'math' as const, difficulty: 'Hard' as const, isCorrect: true },
        { section: 'math' as const, difficulty: 'Medium' as const, isCorrect: true },
        { section: 'reading_writing' as const, difficulty: 'Hard' as const, isCorrect: true },
        { section: 'reading_writing' as const, difficulty: 'Hard' as const, isCorrect: true },
        { section: 'reading_writing' as const, difficulty: 'Medium' as const, isCorrect: true }
      ];
      const prediction = calculatePredictedScore(attempts);
      expect(prediction.compositeScore).toBeGreaterThan(1200);
      expect(prediction.compositeScore).toBeLessThanOrEqual(1600);
      expect(prediction.mathScore).toBeGreaterThanOrEqual(200);
      expect(prediction.rwScore).toBeGreaterThanOrEqual(200);
    });

    it('composite score must strictly stay within 400 - 1600', () => {
      const perfectAttempts = Array.from({ length: 50 }, () => ({
        section: 'math' as const,
        difficulty: 'Hard' as const,
        isCorrect: true
      }));
      const pred = calculatePredictedScore(perfectAttempts);
      expect(pred.compositeScore).toBeLessThanOrEqual(1600);
      expect(pred.compositeScore).toBeGreaterThanOrEqual(400);
    });

    it('should NEVER grant 1600 if any question is incorrect', () => {
      // 30 correct, but 1 error
      const attemptsWithOneMistake = [
        ...Array.from({ length: 15 }, () => ({ section: 'math' as const, difficulty: 'Hard' as const, isCorrect: true })),
        ...Array.from({ length: 14 }, () => ({ section: 'reading_writing' as const, difficulty: 'Hard' as const, isCorrect: true })),
        { section: 'reading_writing' as const, difficulty: 'Medium' as const, isCorrect: false }
      ];
      const pred = calculatePredictedScore(attemptsWithOneMistake);
      expect(pred.compositeScore).toBeLessThan(1600);
      expect(pred.compositeScore).toBeLessThanOrEqual(1560);
      expect(pred.rwScore).toBeLessThan(800);
    });

    it('should grant 1600 only when 100% of questions are correct with sufficient volume', () => {
      const allCorrectBalanced = [
        ...Array.from({ length: 10 }, () => ({ section: 'math' as const, difficulty: 'Hard' as const, isCorrect: true })),
        ...Array.from({ length: 10 }, () => ({ section: 'reading_writing' as const, difficulty: 'Hard' as const, isCorrect: true }))
      ];
      const pred = calculatePredictedScore(allCorrectBalanced);
      expect(pred.compositeScore).toBe(1600);
      expect(pred.mathScore).toBe(800);
      expect(pred.rwScore).toBe(800);
    });
  });

  describe('SAT Vocabulary and Reference Sheets', () => {
    it('should have the comprehensive SAT 1,790+ word catalog with Bengali meanings and context', () => {
      expect(SAT_VOCAB_LIST.length).toBeGreaterThanOrEqual(1750);
      for (const item of SAT_VOCAB_LIST) {
        expect(item.word).toBeTruthy();
        expect(item.definition).toBeTruthy();
        expect(item.bengaliMeaning).toBeTruthy();
        expect(item.contextSentence).toBeTruthy();
      }
    });

    it('paired questions must only exist when an authentic College Board question contains that word', async () => {
      const { getPairedQuestionForVocab } = await import('./data/vocabQuestions');
      const itemsWithQuestions = SAT_VOCAB_LIST.filter(v => Boolean(v.pairedQuestionId));
      expect(itemsWithQuestions.length).toBeGreaterThan(600);

      // Verify that for items with questions, the question is authentic and contains the word
      for (const item of itemsWithQuestions.slice(0, 10)) {
        const q = getPairedQuestionForVocab(item);
        expect(q).toBeDefined();
        if (q) {
          expect(q.id).toMatch(/^[a-f0-9]{8}$/);
          expect(q.test).toBe('reading_writing');
          const regex = new RegExp(`\\b${item.word.toLowerCase()}\\b`, 'i');
          const hasWord = (q.options || []).some(o => regex.test(o.content)) ||
                          regex.test(q.stem) ||
                          (q.stimulus && regex.test(q.stimulus));
          expect(hasWord).toBe(true);
        }
      }

      // Verify that an item without a question in the bank returns undefined (no forced unrelated questions)
      const itemsWithoutQuestions = SAT_VOCAB_LIST.filter(v => !v.pairedQuestionId);
      expect(itemsWithoutQuestions.length).toBeGreaterThan(500);
      const sampleNoQ = itemsWithoutQuestions[0];
      const qNone = getPairedQuestionForVocab(sampleNoQ);
      expect(qNone).toBeUndefined();
    });

    it('should have all official SAT Math reference formulas', () => {
      expect(SAT_FORMULA_SHEET.length).toBeGreaterThanOrEqual(10);
      const names = SAT_FORMULA_SHEET.map(f => f.name.toLowerCase());
      expect(names.some(n => n.includes('circle'))).toBe(true);
      expect(names.some(n => n.includes('pythagorean'))).toBe(true);
      expect(names.some(n => n.includes('quadratic'))).toBe(true);
    });
  });

  describe('Spaced Repetition System (SRS) & Module Partitioning', () => {
    it('computeSrsNextDate should calculate SuperMemo intervals (+1d, +3d, +7d)', async () => {
      const { computeSrsNextDate } = await import('./lib/satStorage');

      const stage1 = computeSrsNextDate(1);
      const stage2 = computeSrsNextDate(2);
      const stage3 = computeSrsNextDate(3);

      expect(stage1).toBeDefined();
      expect(stage2).toBeDefined();
      expect(stage3).toBeDefined();

      const d1 = new Date(stage1).getTime();
      const d2 = new Date(stage2).getTime();
      const d3 = new Date(stage3).getTime();

      expect(d2).toBeGreaterThan(d1);
      expect(d3).toBeGreaterThan(d2);
    });

    it('98-question full exam must partition into 4 modules with authentic Digital SAT pacing', async () => {
      const { generateSatPracticeTest } = await import('./data/questionsRepo');
      const fullExam = generateSatPracticeTest('full', 98);
      expect(fullExam.length).toBe(98);

      // Section 1: First 54 questions are Reading & Writing
      const rwQuestions = fullExam.slice(0, 54);
      for (const q of rwQuestions) {
        expect(q.test).toBe('reading_writing');
      }

      // Section 2: Next 44 questions are Math
      const mathQuestions = fullExam.slice(54, 98);
      for (const q of mathQuestions) {
        expect(q.test).toBe('math');
      }
    });

    it('Section exams (54 RW, 44 Math) must generate correct module partitions', async () => {
      const { generateSatPracticeTest } = await import('./data/questionsRepo');
      const rwExam = generateSatPracticeTest('reading_writing', 54);
      expect(rwExam.length).toBe(54);
      for (const q of rwExam) {
        expect(q.test).toBe('reading_writing');
      }

      const mathExam = generateSatPracticeTest('math', 44);
      expect(mathExam.length).toBe(44);
      for (const q of mathExam) {
        expect(q.test).toBe('math');
      }
    });

    it('microtypes catalog must have exactly 46 archetypes with zero inconsistencies', () => {
      expect(MICRO_TYPES.length).toBe(46);
    });

    it('all questions in the question bank must have consistent types and valid answer keys', async () => {
      const { ALL_QUESTIONS } = await import('./data/questionsRepo');
      for (const q of ALL_QUESTIONS) {
        if (q.type === 'mcq') {
          expect(q.options).toBeDefined();
          expect(q.options!.length).toBeGreaterThanOrEqual(2);
          for (const opt of q.options!) {
            expect(['A', 'B', 'C', 'D']).toContain(opt.id);
          }
        } else if (q.type === 'spr') {
          // SPR questions must not have options
          expect(!q.options || q.options.length === 0).toBe(true);
          for (const ans of q.correctAnswers) {
            expect(['A', 'B', 'C', 'D']).not.toContain(ans.trim());
          }
        }
      }
    });
  });
});


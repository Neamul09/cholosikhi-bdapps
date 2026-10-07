import { describe, it, expect } from 'vitest';
import { allPythonLessons, getCompletedLessonsCount, areAllPythonLessonsCompleted } from './index';
import { certificationExamQuestions } from '../examQuestions';

describe('Comprehensive Python Curriculum Suite (Units 1-10)', () => {
  it('loads all 32 lessons across all 10 units', () => {
    expect(allPythonLessons.length).toBe(32);
  });

  it('verifies exactly 280 exercises across all units', () => {
    const allExIds = allPythonLessons.flatMap((l) => l.exercises.map((e) => e.id));
    expect(allExIds.length).toBe(280);
  });

  it('ensures all lesson IDs are globally unique', () => {
    const ids = allPythonLessons.map((l) => l.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('ensures all exercise IDs are globally unique across all units', () => {
    const allExIds = allPythonLessons.flatMap((l) => l.exercises.map((e) => e.id));
    const uniqueExIds = new Set(allExIds);
    expect(uniqueExIds.size).toBe(allExIds.length);
  });

  it('ensures all exercises have valid schemas and bounds', () => {
    for (const lesson of allPythonLessons) {
      for (const ex of lesson.exercises) {
        // ID format check
        expect(ex.id).toBeTruthy();
        expect(ex.xpReward).toBeGreaterThan(0);
        expect(ex.question).toBeTruthy();
        if (typeof ex.question === 'object' && ex.question !== null) {
          expect(ex.question.en).toBeTruthy();
          expect(ex.question.bn).toBeTruthy();
        }

        if (ex.type === 'mcq' || ex.type === 'output_predict') {
          expect(ex.options.length).toBeGreaterThanOrEqual(2);
          expect(ex.correctIndex).toBeGreaterThanOrEqual(0);
          expect(ex.correctIndex).toBeLessThan(ex.options.length);
        } else if (ex.type === 'fill_blank') {
          expect(ex.codeTemplate).toContain('___');
          expect(ex.blanks.length).toBeGreaterThan(0);
          const blankMatches = (ex.codeTemplate.match(/___/g) || []).length;
          expect(blankMatches).toBe(ex.blanks.length);
        } else if (ex.type === 'code_arrange') {
          expect(ex.blocks.length).toBeGreaterThanOrEqual(2);
          expect(ex.correctOrder.length).toBe(ex.blocks.length);
          const sorted = [...ex.correctOrder].sort((a, b) => a - b);
          const expected = ex.blocks.map((_, i) => i);
          expect(sorted).toEqual(expected);
        } else if (ex.type === 'bug_hunt') {
          expect(ex.code).toBeTruthy();
          const lineCount = ex.code.split('\n').length;
          expect(ex.buggyLine).toBeGreaterThanOrEqual(1);
          expect(ex.buggyLine).toBeLessThanOrEqual(lineCount);
        }
      }
    }
  });

  it('ensures strict spelling of চলোশিখি and no legacy spelling', () => {
    const jsonStr = JSON.stringify(allPythonLessons);
    expect(jsonStr).not.toContain('চলশিখি');
    expect(jsonStr).not.toContain('চল শিখি');
  });

  it('ensures warm Tumi tone across all lessons with zero formal আপনার', () => {
    const jsonStr = JSON.stringify(allPythonLessons);
    expect(jsonStr).not.toContain('আপনার');
  });

  it('validates the 20-question Certification Exam dataset', () => {
    expect(certificationExamQuestions.length).toBe(20);
    const unitCoverages = new Set(certificationExamQuestions.map((q) => q.unit));
    // Must cover all 10 units
    for (let u = 1; u <= 10; u++) {
      expect(unitCoverages.has(u)).toBe(true);
    }
    for (const q of certificationExamQuestions) {
      expect(q.id).toBeTruthy();
      expect(q.question.en).toBeTruthy();
      expect(q.question.bn).toBeTruthy();
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(q.options.length);
    }
  });

  it('strictly validates that certificate and exam unlock only upon completing all 32 lessons', () => {
    // 0 lessons completed
    expect(getCompletedLessonsCount({})).toBe(0);
    expect(areAllPythonLessonsCompleted({})).toBe(false);

    // 1 lesson completed (~3% or 1%)
    const partialProgress = { [allPythonLessons[0].id]: { completed: true } };
    expect(getCompletedLessonsCount(partialProgress)).toBe(1);
    expect(areAllPythonLessonsCompleted(partialProgress)).toBe(false);

    // 31 lessons completed (97%)
    const almostDoneProgress: Record<string, { completed: boolean }> = {};
    for (let i = 0; i < 31; i++) {
      almostDoneProgress[allPythonLessons[i].id] = { completed: true };
    }
    expect(getCompletedLessonsCount(almostDoneProgress)).toBe(31);
    expect(areAllPythonLessonsCompleted(almostDoneProgress)).toBe(false);

    // All 32 lessons completed (100%)
    const fullProgress: Record<string, { completed: boolean }> = {};
    for (const lesson of allPythonLessons) {
      fullProgress[lesson.id] = { completed: true };
    }
    expect(getCompletedLessonsCount(fullProgress)).toBe(32);
    expect(areAllPythonLessonsCompleted(fullProgress)).toBe(true);
  });
});

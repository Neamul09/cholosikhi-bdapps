import { describe, it, expect } from 'vitest';
import { unit1Lessons } from './unit1';

describe('unit1Lessons', () => {
  it('has at least one lesson', () => {
    expect(unit1Lessons.length).toBeGreaterThan(0);
  });

  it('every lesson has unique ids and ascending order', () => {
    const ids = unit1Lessons.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
    const orders = unit1Lessons.map((l) => l.order);
    const sorted = [...orders].sort((a, b) => a - b);
    expect(orders).toEqual(sorted);
  });

  it('every exercise id is unique within the unit', () => {
    const ids = unit1Lessons.flatMap((l) => l.exercises.map((e) => e.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every MCQ has correctIndex within bounds', () => {
    for (const lesson of unit1Lessons) {
      for (const ex of lesson.exercises) {
        if (ex.type === 'mcq' || ex.type === 'output_predict') {
          expect(ex.correctIndex).toBeGreaterThanOrEqual(0);
          expect(ex.correctIndex).toBeLessThan(ex.options.length);
        }
      }
    }
  });
});
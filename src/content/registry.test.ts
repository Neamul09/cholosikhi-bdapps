import { describe, it, expect } from 'vitest';
import { COURSE_REGISTRY } from './registry';

describe('COURSE_REGISTRY', () => {
  it('contains unique ids', () => {
    const ids = COURSE_REGISTRY.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has at least one available course', () => {
    expect(COURSE_REGISTRY.some((c) => c.available)).toBe(true);
  });

  it('every course has both nameBn and an en tagline', () => {
    for (const course of COURSE_REGISTRY) {
      expect(course.nameBn).toBeTruthy();
      expect(course.tagline.en).toBeTruthy();
      expect(course.tagline.bn).toBeTruthy();
    }
  });
});
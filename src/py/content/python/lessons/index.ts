import { unit1Lessons } from './unit1';
import { unit2Lessons } from './unit2';
import { unit3Lessons } from './unit3';
import { unit4Lessons } from './unit4';
import { unit5Lessons } from './unit5';
import { unit6Lessons } from './unit6';
import { unit7Lessons } from './unit7';
import { unit8Lessons } from './unit8';
import { unit9Lessons } from './unit9';
import { unit10Lessons } from './unit10';

export const allPythonLessons = [
  ...unit1Lessons,
  ...unit2Lessons,
  ...unit3Lessons,
  ...unit4Lessons,
  ...unit5Lessons,
  ...unit6Lessons,
  ...unit7Lessons,
  ...unit8Lessons,
  ...unit9Lessons,
  ...unit10Lessons,
];

export const TOTAL_PYTHON_LESSONS = allPythonLessons.length;

export function getCompletedLessonsCount(lessonProgress: Record<string, { completed?: boolean }>): number {
  return allPythonLessons.filter((l) => Boolean(lessonProgress[l.id]?.completed)).length;
}

export function areAllPythonLessonsCompleted(
  lessonProgress: Record<string, { completed?: boolean }>
): boolean {
  if (!lessonProgress) return false;
  return allPythonLessons.every((l) => Boolean(lessonProgress[l.id]?.completed));
}


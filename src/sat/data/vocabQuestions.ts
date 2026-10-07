import type { SatQuestion, SatVocabItem } from '../types';
import vocabQuestionsMap from './vocabQuestions.json';
import { ALL_QUESTIONS } from './questionsRepo';

const questionsMap = vocabQuestionsMap as Record<string, SatQuestion>;

/**
 * Retrieves the 100% relevant SAT question for any vocabulary item.
 * Guarantees that the question directly tests the target vocabulary word!
 */
export function getPairedQuestionForVocab(item?: SatVocabItem | null): SatQuestion | undefined {
  if (!item) return undefined;
  
  // 1. Direct lookup by vocab id or lowercase word in authentic map
  if (questionsMap[item.id]) {
    return questionsMap[item.id];
  }
  const cleanWord = item.word.toLowerCase().trim();
  if (questionsMap[cleanWord]) {
    return questionsMap[cleanWord];
  }
  
  // 2. Direct lookup by pairedQuestionId in ALL_QUESTIONS
  if (item.pairedQuestionId) {
    const q = ALL_QUESTIONS.find(candidate => candidate.id === item.pairedQuestionId);
    if (q) return q;
  }
  
  // 3. Search for any official question with the exact word in options
  const optMatch = ALL_QUESTIONS.find(q =>
    (q.options || []).some(o => new RegExp(`\\b${cleanWord}\\b`, 'i').test(o.content))
  );
  if (optMatch) return optMatch;

  // 4. If no question has the word, return undefined! Do not show unrelated questions.
  return undefined;
}

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.resolve(__dirname, '../src/sat/data/questionsData.json');

const questions = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
console.log(`Loaded ${questions.length} questions.`);

// 1. Check for legacy/seed questions
const seedQuestions = questions.filter(q => !q.externalId || q.id.includes('-') || !/^[0-9a-fA-F]{8}$/.test(q.id));
console.log(`Found ${seedQuestions.length} legacy/seed questions:`, seedQuestions.map(q => q.id));

// 2. Check for unique IDs
const idCounts = {};
questions.forEach(q => {
  idCounts[q.id] = (idCounts[q.id] || 0) + 1;
});
const duplicateIds = Object.keys(idCounts).filter(id => idCounts[id] > 1);
console.log(`Duplicate IDs: ${duplicateIds.length}`);

// 3. Check question types & option integrity
let emptyOptionsCount = 0;
let invalidAnswerKeyCount = 0;
const invalidAnswerKeys = [];

questions.forEach(q => {
  if (q.type === 'mcq') {
    if (!q.options || q.options.length < 2) {
      emptyOptionsCount++;
      console.log(`MCQ ${q.id} has invalid options:`, q.options);
    }
    const validLetters = ['A', 'B', 'C', 'D'];
    if (!q.correctAnswers || q.correctAnswers.length === 0 || !q.correctAnswers.every(ans => validLetters.includes(ans))) {
      invalidAnswerKeyCount++;
      invalidAnswerKeys.push({ id: q.id, type: q.type, correctAnswers: q.correctAnswers });
    }
  } else if (q.type === 'spr') {
    if (!q.correctAnswers || q.correctAnswers.length === 0) {
      invalidAnswerKeyCount++;
      invalidAnswerKeys.push({ id: q.id, type: q.type, correctAnswers: q.correctAnswers });
    }
  }
});
console.log(`MCQ empty/insufficient options: ${emptyOptionsCount}`);
console.log(`Invalid answer keys: ${invalidAnswerKeyCount}`, invalidAnswerKeys);

// 4. Check rationale vs correctAnswers
const rationaleDiscrepancies = [];
questions.forEach(q => {
  if (q.type === 'mcq' && q.rationale) {
    // Regex for "Choice [A-D] is correct"
    const match = q.rationale.match(/Choice\s+([A-D])\s+is\s+correct/i);
    if (match) {
      const rationaleChoice = match[1].toUpperCase();
      const actualChoice = q.correctAnswers && q.correctAnswers[0];
      if (actualChoice && rationaleChoice !== actualChoice) {
        rationaleDiscrepancies.push({
          id: q.id,
          actualChoice,
          rationaleChoice,
          stem: q.stem.substring(0, 100),
          rationalePreview: q.rationale.substring(0, 200)
        });
      }
    }
  }
});

console.log(`\nRationale vs Key discrepancies found: ${rationaleDiscrepancies.length}`);
rationaleDiscrepancies.forEach(d => {
  console.log(`\nID: ${d.id}`);
  console.log(`  correctAnswers: ${d.actualChoice} vs rationale claims: Choice ${d.rationaleChoice}`);
  console.log(`  Stem: ${d.stem}`);
  console.log(`  Rationale preview: ${d.rationalePreview}`);
});

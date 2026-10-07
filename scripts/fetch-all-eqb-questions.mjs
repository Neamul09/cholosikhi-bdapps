// Comprehensive fetcher for College Board Educator Question Bank
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DOMAINS, inferMicroType, GET_QUESTIONS_URL, GET_QUESTION_URL } from './eqb-helper.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.resolve(__dirname, '../src/sat/data/questionsData.json');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, payload, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Retry
    }
    await sleep(200 * (attempt + 1));
  }
  return null;
}

async function run() {
  console.log('=== College Board EQB Full Question Bank Ingest ===');

  // Load existing questions
  let existingQuestions = [];
  if (fs.existsSync(DATA_FILE)) {
    try {
      existingQuestions = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      console.log(`Loaded ${existingQuestions.length} existing questions from questionsData.json`);
    } catch (e) {
      console.warn('Could not read existing file, starting fresh:', e.message);
    }
  }

  const existingExtIds = new Set(existingQuestions.map(q => q.externalId || q.id));

  // 1. Fetch metadata for all 8 domains
  const allRows = [];
  for (const domain of DOMAINS) {
    console.log(`Querying domain: ${domain.name} (${domain.code})...`);
    const rows = await fetchWithRetry(GET_QUESTIONS_URL, {
      asmtEventId: 99,
      test: domain.test,
      domain: domain.code
    });
    if (rows && Array.isArray(rows)) {
      console.log(`  Found ${rows.length} questions in ${domain.name}`);
      for (const r of rows) {
        if (r.external_id && !existingExtIds.has(r.external_id)) {
          allRows.push({ ...r, domainInfo: domain });
        }
      }
    }
  }

  console.log(`Total new un-fetched candidate questions: ${allRows.length}`);

  // Fetch every single un-fetched question to complete the 3,770 question bank
  const targetCandidates = allRows;

  console.log(`Selected all ${targetCandidates.length} un-fetched questions for complete ingestion...`);

  // Fetch in batches of 20
  const CONCURRENCY = 20;
  const newQuestions = [];
  let completedCount = 0;

  for (let i = 0; i < targetCandidates.length; i += CONCURRENCY) {
    const chunk = targetCandidates.slice(i, i + CONCURRENCY);
    const promises = chunk.map(async (row) => {
      const detail = await fetchWithRetry(GET_QUESTION_URL, { external_id: row.external_id });
      if (!detail || !detail.stem) return null;

      const options = (detail.answerOptions || []).map((opt, idx) => ({
        id: String.fromCharCode(65 + idx),
        content: opt.content || '',
        key: opt.id
      }));

      const microType = inferMicroType(
        row.domainInfo.code,
        row.skill_desc,
        detail.stem,
        detail.stimulus,
        row.difficulty,
        options
      );

      const isHardest = row.difficulty === 'H' && (
        row.score_band_range_cd >= 6 ||
        row.skill_desc.includes('Nonlinear') ||
        row.skill_desc.includes('Inferences') ||
        row.skill_desc.includes('Command of Evidence') ||
        row.skill_desc.includes('Boundaries') ||
        row.skill_desc.includes('Circles') ||
        row.skill_desc.includes('Right triangles')
      );

      return {
        id: row.questionId || row.external_id,
        externalId: row.external_id,
        test: row.domainInfo.test === 2 ? 'math' : 'reading_writing',
        domain: row.domainInfo.name,
        domainCode: row.domainInfo.code,
        skill: row.skill_desc,
        skillCode: row.skill_cd,
        microType,
        difficulty: row.difficulty === 'H' ? 'Hard' : row.difficulty === 'M' ? 'Medium' : 'Easy',
        scoreBand: row.score_band_range_cd || 4,
        type: detail.type === 'spr' || !detail.answerOptions?.length ? 'spr' : 'mcq',
        stimulus: detail.stimulus || '',
        stem: detail.stem || '',
        options,
        correctAnswers: detail.correct_answer || [],
        rationale: detail.rationale || '',
        isHardest
      };
    });

    const results = await Promise.all(promises);
    for (const r of results) {
      if (r && r.stem) {
        newQuestions.push(r);
        existingQuestions.push(r);
        existingExtIds.add(r.externalId);
      }
    }

    completedCount += chunk.length;
    process.stdout.write(`\rProgress: ${completedCount}/${targetCandidates.length} processed (${newQuestions.length} added)...`);

    // Progressive save every 50 questions
    if (newQuestions.length % 50 === 0 || completedCount >= targetCandidates.length) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(existingQuestions, null, 2), 'utf8');
    }

    await sleep(60);
  }

  // Final save
  fs.writeFileSync(DATA_FILE, JSON.stringify(existingQuestions, null, 2), 'utf8');
  console.log(`\n\nIngestion complete! Total questions now in repository: ${existingQuestions.length}`);

  // Summary per microtype
  const counts = {};
  for (const q of existingQuestions) {
    counts[q.microType] = (counts[q.microType] || 0) + 1;
  }

  console.log('\n--- Microtype Coverage ---');
  for (const [mt, c] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
    console.log(`${mt}: ${c} questions`);
  }
}

run().catch(err => {
  console.error('Fatal fetch error:', err);
  process.exit(1);
});

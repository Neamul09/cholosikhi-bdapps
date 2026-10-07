// Script to fetch official College Board SAT questions via EQB API
// and classify them into granular micro-types with full metadata.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GET_QUESTIONS_URL = 'https://qbank-api.collegeboard.org/msreportingquestionbank-prod/questionbank/digital/get-questions';
const GET_QUESTION_URL = 'https://qbank-api.collegeboard.org/msreportingquestionbank-prod/questionbank/digital/get-question';

const DOMAINS = [
  { code: 'H', name: 'Algebra', test: 2 },
  { code: 'P', name: 'Advanced Math', test: 2 },
  { code: 'Q', name: 'Problem-Solving and Data Analysis', test: 2 },
  { code: 'S', name: 'Geometry and Trigonometry', test: 2 },
  { code: 'CAS', name: 'Craft and Structure', test: 1 },
  { code: 'INI', name: 'Information and Ideas', test: 1 },
  { code: 'EOI', name: 'Expression of Ideas', test: 1 },
  { code: 'SEC', name: 'Standard English Conventions', test: 1 }
];

// Helper to infer micro-type from skill and question text/type
function inferMicroType(domainCode, skillDesc, stem, stimulus, difficulty) {
  const text = ((stimulus || '') + ' ' + (stem || '')).toLowerCase();

  // Algebra
  if (skillDesc.includes('Linear equations in one variable')) {
    if (text.includes('no solution') || text.includes('infinitely many')) return 'alg-linear-one-solutions-count';
    if (text.includes('fraction') || text.includes('over') || text.includes('frac')) return 'alg-linear-one-fractional';
    return 'alg-linear-one-basic';
  }
  if (skillDesc.includes('Systems of two linear equations')) {
    if (text.includes('no solution') || text.includes('parallel')) return 'alg-sys-no-solution';
    if (text.includes('infinitely many') || text.includes('same line')) return 'alg-sys-inf-solutions';
    if (text.includes('constant') || text.includes('value of k') || text.includes('value of a')) return 'alg-sys-constants';
    return 'alg-sys-substitution-elimination';
  }
  if (skillDesc.includes('Linear functions')) {
    if (text.includes('slope') || text.includes('rate of change')) return 'alg-func-slope-interpretation';
    if (text.includes('y-intercept') || text.includes('initial value')) return 'alg-func-intercept';
    if (text.includes('parallel') || text.includes('perpendicular')) return 'alg-func-parallel-perpendicular';
    return 'alg-func-modeling';
  }
  if (skillDesc.includes('Linear equations in two variables')) {
    if (text.includes('distance') || text.includes('between two points')) return 'alg-dist-pts';
    if (text.includes('standard form') || text.includes('ax + by')) return 'alg-two-var-standard';
    return 'alg-two-var-graph-intercepts';
  }
  if (skillDesc.includes('Linear inequalities')) {
    if (text.includes('system of inequalities') || text.includes('shaded region')) return 'alg-ineq-system';
    return 'alg-ineq-single-variable';
  }

  // Advanced Math
  if (skillDesc.includes('Nonlinear functions')) {
    if (text.includes('vertex') || text.includes('maximum') || text.includes('minimum')) return 'adv-quad-vertex';
    if (text.includes('exponential') || text.includes('growth') || text.includes('decay') || text.includes('interest')) return 'adv-exp-growth-decay';
    if (text.includes('discriminant') || text.includes('real solution') || text.includes('no real solutions')) return 'adv-quad-discriminant';
    return 'adv-quad-roots-factoring';
  }
  if (skillDesc.includes('Nonlinear equations in one variable')) {
    if (text.includes('extraneous') || text.includes('radical') || text.includes('sqrt')) return 'adv-radical-extraneous';
    if (text.includes('system') || (text.includes('y =') && text.includes('x^2'))) return 'adv-nonlinear-linear-system';
    return 'adv-rational-equations';
  }
  if (skillDesc.includes('Equivalent expressions')) {
    if (text.includes('exponent') || text.includes('power') || text.includes('radical')) return 'adv-exp-rules';
    if (text.includes('difference of squares') || text.includes('factored form')) return 'adv-poly-factoring';
    return 'adv-rational-simplification';
  }

  // Problem-Solving and Data Analysis
  if (skillDesc.includes('Ratios, rates')) {
    if (text.includes('unit conversion') || text.includes('per hour') || text.includes('speed')) return 'ps-unit-conversion';
    return 'ps-ratio-proportions';
  }
  if (skillDesc.includes('Percentages')) {
    if (text.includes('percent increase') || text.includes('percent decrease') || text.includes('greater than')) return 'ps-percent-change';
    return 'ps-percent-multistep';
  }
  if (skillDesc.includes('One-variable data')) {
    if (text.includes('standard deviation') || text.includes('spread')) return 'ps-stat-spread-std-dev';
    if (text.includes('median') || text.includes('mean') || text.includes('outlier')) return 'ps-stat-center-outlier';
    return 'ps-stat-box-plot-histogram';
  }
  if (skillDesc.includes('Two-variable data')) {
    if (text.includes('line of best fit') || text.includes('scatterplot')) return 'ps-scatter-best-fit';
    return 'ps-scatter-trend-prediction';
  }
  if (skillDesc.includes('Probability')) {
    if (text.includes('given that') || text.includes('conditional') || text.includes('two-way table')) return 'ps-prob-conditional';
    return 'ps-prob-simple';
  }
  if (skillDesc.includes('Inference from sample statistics') || skillDesc.includes('margin of error')) {
    return 'ps-margin-of-error';
  }
  if (skillDesc.includes('Evaluating statistical claims')) {
    return 'ps-study-design-generalizability';
  }

  // Geometry and Trigonometry
  if (skillDesc.includes('Lines, angles, and triangles')) {
    if (text.includes('similar') || text.includes('congruent')) return 'geo-triangles-similar';
    if (text.includes('parallel lines') || text.includes('transversal') || text.includes('alternate interior')) return 'geo-angles-parallel';
    return 'geo-triangle-angle-sum';
  }
  if (skillDesc.includes('Right triangles and trigonometry')) {
    if (text.includes('sin(') || text.includes('cos(') || text.includes('complementary')) return 'geo-trig-cofunction';
    if (text.includes('pythagorean') || text.includes('hypotenuse')) return 'geo-pythagorean-theorem';
    return 'geo-trig-soh-cah-toa';
  }
  if (skillDesc.includes('Circles')) {
    if (text.includes('equation of a circle') || text.includes('radius') || text.includes('(x - h)^2')) return 'geo-circle-equation';
    if (text.includes('arc length') || text.includes('sector area') || text.includes('radian')) return 'geo-circle-arcs-sectors';
    return 'geo-circle-theorems';
  }
  if (skillDesc.includes('Area and volume')) {
    if (text.includes('cylinder') || text.includes('cone') || text.includes('sphere') || text.includes('volume')) return 'geo-volume-3d';
    return 'geo-area-polygons';
  }

  // Reading and Writing - Craft and Structure
  if (skillDesc.includes('Words in Context')) {
    if (text.includes('scientific') || text.includes('study') || text.includes('researcher')) return 'rw-vocab-scientific';
    return 'rw-vocab-secondary-meaning';
  }
  if (skillDesc.includes('Text Structure and Purpose')) {
    if (text.includes('underlined') || text.includes('function of the sentence')) return 'rw-struct-sentence-function';
    return 'rw-struct-overall-purpose';
  }
  if (skillDesc.includes('Cross-Text') || skillDesc.includes('Cross-text')) {
    return 'rw-cross-text-comparison';
  }

  // Information and Ideas
  if (skillDesc.includes('Central Ideas and Details')) {
    return 'rw-central-ideas';
  }
  if (skillDesc.includes('Inferences')) {
    return 'rw-inferences-conclusion';
  }
  if (skillDesc.includes('Command of Evidence')) {
    if (text.includes('table') || text.includes('graph') || text.includes('figure') || text.includes('chart')) return 'rw-evidence-quantitative';
    return 'rw-evidence-textual';
  }

  // Expression of Ideas
  if (skillDesc.includes('Transitions')) {
    if (text.includes('however') || text.includes('in contrast') || text.includes('nevertheless')) return 'rw-trans-contrast';
    if (text.includes('therefore') || text.includes('consequently') || text.includes('thus')) return 'rw-trans-cause-effect';
    return 'rw-trans-addition-elaboration';
  }
  if (skillDesc.includes('Rhetorical Synthesis')) {
    return 'rw-rhetorical-synthesis';
  }

  // Standard English Conventions
  if (skillDesc.includes('Boundaries')) {
    if (text.includes('semicolon') || text.includes('period') || text.includes('comma splice')) return 'rw-bound-comma-splices';
    if (text.includes('colon') || text.includes('dash')) return 'rw-bound-colons-dashes';
    return 'rw-bound-clauses';
  }
  if (skillDesc.includes('Form, Structure, and Sense')) {
    if (text.includes('subject-verb') || text.includes('plural') || text.includes('singular')) return 'rw-form-subject-verb';
    if (text.includes('modifier') || text.includes('dangling') || text.includes('misplaced')) return 'rw-form-modifiers';
    if (text.includes('pronoun') || text.includes('its') || text.includes('their')) return 'rw-form-pronouns';
    return 'rw-form-verb-tense';
  }

  return 'misc-general';
}

async function fetchQuestions() {
  console.log('Starting College Board EQB Question fetch...');
  const outDir = path.join(__dirname, '../src/sat/data');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const allQuestions = [];
  const candidateRows = [];

  for (const domain of DOMAINS) {
    console.log(`Fetching questions list for domain: ${domain.name} (${domain.code})...`);
    try {
      const res = await fetch(GET_QUESTIONS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asmtEventId: 99, test: domain.test, domain: domain.code })
      });
      if (!res.ok) {
        console.error(`Failed to fetch domain ${domain.code}: HTTP ${res.status}`);
        continue;
      }
      const rows = await res.json();
      console.log(`Domain ${domain.name}: received ${rows.length} question rows.`);

      // Group by skill
      const bySkill = {};
      for (const row of rows) {
        if (!bySkill[row.skill_desc]) bySkill[row.skill_desc] = [];
        bySkill[row.skill_desc].push(row);
      }

      // Pick representative questions per skill (ensure easy, medium, and hard)
      for (const [skill, skillRows] of Object.entries(bySkill)) {
        const hard = skillRows.filter(r => r.difficulty === 'H');
        const med = skillRows.filter(r => r.difficulty === 'M');
        const easy = skillRows.filter(r => r.difficulty === 'E');

        // Always take 2-3 hard if available, 1-2 medium, 1 easy
        const picked = [
          ...hard.slice(0, 3),
          ...med.slice(0, 2),
          ...easy.slice(0, 1)
        ];

        for (const row of picked) {
          if (row.external_id) {
            candidateRows.push({ ...row, domainInfo: domain });
          }
        }
      }
    } catch (err) {
      console.error(`Error querying domain ${domain.code}:`, err.message);
    }
  }

  console.log(`Total candidate questions selected for deep fetch: ${candidateRows.length}`);

  // Fetch full details in batches
  const batchSize = 10;
  for (let i = 0; i < candidateRows.length; i += batchSize) {
    const batch = candidateRows.slice(i, i + batchSize);
    console.log(`Fetching batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(candidateRows.length / batchSize)}...`);

    const promises = batch.map(async (row) => {
      try {
        const res = await fetch(GET_QUESTION_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ external_id: row.external_id })
        });
        if (!res.ok) return null;
        const detail = await res.json();

        const microType = inferMicroType(
          row.domainInfo.code,
          row.skill_desc,
          detail.stem,
          detail.stimulus,
          row.difficulty
        );

        const options = (detail.answerOptions || []).map((opt, idx) => ({
          id: String.fromCharCode(65 + idx), // 'A', 'B', 'C', 'D'
          content: opt.content || '',
          key: opt.id
        }));

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
      } catch (err) {
        console.warn(`Failed question ${row.external_id}:`, err.message);
        return null;
      }
    });

    const results = await Promise.all(promises);
    for (const r of results) {
      if (r && r.stem) {
        allQuestions.push(r);
      }
    }

    // Small delay between batches to respect rate limits
    await new Promise(res => setTimeout(res, 200));
  }

  console.log(`Successfully fetched and parsed ${allQuestions.length} full question records.`);

  const outputPath = path.join(outDir, 'questionsData.json');
  fs.writeFileSync(outputPath, JSON.stringify(allQuestions, null, 2), 'utf-8');
  console.log(`Questions written to ${outputPath} (${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB)`);
}

fetchQuestions().catch(err => {
  console.error('Fatal fetch error:', err);
  process.exit(1);
});

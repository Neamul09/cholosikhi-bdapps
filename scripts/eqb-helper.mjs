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

// Helper to infer micro-type matching the 36 exact MICRO_TYPES in src/sat/data/microtypes.ts
function inferMicroType(domainCode, skillDesc, stem, stimulus, difficulty, options = []) {
  const optionsText = options.map(o => o.content || '').join(' ').toLowerCase();
  const text = ((stimulus || '') + ' ' + (stem || '') + ' ' + optionsText).toLowerCase();
  const skill = (skillDesc || '').toLowerCase();
  const dCode = (domainCode || '').toUpperCase();

  // 1. Advanced Math (P) - check before H to prevent 'function'/'system' overlap
  if (dCode === 'P' || skill.includes('nonlinear') || skill.includes('equivalent expression') || skill.includes('exponential')) {
    if (skill.includes('nonlinear function') || skill.includes('quadratic')) {
      if (text.includes('vertex') || text.includes('maximum') || text.includes('minimum') || text.includes('peak') || text.includes('highest') || text.includes('lowest')) {
        return 'adv-quad-vertex';
      }
      if (text.includes('discriminant') || text.includes('real solution') || text.includes('no real') || text.includes('one real') || text.includes('two real') || text.includes('b^2') || text.includes('intersect') || text.includes('solutions')) {
        return 'adv-quad-discriminant';
      }
      if (text.includes('growth') || text.includes('decay') || text.includes('percent') || text.includes('initial') || text.includes('half-life') || text.includes('factor')) {
        return 'adv-exp-growth-decay';
      }
      return 'adv-quad-vertex';
    }
    if (skill.includes('nonlinear equation') || skill.includes('radical') || skill.includes('rational')) {
      if (text.includes('extraneous') || text.includes('radical') || text.includes('sqrt') || text.includes('square root')) {
        return 'adv-radical-extraneous';
      }
      return 'adv-nonlinear-linear-system';
    }
    if (skill.includes('exponential')) {
      if (text.includes('growth') || text.includes('decay') || text.includes('half-life') || text.includes('doubl')) {
        return 'adv-exp-growth-decay';
      }
      return 'math-pam-exponential-models';
    }
    if (skill.includes('equivalent expression')) {
      return 'adv-exp-rules';
    }
    return 'adv-exp-rules';
  }

  // 2. Algebra (H)
  if (dCode === 'H' || skill.includes('linear equation') || skill.includes('linear function') || skill.includes('inequalit')) {
    if (skill.includes('one variable')) {
      if (text.includes('no solution') || text.includes('infinitely many') || text.includes('number of solutions') || text.includes('exactly one')) {
        return 'alg-linear-one-solutions-count';
      }
      if (text.includes('frac') || text.includes('/') || text.includes('denominator') || text.includes('over')) {
        return 'alg-linear-one-fractional';
      }
      return 'alg-linear-one-basic';
    }
    if (skill.includes('systems of two') || (skill.includes('system') && !skill.includes('nonlinear'))) {
      if (text.includes('no solution') || text.includes('parallel') || text.includes('never intersect')) {
        return 'alg-sys-no-solution';
      }
      if (text.includes('infinitely many') || text.includes('same line') || text.includes('overlap')) {
        return 'alg-sys-inf-solutions';
      }
      return 'alg-sys-substitution-elimination';
    }
    if (skill.includes('linear function')) {
      if (text.includes('slope') || text.includes('rate of change') || text.includes('per hour') || text.includes('per unit') || text.includes('increase of')) {
        return 'alg-func-slope-interpretation';
      }
      return 'alg-func-intercept';
    }
    if (skill.includes('two variables')) {
      if (text.includes('distance') || text.includes('midpoint') || text.includes('coordinates') || text.includes('between two points')) {
        return 'alg-dist-pts';
      }
      return 'alg-func-intercept';
    }
    if (skill.includes('inequalit')) {
      return 'alg-ineq-system';
    }
    return 'alg-linear-one-basic';
  }

  // 3. Problem-Solving & Data Analysis (Q)
  if (dCode === 'Q' || skill.includes('data') || skill.includes('ratio') || skill.includes('percent') || skill.includes('probab') || skill.includes('statistic')) {
    if (skill.includes('ratio') || skill.includes('rate') || skill.includes('unit') || skill.includes('proportional')) {
      return 'ps-ratio-proportions-units';
    }
    if (skill.includes('percent')) {
      return 'ps-percentages-multistep';
    }
    if (skill.includes('one-variable') || skill.includes('center and spread') || skill.includes('distribution')) {
      return 'ps-stat-center-spread';
    }
    if (skill.includes('two-variable') || skill.includes('scatterplot') || skill.includes('model')) {
      return 'ps-scatterplots-models';
    }
    if (skill.includes('probab')) {
      return 'ps-probability-conditional';
    }
    if (skill.includes('evaluating statistical') || skill.includes('observational')) {
      return 'ps-evaluating-statistical-claims';
    }
    return 'math-psda-margins-of-error';
  }

  // 4. Geometry and Trigonometry (S)
  if (dCode === 'S' || skill.includes('circle') || skill.includes('triangle') || skill.includes('trig') || skill.includes('angle') || skill.includes('area') || skill.includes('volume')) {
    if (skill.includes('area and volume') || skill.includes('volume') || skill.includes('area')) {
      return 'geo-area-volume-3d';
    }
    if (skill.includes('circle')) {
      if (text.includes('tangent') || text.includes('perpendicular') || text.includes('secant') || text.includes('theorem')) {
        return 'math-geom-circle-theorems';
      }
      if (text.includes('arc') || text.includes('sector') || text.includes('radian') || text.includes('central angle')) {
        return 'geo-circle-arcs-sectors';
      }
      return 'geo-circle-equation';
    }
    if (skill.includes('trig') || skill.includes('right triangle')) {
      return 'geo-trig-cofunction';
    }
    if (skill.includes('similar') || skill.includes('lines') || skill.includes('angles') || skill.includes('triangles')) {
      return 'geo-triangles-similar';
    }
    return 'geo-triangles-similar';
  }

  // 5. Craft and Structure (CAS)
  if (dCode === 'CAS' || skill.includes('words in context') || skill.includes('text structure') || skill.includes('cross-text')) {
    if (skill.includes('cross-text')) {
      return 'rw-cross-text-connections';
    }
    if (skill.includes('structure') || skill.includes('purpose')) {
      return 'rw-struct-sentence-function';
    }
    return 'rw-vocab-secondary-meaning';
  }

  // 6. Information and Ideas (INI)
  if (dCode === 'INI' || skill.includes('inference') || skill.includes('evidence') || skill.includes('central idea')) {
    if (skill.includes('central idea')) {
      return 'rw-central-ideas-details';
    }
    if (skill.includes('evidence')) {
      if (text.includes('table') || text.includes('graph') || text.includes('chart') || text.includes('figure') || text.includes('data in the table')) {
        return 'rw-evidence-quantitative';
      }
      return 'rw-evidence-textual';
    }
    return 'rw-inferences-conclusion';
  }

  // 7. Expression of Ideas (EOI)
  if (dCode === 'EOI' || skill.includes('transition') || skill.includes('rhetorical')) {
    if (skill.includes('rhetorical') || text.includes('student notes') || text.includes('while researching')) {
      return 'rw-rhetorical-synthesis';
    }
    if (text.includes('contrast') || text.includes('however') || text.includes('nevertheless') || text.includes('on the other hand') || text.includes('conversely')) {
      return 'rw-trans-contrast';
    }
    if (text.includes('therefore') || text.includes('consequently') || text.includes('thus') || text.includes('as a result')) {
      return 'rw-trans-cause-effect';
    }
    return 'rw-eoi-transitions-contrast';
  }

  // 8. Standard English Conventions (SEC)
  if (dCode === 'SEC' || skill.includes('boundar') || skill.includes('form') || skill.includes('conventions')) {
    if (skill.includes('boundar')) {
      if (text.includes('modifier') || text.includes('dangling') || text.includes('participial')) {
        return 'rw-sec-boundaries-modifiers';
      }
      if (text.includes('colon') || text.includes('dash') || text.includes(';') || text.includes(':') || text.includes('list')) {
        return 'rw-bound-colons-dashes';
      }
      return 'rw-bound-comma-splices';
    }
    if (skill.includes('form') || skill.includes('structure') || skill.includes('sense')) {
      // If answer options have verbs (is, was, were, are, has, have, plays, play, creates, create) -> subject verb agreement
      if (/\b(is|are|was|were|has|have|had|plays|play|creates|create|shows|show|remains|remain)\b/i.test(optionsText) || text.includes('subject') || text.includes('singular') || text.includes('plural') || text.includes('verb')) {
        return 'rw-form-subject-verb';
      }
      return 'rw-form-modifiers';
    }
    return 'rw-bound-comma-splices';
  }

  return 'alg-linear-one-basic';
}

export { DOMAINS, inferMicroType, GET_QUESTIONS_URL, GET_QUESTION_URL };

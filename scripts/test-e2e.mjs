#!/usr/bin/env node
/**
 * Opt-in Playwright runner.
 *
 * Why this wrapper exists:
 *   The Playwright browser binary is large (~300 MB) and most contributors
 *   don't need it for day-to-day work. To keep `npm install` fast, we keep
 *   `@playwright/test` as an *optional* devDependency and surface a clear
 *   install hint when someone runs `npm run test:e2e`.
 *
 *   When you're ready to enable e2e:
 *     1. npm i -D @playwright/test
 *     2. npx playwright install --with-deps chromium
 *     3. npm run test:e2e
 */
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

function fail(message) {
  process.stderr.write(`\n  ${message}\n\n`);
  process.exit(1);
}

try {
  // Resolve from the local project; throws if not installed.
  await import('@playwright/test');
} catch {
  fail(
    'Playwright is not installed.\n' +
      '  Run:\n' +
      '    npm i -D @playwright/test\n' +
      '    npx playwright install --with-deps chromium\n' +
      '  then retry `npm run test:e2e`.',
  );
}

if (!existsSync('playwright.config.ts')) {
  fail('Missing playwright.config.ts at the repo root.');
}

const result = spawnSync('npx', ['playwright', 'test'], {
  stdio: 'inherit',
  env: process.env,
});
process.exit(result.status ?? 1);
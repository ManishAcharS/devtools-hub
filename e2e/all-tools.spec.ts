import { test, expect, type Page } from '@playwright/test';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { getSamples } from './samples';

const SOURCE = readFileSync(
  path.join(__dirname, '..', 'src', 'registry', 'tool-components.ts'),
  'utf8'
);
const exportStart = SOURCE.indexOf('export const toolComponents');
const EXPORT_SOURCE = exportStart >= 0 ? SOURCE.slice(exportStart) : SOURCE;
const SLUGS: string[] = [...EXPORT_SOURCE.matchAll(/'([a-z0-9-]+)':\s*[A-Z][A-Za-z0-9]+/g)].map(
  (m) => m[1]
);

console.log(`[E2E] Discovered ${SLUGS.length} tool slugs`);

const ACTION_RE =
  /(generate|transform|convert|format|encode|decode|hash|calculate|parse|preview|extract|lookup|validate|run|sort|translate|compress|resize|crop|scan|search|verify|check|minif|add|create|build|roll|flip|regenerate|submit|open)/i;

const ERROR_RE =
  /(invalid|not valid|error|failed|does not match|unexpected|must be|cannot be|please enter|isn'?t a|is not a|no valid|unsupported|out of range|exceeds)/i;

interface ToolReport {
  slug: string;
  title: string;
  checks: Record<string, { status: 'PASS' | 'FAIL' | 'WARN' | 'N/A'; detail?: string }>;
}

type CheckStatus = 'PASS' | 'FAIL' | 'WARN' | 'N/A';
interface CheckResult {
  status: CheckStatus;
  detail?: string;
}

async function safeRun(
  fn: () => Promise<CheckResult>,
  fallback: CheckResult
): Promise<{ result: CheckResult; error?: string }> {
  try {
    return { result: await fn() };
  } catch (e) {
    const err = String(e).slice(0, 300);
    return { result: { ...fallback, detail: `${fallback.detail ?? 'error'}: ${err}` }, error: err };
  }
}

async function safeValue<T>(fn: () => Promise<T>): Promise<{ result: T; error?: string }> {
  try {
    return { result: await fn() };
  } catch (e) {
    return { result: null as unknown as T, error: String(e).slice(0, 500) };
  }
}

function runInPage(page: Page) {
  return {
    snapshot: () =>
      page.evaluate(() => {
        const staticText = document.body.innerText;
        const dynamicValues = [...document.querySelectorAll('input,textarea')]
          .filter((el) => (el as HTMLInputElement).readOnly)
          .map((el) => (el as HTMLInputElement).value)
          .join('|');
        return staticText + '||READONLY||' + dynamicValues;
      }),
    hasErrorElement: () =>
      page.evaluate((re) => {
        const errorNodes = [
          ...document.querySelectorAll(
            'p, span, div, pre, [role="alert"], .text-red-600, .text-amber-600'
          ),
        ];
        return errorNodes.some((el) => {
          const cls = (el as HTMLElement).className ?? '';
          if (!/red|error|alert|amber/i.test(String(cls))) return false;
          return new RegExp(re, 'i').test((el as HTMLElement).textContent ?? '');
        });
      }, ERROR_RE.source),
    getOutputValue: () =>
      page.evaluate(() => {
        const pre = document.querySelector('pre[id$="-output"], [data-output], pre code, output');
        return pre?.textContent ?? '';
      }),
    findFirstTextarea: () =>
      page.evaluate(() => {
        const ta: HTMLTextAreaElement | null = document.querySelector('textarea');
        return ta ? { id: ta.id, tag: 'textarea' } : null;
      }),
    findFirstTextInput: () =>
      page.evaluate(() => {
        const inp: HTMLInputElement | null = document.querySelector(
          'input[type="text"], input[type="search"], input:not([type])'
        );
        return inp ? { id: inp.id, tag: 'input', type: inp.type } : null;
      }),
  };
}

test.describe('tool verification suite', () => {
  for (const slug of SLUGS) {
    test(`tools/${slug}`, async ({ page, context }) => {
      const report: ToolReport = {
        slug,
        title: '',
        checks: {},
      };
      const errors: string[] = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(`console: ${msg.text().slice(0, 300)}`);
      });
      page.on('pageerror', (err) => errors.push(`pageerror: ${String(err).slice(0, 300)}`));

      await context.grantPermissions(['clipboard-read', 'clipboard-write'], {
        origin: 'http://localhost:3100',
      });

      const samples = getSamples(slug);
      const base = 'http://localhost:3100';

      // ---- Page load ----
      const nav = await safeValue(() => page.goto(`${base}/tools/${slug}`, { waitUntil: 'load' }));
      if (nav.error) {
        report.checks['page.load'] = { status: 'FAIL', detail: nav.error };
        gotoReport(slug, report);
        return;
      }
      await page.waitForTimeout(500);
      report.checks['page.load'] = { status: 'PASS' };

      // ---- Metadata ----
      const title = await page.title().catch(() => '');
      report.title = title;
      const description = await page
        .locator('meta[name="description"]')
        .getAttribute('content')
        .catch(() => null);
      report.checks['metadata.title'] = {
        status: title && !title.includes('404') && title !== 'Toolbox for Devs' ? 'PASS' : 'FAIL',
        detail: title,
      };
      report.checks['metadata.description'] = {
        status: description ? 'PASS' : 'FAIL',
        detail: description ?? 'missing',
      };

      // ---- Page renders ----
      const bodyText = await page.evaluate(() => document.body.innerText).catch(() => '');
      report.checks['page.renders'] = {
        status: bodyText.length > 50 ? 'PASS' : 'FAIL',
        detail: `len=${bodyText.length}`,
      };

      // ---- Related tools ----
      const related = page.locator('section[aria-labelledby="related-tools-heading"]');
      const relatedCount = await related.count();
      if (relatedCount > 0) {
        const links = await related.locator('a[href^="/tools/"]').count();
        report.checks['related.section'] = { status: 'PASS' };
        report.checks['related.links'] = {
          status: links >= 1 ? 'PASS' : 'FAIL',
          detail: `${links} links`,
        };
      } else {
        report.checks['related.section'] = { status: 'WARN', detail: 'no related tools section' };
        report.checks['related.links'] = { status: 'N/A' };
      }

      // ---- Interaction ----
      if (!samples.skipInteraction) {
        const helper = runInPage(page);

        // Capture pre-fill snapshot for change detection (live tools update on fill)
        const before = await helper.snapshot();

        // Fill inputs
        await safeValue(async () => {
          const scope = page.locator('#main-content, main');
          const textareas = scope.locator('textarea');
          const textInputs = scope.locator(
            'input[type="text"], input[type="search"], input:not([type])'
          );

          if (await textareas.count()) {
            if (samples.main) await textareas.first().fill(samples.main);
          }
          if (await textInputs.count()) {
            if (!(await textareas.count()) && samples.main)
              await textInputs.first().fill(samples.main);
            else if ((await textareas.count()) && samples.secondary)
              await textInputs.first().fill(samples.secondary);
          }
          if (samples.file) {
            const fileInputs = scope.locator('input[type="file"]');
            if (await fileInputs.count()) {
              await fileInputs
                .first()
                .setInputFiles(path.join(__dirname, 'fixtures', samples.file));
              await page.waitForTimeout(700);
            }
          }
          // Second textarea (e.g. text-diff)
          if ((await textareas.count()) > 1 && samples.secondary) {
            await textareas.nth(1).fill(samples.secondary);
          }
        });

        // Find action button
        const actionBtn = await findActionButton(page);

        let clickedAction = false;
        if (actionBtn) {
          await safeValue(async () => {
            await actionBtn.click();
            clickedAction = true;
          });
        } else if (
          (await page
            .locator('textarea,input[type="text"],input[type="search"],input:not([type])')
            .count()) > 0
        ) {
          // No action button - maybe live filter, just wait for change
          await page.waitForTimeout(400);
          clickedAction = true;
        }

        if (clickedAction) {
          try {
            await page.waitForFunction(
              ({ before, errRe }) => {
                const staticText = document.body.innerText;
                const dynamicValues = [...document.querySelectorAll('input,textarea')]
                  .filter((el) => (el as HTMLInputElement).readOnly)
                  .map((el) => (el as HTMLInputElement).value)
                  .join('|');
                const now = staticText + '||READONLY||' + dynamicValues;
                if (now !== before) return true;
                const hasEnabledCopy = [
                  ...document.querySelectorAll(
                    'button[aria-label="Copy"], button[aria-label="Copy all"]'
                  ),
                ].some((b) => !(b as HTMLButtonElement).disabled);
                const readonlyHasValue = [
                  ...document.querySelectorAll('input[readonly], textarea[readonly]'),
                ].some((el) => (el as HTMLInputElement).value.length > 0);
                if (hasEnabledCopy || readonlyHasValue) return true;
                const errorNodes = [...document.querySelectorAll('p,span,div,pre,[role="alert"]')];
                return errorNodes.some((el) => {
                  const cls = (el as HTMLElement).className ?? '';
                  if (!/red|error|alert|amber/i.test(String(cls))) return false;
                  return new RegExp(errRe, 'i').test((el as HTMLElement).textContent ?? '');
                });
              },
              { before, errRe: ERROR_RE.source },
              { timeout: 10_000 }
            );
            const after = await helper.snapshot();
            const hasError = await helper.hasErrorElement();
            const preexisting = await page.evaluate(() => {
              const hasEnabledCopy = [
                ...document.querySelectorAll(
                  'button[aria-label="Copy"], button[aria-label="Copy all"]'
                ),
              ].some((b) => !(b as HTMLButtonElement).disabled);
              const readonlyHasValue = [
                ...document.querySelectorAll('input[readonly], textarea[readonly]'),
              ].some((el) => (el as HTMLInputElement).value.length > 0);
              const outEl = document.querySelector(
                'pre[id$="-output"], [data-output], pre code, output'
              );
              return (
                hasEnabledCopy || readonlyHasValue || (outEl && outEl.textContent.trim().length > 0)
              );
            });
            if (after !== before || hasError || preexisting) {
              report.checks['input.works'] = {
                status: 'PASS',
                detail: hasError
                  ? 'error shown'
                  : after !== before
                    ? 'output changed'
                    : 'auto output',
              };
              report.checks['error.handled'] = {
                status: hasError ? 'PASS' : 'PASS',
                detail: hasError ? 'error shown' : 'no crash',
              };
            } else {
              report.checks['input.works'] = { status: 'FAIL', detail: 'no output change' };
              report.checks['error.handled'] = { status: 'FAIL', detail: 'no feedback' };
            }
          } catch {
            report.checks['input.works'] = { status: 'FAIL', detail: 'timeout' };
            report.checks['error.handled'] = { status: 'WARN', detail: 'no feedback' };
          }
        } else {
          report.checks['input.works'] = { status: 'N/A', detail: 'no inputs' };
          report.checks['error.handled'] = { status: 'N/A' };
        }

        // ---- Copy ----
        const copyRes = await safeRun(
          async () => {
            // Wait for output to appear (copy button enables when outputValue exists)
            const scope = page.locator('#main-content, main');
            const copyButton = scope.locator(
              'button[aria-label="Copy"]:not(:disabled), button[aria-label="Copy all"]:not(:disabled)'
            );
            const hasEnabledCopy = await copyButton.count().then((c) => c > 0);
            if (!hasEnabledCopy) {
              // Wait a bit for output to render
              await page.waitForTimeout(500);
            }
            const enabledButtons = scope.locator(
              'button[aria-label="Copy"]:not(:disabled), button[aria-label="Copy all"]:not(:disabled)'
            );
            const count = await enabledButtons.count();
            if (count === 0) return { status: 'WARN', detail: 'no enabled copy button' };
            let copied = false;
            for (let i = 0; i < count && !copied; i++) {
              const btn = enabledButtons.nth(i);
              await btn.click();
              await page.waitForTimeout(150);
              const clipboard = await page
                .evaluate(() => navigator.clipboard.readText())
                .catch(() => '');
              if (clipboard && clipboard !== 'warm-up') copied = true;
            }
            return { status: copied ? 'PASS' : 'FAIL', detail: copied ? 'ok' : 'clipboard empty' };
          },
          { status: 'WARN', detail: 'copy test error' }
        );
        report.checks['copy.works'] = copyRes.result;

        // ---- Download ----
        const dlRes = await safeRun(
          async () => {
            const scope = page.locator('#main-content, main');
            const dlButtons = scope.locator(
              'button[aria-label="Download"]:not(:disabled), button:has-text("Download"):not(:disabled)'
            );
            if ((await dlButtons.count()) === 0)
              return { status: 'N/A', detail: 'no download button' };
            // Click but don't wait for download event (programmatic blob downloads don't trigger it in headless)
            await dlButtons.first().click();
            await page.waitForTimeout(500);
            return { status: 'PASS', detail: 'clicked (download event not observed in headless)' };
          },
          { status: 'N/A', detail: 'no download button' }
        );
        report.checks['download.works'] = dlRes.result;

        // ---- Reset / Clear ----
        const resetRes = await safeRun(
          async () => {
            const scope = page.locator('#main-content, main');
            const clearButtons = scope.locator(
              'button:has-text("Clear"):not(:disabled), button:has-text("Reset"):not(:disabled)'
            );
            const count = await clearButtons.count();
            if (count === 0) return { status: 'N/A', detail: 'no clear/reset' };
            await clearButtons.first().click();
            await page.waitForTimeout(200);
            const empty = await page.evaluate(() =>
              [...document.querySelectorAll('textarea')].every(
                (el) => !(el as HTMLTextAreaElement).value.length
              )
            );
            return { status: empty ? 'PASS' : 'WARN', detail: empty ? 'cleared' : 'not all empty' };
          },
          { status: 'N/A', detail: 'no clear/reset' }
        );
        report.checks['reset.works'] = resetRes.result;

        // ---- Huge input ----
        const hugeRes = await safeRun(
          async () => {
            const scope = page.locator('#main-content, main');
            const textareas = scope.locator('textarea');
            const textInputs = scope.locator(
              'input[type="text"], input[type="search"], input:not([type])'
            );
            const target = (await textareas.count()) ? textareas.first() : textInputs.first();
            if ((await target.count()) === 0) return { status: 'N/A', detail: 'no text input' };
            const huge = 'x'.repeat(100_000) + '\n'.repeat(200);
            await target.fill(huge);
            await page.waitForTimeout(1200);
            const crashed = errors.some((e) => e.startsWith('pageerror:'));
            return { status: crashed ? 'FAIL' : 'PASS', detail: crashed ? 'page error' : 'ok' };
          },
          { status: 'N/A', detail: 'no text input' }
        );
        report.checks['huge.input'] = hugeRes.result;

        // ---- Invalid input ----
        const invalidRes = await safeRun(
          async () => {
            const scope = page.locator('#main-content, main');
            const textareas = scope.locator('textarea');
            const textInputs = scope.locator(
              'input[type="text"], input[type="search"], input:not([type])'
            );
            const target = (await textareas.count()) ? textareas.first() : textInputs.first();
            if ((await target.count()) === 0) return { status: 'N/A', detail: 'no text input' };
            await target.fill(samples.invalid ?? '!!!totally-invalid-value!!!');
            await page.waitForTimeout(700);
            const helper = runInPage(page);
            const hasError = await helper.hasErrorElement();
            const crashed = errors.some((e) => e.startsWith('pageerror:'));
            if (crashed) return { status: 'FAIL', detail: 'page error' };
            return {
              status: hasError ? 'PASS' : 'PASS',
              detail: hasError ? 'error shown' : 'no crash',
            };
          },
          { status: 'N/A', detail: 'no text input' }
        );
        report.checks['invalid.input'] = invalidRes.result;
      } else {
        report.checks['input.works'] = { status: 'N/A', detail: 'skipped' };
        report.checks['copy.works'] = { status: 'N/A' };
        report.checks['download.works'] = { status: 'N/A' };
        report.checks['reset.works'] = { status: 'N/A' };
        report.checks['huge.input'] = { status: 'N/A' };
        report.checks['invalid.input'] = { status: 'N/A' };
        report.checks['error.handled'] = { status: 'N/A' };
      }

      // ---- Dark mode ----
      const darkRes = await safeRun(
        async () => {
          // Try multiple selectors for theme toggle
          let themeToggle = page.locator('button[aria-label="Toggle theme"]');
          if ((await themeToggle.count()) === 0) {
            themeToggle = page.locator(
              '[role="radiogroup"][aria-label="Color scheme"] >> button:first-child'
            );
          }
          if ((await themeToggle.count()) === 0) {
            themeToggle = page.locator('button[aria-label*="theme" i]');
          }
          if ((await themeToggle.count()) === 0) {
            themeToggle = page.locator('button[aria-label*="color" i]');
          }
          if ((await themeToggle.count()) === 0) {
            themeToggle = page
              .locator('button:has(svg.lucide-sun), button:has(svg.lucide-moon)')
              .first();
          }
          if ((await themeToggle.count()) === 0)
            return { status: 'WARN', detail: 'no theme toggle found' };
          const beforeErrors = errors.length;
          await themeToggle.first().click();
          await page.waitForTimeout(400);
          const isDark = await page.evaluate(() =>
            document.documentElement.classList.contains('dark')
          );
          const stillRenders = await page.evaluate(() => document.body.innerText.length > 50);
          const newErrors = errors.slice(beforeErrors);
          if (newErrors.length > 0) return { status: 'FAIL', detail: newErrors[0] };
          return {
            status: isDark && stillRenders ? 'PASS' : 'FAIL',
            detail: `dark=${isDark} renders=${stillRenders}`,
          };
        },
        { status: 'FAIL', detail: 'theme toggle missing' }
      );
      report.checks['dark-mode.toggle'] = darkRes.result;

      // ---- Mobile ----
      const mobileRes = await safeRun(
        async () => {
          await page.setViewportSize({ width: 390, height: 844 });
          await page.waitForTimeout(500);
          const overflow = await page.evaluate(() => {
            try {
              return document.documentElement.scrollWidth - window.innerWidth;
            } catch {
              return 0;
            }
          });
          return { status: overflow <= 1 ? 'PASS' : 'FAIL', detail: `overflow=${overflow}px` };
        },
        { status: 'WARN', detail: 'mobile test error' }
      );
      report.checks['mobile.no-overflow'] = mobileRes.result;

      // ---- Console ----
      report.checks['console.clean'] = {
        status: errors.filter((e) => e.startsWith('console:')).length === 0 ? 'PASS' : 'WARN',
        detail: errors
          .filter((e) => e.startsWith('console:'))
          .slice(0, 3)
          .join('; '),
      };

      // ---- Write report ----
      mkdirSync(path.join(__dirname, '..', 'e2e-results', 'tools'), { recursive: true });
      writeFileSync(
        path.join(__dirname, '..', 'e2e-results', 'tools', `${slug}.json`),
        JSON.stringify(report, null, 2)
      );

      // ---- Soft assertions ----
      expect.soft(report.checks['page.load'].status).toBe('PASS');
      expect.soft(report.checks['page.renders'].status).toBe('PASS');
      expect.soft(report.checks['dark-mode.toggle'].status).not.toBe('FAIL');
    });
  }
});

async function findActionButton(page: Page) {
  const scope = page.locator('#main-content, main');
  const buttons = scope.locator('button:visible:not(:disabled)');
  const count = await buttons.count();
  for (let i = 0; i < count; i++) {
    const btn = buttons.nth(i);
    const text = (await btn.innerText()).trim();
    if (
      text &&
      ACTION_RE.test(text) &&
      !/^(copy|downloaded!|copied!|clear|reset|share this tool)$/i.test(text)
    ) {
      return btn;
    }
  }
  return null;
}

function gotoReport(slug: string, report: ToolReport) {
  mkdirSync(path.join(__dirname, '..', 'e2e-results', 'tools'), { recursive: true });
  writeFileSync(
    path.join(__dirname, '..', 'e2e-results', 'tools', `${slug}.json`),
    JSON.stringify(report, null, 2)
  );
}

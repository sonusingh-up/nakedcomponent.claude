/**
 * status.js — Check ingredient generation progress
 * Usage: node status.js
 */
import fs from 'fs';

const QUEUE_FILE    = new URL('./queue.json',    import.meta.url).pathname;
const PROGRESS_FILE = new URL('./progress.json', import.meta.url).pathname;

const queue    = fs.existsSync(QUEUE_FILE)    ? JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf8'))    : [];
const progress = fs.existsSync(PROGRESS_FILE) ? JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8')) : { built: [], failed: [] };

const total   = 312;
const built   = progress.built?.length || 0;
const failed  = progress.failed?.length || 0;
const pending = queue.length;
const pct     = ((built / total) * 100).toFixed(1);

// Progress bar
const barLen = 40;
const filled = Math.round((built / total) * barLen);
const bar    = '█'.repeat(filled) + '░'.repeat(barLen - filled);

console.log('\n=== Naked Compound — Ingredient Pages Progress ===\n');
console.log(`[${bar}] ${pct}%`);
console.log(`\n  Total:    ${total} ingredients`);
console.log(`  Built:    ${built} pages`);
console.log(`  Pending:  ${pending} in queue`);
console.log(`  Failed:   ${failed} (will retry on next run)`);

if (built > 0) {
  const atRate  = 3;
  const perDay  = atRate * 6; // 6 runs per day (every 4h)
  const daysLeft = Math.ceil(pending / perDay);
  console.log(`\n  At 3 pages / 4 hours → ~${daysLeft} days to complete all 312`);
}

console.log('\n  Next in queue:');
queue.slice(0, 5).forEach(i => console.log(`    ${i.slug.padEnd(50)} ${i.cat}`));

if (failed > 0) {
  console.log(`\n  Recent failures:`);
  (progress.failed || []).slice(-3).forEach(f =>
    console.log(`    ${f.slug}: ${f.error?.slice(0,80)}`)
  );
}

console.log('');

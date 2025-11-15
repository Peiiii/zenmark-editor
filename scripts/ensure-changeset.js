#!/usr/bin/env node
/**
 * Ensure there is at least one pending changeset.
 * If none exists, create a default patch changeset for zenmark-editor.
 */
const fs = require('fs');
const path = require('path');

const repoRoot = process.cwd();
const changesetDir = path.join(repoRoot, '.changeset');

function hasPendingChangeset() {
  if (!fs.existsSync(changesetDir)) return false;
  const files = fs.readdirSync(changesetDir);
  return files.some((f) => f.endsWith('.md'));
}

function getPackageName() {
  const pkgPath = path.join(repoRoot, 'packages', 'zenmark-editor', 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  return pkg.name || 'zenmark-editor';
}

function createPatchChangeset(pkgName) {
  if (!fs.existsSync(changesetDir)) {
    fs.mkdirSync(changesetDir, { recursive: true });
  }
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const file = path.join(changesetDir, `auto-release-${stamp}.md`);
  const content = `---\n"${pkgName}": patch\n---\n\nAuto release.\n`;
  fs.writeFileSync(file, content, 'utf8');
  return file;
}

(function main() {
  try {
    if (hasPendingChangeset()) {
      console.log('[ensure-changeset] Found pending changeset, skip creating.');
      process.exit(0);
    }
    const name = getPackageName();
    const file = createPatchChangeset(name);
    console.log(`[ensure-changeset] Created changeset: ${path.relative(repoRoot, file)}`);
  } catch (err) {
    console.error('[ensure-changeset] Failed:', err);
    process.exit(1);
  }
})();


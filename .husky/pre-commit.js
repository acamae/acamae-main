import { execSync } from 'child_process';

try {
  // Get commit message
  const commitMsg = execSync('git log -1 --pretty=%B').toString().trim();
  console.log('Commit message:', commitMsg);

  // Skip for Lerna version commits (detect 'chore(release):')
  if (/^chore\(release\):/i.test(commitMsg)) {
    console.log('⏩ Pre-commit hook skipped for Lerna version commit.');
    process.exit(0);
  }
} catch (error) {
  console.error('❌ Pre-commit hook failed:', error.message);
  process.exit(1);
}

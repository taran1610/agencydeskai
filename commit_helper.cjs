const { execSync } = require('child_process');

try {
  console.log('Staging changes...');
  execSync('git add -A', { stdio: 'inherit' });
  console.log('Committing changes...');
  execSync('git commit -m "Add interactive video demo player with chapter navigation and sandbox toggle"', { stdio: 'inherit' });
  console.log('Pushing to main...');
  execSync('git push origin main', { stdio: 'inherit' });
  console.log('Done!');
} catch (err) {
  console.error(err);
  process.exit(1);
}

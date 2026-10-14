const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const frontendDir = path.join(rootDir, 'Realestate');

console.log('===> Step 1: Installing frontend dependencies in Realestate...');
execSync('npm install', { cwd: frontendDir, stdio: 'inherit' });

console.log('===> Step 2: Building frontend with Vite / Nitro...');
execSync('npm run build', { cwd: frontendDir, stdio: 'inherit' });

console.log('===> Step 3: Syncing build artifacts to root for Vercel...');
const vercelSource = path.join(frontendDir, '.vercel');
const vercelDest = path.join(rootDir, '.vercel');
if (fs.existsSync(vercelSource)) {
  fs.cpSync(vercelSource, vercelDest, { recursive: true, force: true });
  console.log('✓ Successfully copied Realestate/.vercel to root .vercel');
}

const outputSource = path.join(frontendDir, '.output');
const outputDest = path.join(rootDir, '.output');
if (fs.existsSync(outputSource)) {
  fs.cpSync(outputSource, outputDest, { recursive: true, force: true });
  console.log('✓ Successfully copied Realestate/.output to root .output');
}

const distSource = path.join(frontendDir, 'dist');
const distDest = path.join(rootDir, 'dist');
if (fs.existsSync(distSource)) {
  fs.cpSync(distSource, distDest, { recursive: true, force: true });
  console.log('✓ Successfully copied Realestate/dist to root dist');
}

console.log('===> Build script completed successfully!');

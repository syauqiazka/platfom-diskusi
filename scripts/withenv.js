#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });
const { execSync } = require('child_process');

const cmd = process.argv.slice(2).join(' ');
try {
  execSync(cmd, { stdio: 'inherit' });
} catch (error) {
  process.exit(1);
}

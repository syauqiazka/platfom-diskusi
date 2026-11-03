#!/usr/bin/env node
import dotenv from 'dotenv';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const cmd = process.argv.slice(2).join(' ');
try {
  execSync(cmd, { stdio: 'inherit' });
} catch (error) {
  process.exit(1);
}

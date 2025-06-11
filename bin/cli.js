#!/usr/bin/env node
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Only output errors to stderr, keep stdout clean for MCP communication
const serverRoot = path.join(__dirname, '..');
const entryPoint = path.join(serverRoot, 'dist', 'index.js');

if (!fs.existsSync(entryPoint)) {
  console.error('Error: dist/index.js not found. The package may not have been built correctly.');
  console.error('Please ensure you have run the build step if installing from a local source.');
  process.exit(1);
}

// Parse command line arguments
const args = process.argv.slice(2);

// Warn about missing API token to stderr (not stdout) only if no token provided via args
const hasTokenArg = args.includes('--token') || args.includes('-t');
const isHelpRequest = args.includes('--help') || args.includes('-h');

if (!hasTokenArg && !process.env.USER_API_TOKEN && !isHelpRequest) {
    console.error('Warning: No API token provided via --token argument or USER_API_TOKEN environment variable.');
    console.error('The MCP server may not function correctly without it.');
    console.error('Use --help for more information.');
}

// Start the actual MCP server process with proper stdio inheritance and pass through all arguments
const child = spawn('node', [entryPoint, ...args], {
  cwd: serverRoot,
  env: process.env,
  stdio: ['inherit', 'inherit', 'inherit'] // Inherit all stdio streams
});

// Handle process termination
child.on('close', (code) => {
  process.exit(code);
});

child.on('error', (err) => {
  console.error('Failed to start MCP server:', err);
  process.exit(1);
});

// Ensure proper cleanup on parent process termination
process.on('SIGINT', () => child.kill('SIGINT'));
process.on('SIGTERM', () => child.kill('SIGTERM')); 
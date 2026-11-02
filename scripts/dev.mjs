import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { readFile } from 'node:fs/promises';

const processes = [];
let stopping = false;

function stopAll(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of processes) if (child.exitCode === null) child.kill('SIGTERM');
  process.exitCode = code;
}

function portAvailable(port) {
  return new Promise((resolve) => {
    const probe = createServer();
    probe.once('error', () => resolve(false));
    probe.listen(port, '0.0.0.0', () => probe.close(() => resolve(true)));
  });
}

async function healthCheck(port) {
  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/health`, { signal: AbortSignal.timeout(1000) });
    if (!response.ok) return false;
    const health = await response.json();
    return health.status === 'ok' && health.assistant === 'Orchid AI';
  } catch {
    return false;
  }
}

function start(command, args, env = process.env) {
  const child = spawn(command, args, { stdio: 'inherit', env });
  processes.push(child);
  child.on('error', (error) => {
    console.error('Could not start a development service:', error.message);
    stopAll(1);
  });
  child.on('exit', (code) => {
    if (!stopping) stopAll(code ?? 1);
  });
  return child;
}

async function configuredApiPort() {
  if (process.env.PORT && /^\d+$/.test(process.env.PORT)) return Number(process.env.PORT);
  try {
    const envText = await readFile('orchiai/.env', 'utf8');
    const match = envText.match(/^\s*PORT\s*=\s*(\d+)\s*$/m);
    if (match) return Number(match[1]);
  } catch {}
  return 8789;
}

const preferredApiPort = await configuredApiPort();
let apiPort = preferredApiPort;
if (await healthCheck(apiPort)) {
  console.log(`Reusing the healthy OrchiVoice API on http://127.0.0.1:${apiPort}`);
} else {
  while (!(await portAvailable(apiPort))) apiPort += 1;
  if (apiPort !== preferredApiPort) console.log(`API port ${preferredApiPort} is occupied; using ${apiPort} instead.`);
  const apiEnv = { ...process.env, PORT: String(apiPort) };
  start(process.execPath, ['--env-file-if-exists=orchiai/.env', 'orchiai/backend/src/server.js'], apiEnv);
}

const viteEnv = { ...process.env, ORCHID_API_PORT: String(apiPort) };
start(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '0.0.0.0', '--port', '5174'], viteEnv);

process.on('SIGINT', () => stopAll(0));
process.on('SIGTERM', () => stopAll(0));

import { cp, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assistantBuild = path.join(projectRoot, 'orchiai', 'dist');
const publicAssistant = path.join(projectRoot, 'public', 'orchivoice');

await mkdir(publicAssistant, { recursive: true });
await cp(assistantBuild, publicAssistant, { recursive: true, force: true });
console.log('Synced OrchiVoice build to public/orchivoice.');

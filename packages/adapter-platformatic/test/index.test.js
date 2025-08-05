import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import { join } from 'node:path';
import adapter from '../index.js';

test('adapter exposes correct name', () => {
  assert.equal(adapter().name, '@sveltejs/adapter-platformatic');
});

test('adapt writes handler and index files', async () => {
  const tmp = await mkdtemp(join(os.tmpdir(), 'adapter-'));
  const builder = {
    getBuildDirectory () { return tmp; },
    log: { minor () {} },
    async writeClient (dir) { await mkdir(dir, { recursive: true }); },
    async writeServer (dir) {
      await mkdir(dir, { recursive: true });
      await writeFile(join(dir, 'index.js'), 'export class Server {}');
      await writeFile(join(dir, 'manifest.js'), 'export const manifest = {};');
    },
    async writePrerendered (dir) { await mkdir(dir, { recursive: true }); }
  };

  await adapter().adapt(builder);
  const indexContent = await readFile(join(tmp, 'build', 'index.js'), 'utf8');
  const handlerContent = await readFile(join(tmp, 'build', 'handler.js'), 'utf8');
  assert.match(indexContent, /process\.env\.PORT/);
  assert.match(handlerContent, /export async function handler/);
  await rm(tmp, { recursive: true, force: true });
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import os from 'node:os';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const cp = require('node:child_process');

test('dev mode spawns svelte-kit dev', async () => {
  process.env.NODE_ENV = 'development';
  const calls = [];
  const originalSpawn = cp.spawn;
  cp.spawn = (cmd, args, opts) => {
    calls.push({ cmd, args, opts });
    return { kill () {} };
  };
  const app = { addHook () {} };
  const tmp = await mkdtemp(join(os.tmpdir(), 'sveltekit-'));
  const plugin = (await import('../lib/index.js')).default;
  await plugin(app, { root: tmp });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].cmd, 'npx');
  assert.deepEqual(calls[0].args.slice(0, 3), ['svelte-kit', 'dev', '--port']);
  cp.spawn = originalSpawn;
  await rm(tmp, { recursive: true, force: true });
});

test('production mode registers handler route', async () => {
  process.env.NODE_ENV = 'production';
  const tmp = await mkdtemp(join(os.tmpdir(), 'sveltekit-'));
  await mkdir(join(tmp, 'build'), { recursive: true });
  await writeFile(join(tmp, 'build', 'handler.js'), `
    globalThis.__called = false;
    export async function handler () { globalThis.__called = true; }
  `);

  let registered;
  const app = {
    addHook () {},
    all: (route, fn) => { registered = fn; }
  };

  const plugin = (await import('../lib/index.js')).default;
  await plugin(app, { root: tmp });
  const req = { raw: {} };
  const reply = { raw: {}, sent: false };
  await registered(req, reply);
  assert.equal(globalThis.__called, true);
  assert.equal(reply.sent, true);
  await rm(tmp, { recursive: true, force: true });
});

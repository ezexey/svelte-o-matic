import { describe, it, before, after, mock } from 'node:test';
import assert from 'node:assert';
import { delay } from '../src/utils/polly';

describe('polly', () => {
  it('should wait for a specified duration', async () => {
    const start = Date.now();
    await delay(100);
    const duration = Date.now() - start;
    assert.ok(duration >= 100, 'Expected delay to be at least 100ms');
  });
});

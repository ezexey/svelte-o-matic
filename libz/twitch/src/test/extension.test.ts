import { describe, it, before, after, mock } from 'node:test';
import assert from 'node:assert';
import { EventEmitter } from '../core/EventEmitter';
import { StateManager } from '../core/StateManager';
import { decodeJWT, isTokenExpired } from '../utils/jwt';

describe('EventEmitter', () => {
  it('should emit and listen to events', () => {
    const emitter = new EventEmitter();
    let called = false;
    
    emitter.on('test', () => {
      called = true;
    });
    
    emitter.emit('test');
    assert.strictEqual(called, true);
  });

  it('should handle once listeners', () => {
    const emitter = new EventEmitter();
    let count = 0;
    
    emitter.once('test', () => {
      count++;
    });
    
    emitter.emit('test');
    emitter.emit('test');
    assert.strictEqual(count, 1);
  });

  it('should remove listeners', () => {
    const emitter = new EventEmitter();
    let called = false;
    
    const listener = () => {
      called = true;
    };
    
    emitter.on('test', listener);
    emitter.off('test', listener);
    emitter.emit('test');
    
    assert.strictEqual(called, false);
  });
});

describe('StateManager', () => {
  it('should get and set state', () => {
    const state = new StateManager();
    
    state.set('key', 'value');
    assert.strictEqual(state.get('key'), 'value');
  });

  it('should notify listeners on state change', () => {
    const state = new StateManager();
    let newVal, oldVal;
    
    state.subscribe('key', (n, o) => {
      newVal = n;
      oldVal = o;
    });
    
    state.set('key', 'value');
    
    assert.strictEqual(newVal, 'value');
    assert.strictEqual(oldVal, undefined);
  });

  it('should update state with function', () => {
    const state = new StateManager();
    
    state.set('counter', 0);
    state.update<number>('counter', (prev) => (prev || 0) + 1);
    
    assert.strictEqual(state.get('counter'), 1);
  });
});

describe('JWT Utils', () => {
  it('should decode valid JWT', () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDAwMDAwMDAsIm9wYXF1ZV91c2VyX2lkIjoiVTEyMzQ1Njc4OSIsImNoYW5uZWxfaWQiOiIxMjM0NTY3ODkiLCJyb2xlIjoidmlld2VyIn0.test';
    
    const payload = decodeJWT(token);
    assert.strictEqual(payload?.channel_id, '123456789');
    assert.strictEqual(payload?.role, 'viewer');
  });

  it('should handle invalid JWT', () => {
    const payload = decodeJWT('invalid');
    assert.strictEqual(payload, null);
  });

  it('should check token expiration', () => {
    const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MDAwMDAwMDB9.test';
    assert.strictEqual(isTokenExpired(expiredToken), true);
  });
});

#!/bin/bash

# Twitch Extension TypeScript Library Setup Script
# This script creates the complete project structure with all files

PROJECT_NAME="twitch-ext-lib"
echo "🚀 Creating Twitch Extension Library: $PROJECT_NAME"

# Create project directory
mkdir -p $PROJECT_NAME
cd $PROJECT_NAME

# Create directory structure
mkdir -p src/{core,types,utils,test}
mkdir -p public

echo "📁 Creating directory structure..."

# Create package.json
cat > package.json << 'EOF'
{
  "name": "twitch-ext-lib",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "node --test",
    "dev": "tsc --watch",
    "clean": "rm -rf dist"
  },
  "keywords": ["twitch", "extension", "typescript", "twitch-ext"],
  "author": "",
  "license": "MIT",
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
EOF

# Create tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "lib": ["ES2022", "DOM"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "removeComments": false
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
node_modules/
dist/
*.log
.DS_Store
.env
.vscode/
.idea/
*.map
*.d.ts.map
coverage/
.npm
.yarn-integrity
EOF

# Create README.md
cat > README.md << 'EOF'
# Twitch Extension TypeScript Library

A minimal, zero-dependency TypeScript library for building Twitch Extensions.

## Features

- 🎯 Complete TypeScript type definitions
- 🚀 Zero external dependencies 
- 📦 Event-driven architecture
- 💾 State management system
- 🔐 JWT utilities
- 📡 PubSub helpers
- 🧪 Built-in testing with node:test

## Installation

```bash
npm install
npm run build
```

## Quick Start

```typescript
import TwitchExt from './dist/index.js';

// Wait for extension to initialize
TwitchExt.on('ready', (auth) => {
  console.log('Extension authorized:', auth);
  
  // Check user role
  if (TwitchExt.isBroadcaster()) {
    console.log('User is the broadcaster');
  }
  
  // Send PubSub message
  TwitchExt.broadcast('update', { data: 'Hello viewers!' });
});

// Async initialization
const auth = await TwitchExt.waitForReady();
```

## API Reference

### Core Classes

- `TwitchExtension` - Main extension singleton
- `EventEmitter` - Event system
- `StateManager` - State management
- `PubSubManager` - PubSub utilities
- `EBSClient` - Backend communication

### Events

- `ready` - Extension authorized
- `context` - Context updated
- `configuration` - Config changed
- `visibility` - Visibility changed
- `error` - Error occurred

## Development

```bash
npm run dev    # Watch mode
npm test       # Run tests
npm run build  # Production build
```

## License

MIT
EOF

# Create src/types/twitch.d.ts
cat > src/types/twitch.d.ts << 'EOF'
declare global {
  interface Window {
    Twitch: {
      ext: TwitchExtensionHelper;
    };
  }
}

export interface TwitchExtensionHelper {
  onAuthorized: (callback: AuthorizedCallback) => void;
  onContext: (callback: ContextCallback) => void;
  onError: (callback: ErrorCallback) => void;
  onHighlightChanged: (callback: HighlightCallback) => void;
  onPositionChanged: (callback: PositionCallback) => void;
  onVisibilityChanged: (callback: VisibilityCallback) => void;
  configuration: Configuration;
  viewer: Viewer;
  features: Features;
  actions: Actions;
  rig: Rig;
  bits: Bits;
  pubsub: PubSub;
}

export type AuthorizedCallback = (auth: AuthData) => void;
export type ContextCallback = (context: Context) => void;
export type ErrorCallback = (error: string) => void;
export type HighlightCallback = (highlighted: boolean) => void;
export type PositionCallback = (position: Position) => void;
export type VisibilityCallback = (isVisible: boolean, context: VisibilityContext) => void;

export interface AuthData {
  token: string;
  userId: string;
  channelId: string;
  helixToken: string;
  clientId: string;
}

export interface Context {
  arePlayerControlsVisible: boolean;
  bitrate: number;
  bufferSize: number;
  displayResolution: string;
  game: string;
  hlsLatencyBroadcaster: number;
  hostingInfo?: HostingInfo;
  isFullScreen: boolean;
  isMuted: boolean;
  isPaused: boolean;
  isTheatreMode: boolean;
  language: string;
  mode: 'viewer' | 'dashboard' | 'config';
  playbackMode: 'video' | 'audio' | 'remote' | 'chat-only';
  theme: 'light' | 'dark';
  videoResolution: string;
  volume: number;
}

export interface Configuration {
  broadcaster?: ConfigurationObject;
  developer?: ConfigurationObject;
  global?: ConfigurationObject;
  onChanged: (callback: () => void) => void;
  set: (segment: 'broadcaster' | 'developer' | 'global', version: string, content: string) => void;
}

export interface ConfigurationObject {
  version: string;
  content: string;
}

export interface Viewer {
  id: string;
  isLinked: boolean;
  opaqueId: string;
  role: 'broadcaster' | 'moderator' | 'viewer' | 'external';
  sessionToken: string;
  subscriptionStatus?: SubscriptionStatus;
  onChanged: (callback: () => void) => void;
}

export interface SubscriptionStatus {
  tier: '1000' | '2000' | '3000' | 'prime';
}

export interface Features {
  isBitsEnabled: boolean;
  isChatEnabled: boolean;
  isSubscriptionStatusAvailable: boolean;
  onChanged: (callback: (changed: string[]) => void) => void;
}

export interface Actions {
  followChannel: (channelName: string) => void;
  minimize: () => void;
  onFollow: (callback: (didFollow: boolean, channelName: string) => void) => void;
  requestIdShare: () => void;
}

export interface Bits {
  getProducts: () => Promise<BitsProduct[]>;
  onTransactionComplete: (callback: (transaction: BitsTransaction) => void) => void;
  onTransactionCancelled: (callback: () => void) => void;
  setUseLoopback: (useLoopback: boolean) => void;
  showBitsBalance: () => void;
  useBits: (sku: string) => void;
}

export interface BitsProduct {
  sku: string;
  cost: { amount: string; type: 'bits' };
  displayName: string;
  inDevelopment?: boolean;
}

export interface BitsTransaction {
  transactionID: string;
  product: BitsProduct;
  userId: string;
  transactionReceipt: string;
  displayName: string;
  initiator: 'CURRENT_USER' | 'OTHER';
}

export interface PubSub {
  listen: (target: string, callback: PubSubCallback) => void;
  unlisten: (target: string, callback: PubSubCallback) => void;
  send: (target: string, contentType: string, message: object | string) => void;
}

export type PubSubCallback = (target: string, contentType: string, message: string) => void;

export interface Position {
  x: number;
  y: number;
}

export interface VisibilityContext {
  isChannelPage: boolean;
  isLive: boolean;
  isVod: boolean;
}

export interface HostingInfo {
  hostedChannelId: string;
  hostingChannelId: string;
}

export interface Rig {
  log: (message: string) => void;
}
EOF

# Create src/core/EventEmitter.ts
cat > src/core/EventEmitter.ts << 'EOF'
export type EventListener = (...args: any[]) => void;

export class EventEmitter {
  private events: Map<string, Set<EventListener>> = new Map();

  on(event: string, listener: EventListener): this {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(listener);
    return this;
  }

  once(event: string, listener: EventListener): this {
    const onceWrapper = (...args: any[]) => {
      listener(...args);
      this.off(event, onceWrapper);
    };
    return this.on(event, onceWrapper);
  }

  off(event: string, listener: EventListener): this {
    const listeners = this.events.get(event);
    if (listeners) {
      listeners.delete(listener);
      if (listeners.size === 0) {
        this.events.delete(event);
      }
    }
    return this;
  }

  emit(event: string, ...args: any[]): boolean {
    const listeners = this.events.get(event);
    if (!listeners || listeners.size === 0) return false;
    
    listeners.forEach(listener => {
      try {
        listener(...args);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    });
    return true;
  }

  removeAllListeners(event?: string): this {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
    return this;
  }

  listenerCount(event: string): number {
    return this.events.get(event)?.size || 0;
  }
}
EOF

# Create src/core/TwitchExtension.ts
cat > src/core/TwitchExtension.ts << 'EOF'
import { EventEmitter } from './EventEmitter.js';
import type { 
  TwitchExtensionHelper, 
  AuthData, 
  Context, 
  Viewer, 
  Features, 
  Actions, 
  Bits, 
  Configuration,
  PubSub,
  Rig
} from '../types/twitch.js';

export class TwitchExtension extends EventEmitter {
  private static instance: TwitchExtension | null = null;
  private helper: TwitchExtensionHelper;
  private authData: AuthData | null = null;
  private context: Context | null = null;
  private isReady = false;
  private readyPromise: Promise<AuthData>;
  private readyResolve!: (auth: AuthData) => void;

  private constructor() {
    super();
    
    if (typeof window === 'undefined' || !window.Twitch?.ext) {
      throw new Error('Twitch Extension Helper not found');
    }
    
    this.helper = window.Twitch.ext;
    this.readyPromise = new Promise(resolve => {
      this.readyResolve = resolve;
    });
    
    this.initialize();
  }

  static getInstance(): TwitchExtension {
    if (!TwitchExtension.instance) {
      TwitchExtension.instance = new TwitchExtension();
    }
    return TwitchExtension.instance;
  }

  private initialize(): void {
    this.helper.onAuthorized((auth) => {
      this.authData = auth;
      this.isReady = true;
      this.emit('authorized', auth);
      this.emit('ready', auth);
      this.readyResolve(auth);
    });

    this.helper.onContext((context) => {
      const previousContext = this.context;
      this.context = context;
      this.emit('context', context, previousContext);
    });

    this.helper.onError((error) => {
      this.emit('error', new Error(error));
    });

    this.helper.onVisibilityChanged((isVisible, context) => {
      this.emit('visibility', isVisible, context);
    });

    this.helper.onHighlightChanged((highlighted) => {
      this.emit('highlight', highlighted);
    });

    this.helper.onPositionChanged((position) => {
      this.emit('position', position);
    });

    if (this.helper.configuration.onChanged) {
      this.helper.configuration.onChanged(() => {
        this.emit('configurationChanged', this.helper.configuration);
      });
    }

    if (this.helper.viewer.onChanged) {
      this.helper.viewer.onChanged(() => {
        this.emit('viewerChanged', this.helper.viewer);
      });
    }

    if (this.helper.features.onChanged) {
      this.helper.features.onChanged((changed) => {
        this.emit('featuresChanged', changed);
      });
    }
  }

  get auth(): AuthData | null { return this.authData; }
  get currentContext(): Context | null { return this.context; }
  get viewer(): Viewer { return this.helper.viewer; }
  get features(): Features { return this.helper.features; }
  get actions(): Actions { return this.helper.actions; }
  get bits(): Bits { return this.helper.bits; }
  get configuration(): Configuration { return this.helper.configuration; }
  get pubsub(): PubSub { return this.helper.pubsub; }
  get rig(): Rig { return this.helper.rig; }
  get ready(): boolean { return this.isReady; }

  async waitForReady(): Promise<AuthData> {
    return this.readyPromise;
  }

  log(message: string, ...args: any[]): void {
    if (this.helper.rig) {
      this.helper.rig.log(`[Extension] ${message} ${args.join(' ')}`);
    } else {
      console.log(`[Extension] ${message}`, ...args);
    }
  }

  getJWTPayload(): any | null {
    if (!this.authData?.token) return null;
    try {
      const parts = this.authData.token.split('.');
      if (parts.length !== 3) return null;
      return JSON.parse(atob(parts[1]));
    } catch (error) {
      this.log('Failed to decode JWT', error);
      return null;
    }
  }

  isTokenExpired(): boolean {
    const payload = this.getJWTPayload();
    if (!payload?.exp) return true;
    return Date.now() >= payload.exp * 1000;
  }

  isBroadcaster(): boolean {
    return this.viewer.role === 'broadcaster';
  }

  isModerator(): boolean {
    return this.viewer.role === 'moderator' || this.isBroadcaster();
  }

  getConfig(segment: 'broadcaster' | 'developer' | 'global'): any {
    const config = this.configuration[segment];
    if (!config?.content) return null;
    
    try {
      return JSON.parse(config.content);
    } catch {
      return config.content;
    }
  }

  setConfig(segment: 'broadcaster' | 'developer' | 'global', content: any, version: string = '1.0'): void {
    const data = typeof content === 'string' ? content : JSON.stringify(content);
    this.configuration.set(segment, version, data);
  }

  broadcast(contentType: string, message: any): void {
    this.pubsub.send('broadcast', contentType, message);
  }

  whisper(userId: string, contentType: string, message: any): void {
    this.pubsub.send(`whisper-${userId}`, contentType, message);
  }

  listenBroadcast(callback: (contentType: string, message: string) => void): void {
    this.pubsub.listen('broadcast', (target, contentType, message) => {
      callback(contentType, message);
    });
  }

  listenWhisper(callback: (contentType: string, message: string) => void): void {
    const target = `whisper-${this.authData?.userId}`;
    this.pubsub.listen(target, (_, contentType, message) => {
      callback(contentType, message);
    });
  }
}
EOF

# Create src/core/StateManager.ts
cat > src/core/StateManager.ts << 'EOF'
export type StateListener<T> = (newValue: T, oldValue: T) => void;
export type StateUnsubscribe = () => void;

export class StateManager {
  private state: Map<string, any> = new Map();
  private listeners: Map<string, Set<StateListener<any>>> = new Map();

  get<T>(key: string): T | undefined {
    return this.state.get(key);
  }

  set<T>(key: string, value: T): void {
    const oldValue = this.state.get(key);
    this.state.set(key, value);
    this.notifyListeners(key, value, oldValue);
  }

  update<T>(key: string, updater: (prev: T | undefined) => T): void {
    const oldValue = this.state.get(key);
    const newValue = updater(oldValue);
    this.set(key, newValue);
  }

  delete(key: string): boolean {
    const oldValue = this.state.get(key);
    const result = this.state.delete(key);
    if (result) {
      this.notifyListeners(key, undefined, oldValue);
    }
    return result;
  }

  subscribe<T>(key: string, listener: StateListener<T>): StateUnsubscribe {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(listener);

    return () => {
      const keyListeners = this.listeners.get(key);
      if (keyListeners) {
        keyListeners.delete(listener);
        if (keyListeners.size === 0) {
          this.listeners.delete(key);
        }
      }
    };
  }

  private notifyListeners(key: string, newValue: any, oldValue: any): void {
    const keyListeners = this.listeners.get(key);
    if (keyListeners) {
      keyListeners.forEach(listener => {
        try {
          listener(newValue, oldValue);
        } catch (error) {
          console.error(`Error in state listener for ${key}:`, error);
        }
      });
    }
  }

  clear(): void {
    this.state.clear();
    this.listeners.clear();
  }

  toObject(): Record<string, any> {
    return Object.fromEntries(this.state);
  }
}
EOF

# Create src/utils/jwt.ts
cat > src/utils/jwt.ts << 'EOF'
export interface JWTPayload {
  exp: number;
  opaque_user_id: string;
  user_id?: string;
  channel_id: string;
  role: 'broadcaster' | 'moderator' | 'viewer' | 'external';
  pubsub_perms: {
    listen: string[];
    send: string[];
  };
}

export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }
    
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload) return true;
  
  const now = Date.now() / 1000;
  return now >= payload.exp;
}

export function getTokenTimeRemaining(token: string): number {
  const payload = decodeJWT(token);
  if (!payload) return 0;
  
  const now = Date.now() / 1000;
  return Math.max(0, payload.exp - now);
}
EOF

# Create src/utils/pubsub.ts
cat > src/utils/pubsub.ts << 'EOF'
import type { PubSub } from '../types/twitch.js';

export class PubSubManager {
  private listeners: Map<string, Set<(contentType: string, message: any) => void>> = new Map();
  private pubsub: PubSub;

  constructor(pubsub: PubSub) {
    this.pubsub = pubsub;
  }

  broadcast(contentType: string, message: any): void {
    this.send('broadcast', contentType, message);
  }

  whisper(userId: string, contentType: string, message: any): void {
    this.send(`whisper-${userId}`, contentType, message);
  }

  global(contentType: string, message: any): void {
    this.send('global', contentType, message);
  }

  send(target: string, contentType: string, message: any): void {
    const data = typeof message === 'string' ? message : JSON.stringify(message);
    this.pubsub.send(target, contentType, data);
  }

  listen(target: string, callback: (contentType: string, message: any) => void): () => void {
    const wrapper = (_: string, contentType: string, message: string) => {
      try {
        const parsed = JSON.parse(message);
        callback(contentType, parsed);
      } catch {
        callback(contentType, message);
      }
    };

    if (!this.listeners.has(target)) {
      this.listeners.set(target, new Set());
    }
    this.listeners.get(target)!.add(callback);

    this.pubsub.listen(target, wrapper);

    return () => {
      this.pubsub.unlisten(target, wrapper);
      const targetListeners = this.listeners.get(target);
      if (targetListeners) {
        targetListeners.delete(callback);
        if (targetListeners.size === 0) {
          this.listeners.delete(target);
        }
      }
    };
  }
}
EOF

# Create src/utils/storage.ts
cat > src/utils/storage.ts << 'EOF'
export class ExtensionStorage {
  private prefix: string;

  constructor(prefix = 'twitch-ext') {
    this.prefix = prefix;
  }

  private getKey(key: string): string {
    return `${this.prefix}:${key}`;
  }

  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.getKey(key));
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(this.getKey(key), JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  remove(key: string): void {
    localStorage.removeItem(this.getKey(key));
  }

  clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix + ':')) {
        localStorage.removeItem(key);
      }
    });
  }
}
EOF

# Create src/utils/api.ts
cat > src/utils/api.ts << 'EOF'
export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

export class EBSClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string) {
    this.baseURL = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  setAuthToken(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeout = config.timeout || 10000;

    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method: config.method || 'GET',
        headers: {
          ...this.defaultHeaders,
          ...config.headers,
        },
        body: config.body ? JSON.stringify(config.body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  post<T>(endpoint: string, body?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body });
  }

  put<T>(endpoint: string, body?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body });
  }

  delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}
EOF

# Create src/index.ts
cat > src/index.ts << 'EOF'
export { TwitchExtension } from './core/TwitchExtension.js';
export { EventEmitter } from './core/EventEmitter.js';
export { StateManager } from './core/StateManager.js';
export { PubSubManager } from './utils/pubsub.js';
export { ExtensionStorage } from './utils/storage.js';
export { EBSClient } from './utils/api.js';
export * from './utils/jwt.js';
export * from './types/twitch.js';

// Default export for convenience
import { TwitchExtension } from './core/TwitchExtension.js';
export default TwitchExtension.getInstance();
EOF

# Create src/test/extension.test.ts
cat > src/test/extension.test.ts << 'EOF'
import { describe, it, before, after, mock } from 'node:test';
import assert from 'node:assert';
import { EventEmitter } from '../core/EventEmitter.js';
import { StateManager } from '../core/StateManager.js';
import { decodeJWT, isTokenExpired } from '../utils/jwt.js';

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
    state.update('counter', (prev) => (prev || 0) + 1);
    
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
EOF

# Create public/index.html
cat > public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Twitch Extension</title>
  <script src="https://extension-files.twitch.tv/helper/v1/twitch-ext.min.js"></script>
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: transparent;
    }
    .container {
      max-width: 100%;
      margin: 0 auto;
    }
    .status {
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 10px;
    }
    .ready { background: #4CAF50; color: white; }
    .loading { background: #FFC107; }
    .info { margin: 10px 0; }
    .label { font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div id="status" class="status loading">Loading Extension...</div>
    <div id="info"></div>
  </div>

  <script type="module">
    import TwitchExt from '../dist/index.js';
    
    const statusEl = document.getElementById('status');
    const infoEl = document.getElementById('info');
    
    // Wait for extension to be ready
    TwitchExt.on('ready', (auth) => {
      statusEl.className = 'status ready';
      statusEl.textContent = 'Extension Ready!';
      
      const info = `
        <div class="info">
          <span class="label">Channel ID:</span> ${auth.channelId}
        </div>
        <div class="info">
          <span class="label">User Role:</span> ${TwitchExt.viewer.role}
        </div>
        <div class="info">
          <span class="label">Theme:</span> ${TwitchExt.currentContext?.theme || 'unknown'}
        </div>
        <div class="info">
          <span class="label">Broadcaster:</span> ${TwitchExt.isBroadcaster() ? 'Yes' : 'No'}
        </div>
      `;
      
      infoEl.innerHTML = info;
    });
    
    // Listen for context changes
    TwitchExt.on('context', (context) => {
      console.log('Context updated:', context);
    });
    
    // Listen for configuration changes
    TwitchExt.on('configurationChanged', (config) => {
      console.log('Configuration changed:', config);
    });
    
    // Error handling
    TwitchExt.on('error', (error) => {
      console.error('Extension error:', error);
      statusEl.textContent = 'Error: ' + error.message;
    });
  </script>
</body>
</html>
EOF

echo "✨ Project created successfully!"
echo ""
echo "📦 Next steps:"
echo "  cd $PROJECT_NAME"
echo "  npm install"
echo "  npm run build"
echo ""
echo "🚀 To start development:"
echo "  npm run dev"
echo ""
echo "🧪 To run tests:"
echo "  npm test"
echo ""
echo "📁 Project structure:"
echo "  src/           - TypeScript source files"
echo "  ├── core/      - Core extension classes"
echo "  ├── types/     - TypeScript type definitions"
echo "  ├── utils/     - Utility functions"
echo "  └── test/      - Test files"
echo "  public/        - HTML files"
echo "  dist/          - Compiled JavaScript (after build)"
echo ""
echo "🎉 Happy coding!"
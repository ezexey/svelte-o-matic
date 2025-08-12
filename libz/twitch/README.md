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

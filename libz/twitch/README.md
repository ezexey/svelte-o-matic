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

``` ts
// ============================================
// Example: Bridging EventSub from EBS to Extension
// ============================================
/*

// === BACKEND (EBS) CODE ===
// This runs on your server, not in the browser

import { EventSub } from './EventSub';
import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();
const eventSub = new EventSub(ACCESS_TOKEN, CLIENT_ID);

// Connect to EventSub WebSocket
await eventSub.connect();

// Subscribe to events
await eventSub.subscribe({
  type: 'channel.subscribe',
  version: '1',
  condition: {
    broadcaster_user_id: BROADCASTER_ID
  }
});

// Forward EventSub events to the extension via your EBS
eventSub.on('channel.subscribe', async (event) => {
  // Send to your extension via your EBS API
  // The extension will receive this via EBS polling or WebSocket
  await sendToExtension(event);
});

// === FRONTEND (EXTENSION) CODE ===
// This runs in the browser extension

import { Extension } from './Extension';
import { ExtensionMessaging } from './ExtensionMessaging';

const ext = Extension.I;

// Wait for authentication
await ext.waitForAuth();

// Set up messaging
const messaging = new ExtensionMessaging(ext.helper);

// Listen to broadcast messages from the broadcaster
messaging.listenToBroadcast();

// Handle EventSub events relayed from your EBS
messaging.on('eventsub-event', (data) => {
  console.log('Received EventSub event from EBS:', data);
  
  // Handle different event types
  switch(data.type) {
    case 'channel.subscribe':
      handleNewSubscriber(data.event);
      break;
    case 'channel.cheer':
      handleCheer(data.event);
      break;
  }
});

// Poll your EBS for EventSub events
setInterval(async () => {
  try {
    const events = await ext.ebsRequest('https://your-ebs.com/api/events');
    events.forEach(event => {
      messaging.emit('eventsub-event', event);
    });
  } catch (error) {
    console.error('Failed to fetch events from EBS:', error);
  }
}, 5000);

// If broadcaster, can send messages directly
if (ext.isBroadcaster()) {
  messaging.sendBroadcast('notification', {
    message: 'Welcome to the stream!'
  });
}

*/
```
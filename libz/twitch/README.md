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

// ============================================
// src/utils/pubsub-migration.ts - Migration Helper
// ============================================
import { EventSubManager } from '../core/EventSubManager.js';
import { EventSubTopicType } from '../types/eventsub.js';

/**
 * Helper class to migrate from PubSub to EventSub
 */
export class PubSubMigration {
  private static topicMapping: Map<string, EventSubTopicType> = new Map([
    // Bits events
    ['channel-bits-events-v1', EventSubTopicType.CHANNEL_CHEER],
    ['channel-bits-events-v2', EventSubTopicType.CHANNEL_CHEER],
    ['channel-bits-badge-unlocks', EventSubTopicType.CHANNEL_CHAT_NOTIFICATION],
    
    // Channel Points
    ['channel-points-channel-v1', EventSubTopicType.CHANNEL_POINTS_CUSTOM_REWARD_REDEMPTION_ADD],
    
    // Subscriptions
    ['channel-subscribe-events-v1', EventSubTopicType.CHANNEL_SUBSCRIBE],
    
    // Moderation
    ['automod-queue', EventSubTopicType.AUTOMOD_MESSAGE_HOLD],
    ['chat_moderator_actions', EventSubTopicType.CHANNEL_MODERATE],
    ['low-trust-users', EventSubTopicType.CHANNEL_SUSPICIOUS_USER_UPDATE],
    ['user-moderation-notifications', EventSubTopicType.AUTOMOD_MESSAGE_UPDATE],
    
    // Whispers
    ['whispers', EventSubTopicType.WHISPER_RECEIVED]
  ]);

  static getEventSubTopic(pubsubTopic: string): EventSubTopicType | null {
    // Extract the base topic name (remove channel ID and version suffixes)
    const baseTopic = pubsubTopic.split('.')[0];
    return this.topicMapping.get(baseTopic) || null;
  }

  static getScopeMapping(pubsubScope: string): string[] {
    const scopeMap: Record<string, string[]> = {
      'bits:read': ['bits:read'],
      'channel:read:redemptions': ['channel:read:redemptions', 'channel:manage:redemptions'],
      'channel:read:subscriptions': ['channel:read:subscriptions'],
      'channel:moderate': [
        'moderator:manage:automod',
        'moderator:read:blocked_terms',
        'moderator:manage:blocked_terms',
        'moderator:read:chat_settings',
        'moderator:manage:chat_settings',
        'moderator:read:unban_requests',
        'moderator:manage:unban_requests',
        'moderator:read:banned_users',
        'moderator:manage:banned_users',
        'moderator:read:chat_messages',
        'moderator:manage:chat_messages',
        'moderator:read:moderators',
        'moderator:read:vips',
        'moderator:read:suspicious_users'
      ],
      'chat:read': ['moderator:manage:automod'],
      'whispers:read': ['user:read:whispers', 'user:manage:whispers']
    };

    return scopeMap[pubsubScope] || [];
  }

  static createMigrationGuide(usedPubSubTopics: string[]): string {
    const guide: string[] = ['=== PubSub to EventSub Migration Guide ===\n'];
    
    guide.push('PubSub has been decommissioned as of April 14, 2025.');
    guide.push('Here are the EventSub equivalents for your PubSub topics:\n');

    for (const topic of usedPubSubTopics) {
      const eventSubTopic = this.getEventSubTopic(topic);
      if (eventSubTopic) {
        guide.push(`  ${topic} → ${eventSubTopic}`);
      } else {
        guide.push(`  ${topic} → No direct equivalent (check documentation)`);
      }
    }

    guide.push('\nRequired changes:');
    guide.push('1. Use EventSub WebSocket or Webhooks instead of PubSub WebSocket');
    guide.push('2. Subscribe via Twitch API instead of sending LISTEN messages');
    guide.push('3. Update your authentication scopes as needed');
    guide.push('4. Handle new message formats and subscription management');

    return guide.join('\n');
  }
}

// ============================================
// Example Usage with EventSub
// ============================================
/*
import TwitchExt from './dist/index.js';

// Wait for extension to be ready
const auth = await TwitchExt.waitForReady();

// Get EventSub manager
const eventSub = TwitchExt.getEventSub();

if (eventSub) {
  // Subscribe to channel events
  await TwitchExt.subscribeToChannelEvents(auth.channelId);
  
  // Listen for specific events
  eventSub.on('channel.cheer', (event) => {
    console.log('New cheer:', event);
  });
  
  eventSub.on('channel.subscribe', (event) => {
    console.log('New subscription:', event);
  });
  
  eventSub.on('channel.chat.message', (event) => {
    console.log('Chat message:', event);
  });
}

// Handle EventSub connection events
TwitchExt.on('eventsub:connected', () => {
  console.log('EventSub connected');
});

TwitchExt.on('eventsub:error', (error) => {
  console.error('EventSub error:', error);
});
*/
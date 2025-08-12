// ============================================
// src/types/eventsub.d.ts - EventSub Type Definitions
// ============================================
export interface EventSubWebSocketMessage {
  metadata: {
    message_id: string;
    message_type: 'session_welcome' | 'session_keepalive' | 'notification' | 'session_reconnect' | 'revocation';
    message_timestamp: string;
    subscription_type?: string;
    subscription_version?: string;
  };
  payload: {
    session?: EventSubSession;
    subscription?: EventSubSubscription;
    event?: any;
  };
}

export interface EventSubSession {
  id: string;
  status: 'connected' | 'enabled' | 'reconnecting';
  connected_at: string;
  keepalive_timeout_seconds: number;
  reconnect_url?: string;
}

export interface EventSubSubscription {
  id: string;
  status: 'enabled' | 'webhook_callback_verification_pending' | 'webhook_callback_verification_failed' | 'notification_failures_exceeded' | 'authorization_revoked' | 'moderator_removed' | 'user_removed' | 'version_removed';
  type: string;
  version: string;
  cost: number;
  condition: Record<string, string>;
  transport: EventSubTransport;
  created_at: string;
}

export interface EventSubTransport {
  method: 'websocket' | 'webhook';
  session_id?: string;
  callback?: string;
  secret?: string;
}

export interface EventSubCreateSubscriptionRequest {
  type: string;
  version: string;
  condition: Record<string, string>;
  transport: EventSubTransport;
}

// EventSub subscription types mapping from PubSub
export enum EventSubTopicType {
  // Bits events
  CHANNEL_CHEER = 'channel.cheer',
  CHANNEL_CHAT_MESSAGE = 'channel.chat.message',
  CHANNEL_CHAT_NOTIFICATION = 'channel.chat.notification',
  
  // Channel Points
  CHANNEL_POINTS_CUSTOM_REWARD_REDEMPTION_ADD = 'channel.channel_points_custom_reward_redemption.add',
  CHANNEL_POINTS_AUTOMATIC_REWARD_REDEMPTION_ADD = 'channel.channel_points_automatic_reward_redemption.add',
  
  // Subscriptions
  CHANNEL_SUBSCRIBE = 'channel.subscribe',
  CHANNEL_SUBSCRIPTION_END = 'channel.subscription.end',
  CHANNEL_SUBSCRIPTION_GIFT = 'channel.subscription.gift',
  CHANNEL_SUBSCRIPTION_MESSAGE = 'channel.subscription.message',
  
  // Moderation
  AUTOMOD_MESSAGE_HOLD = 'automod.message.hold',
  AUTOMOD_MESSAGE_UPDATE = 'automod.message.update',
  CHANNEL_MODERATE = 'channel.moderate',
  CHANNEL_SUSPICIOUS_USER_UPDATE = 'channel.suspicious_user.update',
  CHANNEL_SUSPICIOUS_USER_MESSAGE = 'channel.suspicious_user.message',
  CHANNEL_CHAT_USER_MESSAGE_HOLD = 'channel.chat.user_message_hold',
  
  // Whispers
  WHISPER_RECEIVED = 'user.whisper.message'
}
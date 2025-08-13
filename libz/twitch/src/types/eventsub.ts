// ============================================
// types/eventsub.d.ts - EventSub Type Definitions
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
  status: 'enabled' | 'webhook_callback_verification_pending' | 'webhook_callback_verification_failed' | 
          'notification_failures_exceeded' | 'authorization_revoked' | 'moderator_removed' | 
          'user_removed' | 'version_removed';
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
  transport?: EventSubTransport;
}

// EventSub subscription types
export enum EventSubTopicType {
  // Channel events
  CHANNEL_UPDATE = 'channel.update',
  CHANNEL_FOLLOW = 'channel.follow',
  CHANNEL_CHEER = 'channel.cheer',
  CHANNEL_RAID = 'channel.raid',
  
  // Chat events (requires user access token with proper scopes)
  CHANNEL_CHAT_MESSAGE = 'channel.chat.message',
  CHANNEL_CHAT_NOTIFICATION = 'channel.chat.notification',
  CHANNEL_CHAT_CLEAR = 'channel.chat.clear',
  CHANNEL_CHAT_CLEAR_USER_MESSAGES = 'channel.chat.clear_user_messages',
  CHANNEL_CHAT_MESSAGE_DELETE = 'channel.chat.message_delete',
  
  // Channel Points
  CHANNEL_POINTS_CUSTOM_REWARD_REDEMPTION_ADD = 'channel.channel_points_custom_reward_redemption.add',
  CHANNEL_POINTS_CUSTOM_REWARD_REDEMPTION_UPDATE = 'channel.channel_points_custom_reward_redemption.update',
  CHANNEL_POINTS_AUTOMATIC_REWARD_REDEMPTION_ADD = 'channel.channel_points_automatic_reward_redemption.add',
  
  // Subscriptions
  CHANNEL_SUBSCRIBE = 'channel.subscribe',
  CHANNEL_SUBSCRIPTION_END = 'channel.subscription.end',
  CHANNEL_SUBSCRIPTION_GIFT = 'channel.subscription.gift',
  CHANNEL_SUBSCRIPTION_MESSAGE = 'channel.subscription.message',
  
  // Moderation
  CHANNEL_MODERATE = 'channel.moderate',
  CHANNEL_BAN = 'channel.ban',
  CHANNEL_UNBAN = 'channel.unban',
  CHANNEL_MODERATOR_ADD = 'channel.moderator.add',
  CHANNEL_MODERATOR_REMOVE = 'channel.moderator.remove',
  
  // Stream events
  STREAM_ONLINE = 'stream.online',
  STREAM_OFFLINE = 'stream.offline',
  
  // Hype Train
  CHANNEL_HYPE_TRAIN_BEGIN = 'channel.hype_train.begin',
  CHANNEL_HYPE_TRAIN_PROGRESS = 'channel.hype_train.progress',
  CHANNEL_HYPE_TRAIN_END = 'channel.hype_train.end',
  
  // Polls
  CHANNEL_POLL_BEGIN = 'channel.poll.begin',
  CHANNEL_POLL_PROGRESS = 'channel.poll.progress',
  CHANNEL_POLL_END = 'channel.poll.end',
  
  // Predictions
  CHANNEL_PREDICTION_BEGIN = 'channel.prediction.begin',
  CHANNEL_PREDICTION_PROGRESS = 'channel.prediction.progress',
  CHANNEL_PREDICTION_LOCK = 'channel.prediction.lock',
  CHANNEL_PREDICTION_END = 'channel.prediction.end',
}

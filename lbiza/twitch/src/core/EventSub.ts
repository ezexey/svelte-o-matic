// ============================================
// EventSub.ts - EventSub WebSocket Manager for Backend Services
// Note: This should run in your EBS (Extension Backend Service), NOT in the browser
// ============================================
import { Emitter } from './Emitter';
import type { 
  EventSubWebSocketMessage, 
  EventSubSession, 
  EventSubSubscription,
  EventSubCreateSubscriptionRequest
} from '../types/eventsub';

export class EventSub extends Emitter {
  private ws: WebSocket | null = null;
  private sessionId: string | null = null;
  private keepaliveTimeout: number | null = null;
  private keepaliveTimer: NodeJS.Timeout | null = null;
  private reconnectUrl: string | null = null;
  private isConnecting = false;
  private subscriptions: Map<string, EventSubSubscription> = new Map();
  private messageQueue: EventSubWebSocketMessage[] = [];
  private maxReconnectAttempts = 5;
  private reconnectAttempts = 0;
  
  constructor(
    private accessToken: string,  // App access token or user access token
    private clientId: string
  ) {
    super();
  }

  async connect(url = 'wss://eventsub.wss.twitch.tv/ws'): Promise<void> {
    if (this.isConnecting || this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.isConnecting = true;
    
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(url);
        
        this.ws.onopen = () => {
          console.log('[EventSub] WebSocket connected');
          this.emit('connected');
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        this.ws.onerror = (error) => {
          console.error('[EventSub] WebSocket error:', error);
          this.emit('error', error);
          reject(error);
        };

        this.ws.onclose = (event) => {
          console.log('[EventSub] WebSocket closed:', event.code, event.reason);
          this.handleDisconnect();
        };

        // Set up welcome message handler for initial connection
        this.once('session_welcome', (session: EventSubSession) => {
          this.sessionId = session.id;
          this.keepaliveTimeout = session.keepalive_timeout_seconds;
          this.startKeepaliveTimer();
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          resolve();
        });

      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  private handleMessage(data: string): void {
    try {
      const message: EventSubWebSocketMessage = JSON.parse(data);
      
      // Reset keepalive timer on any message
      this.resetKeepaliveTimer();
      
      switch (message.metadata.message_type) {
        case 'session_welcome':
          this.handleSessionWelcome(message);
          break;
          
        case 'session_keepalive':
          this.handleKeepalive(message);
          break;
          
        case 'notification':
          this.handleNotification(message);
          break;
          
        case 'session_reconnect':
          this.handleReconnect(message);
          break;
          
        case 'revocation':
          this.handleRevocation(message);
          break;
          
        default:
          console.warn('[EventSub] Unknown message type:', message.metadata.message_type);
      }
      
      // Store message in queue
      this.messageQueue.push(message);
      if (this.messageQueue.length > 100) {
        this.messageQueue.shift();
      }
      
    } catch (error) {
      console.error('[EventSub] Failed to parse message:', error);
      this.emit('error', error);
    }
  }

  private handleSessionWelcome(message: EventSubWebSocketMessage): void {
    if (message.payload.session) {
      this.emit('session_welcome', message.payload.session);
    }
  }

  private handleKeepalive(message: EventSubWebSocketMessage): void {
    this.emit('keepalive');
  }

  private handleNotification(message: EventSubWebSocketMessage): void {
    const { subscription_type, subscription_version } = message.metadata;
    const { subscription, event } = message.payload;
    
    if (subscription && subscription_type) {
      this.emit('notification', {
        type: subscription_type,
        version: subscription_version,
        event,
        subscription
      });
      
      // Emit specific event type for easier handling
      this.emit(subscription_type, event);
    }
  }

  private async handleReconnect(message: EventSubWebSocketMessage): Promise<void> {
    if (message.payload.session?.reconnect_url) {
      this.reconnectUrl = message.payload.session.reconnect_url;
      console.log('[EventSub] Reconnect requested to:', this.reconnectUrl);
      
      // Close current connection and reconnect
      this.disconnect();
      await this.connect(this.reconnectUrl);
      
      // Resubscribe to all subscriptions after reconnect
      const existingSubscriptions = Array.from(this.subscriptions.values());
      for (const sub of existingSubscriptions) {
        try {
          await this.subscribe({
            type: sub.type,
            version: sub.version,
            condition: sub.condition
          });
        } catch (error) {
          console.error(`[EventSub] Failed to resubscribe to ${sub.type}:`, error);
        }
      }
    }
  }

  private handleRevocation(message: EventSubWebSocketMessage): void {
    const { subscription } = message.payload;
    if (subscription) {
      this.subscriptions.delete(subscription.id);
      this.emit('revocation', subscription);
      
      // Handle specific revocation reasons
      switch (subscription.status) {
        case 'authorization_revoked':
          this.emit('authorization_revoked', subscription);
          break;
        case 'user_removed':
          this.emit('user_removed', subscription);
          break;
        case 'version_removed':
          this.emit('version_removed', subscription);
          break;
      }
    }
  }

  private startKeepaliveTimer(): void {
    if (this.keepaliveTimeout) {
      this.keepaliveTimer = setTimeout(() => {
        console.warn('[EventSub] Keepalive timeout exceeded');
        this.handleDisconnect();
      }, (this.keepaliveTimeout + 10) * 1000); // Add 10 second buffer
    }
  }

  private resetKeepaliveTimer(): void {
    if (this.keepaliveTimer) {
      clearTimeout(this.keepaliveTimer);
      this.startKeepaliveTimer();
    }
  }

  private async handleDisconnect(): Promise<void> {
    this.clearKeepaliveTimer();
    this.emit('disconnected');
    
    // Attempt reconnection
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      
      console.log(`[EventSub] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(async () => {
        try {
          await this.connect(this.reconnectUrl || 'wss://eventsub.wss.twitch.tv/ws');
        } catch (error) {
          console.error('[EventSub] Reconnection failed:', error);
        }
      }, delay);
    } else {
      console.error('[EventSub] Max reconnection attempts reached');
      this.emit('max_reconnect_exceeded');
    }
  }

  private clearKeepaliveTimer(): void {
    if (this.keepaliveTimer) {
      clearTimeout(this.keepaliveTimer);
      this.keepaliveTimer = null;
    }
  }

  async subscribe(request: EventSubCreateSubscriptionRequest): Promise<EventSubSubscription> {
    if (!this.sessionId) {
      throw new Error('WebSocket not connected. Call connect() first.');
    }

    // Add session_id to transport for WebSocket
    request.transport = {
      method: 'websocket',
      session_id: this.sessionId
    };

    const response = await fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Client-Id': this.clientId,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to create subscription: ${error.message || response.statusText}`);
    }

    const data = await response.json();
    const subscription = data.data[0];
    
    this.subscriptions.set(subscription.id, subscription);
    this.emit('subscription_created', subscription);
    
    return subscription;
  }

  async unsubscribe(subscriptionId: string): Promise<void> {
    const response = await fetch(`https://api.twitch.tv/helix/eventsub/subscriptions?id=${subscriptionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Client-Id': this.clientId
      }
    });

    if (!response.ok && response.status !== 404) {
      throw new Error(`Failed to delete subscription: ${response.statusText}`);
    }

    this.subscriptions.delete(subscriptionId);
    this.emit('subscription_deleted', subscriptionId);
  }

  async getSubscriptions(): Promise<EventSubSubscription[]> {
    const response = await fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Client-Id': this.clientId
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get subscriptions: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  }

  disconnect(): void {
    this.clearKeepaliveTimer();
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.sessionId = null;
    this.isConnecting = false;
  }

  getSessionId(): string | null {
    return this.sessionId;
  }

  getMessageHistory(): EventSubWebSocketMessage[] {
    return [...this.messageQueue];
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN && this.sessionId !== null;
  }
}
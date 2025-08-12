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

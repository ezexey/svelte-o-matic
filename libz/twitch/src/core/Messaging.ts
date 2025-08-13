// ============================================
// ExtensionMessaging.ts - Extension Messaging Manager
// This uses the Extension Helper's built-in messaging (NOT deprecated)
// ============================================
import { Emitter } from "./Emitter";
import type { TwitchExtensionHelper } from "../types/twitch";

interface ExtensionMessage {
  type: string;
  data: any;
  timestamp: number;
  sender?: string;
}

export class Messaging extends Emitter {
  private ext: TwitchExtensionHelper;
  private listeners: Map<string, Function> = new Map();

  constructor(ext: TwitchExtensionHelper) {
    super();
    this.ext = ext;
  }

  // Listen to broadcast messages
  listenToBroadcast(): void {
    const callback = (target: string, contentType: string, message: string) => {
      this.handleMessage("broadcast", contentType, message);
    };
    this.ext.listen("broadcast", callback);
    this.listeners.set("broadcast", callback);
  }

  // Listen to whisper messages
  listenToWhispers(userId: string): void {
    const target = `whisper-${userId}`;
    const callback = (target: string, contentType: string, message: string) => {
      this.handleMessage("whisper", contentType, message);
    };
    this.ext.listen(target, callback);
    this.listeners.set(target, callback);
  }

  // Listen to global messages
  listenToGlobal(): void {
    const callback = (target: string, contentType: string, message: string) => {
      this.handleMessage("global", contentType, message);
    };
    this.ext.listen("global", callback);
    this.listeners.set("global", callback);
  }

  // Send broadcast message (broadcaster only)
  sendBroadcast(type: string, data: any): void {
    const message: ExtensionMessage = {
      type,
      data,
      timestamp: Date.now(),
    };
    this.ext.send("broadcast", "application/json", JSON.stringify(message));
  }

  // Send whisper message (broadcaster only)
  sendWhisper(userId: string, type: string, data: any): void {
    const message: ExtensionMessage = {
      type,
      data,
      timestamp: Date.now(),
    };
    this.ext.send(`whisper-${userId}`, "application/json", JSON.stringify(message));
  }

  // Handle incoming messages
  private handleMessage(channel: string, contentType: string, message: string): void {
    try {
      let parsed: any;
      
      if (contentType === "application/json") {
        parsed = JSON.parse(message);
      } else {
        parsed = { raw: message };
      }

      // Emit general message event
      this.emit("message", {
        channel,
        contentType,
        data: parsed,
      });

      // Emit specific event if message has a type
      if (parsed.type) {
        this.emit(parsed.type, parsed.data || parsed);
      }
    } catch (error) {
      console.error("[ExtensionMessaging] Failed to parse message:", error);
      this.emit("error", error);
    }
  }

  // Clean up listeners
  destroy(): void {
    this.listeners.forEach((callback, target) => {
      this.ext.unlisten(target, callback);
    });
    this.listeners.clear();
    this.removeAllListeners();
  }
}
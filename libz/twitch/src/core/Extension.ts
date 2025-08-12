import { Emitter } from "./Emitter";
import { EventSub } from "./EventSub";
import type {
  TwitchExtensionHelper,
  AuthData,
  Context,
  Viewer,
  Features,
  Actions,
  Bits,
  Configuration,
  Rig,
} from "../types/twitch";
import { EventSubCreateSubscriptionRequest, EventSubTopicType } from "../types/eventsub";

export class Extension extends Emitter {
  private static instance: Extension | null = null;
  private ext: TwitchExtensionHelper;
  private authData: AuthData | null = null;
  private currentContext: Context | null = null;
  private eventSubscriber: EventSub | null = null;

  private authPromise: Promise<AuthData>;
  private authResolve!: (auth: AuthData) => void;

  private contextPromise: Promise<Context>;
  private contextResolve!: (context: Context) => void;

  private constructor() {
    super();

    if (typeof window === "undefined" || !window.Twitch?.ext) {
      throw new Error("Twitch Extension Helper not found");
    }

    this.ext = window.Twitch.ext;
    this.authPromise = new Promise((resolve) => {
      this.authResolve = resolve;
    });
    this.contextPromise = new Promise((resolve) => {
      this.contextResolve = resolve;
    });

    this.initialize();
  }

  static get I(): Extension {
    if (!Extension.instance) {
      Extension.instance = new Extension();
    }
    return Extension.instance;
  }

  private initialize(): void {
    this.ext.onAuthorized(async (auth) => {
      this.authData = auth;

      // Initialize EventSub if we have a token
      if (auth.helixToken && auth.clientId) {
        try {
          this.eventSubscriber = new EventSub(auth.helixToken, auth.clientId);

          // Forward EventSub events
          this.eventSubscriber.on("connected", () => this.emit("eventsub:connected"));
          this.eventSubscriber.on("disconnected", () => this.emit("eventsub:disconnected"));
          this.eventSubscriber.on("error", (error) => this.emit("eventsub:error", error));
          this.eventSubscriber.on("notification", (data) => this.emit("eventsub:notification", data));

          // Auto-connect EventSub
          await this.eventSubscriber.connect();
          console.log("[TwitchExtension] EventSub connected successfully");
        } catch (error) {
          console.error("[TwitchExtension] Failed to initialize EventSub:", error);
          this.emit("eventsub:error", error);
        }
      }

      this.emit("authorized", auth);
      this.authResolve(auth);
    });

    this.ext.onContext((context) => {
      const previousContext = this.currentContext;
      this.currentContext = context;
      this.emit("context", context, previousContext);
      this.contextResolve(context);
    });

    this.ext.onError((error) => {
      this.emit("error", new Error(error));
    });

    this.ext.onVisibilityChanged((isVisible, context) => {
      this.emit("visibility", isVisible, context);
    });

    this.ext.onHighlightChanged((highlighted) => {
      this.emit("highlight", highlighted);
    });

    this.ext.onPositionChanged((position) => {
      this.emit("position", position);
    });

    if (this.ext.configuration.onChanged) {
      this.ext.configuration.onChanged(() => {
        this.emit("configurationChanged", this.ext.configuration);
      });
    }

    if (this.ext.viewer.onChanged) {
      this.ext.viewer.onChanged(() => {
        this.emit("viewerChanged", this.ext.viewer);
      });
    }

    if (this.ext.features.onChanged) {
      this.ext.features.onChanged((changed) => {
        this.emit("featuresChanged", changed);
      });
    }
  }

  get auth(): AuthData | null {
    return this.authData;
  }
  get context(): Context | null {
    return this.currentContext;
  }
  get helper(): TwitchExtensionHelper {
    return this.ext;
  }
  get viewer(): Viewer {
    return this.ext.viewer;
  }
  get features(): Features {
    return this.ext.features;
  }
  get actions(): Actions {
    return this.ext.actions;
  }
  get bits(): Bits {
    return this.ext.bits;
  }
  get configuration(): Configuration {
    return this.ext.configuration;
  }
  get rig(): Rig {
    return this.ext.rig;
  }
  get eventSub(): EventSub | null {
    return this.eventSubscriber;
  }

  async waitForAuth(): Promise<AuthData> {
    if (this.authData) return this.authData;
    return this.authPromise;
  }
  async waitForContext(): Promise<Context> {
    if (this.currentContext) return this.currentContext;
    return this.contextPromise;
  }

  log(message: string, ...args: any[]): void {
    console.log(`[Extension] ${message}`, ...args);
    if (this.ext.rig) {
      this.ext.rig.log(`[Extension] ${message} ${args.join(" ")}`);
    }
  }

  getJWTPayload(): any | null {
    if (!this.authData?.token) return null;
    try {
      const parts = this.authData.token.split(".");
      if (parts.length !== 3) return null;
      return JSON.parse(atob(parts[1]));
    } catch (error) {
      this.log("Failed to decode JWT", error);
      return null;
    }
  }

  isTokenExpired(): boolean {
    const payload = this.getJWTPayload();
    if (!payload?.exp) return true;
    return Date.now() >= payload.exp * 1000;
  }

  isBroadcaster(): boolean {
    return this.viewer.role === "broadcaster";
  }

  isModerator(): boolean {
    return this.viewer.role === "moderator" || this.isBroadcaster();
  }

  getConfig(segment: "broadcaster" | "developer" | "global"): any {
    const config = this.configuration[segment];
    if (!config?.content) return null;

    try {
      return JSON.parse(config.content);
    } catch {
      return config.content;
    }
  }

  setConfig(segment: "broadcaster" | "developer" | "global", content: any, version: string = "1.0"): void {
    const data = typeof content === "string" ? content : JSON.stringify(content);
    this.configuration.set(segment, version, data);
  }

   // ===== EventSub Helper Methods =====
  async subscribeToChannelEvents(channelId: string): Promise<void> {
    if (!this.eventSubscriber) {
      throw new Error('EventSub not initialized. Ensure you have proper authentication.');
    }

    // Subscribe to common channel events
    const subscriptions: Array<EventSubCreateSubscriptionRequest> = [
      {
        type: EventSubTopicType.CHANNEL_CHAT_MESSAGE,
        version: '1',
        condition: { broadcaster_user_id: channelId, user_id: channelId }
      },
      {
        type: EventSubTopicType.CHANNEL_CHEER,
        version: '1',
        condition: { broadcaster_user_id: channelId }
      },
      {
        type: EventSubTopicType.CHANNEL_SUBSCRIBE,
        version: '1',
        condition: { broadcaster_user_id: channelId }
      },
      {
        type: EventSubTopicType.CHANNEL_SUBSCRIPTION_GIFT,
        version: '1',
        condition: { broadcaster_user_id: channelId }
      }
    ];

    for (const sub of subscriptions) {
      try {
        await this.eventSubscriber.subscribe(sub);
        this.log(`Subscribed to ${sub.type}`);
      } catch (error) {
        console.error(`Failed to subscribe to ${sub.type}:`, error);
      }
    }
  }

  override emit(event: string, ...args: any[]): boolean {
    this.log(`Emitting event: ${event}`, ...args);
    return super.emit(event, ...args);
  }
}

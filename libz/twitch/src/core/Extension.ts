// ============================================
// Extension.ts - Twitch Extension Wrapper (Frontend)
// ============================================
import { Emitter } from "./Emitter";
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
  Position,
} from "../types/twitch";

export class Extension extends Emitter {
  private static instance: Extension | null = null;
  private ext: TwitchExtensionHelper;
  private authData: AuthData | null = null;
  private currentContext: Context | null = null;

  private authPromise: Promise<AuthData>;
  private authResolve!: (auth: AuthData) => void;

  private contextPromise: Promise<Context>;
  private contextResolve!: (context: Context) => void;

  private constructor() {
    super();
    this.authPromise = new Promise((resolve) => {
      this.authResolve = resolve;
    });
    this.contextPromise = new Promise((resolve) => {
      this.contextResolve = resolve;
    });
    this.ext = window.Twitch.ext;
    this.initialize();
  }

  static get I(): Extension {
    if (!Extension.instance) {
      Extension.instance = new Extension();
    }
    return Extension.instance;
  }

  private initialize(): void {
    // Set up authorization handler
    this.ext.onAuthorized((auth) => {
      this.authData = auth;
      this.emit("authorized", auth);
      this.authResolve(auth);
    });

    // Set up context handler
    this.ext.onContext((context, changed) => {
      const previousContext = this.currentContext;
      this.currentContext = context;
      this.emit("context", context, changed || [], previousContext);
      this.contextResolve(context);
    });

    // Set up error handler
    this.ext.onError((error) => {
      this.emit("error", error);
    });

    // Set up visibility handler
    this.ext.onVisibilityChanged((isVisible, context) => {
      this.emit("visibility", isVisible, context);
    });

    // Set up highlight handler (for video overlay and component extensions)
    this.ext.onHighlightChanged((highlighted) => {
      this.emit("highlight", highlighted);
    });

    // Set up position handler (for video component extensions)
    this.ext.onPositionChanged((position) => {
      this.emit("position", position);
    });

    // Set up configuration change handler
    if (this.ext.configuration?.onChanged) {
      this.ext.configuration.onChanged(() => {
        this.emit("configurationChanged", this.ext.configuration);
      });
    }

    // Set up viewer change handler
    if (this.ext.viewer?.onChanged) {
      this.ext.viewer.onChanged(() => {
        this.emit("viewerChanged", this.ext.viewer);
      });
    }

    // Set up features change handler
    if (this.ext.features?.onChanged) {
      this.ext.features.onChanged((changed) => {
        this.emit("featuresChanged", changed);
      });
    }
  }

  // Getters for easy access
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

  get rig(): Rig | undefined {
    return this.ext.rig;
  }

  // Promise-based helpers
  async waitForAuth(): Promise<AuthData> {
    if (this.authData) return this.authData;
    return this.authPromise;
  }

  async waitForContext(): Promise<Context> {
    if (this.currentContext) return this.currentContext;
    return this.contextPromise;
  }

  // Logging helper
  log(message: string, ...args: any[]): void {
    console.log(`[TwitchExt] ${message}`, ...args);
    if (this.ext.rig) {
      this.ext.rig.log(`${message} ${args.map((a) => JSON.stringify(a)).join(" ")}`);
    }
  }

  // JWT helpers
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

  // Role helpers
  isBroadcaster(): boolean {
    return this.viewer?.role === "broadcaster";
  }

  isModerator(): boolean {
    return this.viewer?.role === "moderator" || this.isBroadcaster();
  }

  isViewer(): boolean {
    return this.viewer?.role === "viewer";
  }

  // Configuration helpers
  getConfig(segment: "broadcaster" | "developer" | "global"): any {
    const config = this.configuration[segment];
    if (!config?.content) return null;

    try {
      return JSON.parse(config.content);
    } catch {
      return config.content;
    }
  }

  setConfig(content: any, version: string = "1.0"): void {
    if (!this.isBroadcaster()) {
      throw new Error("Only broadcasters can set configuration");
    }
    const data = typeof content === "string" ? content : JSON.stringify(content);
    this.configuration.set("broadcaster", version, data);
  }

  // Extension Messaging helpers (NOT deprecated - this is Extension-specific)
  broadcast(contentType: string, message: any): void {
    if (!this.isBroadcaster()) {
      throw new Error("Only broadcasters can send broadcast messages");
    }
    this.ext.send("broadcast", contentType, message);
  }

  whisper(userId: string, contentType: string, message: any): void {
    if (!this.isBroadcaster()) {
      throw new Error("Only broadcasters can send whisper messages");
    }
    this.ext.send(`whisper-${userId}`, contentType, message);
  }

  listenBroadcast(callback: (message: any) => void): void {
    this.ext.listen("broadcast", (target, contentType, message) => {
      try {
        const parsed = contentType === "application/json" ? JSON.parse(message) : message;
        callback(parsed);
      } catch (error) {
        callback(message);
      }
    });
  }

  listenWhisper(callback: (message: any) => void): void {
    const userId = this.viewer?.id || this.viewer?.opaqueId;
    if (!userId) {
      throw new Error("User ID not available");
    }

    this.ext.listen(`whisper-${userId}`, (target, contentType, message) => {
      try {
        const parsed = contentType === "application/json" ? JSON.parse(message) : message;
        callback(parsed);
      } catch (error) {
        callback(message);
      }
    });
  }

  // API Request Helper using the helixToken
  async apiRequest(endpoint: string, fetcher = fetch, options: RequestInit = {}): Promise<any> {
    if (!this.authData?.helixToken) throw new Error("Helix token not available");

    const response = await fetcher(`https://api.twitch.tv/helix${endpoint}`, {
      ...options,
      headers: {
        "Client-Id": this.authData.clientId,
        Authorization: `Extension ${this.authData.helixToken}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // EBS Request Helper using the JWT token
  async ebsRequest(url: string, fetcher = fetch, options: RequestInit = {}): Promise<any> {
    if (!this.authData?.token) throw new Error("JWT token not available");

    const response = await fetcher(url, {
      ...options,
      headers: {
        "x-extension-jwt": this.authData.token,
        ...options.headers,
      },
    });

    if (!response.ok) throw new Error(`EBS request failed: ${response.statusText}`);

    return response.json();
  }

  // Bits helpers
  async hasBitsSupport(): Promise<boolean> {
    if (!this.features.isBitsEnabled) {
      return false;
    }

    try {
      const products = await this.bits.getProducts();
      return products.length > 0;
    } catch {
      return false;
    }
  }

  // Subscription helpers
  isSubscriber(): boolean {
    return this.viewer?.subscriptionStatus !== null;
  }

  getSubscriptionTier() {
    return this.viewer?.subscriptionStatus?.tier;
  }
}

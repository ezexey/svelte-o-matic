import { EventEmitter } from './EventEmitter.js';
import type { 
  TwitchExtensionHelper, 
  AuthData, 
  Context, 
  Viewer, 
  Features, 
  Actions, 
  Bits, 
  Configuration,
  PubSub,
  Rig
} from '../types/twitch';

export class TwitchExtension extends EventEmitter {
  private static instance: TwitchExtension | null = null;
  private helper: TwitchExtensionHelper;
  private authData: AuthData | null = null;
  private context: Context | null = null;
  private isReady = false;
  private authPromise: Promise<AuthData>;
  private contextPromise: Promise<Context>;
  private readyResolve!: (auth: AuthData) => void;
  private contextResolve!: (context: Context) => void;

  private constructor() {
    super();
    
    if (typeof window === 'undefined' || !window.Twitch?.ext) {
      throw new Error('Twitch Extension Helper not found');
    }
    
    this.helper = window.Twitch.ext;
    this.authPromise = new Promise((resolve) => {
      this.readyResolve = resolve;
    });
    this.contextPromise = new Promise(resolve => {
      this.contextResolve = resolve;
    });
    
    this.initialize();
  }

  static getInstance(): TwitchExtension {
    if (!TwitchExtension.instance) {
      TwitchExtension.instance = new TwitchExtension();
    }
    return TwitchExtension.instance;
  }

  private initialize(): void {
    this.helper.onAuthorized((auth) => {
      this.authData = auth;
      this.isReady = true;
      this.emit('authorized', auth);
      this.readyResolve(auth);
    });

    this.helper.onContext((context) => {
      const previousContext = this.context;
      this.context = context;
      this.emit('context', context, previousContext);
      this.contextResolve(context);
    });

    this.helper.onError((error) => {
      this.emit('error', new Error(error));
    });

    this.helper.onVisibilityChanged((isVisible, context) => {
      this.emit('visibility', isVisible, context);
    });

    this.helper.onHighlightChanged((highlighted) => {
      this.emit('highlight', highlighted);
    });

    this.helper.onPositionChanged((position) => {
      this.emit('position', position);
    });

    if (this.helper.configuration.onChanged) {
      this.helper.configuration.onChanged(() => {
        this.emit('configurationChanged', this.helper.configuration);
      });
    }

    if (this.helper.viewer.onChanged) {
      this.helper.viewer.onChanged(() => {
        this.emit('viewerChanged', this.helper.viewer);
      });
    }

    if (this.helper.features.onChanged) {
      this.helper.features.onChanged((changed) => {
        this.emit('featuresChanged', changed);
      });
    }
  }
  override emit(event: string, ...args: any[]): boolean {
    this.log(`Emitting event: ${event}`, ...args);
    return super.emit(event, ...args);
  }

  get auth(): AuthData | null { return this.authData; }
  get currentContext(): Context | null { return this.context; }
  get viewer(): Viewer { return this.helper.viewer; }
  get features(): Features { return this.helper.features; }
  get actions(): Actions { return this.helper.actions; }
  get bits(): Bits { return this.helper.bits; }
  get configuration(): Configuration { return this.helper.configuration; }
  get pubsub(): PubSub { return this.helper.pubsub; }
  get rig(): Rig { return this.helper.rig; }
  get ready(): boolean { return this.isReady; }

  async waitForAuth(): Promise<AuthData> {
    if (this.authData) return this.authData;
    return this.authPromise;
  }
  async waitForContext(): Promise<Context> {
    if (this.context) return this.context;
    return this.contextPromise;
  }

  log(message: string, ...args: any[]): void {
    if (this.helper.rig) {
      this.helper.rig.log(`[Extension] ${message} ${args.join(' ')}`);
    } 
    console.log(`[Extension] ${message}`, ...args);
  }

  getJWTPayload(): any | null {
    if (!this.authData?.token) return null;
    try {
      const parts = this.authData.token.split('.');
      if (parts.length !== 3) return null;
      return JSON.parse(atob(parts[1]));
    } catch (error) {
      this.log('Failed to decode JWT', error);
      return null;
    }
  }

  isTokenExpired(): boolean {
    const payload = this.getJWTPayload();
    if (!payload?.exp) return true;
    return Date.now() >= payload.exp * 1000;
  }

  isBroadcaster(): boolean {
    return this.viewer.role === 'broadcaster';
  }

  isModerator(): boolean {
    return this.viewer.role === 'moderator' || this.isBroadcaster();
  }

  getConfig(segment: 'broadcaster' | 'developer' | 'global'): any {
    const config = this.configuration[segment];
    if (!config?.content) return null;
    
    try {
      return JSON.parse(config.content);
    } catch {
      return config.content;
    }
  }

  setConfig(segment: 'broadcaster' | 'developer' | 'global', content: any, version: string = '1.0'): void {
    const data = typeof content === 'string' ? content : JSON.stringify(content);
    this.configuration.set(segment, version, data);
  }

  broadcast(contentType: string, message: any): void {
    this.pubsub.send('broadcast', contentType, message);
  }

  whisper(userId: string, contentType: string, message: any): void {
    this.pubsub.send(`whisper-${userId}`, contentType, message);
  }

  listenBroadcast(callback: (contentType: string, message: string) => void): void {
    this.pubsub.listen('broadcast', (target, contentType, message) => {
      callback(contentType, message);
    });
  }

  listenWhisper(callback: (contentType: string, message: string) => void): void {
    const target = `whisper-${this.authData?.userId}`;
    this.pubsub.listen(target, (_, contentType, message) => {
      callback(contentType, message);
    });
  }
}

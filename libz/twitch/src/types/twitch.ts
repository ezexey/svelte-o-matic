// ============================================
// types/twitch.d.ts - Updated Twitch Extension Types
// ============================================
declare global {
  interface Window {
    Twitch: {
      ext: TwitchExtensionHelper;
    };
  }
}

export interface TwitchExtensionHelper {
  version: string;
  environment: string;
  
  // Core callbacks
  onAuthorized: (callback: (auth: AuthData) => void) => void;
  onContext: (callback: (context: Context, changed?: string[]) => void) => void;
  onError: (callback: (error: any) => void) => void;
  onHighlightChanged: (callback: (highlighted: boolean) => void) => void;
  onPositionChanged: (callback: (position: Position) => void) => void;
  onVisibilityChanged: (callback: (isVisible: boolean, context?: Context) => void) => void;
  
  // Extension Messaging (NOT deprecated - this is Extension-specific, not legacy PubSub)
  send: (target: string, contentType: string, message: object | string) => void;
  listen: (target: string, callback: (target: string, contentType: string, message: string) => void) => void;
  unlisten: (target: string, callback: Function) => void;
  
  // Sub-namespaces
  actions: Actions;
  configuration: Configuration;
  features: Features;
  bits: Bits;
  viewer: Viewer;
  rig?: Rig;
}

export interface AuthData {
  channelId: string;
  clientId: string;
  token: string;  // JWT for EBS authentication
  helixToken: string;  // JWT for Twitch API requests
  userId?: string;
}

export interface Context {
  arePlayerControlsVisible?: boolean;
  bitrate?: number;
  bufferSize?: number;
  displayResolution?: string;
  game?: string;
  hlsLatencyBroadcaster?: number;
  hostingInfo?: {
    hostedChannelId: string;
    hostingChannelId: string;
  };
  isFullScreen?: boolean;
  isMuted?: boolean;
  isPaused?: boolean;
  isTheatreMode?: boolean;
  language?: string;
  mode?: 'viewer' | 'dashboard' | 'config';
  playbackMode?: 'video' | 'audio' | 'remote' | 'chat-only';
  theme?: 'light' | 'dark';
  videoResolution?: string;
  volume?: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface Actions {
  followChannel: (channelName: string) => void;
  minimize: () => void;
  onFollow: (callback: (didFollow: boolean, channelName: string) => void) => void;
  requestIdShare: () => void;
}

export interface ConfigurationSegment {
  version: string;
  content: string;
}

export interface Configuration {
  broadcaster?: ConfigurationSegment;
  developer?: ConfigurationSegment;
  global?: ConfigurationSegment;
  onChanged: (callback: () => void) => void;
  set: (segment: 'broadcaster', version: string, content: string) => void;
}

export interface Features {
  isBitsEnabled: boolean;
  isChatEnabled: boolean;
  isSubscriptionStatusAvailable: boolean;
  onChanged: (callback: (changed: string[]) => void) => void;
}

export interface Viewer {
  opaqueId: string;
  id: string | null;
  role: 'broadcaster' | 'moderator' | 'viewer' | 'external';
  isLinked: boolean;
  sessionToken: string;
  helixToken: string;
  subscriptionStatus: SubscriptionStatus | null;
  onChanged: (callback: () => void) => void;
}

export interface SubscriptionStatus {
  tier: '1000' | '2000' | '3000';
}

export interface Product {
  sku: string;
  displayName: string;
  cost: {
    amount: string;
    type: 'bits';
  };
  inDevelopment?: boolean;
}

export interface TransactionObject {
  displayName: string;
  initiator: 'current_user' | 'other';
  product: Product;
  domainId: string;
  transactionId: string;
  transactionReceipt: string;
  userId: string;
}

export interface Bits {
  getProducts: () => Promise<Product[]>;
  onTransactionCancelled: (callback: () => void) => void;
  onTransactionComplete: (callback: (transaction: TransactionObject) => void) => void;
  setUseLoopback: (useLoopback: boolean) => void;
  showBitsBalance: () => void;
  useBits: (sku: string) => void;
}

export interface Rig {
  log: (message: string) => void;
}
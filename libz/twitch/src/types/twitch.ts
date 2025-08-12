declare global {
  interface Window {
    Twitch: {
      ext: TwitchExtensionHelper;
    };
  }
}
export interface TwitchExtensionHelper {
  onAuthorized: (callback: AuthorizedCallback) => void;
  onContext: (callback: ContextCallback) => void;
  onError: (callback: ErrorCallback) => void;
  onHighlightChanged: (callback: HighlightCallback) => void;
  onPositionChanged: (callback: PositionCallback) => void;
  onVisibilityChanged: (callback: VisibilityCallback) => void;
  configuration: Configuration;
  viewer: Viewer;
  features: Features;
  actions: Actions;
  rig: Rig;
  bits: Bits;
  pubsub: PubSub;
}

export type AuthorizedCallback = (auth: AuthData) => void;
export type ContextCallback = (context: Context) => void;
export type ErrorCallback = (error: string) => void;
export type HighlightCallback = (highlighted: boolean) => void;
export type PositionCallback = (position: Position) => void;
export type VisibilityCallback = (isVisible: boolean, context: VisibilityContext) => void;

export interface AuthData {
  token: string;
  userId: string;
  channelId: string;
  helixToken: string;
  clientId: string;
}

export interface Context {
  arePlayerControlsVisible: boolean;
  bitrate: number;
  bufferSize: number;
  displayResolution: string;
  game: string;
  hlsLatencyBroadcaster: number;
  hostingInfo?: HostingInfo;
  isFullScreen: boolean;
  isMuted: boolean;
  isPaused: boolean;
  isTheatreMode: boolean;
  language: string;
  mode: 'viewer' | 'dashboard' | 'config';
  playbackMode: 'video' | 'audio' | 'remote' | 'chat-only';
  theme: 'light' | 'dark';
  videoResolution: string;
  volume: number;
}

export interface Configuration {
  broadcaster?: ConfigurationObject;
  developer?: ConfigurationObject;
  global?: ConfigurationObject;
  onChanged: (callback: () => void) => void;
  set: (segment: 'broadcaster' | 'developer' | 'global', version: string, content: string) => void;
}

export interface ConfigurationObject {
  version: string;
  content: string;
}

export interface Viewer {
  id: string;
  isLinked: boolean;
  opaqueId: string;
  role: 'broadcaster' | 'moderator' | 'viewer' | 'external';
  sessionToken: string;
  subscriptionStatus?: SubscriptionStatus;
  onChanged: (callback: () => void) => void;
}

export interface SubscriptionStatus {
  tier: '1000' | '2000' | '3000' | 'prime';
}

export interface Features {
  isBitsEnabled: boolean;
  isChatEnabled: boolean;
  isSubscriptionStatusAvailable: boolean;
  onChanged: (callback: (changed: string[]) => void) => void;
}

export interface Actions {
  followChannel: (channelName: string) => void;
  minimize: () => void;
  onFollow: (callback: (didFollow: boolean, channelName: string) => void) => void;
  requestIdShare: () => void;
}

export interface Bits {
  getProducts: () => Promise<BitsProduct[]>;
  onTransactionComplete: (callback: (transaction: BitsTransaction) => void) => void;
  onTransactionCancelled: (callback: () => void) => void;
  setUseLoopback: (useLoopback: boolean) => void;
  showBitsBalance: () => void;
  useBits: (sku: string) => void;
}

export interface BitsProduct {
  sku: string;
  cost: { amount: string; type: 'bits' };
  displayName: string;
  inDevelopment?: boolean;
}

export interface BitsTransaction {
  transactionID: string;
  product: BitsProduct;
  userId: string;
  transactionReceipt: string;
  displayName: string;
  initiator: 'CURRENT_USER' | 'OTHER';
}

export interface PubSub {
  listen: (target: string, callback: PubSubCallback) => void;
  unlisten: (target: string, callback: PubSubCallback) => void;
  send: (target: string, contentType: string, message: object | string) => void;
}

export type PubSubCallback = (target: string, contentType: string, message: string) => void;

export interface Position {
  x: number;
  y: number;
}

export interface VisibilityContext {
  isChannelPage: boolean;
  isLive: boolean;
  isVod: boolean;
}

export interface HostingInfo {
  hostedChannelId: string;
  hostingChannelId: string;
}

export interface Rig {
  log: (message: string) => void;
}

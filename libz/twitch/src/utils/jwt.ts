export interface JWTPayload {
  exp: number;
  opaque_user_id: string;
  user_id?: string;
  channel_id: string;
  role: 'broadcaster' | 'moderator' | 'viewer' | 'external';
  pubsub_perms: {
    listen: string[];
    send: string[];
  };
}

export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }
    
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload) return true;
  
  const now = Date.now() / 1000;
  return now >= payload.exp;
}

export function getTokenTimeRemaining(token: string): number {
  const payload = decodeJWT(token);
  if (!payload) return 0;
  
  const now = Date.now() / 1000;
  return Math.max(0, payload.exp - now);
}

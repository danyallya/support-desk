import { createHash, randomBytes } from 'node:crypto';

export const SESSION_COOKIE_NAME = 'northstar_session';
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function createSessionToken(): string {
  return randomBytes(32).toString('base64url');
}

export function hashSessionToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function isSessionToken(value: unknown): value is string {
  return typeof value === 'string' && /^[A-Za-z0-9_-]{43}$/.test(value);
}

export function getSessionExpiry(now = new Date()): Date {
  return new Date(now.getTime() + SESSION_TTL_MS);
}

export function isSessionExpired(expiresAt: Date, now = new Date()): boolean {
  return expiresAt.getTime() <= now.getTime();
}

export function isObjectId(value: unknown): value is string {
  return typeof value === 'string' && /^[a-f\d]{24}$/i.test(value);
}

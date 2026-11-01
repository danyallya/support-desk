import { describe, expect, it } from 'vitest';
import {
  createSessionToken,
  getSessionExpiry,
  hashSessionToken,
  isObjectId,
  isSessionExpired,
  isSessionToken,
  SESSION_TTL_MS,
} from '../lib/session-policy';

describe('Northstar session policy', () => {
  it('uses unguessable-shaped tokens and stores a one-way digest', () => {
    const token = createSessionToken();
    expect(isSessionToken(token)).toBe(true);
    expect(hashSessionToken(token)).not.toBe(token);
    expect(hashSessionToken(token)).toMatch(/^[a-f\d]{64}$/);
    expect(isSessionToken('short')).toBe(false);
  });

  it('expires sessions at the seven-day boundary and validates Mongo ids', () => {
    const now = new Date('2026-11-01T00:00:00.000Z');
    const expiresAt = getSessionExpiry(now);
    expect(expiresAt.getTime() - now.getTime()).toBe(SESSION_TTL_MS);
    expect(isSessionExpired(expiresAt, new Date(expiresAt.getTime() - 1))).toBe(false);
    expect(isSessionExpired(expiresAt, expiresAt)).toBe(true);
    expect(isObjectId('111111111111111111111111')).toBe(true);
    expect(isObjectId('invalid')).toBe(false);
  });
});

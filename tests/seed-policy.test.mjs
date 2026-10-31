import { describe, expect, it } from 'vitest';
import { assertSafeSeedTarget, isSafeSeedTarget } from '../prisma/seed-policy.mjs';

describe('Northstar local seed boundary', () => {
  it('allows only the dedicated loopback MongoDB database', () => {
    expect(isSafeSeedTarget('mongodb://127.0.0.1:27017/northstar_desk')).toBe(true);
    expect(isSafeSeedTarget('mongodb://localhost:27017/northstar_desk?replicaSet=rs0')).toBe(true);
    expect(isSafeSeedTarget('mongodb://127.0.0.1:27017/other')).toBe(false);
    expect(isSafeSeedTarget('mongodb+srv://cluster.example.com/northstar_desk')).toBe(false);
    expect(isSafeSeedTarget('mongodb://db.example.com:27017/northstar_desk')).toBe(false);
    expect(isSafeSeedTarget(undefined)).toBe(false);
  });

  it('refuses unsafe seed destinations before opening a database client', () => {
    expect(() => assertSafeSeedTarget('mongodb://db.example.com:27017/northstar_desk'))
      .toThrow('DATABASE_URL must point to the local northstar_desk MongoDB database.');
  });
});

import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from '../lib/password-hash.mjs';

describe('Northstar agent password hashes', () => {
  it('stores a salted hash and verifies only the matching passphrase', async () => {
    const password = 'local-test-passphrase-2026!';
    const encodedHash = await hashPassword(password);

    expect(encodedHash).toMatch(/^scrypt\$[a-f\d]{32}\$[a-f\d]{128}$/i);
    expect(await verifyPassword(password, encodedHash)).toBe(true);
    expect(await verifyPassword('incorrect local passphrase', encodedHash)).toBe(false);
    expect(await verifyPassword(password, null)).toBe(false);
  });

  it('requires a long passphrase for a seeded sample account', async () => {
    await expect(hashPassword('too-short')).rejects.toThrow('Sample password must be 12–128 characters.');
  });
});

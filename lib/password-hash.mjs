import { promisify } from 'node:util';
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';

const scrypt = promisify(scryptCallback);
const KEY_BYTES = 64;
const SALT_BYTES = 16;
const MIN_PASSWORD_LENGTH = 12;
const MAX_PASSWORD_LENGTH = 128;

export async function hashPassword(password) {
  if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH || password.length > MAX_PASSWORD_LENGTH) {
    throw new Error(`Sample password must be ${MIN_PASSWORD_LENGTH}–${MAX_PASSWORD_LENGTH} characters.`);
  }

  const salt = randomBytes(SALT_BYTES);
  const derivedKey = await scrypt(password, salt, KEY_BYTES);
  return `scrypt$${salt.toString('hex')}$${Buffer.from(derivedKey).toString('hex')}`;
}

export async function verifyPassword(password, encodedHash) {
  if (typeof password !== 'string' || typeof encodedHash !== 'string') return false;

  const [scheme, saltHex, keyHex, extra] = encodedHash.split('$');
  if (
    scheme !== 'scrypt'
    || extra !== undefined
    || !/^[a-f\d]{32}$/i.test(saltHex ?? '')
    || !/^[a-f\d]{128}$/i.test(keyHex ?? '')
  ) {
    return false;
  }

  const expected = Buffer.from(keyHex, 'hex');
  const actual = Buffer.from(await scrypt(password, Buffer.from(saltHex, 'hex'), KEY_BYTES));
  return timingSafeEqual(actual, expected);
}

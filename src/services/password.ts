import CryptoJS from 'crypto-js';

// Simple salted SHA256 (NOT perfect for password storage — for demo only).
// For production use PBKDF2/scrypt + Keychain/KMS.

const SALT = 'your-app-salt-change-this';

export function hashPassword(plain: string) {
  return CryptoJS.SHA256(`${SALT}:${plain}`).toString();
}

export function verifyPassword(plain: string, hash: string) {
  return hashPassword(plain) === hash;
}

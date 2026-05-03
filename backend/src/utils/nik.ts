import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

function getNikHashSecret() {
  const secret = process.env.NIK_HASH_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('NIK_HASH_SECRET or JWT_SECRET is not defined in environment variables');
  }
  return secret;
}

export function hashNik(nik: string) {
  return crypto.createHmac('sha256', getNikHashSecret()).update(nik).digest('hex');
}

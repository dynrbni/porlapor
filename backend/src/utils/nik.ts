import bcrypt from 'bcrypt';

const NIK_SALT_ROUNDS = 10;

export async function hashNik(nik: string) {
  return bcrypt.hash(nik, NIK_SALT_ROUNDS);
}

export async function compareNik(nik: string, hash: string) {
  return bcrypt.compare(nik, hash);
}

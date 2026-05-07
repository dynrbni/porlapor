type GenderValue = 'LAKI_LAKI' | 'PEREMPUAN';

const GENDER_ALIASES: Record<string, GenderValue> = {
  LAKI_LAKI: 'LAKI_LAKI',
  'LAKI-LAKI': 'LAKI_LAKI',
  'LAKI LAKI': 'LAKI_LAKI',
  MALE: 'LAKI_LAKI',
  PEREMPUAN: 'PEREMPUAN',
  WANITA: 'PEREMPUAN',
  FEMALE: 'PEREMPUAN',
};

export function normalizeGender(input: unknown): GenderValue | null | undefined {
  if (input === undefined || input === null || input === '') {
    return undefined;
  }

  if (typeof input !== 'string') {
    return null;
  }

  const value = input.trim().toUpperCase();
  if (!value) {
    return undefined;
  }

  const normalizedValue = value.replace(/\s+/g, ' ');
  return GENDER_ALIASES[normalizedValue] ?? GENDER_ALIASES[normalizedValue.replace(/-/g, '_')] ?? null;
}
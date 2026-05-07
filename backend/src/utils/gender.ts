type GenderValue = 'MALE' | 'FEMALE';

const VALID_GENDERS: GenderValue[] = ['MALE', 'FEMALE'];

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

  return VALID_GENDERS.includes(value as GenderValue) ? (value as GenderValue) : null;
}
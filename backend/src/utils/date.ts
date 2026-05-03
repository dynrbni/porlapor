const MONTHS: Record<string, number> = {
  januari: 1,
  februari: 2,
  maret: 3,
  april: 4,
  mei: 5,
  juni: 6,
  juli: 7,
  agustus: 8,
  september: 9,
  oktober: 10,
  november: 11,
  desember: 12,
};

function isValidDateParts(year: number, month: number, day: number) {
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return false;
  }
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }

  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function pad2(value: number) {
  return value.toString().padStart(2, '0');
}

export function normalizeBirthDate(input: string) {
  const value = input.trim();
  if (!value) {
    return null;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    if (!isValidDateParts(year, month, day)) {
      return null;
    }
    return value;
  }

  const numeric = value.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (numeric) {
    const day = Number(numeric[1]);
    const month = Number(numeric[2]);
    const year = Number(numeric[3]);
    if (!isValidDateParts(year, month, day)) {
      return null;
    }
    return `${year}-${pad2(month)}-${pad2(day)}`;
  }

  const words = value.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (words) {
    const day = Number(words[1]);
    const monthName = words[2].toLowerCase();
    const year = Number(words[3]);
    const month = MONTHS[monthName];
    if (!month || !isValidDateParts(year, month, day)) {
      return null;
    }
    return `${year}-${pad2(month)}-${pad2(day)}`;
  }

  return null;
}

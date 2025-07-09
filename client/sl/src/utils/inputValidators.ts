export function isDecimalString(value: string): boolean {
  if (value === "") return true;
  return /^(\d+)?\.?\d*$/.test(value);
}

export function isNonNegativeIntegerString(value: string): boolean {
  if (value === "") return true;
  return /^\d+$/.test(value);
}

export function isPositiveNumberString(value: string): boolean {
  if (value === "") return true;
  return /^(\d+(\.\d+)?|\.\d+)$/.test(value);
}

export function round(num: number) {
  return Math.round( num * 100 ) / 100;
}
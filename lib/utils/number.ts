export function parseNumberInput(value: string): number | undefined {
  return value === "" ? undefined : Number(value);
}
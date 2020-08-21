export function valueToLuminance(value: number, saturation: number): number {
  return value * (1 - saturation / 2);
}
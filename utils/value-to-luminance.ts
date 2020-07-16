export function valueToLuminance(value: number, saturation: number) {
  return value * (1 - saturation / 2);
}
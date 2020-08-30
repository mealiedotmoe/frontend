import Constants from './constants.json';

export function componentToHex(c: number): string {
  const hex = c.toString(Constants.HEX_BASE);
  return hex.length == 1 ? "0" + hex : hex;
}

export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
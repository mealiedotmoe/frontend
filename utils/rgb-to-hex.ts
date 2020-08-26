import Constants from './constants.json';

export function componentToHex(c: number): string {
  return c.toString(Constants.HEX_BASE);
}

export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
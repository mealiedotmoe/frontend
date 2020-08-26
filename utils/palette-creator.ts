export const CANVAS_HEIGHT = 360;
export const CANVAS_WIDTH = 300;
import Constants from "./constants.json";

export function paletteCreator(roleColorMap: { [key: string]: string; }, username: string): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Palette design is created here
  // https://www.figma.com/file/QQdg0q5vy5lbg6FOH75FQ0/Mealie-Redesign?node-id=126%3A296

  ctx.fillStyle = 'rgba(54,57,63,1)';
  ctx.fillRect(
    Constants.GENERATED_PALETTE_CANVAS.imageStartPos.x,
    Constants.GENERATED_PALETTE_CANVAS.imageStartPos.y,
    canvas.width,
    canvas.height
  );

  // Generate the header first
  ctx.font = "500 24px Inter";
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.fillText(
    "Color Palette",
    Constants.GENERATED_PALETTE_CANVAS.titlePos.x,
    Constants.GENERATED_PALETTE_CANVAS.titlePos.y
  );

  // Generate subtitle
  ctx.font = "400 11px Inter";
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.fillText(
    "Generated at https://mealie.moe/palette",
    Constants.GENERATED_PALETTE_CANVAS.subtitlePos.x,
    Constants.GENERATED_PALETTE_CANVAS.subtitlePos.y
  );

  // Generate role-color entries
  const offset = 60;
  Object.keys(roleColorMap).forEach((role, index) => {
    ctx.fillStyle = roleColorMap[role];
    ctx.font = "700 20px Inter";
    ctx.fillText(
      role,
      Constants.GENERATED_PALETTE_CANVAS.roleNamePos.x, 
      offset + (index + Constants.GENERATED_PALETTE_CANVAS.indexIncrement) * Constants.GENERATED_PALETTE_CANVAS.roleHeight
    );
    ctx.font = "600 20px 'Overpass Mono'";
    ctx.fillText(
      roleColorMap[role].toLocaleUpperCase(),
      Constants.GENERATED_PALETTE_CANVAS.roleColorPos.x,
      offset + (index + Constants.GENERATED_PALETTE_CANVAS.indexIncrement) * Constants.GENERATED_PALETTE_CANVAS.roleHeight
    );
  });

  ctx.font = "400 10px Inter";
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.fillText(
    `Made by ${username}`,
    Constants.GENERATED_PALETTE_CANVAS.paletteAuthorPos.x,
    Constants.GENERATED_PALETTE_CANVAS.paletteAuthorPos.y
  );

  return canvas;
}
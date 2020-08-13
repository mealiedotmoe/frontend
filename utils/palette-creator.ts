export function paletteCreator(roleColorMap: { [key: string]: string; }, username: string): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 360;

  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Palette design is created here
  // https://www.figma.com/file/QQdg0q5vy5lbg6FOH75FQ0/Mealie-Redesign?node-id=126%3A296

  ctx.fillStyle = 'rgba(54,57,63,1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Generate the header first
  ctx.font = "500 24px Inter";
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.fillText("Color Palette", 15, 36);

  // Generate subtitle
  ctx.font = "400 11px Inter";
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.fillText("Generated at https://mealie.moe", 15, 56);

  // Generate role-color entries
  const offset = 60;
  Object.keys(roleColorMap).forEach((role, index) => {
    ctx.fillStyle = roleColorMap[role];
    ctx.font = "700 20px Inter";
    ctx.fillText(role, 15, offset + (index + 1) * 30);
    ctx.font = "700 20px monospace";
    ctx.fillText(roleColorMap[role].toLocaleUpperCase(), 195, offset + (index + 1) * 30);
  });

  ctx.font = "400 10px Inter";
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.fillText(`Made by ${username}`, 219, 350);

  return canvas;
}
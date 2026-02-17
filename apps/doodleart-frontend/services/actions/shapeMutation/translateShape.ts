import { Shape } from "@/services/types";

export function translateShapes(
  shape: Shape,
  delx: number,
  dely: number,
): Shape {
  const type = shape.type;
  if (type === "rect" || type === "text" || type === "diamond") {
    return { ...shape, x: shape.x + delx, y: shape.y + dely };
  } else if (type === "elip") {
    return {
      ...shape,
      centerX: shape.centerX + delx,
      centerY: shape.centerY + dely,
    };
  } else if (type === "line") {
    return {
      ...shape,
      startX: shape.startX + delx,
      startY: shape.startY + dely,
      endX: shape.endX + delx,
      endY: shape.endY + dely,
    };
  } else if (type === "pencil") {
    return {
      ...shape,
      x: shape.x + delx,
      y: shape.y + dely,
      pencilCoords: shape.pencilCoords.map((p) => ({
        x: p.x + delx,
        y: p.y + dely,
      })),
    };
  }

  return shape; // fallback — TypeScript is happy, runtime is safe
}

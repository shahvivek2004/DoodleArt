import { Shape } from "@/services/types";

export function translateShapes(shape: Shape, delx: number, dely: number) {
  let newShape = null;
  const type = shape.type;
  if (type === "rect" || type == "text" || type == "diamond") {
    newShape = { ...shape };
    newShape.x += delx;
    newShape.y += dely;
  } else if (type === "elip") {
    newShape = { ...shape };
    newShape.centerX += delx;
    newShape.centerY += dely;
  } else if (type === "line") {
    newShape = { ...shape };
    newShape.startX += delx;
    newShape.startY += dely;
    newShape.endX += delx;
    newShape.endY += dely;
  } else if (type === "pencil") {
    newShape = {
      ...shape,
      pencilCoords: shape.pencilCoords.map((p) => ({ ...p })),
    };
    const len = newShape.pencilCoords.length;
    for (let i = 0; i < len; i++) {
      newShape.pencilCoords[i].x += delx;
      newShape.pencilCoords[i].y += dely;
    }
  }

  return newShape;
}

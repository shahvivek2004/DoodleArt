import {
  Diamond,
  Ellipse,
  Line,
  Pencil,
  Rectangle,
  TextShape,
  textState,
} from "../../types";

export function hitLine(
  x: number,
  y: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  tolerance: number,
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (!len) return false;

  const dist = Math.abs(dy * (x - x1) - dx * (y - y1)) / len;
  if (dist > tolerance) return false;

  return (
    x >= Math.min(x1, x2) - tolerance &&
    x <= Math.max(x1, x2) + tolerance &&
    y >= Math.min(y1, y2) - tolerance &&
    y <= Math.max(y1, y2) + tolerance
  );
}

export function rectHit(
  shape: Rectangle,
  x: number,
  y: number,
  tol: number,
  checkFill: boolean,
) {
  const x1 = shape.x;
  const y1 = shape.y;
  const x2 = x1 + shape.width;
  const y2 = y1 + shape.height;

  const onEdge =
    (y >= y1 && y <= y2 && Math.abs(x - x1) <= tol) ||
    (y >= y1 && y <= y2 && Math.abs(x - x2) <= tol) ||
    (x >= x1 && x <= x2 && Math.abs(y - y1) <= tol) ||
    (x >= x1 && x <= x2 && Math.abs(y - y2) <= tol);

  if (!checkFill) {
    return onEdge;
  }

  const inside = x > x1 && x < x2 && y > y1 && y < y2;

  return onEdge || inside;
}

export function ellipseHit(
  shape: Ellipse,
  x: number,
  y: number,
  checkFill: boolean,
) {
  const p =
    (x - shape.centerX) ** 2 / shape.radiusX ** 2 +
    (y - shape.centerY) ** 2 / shape.radiusY ** 2;

  const onEdge = Math.abs(p - 1) <= 0.25;

  if (!checkFill) {
    return onEdge;
  }

  const inside = p < 1;

  return onEdge || inside;
}

export function diamondHit(
  shape: Diamond,
  x: number,
  y: number,
  checkFill: boolean,
) {
  const cx = shape.x + shape.width / 2;
  const cy = shape.y + shape.height / 2;
  const hw = shape.width / 2;
  const hh = shape.height / 2;

  const dx = Math.abs(x - cx);
  const dy = Math.abs(y - cy);
  const d = dx / hw + dy / hh;

  const t = 0.1;
  const onEdge = d >= 1 - t && d <= 1 + t;

  if (!checkFill) {
    return onEdge;
  }

  const inside = d < 1;

  return onEdge || inside;
}

export function lineHit(shape: Line, x: number, y: number, scale: number) {
  return hitLine(
    x,
    y,
    shape.startX,
    shape.startY,
    shape.endX,
    shape.endY,
    10 / scale,
  );
}

export function pencilHit(shape: Pencil, x: number, y: number, scale: number) {
  const tol = 10 / scale;
  for (let i = 1; i < shape.pencilCoords.length; i++) {
    const a = shape.pencilCoords[i - 1];
    const b = shape.pencilCoords[i];
    if (hitLine(x, y, a.x, a.y, b.x, b.y, tol)) return true;
  }
  return false;
}

export function textHit(
  shape: TextShape,
  x: number,
  y: number,
  textState: textState,
  scale: number,
) {
  const tol = 12 / scale;
  const width = shape.width ?? 150;
  const height = (shape.nol ?? 1) * 1.2 * textState.fontSize;

  return (
    x >= shape.x - tol &&
    x <= shape.x + width + tol &&
    y >= shape.y + textState.fontVertOffset - tol &&
    y <= shape.y + height + textState.fontVertOffset + tol
  );
}

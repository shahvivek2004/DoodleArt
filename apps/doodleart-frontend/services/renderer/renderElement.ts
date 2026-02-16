import { previewState, Shape } from "../types";

export function drawRect(
  ctx: CanvasRenderingContext2D,
  fillStyle: string,
  strokeStyle: string,
  strokeWidth: number,
  x: number,
  y: number,
  w: number,
  h: number,
  r?: number,
) {
  let radius = 25;
  if (r) {
    radius = r;
  }
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, [radius]);
  if (fillStyle !== "transparent") ctx.fill();
  if (strokeStyle && strokeWidth > 0) ctx.stroke();
}

export function drawEllipse(
  ctx: CanvasRenderingContext2D,
  fillStyle: string,
  strokeStyle: string,
  strokeWidth: number,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
) {
  ctx.beginPath();
  ctx.ellipse(cx, cy, Math.abs(rx), Math.abs(ry), 0, 0, 2 * Math.PI);

  if (fillStyle !== "transparent") ctx.fill();
  if (strokeStyle && strokeWidth > 0) ctx.stroke();
}

export function drawDiamond(
  ctx: CanvasRenderingContext2D,
  fillStyle: string,
  strokeStyle: string,
  strokeWidth: number,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const cx = x + w / 2;
  const cy = y + h / 2;

  const pts = [
    { x: cx, y: y }, // top
    { x: x + w, y: cy }, // right
    { x: cx, y: y + h }, // bottom
    { x: x, y: cy }, // left
  ];

  const roundness = 0.1;

  const halfW = w / 2;
  const halfH = h / 2;
  const edge = Math.sqrt(halfW * halfW + halfH * halfH);
  const r = edge * roundness;

  ctx.beginPath();

  for (let i = 0; i < pts.length; i++) {
    const prev = pts[(i + 3) % 4];
    const curr = pts[i];
    const next = pts[(i + 1) % 4];

    // vectors
    const v1x = curr.x - prev.x;
    const v1y = curr.y - prev.y;
    const v2x = next.x - curr.x;
    const v2y = next.y - curr.y;

    // normalize
    const l1 = Math.hypot(v1x, v1y);
    const l2 = Math.hypot(v2x, v2y);

    const p1x = curr.x - (v1x / l1) * r;
    const p1y = curr.y - (v1y / l1) * r;
    const p2x = curr.x + (v2x / l2) * r;
    const p2y = curr.y + (v2y / l2) * r;

    if (i === 0) ctx.moveTo(p1x, p1y);
    else ctx.lineTo(p1x, p1y);

    ctx.quadraticCurveTo(curr.x, curr.y, p2x, p2y);
  }

  ctx.closePath();
  if (fillStyle !== "transparent") ctx.fill();
  if (strokeStyle && strokeWidth > 0) ctx.stroke();
}

export function drawLine(
  ctx: CanvasRenderingContext2D,
  strokeStyle: string,
  strokeWidth: number,
  sx: number,
  sy: number,
  ex: number,
  ey: number,
) {
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.lineTo(ex, ey);
  if (strokeStyle && strokeWidth > 0) ctx.stroke();
}

export function drawPencil(
  ctx: CanvasRenderingContext2D,
  strokeStyle: string,
  strokeWidth: number,
  pencilCoords: Array<{ x: number; y: number }>,
) {
  if (pencilCoords && pencilCoords.length > 0) {
    ctx.beginPath();

    const coords = pencilCoords;

    if (coords.length < 3) {
      ctx.moveTo(coords[0].x, coords[0].y);
      for (let i = 1; i < coords.length; i++) {
        ctx.lineTo(coords[i].x, coords[i].y);
      }
    } else {
      // Use quadratic curves for smoothing
      ctx.moveTo(coords[0].x, coords[0].y);

      for (let i = 1; i < coords.length - 1; i++) {
        const currentPoint = coords[i];
        const nextPoint = coords[i + 1];

        const endX = (currentPoint.x + nextPoint.x) / 2;
        const endY = (currentPoint.y + nextPoint.y) / 2;

        ctx.quadraticCurveTo(currentPoint.x, currentPoint.y, endX, endY);
      }

      // Draw final segment
      const lastPoint = coords[coords.length - 1];
      ctx.lineTo(lastPoint.x, lastPoint.y);
    }
    if (strokeStyle && strokeWidth > 0) ctx.stroke();
  }
}

export function drawText(
  ctx: CanvasRenderingContext2D,
  fontSize: number,
  x: number,
  y: number,
  content: string,
) {
  const lineHeight = 1.2 * fontSize;
  const offset = 8;

  const lines = content.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x, y + fontSize + offset + i * lineHeight);
  }
}

export function drawShape(
  shape: previewState | Shape,
  ctx: CanvasRenderingContext2D,
  themeStyle: string,
) {
  const defaultStrokeColor = themeStyle === "b" ? "#ffffff" : "#000000";
  if (shape.type === "rect") {
    const { x, y, width: w, height: h } = shape;
    drawRect(
      ctx,
      shape.fillStyle ?? "transparent",
      shape.strokeStyle ?? defaultStrokeColor,
      shape.strokeWidth ?? 4,
      x,
      y,
      w,
      h,
    );
  } else if (shape.type === "elip") {
    const { centerX: cx, centerY: cy, radiusX: rx, radiusY: ry } = shape;
    drawEllipse(
      ctx,
      shape.fillStyle ?? "transparent",
      shape.strokeStyle ?? defaultStrokeColor,
      shape.strokeWidth ?? 4,
      cx,
      cy,
      rx,
      ry,
    );
  } else if (shape.type === "diamond") {
    const { x, y, width: w, height: h } = shape;
    drawDiamond(
      ctx,
      shape.fillStyle ?? "transparent",
      shape.strokeStyle ?? defaultStrokeColor,
      shape.strokeWidth ?? 4,
      x,
      y,
      w,
      h,
    );
  } else if (shape.type === "line") {
    const { startX: x1, startY: y1, endX: x2, endY: y2 } = shape;
    drawLine(
      ctx,
      shape.strokeStyle ?? defaultStrokeColor,
      shape.strokeWidth ?? 4,
      x1,
      y1,
      x2,
      y2,
    );
  } else if (shape.type === "pencil") {
    const { pencilCoords } = shape;
    drawPencil(
      ctx,
      shape.strokeStyle ?? defaultStrokeColor,
      shape.strokeWidth ?? 4,
      pencilCoords,
    );
  } else if (shape.type === "text") {
    const { x, y, content: c } = shape;
    drawText(ctx, shape.fontSize ?? 20, x, y, c);
  }
}

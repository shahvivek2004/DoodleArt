import { themeState, Tool } from "./types";
import {
  diamondHit,
  ellipseHit,
  lineHit,
  pencilHit,
  rectHit,
  textHit,
} from "./actions/shapeDetection/ShapeDetection";
import {
  Bounds,
  cameraState,
  canvasState,
  Shape,
  textState,
  ToolBuilder,
} from "./types";

export function round(x: number) {
  x = (x + 0.5) | 0;
  return x;
}

export function getViewport(
  dpr: number,
  canvasState: canvasState,
  viewState: cameraState,
) {
  const { panx, pany, scale } = viewState;
  const { stCanvas: canvas } = canvasState;

  const cssW = canvas.width / dpr;
  const cssH = canvas.height / dpr;

  const x = -panx / scale;
  const y = -pany / scale;
  const w = cssW / scale;
  const h = cssH / scale;

  return { x, y, w, h };
}

export function isVisible(
  shape: Shape,
  viewport: { x: number; y: number; w: number; h: number },
  textState: textState,
): boolean {
  let sx = 0,
    sy = 0,
    sw = 0,
    sh = 0;

  switch (shape.type) {
    case "rect":
    case "diamond": {
      sx = shape.x;
      sy = shape.y;
      sw = shape.width;
      sh = shape.height;
      break;
    }

    case "elip": {
      sx = shape.centerX - shape.radiusX;
      sy = shape.centerY - shape.radiusY;
      sw = shape.radiusX * 2;
      sh = shape.radiusY * 2;
      break;
    }

    case "line": {
      sx = Math.min(shape.startX, shape.endX);
      sy = Math.min(shape.startY, shape.endY);
      sw = Math.abs(shape.endX - shape.startX);
      sh = Math.abs(shape.endY - shape.startY);
      break;
    }

    case "pencil": {
      sx = shape.x;
      sy = shape.y;
      sw = shape.width;
      sh = shape.height;
      break;
    }

    case "text": {
      sx = shape.x;
      sy = shape.y;
      sw = shape.width;
      sh = 1.2 * shape.nol * textState.fontSize + textState.fontVertOffset; // ⚠️ approx line height (fontSize later)
      break;
    }

    default:
      return true; // fail-open for future shapes
  }

  // ---- AABB overlap ----
  const vx2 = viewport.x + viewport.w;
  const vy2 = viewport.y + viewport.h;
  const sx2 = sx + sw;
  const sy2 = sy + sh;

  return sx < vx2 && sx2 > viewport.x && sy < vy2 && sy2 > viewport.y;
}

// for checking if element really moved or not
export function checkDifference(s1: Shape, s2: Shape) {
  if (s1.id === s2.id || s1.pid === s2.pid) {
    if (s1.type === "rect" && s2.type === "rect") {
      return (
        s1.height !== s2.height ||
        s1.width !== s2.width ||
        s1.x !== s2.x ||
        s1.y !== s2.y
      );
    } else if (s1.type === "elip" && s2.type === "elip") {
      return (
        s1.centerX !== s2.centerX ||
        s1.centerY !== s2.centerY ||
        s1.radiusX !== s2.radiusX ||
        s1.radiusY !== s2.radiusY
      );
    } else if (s1.type === "line" && s2.type === "line") {
      return (
        s1.startX !== s2.startX ||
        s1.endX !== s2.endX ||
        s1.startY !== s2.startY ||
        s1.endY !== s2.endY
      );
    } else if (s1.type === "pencil" && s2.type === "pencil") {
      if (s1.pencilCoords.length !== s2.pencilCoords.length) return true;
      return (
        s1.pencilCoords[0].x !== s2.pencilCoords[0].x ||
        s1.pencilCoords[0].y !== s2.pencilCoords[0].y
      );
    } else if (s1.type === "text" && s2.type === "text") {
      return (
        s1.content !== s2.content ||
        s1.nol !== s2.nol ||
        s1.width !== s2.width ||
        s1.x !== s2.x ||
        s1.y !== s2.y
      );
    } else if (s1.type === "diamond" && s2.type === "diamond") {
      return (
        s1.height !== s2.height ||
        s1.width !== s2.width ||
        s1.x !== s2.x ||
        s1.y !== s2.y
      );
    }
  }

  return false;
}

export function getShapeBounds(
  shape: Shape,
  textState: textState,
): Bounds | null {
  switch (shape.type) {
    case "rect":
    case "diamond":
      return { x: shape.x, y: shape.y, w: shape.width, h: shape.height };

    case "elip":
      return {
        x: shape.centerX - shape.radiusX,
        y: shape.centerY - shape.radiusY,
        w: shape.radiusX * 2,
        h: shape.radiusY * 2,
      };

    case "line": {
      const x1 = shape.startX;
      const y1 = shape.startY;
      const x2 = shape.endX;
      const y2 = shape.endY;

      const minX = Math.min(x1, x2);
      const minY = Math.min(y1, y2);
      const maxX = Math.max(x1, x2);
      const maxY = Math.max(y1, y2);

      const pad = x1 === x2 || y1 === y2 ? 2 : 0; // thin lines
      return {
        x: minX - pad,
        y: minY - pad,
        w: maxX - minX + pad * 2,
        h: maxY - minY + pad * 2,
      };
    }

    case "text": {
      const nol = shape.nol ?? 1;
      const lineHeight = 1.2 * (shape.fontSize ?? textState.fontSize);
      return {
        x: shape.x,
        y: shape.y + textState.fontVertOffset,
        w: shape.width ?? 150,
        h: nol * lineHeight,
      };
    }

    case "pencil": {
      return { x: shape.x, y: shape.y, w: shape.width, h: shape.height };
    }

    default:
      return null;
  }
}

export function hitTest(
  shape: Shape,
  x: number,
  y: number,
  viewState: cameraState,
  textState: textState,
  checkFill: boolean,
) {
  const tol = 10 / viewState.scale;

  switch (shape.type) {
    case "rect":
      return rectHit(shape, x, y, tol, checkFill);
    case "diamond":
      return diamondHit(shape, x, y, checkFill);
    case "elip":
      return ellipseHit(shape, x, y, checkFill);
    case "line":
      return lineHit(shape, x, y, viewState.scale);
    case "pencil":
      return pencilHit(shape, x, y, viewState.scale);
    case "text":
      return textHit(shape, x, y, textState, viewState.scale);

    default:
      return false;
  }
}

export function getDragMetrics(
  startX: number,
  startY: number,
  x: number,
  y: number,
  themeState: themeState,
  textState: textState,
) {
  const dx = x - startX;
  const dy = y - startY;

  return {
    startX,
    startY,
    x,
    y,
    dx,
    dy,
    absW: Math.abs(dx),
    absH: Math.abs(dy),
    minX: Math.min(startX, x),
    minY: Math.min(startY, y),
    centerX: startX + dx / 2,
    centerY: startY + dy / 2,
    themeState,
    textState,
  };
}

export const TOOL_BUILDERS: Record<Tool, ToolBuilder> = {
  rect: ({ metrics }) => {
    if (metrics.absW <= 1 || metrics.absH <= 1) return null;
    return {
      type: "rect",
      x: metrics.minX,
      y: metrics.minY,
      width: metrics.absW,
      height: metrics.absH,
      strokeStyle: metrics.themeState.strokeStyle,
      strokeType: metrics.themeState.strokeType,
      strokeWidth: metrics.themeState.strokeWidth,
      fillStyle: metrics.themeState.fillStyle,
      pid: "",
    };
  },

  elip: ({ metrics }) => {
    if (metrics.absW <= 1 || metrics.absH <= 1) return null;
    return {
      type: "elip",
      centerX: metrics.centerX,
      centerY: metrics.centerY,
      radiusX: metrics.absW / 2,
      radiusY: metrics.absH / 2,
      strokeStyle: metrics.themeState.strokeStyle,
      strokeType: metrics.themeState.strokeType,
      strokeWidth: metrics.themeState.strokeWidth,
      fillStyle: metrics.themeState.fillStyle,
      pid: "",
    };
  },

  line: ({ metrics }) => {
    const dist = Math.hypot(metrics.dx, metrics.dy);
    if (dist <= 1) return null;
    return {
      type: "line",
      startX: metrics.startX,
      startY: metrics.startY,
      endX: metrics.x,
      endY: metrics.y,
      strokeStyle: metrics.themeState.strokeStyle,
      strokeType: metrics.themeState.strokeType,
      strokeWidth: metrics.themeState.strokeWidth,
      pid: "",
    };
  },

  diamond: ({ metrics }) => {
    if (metrics.absW <= 1 || metrics.absH <= 1) return null;
    return {
      type: "diamond",
      x: metrics.minX,
      y: metrics.minY,
      width: metrics.absW,
      height: metrics.absH,
      strokeStyle: metrics.themeState.strokeStyle,
      strokeType: metrics.themeState.strokeType,
      strokeWidth: metrics.themeState.strokeWidth,
      fillStyle: metrics.themeState.fillStyle,
      pid: "",
    };
  },

  pencil: ({ previewState }) => {
    if (previewState?.type !== "pencil") return null;
    return {
      type: "pencil",
      x: previewState.x,
      y: previewState.y,
      width: previewState.width,
      height: previewState.height,
      pencilCoords: [...previewState.pencilCoords],
      strokeStyle: previewState.strokeStyle,
      strokeType: previewState.strokeType,
      strokeWidth: previewState.strokeWidth,
      pid: "",
    };
  },

  text: () => {
    return null;
  },

  cursor: () => {
    return null;
  },

  grab: () => {
    return null;
  },
};

// keys should be in type-color-size-fill
export function createStyleKey(shape: Shape, themeStyle: string = "b") {
  const defaultStrokeColor = themeStyle === "b" ? "#ffffff" : "#000000";
  if (shape.type === "text") {
    const type = shape.fontType ?? "Finger Paint";
    const color = shape.fontColor ?? "#ffffff";
    const size = shape.fontSize ?? 20;

    return `text-${type}-${color}-${size}`;
  } else if (shape.type === "line" || shape.type === "pencil") {
    const type = shape.strokeType ?? "solid";
    const color = shape.strokeStyle ?? defaultStrokeColor;
    const size = shape.strokeWidth ?? 4;

    return `${type}-${color}-${size}`;
  } else {
    const type = shape.strokeType ?? "solid";
    const color = shape.strokeStyle ?? defaultStrokeColor;
    const size = shape.strokeWidth ?? 4;
    const fill = shape.fillStyle ?? "transparent";

    return `${type}-${color}-${size}-${fill}`;
  }
}

export function computePencilBounds(coords: Array<{ x: number; y: number }>) {
  let minX = Infinity,
    minY = Infinity;
  let maxX = -Infinity,
    maxY = -Infinity;
  for (const p of coords) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  return { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

export function simplifyRDP(
  points: { x: number; y: number }[],
  epsilon: number,
): { x: number; y: number }[] {
  if (points.length < 3) return points;

  const sqEps = epsilon * epsilon;

  const distSq = (
    p: { x: number; y: number },
    a: { x: number; y: number },
    b: { x: number; y: number },
  ) => {
    let x = a.x;
    let y = a.y;
    let dx = b.x - x;
    let dy = b.y - y;

    if (dx !== 0 || dy !== 0) {
      const t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy);
      if (t > 1) {
        x = b.x;
        y = b.y;
      } else if (t > 0) {
        x += dx * t;
        y += dy * t;
      }
    }

    dx = p.x - x;
    dy = p.y - y;
    return dx * dx + dy * dy;
  };

  const simplify = (
    pts: { x: number; y: number }[],
    first: number,
    last: number,
    out: { x: number; y: number }[],
  ) => {
    let maxDist = sqEps;
    let index = -1;

    for (let i = first + 1; i < last; i++) {
      const d = distSq(pts[i], pts[first], pts[last]);
      if (d > maxDist) {
        index = i;
        maxDist = d;
      }
    }

    if (index !== -1) {
      simplify(pts, first, index, out);
      simplify(pts, index, last, out);
    } else {
      out.push(pts[first]);
    }
  };

  const out: { x: number; y: number }[] = [];
  simplify(points, 0, points.length - 1, out);
  out.push(points[points.length - 1]);
  return out;
}

// // Display Functions
//   isShapeVisible(shape: Shape): boolean {
//     const margin = 50; // Extra margin for partially visible shapes
//     const viewportLeft = -this.panX / this.scale - margin;
//     const viewportTop = -this.panY / this.scale - margin;
//     const viewportRight =
//       viewportLeft + this.canvas.width / this.scale + margin;
//     const viewportBottom =
//       viewportTop + this.canvas.height / this.scale + margin;

//     // Check bounds based on shape type
//     switch (shape.type) {
//       case "rect":
//         return (
//           shape.x < viewportRight &&
//           shape.x + shape.width > viewportLeft &&
//           shape.y < viewportBottom &&
//           shape.y + shape.height > viewportTop
//         );
//       case "elip":
//         return (
//           shape.centerX - shape.radiusX < viewportRight &&
//           shape.centerX + shape.radiusX > viewportLeft &&
//           shape.centerY - shape.radiusY < viewportBottom &&
//           shape.centerY + shape.radiusY > viewportTop
//         );
//       case "line":
//         const minX = Math.min(shape.startX, shape.endX);
//         const maxX = Math.max(shape.startX, shape.endX);
//         const minY = Math.min(shape.startY, shape.endY);
//         const maxY = Math.max(shape.startY, shape.endY);
//         return (
//           minX < viewportRight &&
//           maxX > viewportLeft &&
//           minY < viewportBottom &&
//           maxY > viewportTop
//         );
//       case "pencil":
//         // Check if any part of pencil stroke is visible
//         return shape.pencilCoords.some(
//           (coord) =>
//             coord.x >= viewportLeft &&
//             coord.x <= viewportRight &&
//             coord.y >= viewportTop &&
//             coord.y <= viewportBottom,
//         );
//       default:
//         return true;
//     }
//   }

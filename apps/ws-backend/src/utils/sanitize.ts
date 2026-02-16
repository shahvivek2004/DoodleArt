import { Shape } from "./config";

export function sanitizeString(str: string) {
  if (typeof str !== "string") return "";

  return str
    .replace(/[<>]/g, "") // Remove HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
    .trim();
}

export function sanitizeNumber(num: number, min = -Infinity, max = Infinity) {
  if (typeof num !== "number" || isNaN(num)) return 0;
  return Math.max(min, Math.min(max, num));
}

export function sanitizeShape(shape: Shape) {
  if (!shape) {
    return null;
  }
  // console.log(shape);
  switch (shape.type) {
    case "rect":
      return {
        type: "rect",
        x: sanitizeNumber(shape.x),
        y: sanitizeNumber(shape.y),
        width: sanitizeNumber(shape.width),
        height: sanitizeNumber(shape.height),
        fillStyle: shape.fillStyle,
        strokeStyle: shape.strokeStyle,
        strokeWidth: shape.strokeWidth,
        strokeType: shape.strokeType,
      };

    case "elip":
      return {
        type: "elip",
        centerX: sanitizeNumber(shape.centerX),
        centerY: sanitizeNumber(shape.centerY),
        radiusX: sanitizeNumber(shape.radiusX),
        radiusY: sanitizeNumber(shape.radiusY),
        fillStyle: shape.fillStyle,
        strokeStyle: shape.strokeStyle,
        strokeWidth: shape.strokeWidth,
        strokeType: shape.strokeType,
      };

    case "diamond":
      return {
        type: "diamond",
        x: sanitizeNumber(shape.x),
        y: sanitizeNumber(shape.y),
        width: sanitizeNumber(shape.width),
        height: sanitizeNumber(shape.height),
        fillStyle: shape.fillStyle,
        strokeStyle: shape.strokeStyle,
        strokeWidth: shape.strokeWidth,
        strokeType: shape.strokeType,
      };

    case "line":
      return {
        type: "line",
        startX: sanitizeNumber(shape.startX),
        startY: sanitizeNumber(shape.startY),
        endX: sanitizeNumber(shape.endX),
        endY: sanitizeNumber(shape.endY),
        strokeStyle: shape.strokeStyle,
        strokeWidth: shape.strokeWidth,
        strokeType: shape.strokeType,
      };

    case "pencil":
      if (!Array.isArray(shape.pencilCoords)) {
        return null;
      }

      // Limit number of points to prevent DoS
      const maxPoints = 1000;
      const sanitizedCoords = shape.pencilCoords
        .slice(0, maxPoints)
        .map((coord) => {
          if (!coord || typeof coord !== "object") return null;
          return {
            x: sanitizeNumber(coord.x),
            y: sanitizeNumber(coord.y),
          };
        })
        .filter((coord) => coord !== null);

      if (sanitizedCoords.length === 0) {
        return null;
      }

      return {
        type: "pencil",
        pencilCoords: sanitizedCoords,
        strokeStyle: shape.strokeStyle,
        strokeWidth: shape.strokeWidth,
        strokeType: shape.strokeType,
      };

    case "text":
      return {
        type: "text",
        x: sanitizeNumber(shape.x),
        y: sanitizeNumber(shape.y),
        width: sanitizeNumber(shape.width),
        content: sanitizeString(shape.content),
        nol: sanitizeNumber(shape.nol),
        fontColor: shape.fontColor,
        fontSize: shape.fontSize,
        fontType: shape.fontType,
      };

    default:
      return null;
  }
}

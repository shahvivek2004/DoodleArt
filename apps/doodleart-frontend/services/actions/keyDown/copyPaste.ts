import { Shape } from "@/services/types";

export function buildClipboardShape(
  data: Shape,
  mx: number,
  my: number,
): Shape {
  switch (data.type) {
    case "rect":
      return {
        type: "rect",
        x: mx,
        y: my,
        width: data.width,
        height: data.height,
        pid: data.pid,
        id: data.id,
        strokeStyle: data.strokeStyle,
        fillStyle: data.fillStyle,
        strokeType: data.strokeType,
        strokeWidth: data.strokeWidth,
      };

    case "elip":
      return {
        type: "elip",
        centerX: mx,
        centerY: my,
        radiusX: data.radiusX,
        radiusY: data.radiusY,
        pid: data.pid,
        id: data.id,
        strokeStyle: data.strokeStyle,
        fillStyle: data.fillStyle,
        strokeType: data.strokeType,
        strokeWidth: data.strokeWidth,
      };

    case "line": {
      const w = data.endX - data.startX;
      const h = data.endY - data.startY;
      return {
        type: "line",
        startX: mx,
        startY: my,
        endX: mx + w,
        endY: my + h,
        pid: data.pid,
        id: data.id,
        strokeStyle: data.strokeStyle,
        strokeType: data.strokeType,
        strokeWidth: data.strokeWidth,
      };
    }

    case "text":
      return {
        type: "text",
        x: mx,
        y: my,
        content: data.content,
        width: data.width,
        nol: data.nol,
        pid: data.pid,
        id: data.id,
        fontColor: data.fontColor,
        fontSize: data.fontSize,
        fontType: data.fontType,
      };

    case "diamond":
      return {
        type: "diamond",
        x: mx - data.width / 2,
        y: my - data.height / 2,
        width: data.width,
        height: data.height,
        pid: data.pid,
        id: data.id,
        strokeStyle: data.strokeStyle,
        fillStyle: data.fillStyle,
        strokeType: data.strokeType,
        strokeWidth: data.strokeWidth,
      };

    default:
      return data;
  }
}

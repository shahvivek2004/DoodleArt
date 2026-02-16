import {
  cameraState,
  canvasState,
  previewState,
  Shape,
  textState,
  themeState,
} from "../types";
import { createStyleKey, getViewport, isVisible } from "../utils";
import { drawShape } from "./renderElement";
import { selector } from "./renderSelector";

export function staticCanvasRender(
  canvasState: canvasState,
  themeState: themeState,
  viewState: cameraState,
  textState: textState,
  shapes: Map<string, Shape>,
  dpr: number,
) {
  //console.log("st render");

  const { panx, pany, scale } = viewState;
  const { stCtx: ctx, stCanvas: canvas } = canvasState;
  const { bgColor, themeStyle } = themeState;

  const viewport = getViewport(dpr, canvasState, viewState);
  const groups = new Map<string, Shape[]>(); // key -> shapes

  for (const shape of shapes.values()) {
    if (!isVisible(shape, viewport, textState)) continue;

    // Build a composite key from style indices
    const key = createStyleKey(shape, themeStyle);
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(shape);
  }

  ctx.save();
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (bgColor) {
    ctx.fillStyle = bgColor;
  }
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * panx, dpr * pany);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (const [, group] of groups.entries()) {
    const first = group[0];

    if (first.type === "text") {
      const { fontSize, fontType } = first;
      let fontColor = first.fontColor;
      // console.log(fontColor);
      if (fontColor) {
        if (themeState.themeStyle === "b" && fontColor === "#000000") {
          fontColor = "#ffffff";
        }

        if (themeState.themeStyle === "w" && fontColor === "#ffffff") {
          fontColor = "#000000";
        }
        ctx.fillStyle = fontColor;
      }

      if (fontSize && fontType) {
        ctx.font = `${fontSize}px ${fontType}`;
      }
    } else {
      const sT = first.strokeType;
      let sS = first.strokeStyle;
      const sW = first.strokeWidth;

      if (sT && sW) {
        setLineDash(ctx, sT, sW);
        ctx.lineWidth = sW;
      }

      if (sS) {
        if (themeState.themeStyle === "b" && sS === "#000000") {
          sS = "#ffffff";
        }

        if (themeState.themeStyle === "w" && sS === "#ffffff") {
          sS = "#000000";
        }
        ctx.strokeStyle = sS;
      }

      if (
        first.type === "diamond" ||
        first.type === "elip" ||
        first.type === "rect"
      ) {
        const fS = first.fillStyle;
        if (fS && fS !== "transparent") {
          ctx.fillStyle = fS;
        }
      }
    }

    // Draw all shapes in this group
    for (const shape of group) {
      drawShape(shape, ctx, themeState.themeStyle);
    }
  }

  ctx.restore();
}

export function interactiveCanvasRender(
  canvasState: canvasState,
  themeState: themeState,
  viewState: cameraState,
  textState: textState,
  dpr: number,
  previewShape: previewState | null,
  selectedShape: Shape | null,
  isPreview: boolean,
) {
  //console.log("it render");
  const { panx, pany, scale } = viewState;
  const { itCtx: ctx, itCanvas: canvas } = canvasState;

  ctx.save();
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * panx, dpr * pany);

  const finalShape = isPreview ? previewShape : selectedShape;

  if (!isPreview && selectedShape) {
    selector(ctx, viewState, themeState, textState, selectedShape);
  }

  if (finalShape) {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (finalShape.type === "text") {
      if (finalShape.fontColor) {
        let fC = finalShape.fontColor;
        if (themeState.themeStyle === "b" && fC === "#000000") {
          fC = "#ffffff";
        }

        if (themeState.themeStyle === "w" && fC === "#ffffff") {
          fC = "#000000";
        }

        ctx.fillStyle = fC;
      }

      if (finalShape.fontSize && finalShape.fontType) {
        ctx.font = `${finalShape.fontSize}px ${finalShape.fontType}`;
      }
    } else {
      // Apply stroke type (line dash pattern)
      if (finalShape.strokeType && finalShape.strokeWidth) {
        setLineDash(ctx, finalShape.strokeType, finalShape.strokeWidth);
        ctx.lineWidth = finalShape.strokeWidth;
      }

      if (finalShape.strokeStyle) {
        let sS = finalShape.strokeStyle;
        if (themeState.themeStyle === "b" && sS === "#000000") {
          sS = "#ffffff";
        }

        if (themeState.themeStyle === "w" && sS === "#ffffff") {
          sS = "#000000";
        }

        ctx.strokeStyle = sS;
      }

      if (
        (finalShape.type === "diamond" ||
          finalShape.type === "rect" ||
          finalShape.type === "elip") &&
        finalShape.fillStyle &&
        finalShape.fillStyle !== "transparent"
      ) {
        ctx.fillStyle = finalShape.fillStyle;
      }
    }
    drawShape(finalShape, ctx, themeState.themeStyle);
  }

  ctx.restore();
}

export function clearInteractiveCanvas(canvasState: canvasState) {
  const { itCtx: ctx, itCanvas: canvas } = canvasState;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function setLineDash(
  ctx: CanvasRenderingContext2D,
  type: string,
  strokeWidth: number,
) {
  if (type === "dotted") {
    const dotLength = Math.max(1, strokeWidth * 0.1);
    const gapLength = strokeWidth * 2.5;
    ctx.setLineDash([dotLength, gapLength]);
  } else if (type === "dashed") {
    const dashLength = strokeWidth * 2.5;
    const gapLength = strokeWidth * 2.5;
    ctx.setLineDash([dashLength, gapLength]);
  } else {
    ctx.setLineDash([]);
  }
}

// ==========================================================================

// export const shapeCache: WeakMap<Shape, { canvas: HTMLCanvasElement, scale: number }> = new WeakMap();

// if (ele.type === "rect") {
//     const entry = shapeCache.get(ele);
//     let cachedCanvas = entry?.canvas;
//     if (!entry || !cachedCanvas || entry.scale !== prevScale) {
//         cachedCanvas = prerender(ele.w, ele.h, padding, activeState, prevState);
//         shapeCache.set(ele, { canvas: cachedCanvas, scale: prevScale });
//     }
//     ctx.drawImage(cachedCanvas, (ele.x - padding), (ele.y - padding), (cachedCanvas.width / dpr / prevScale), (cachedCanvas.height / dpr / prevScale));
// } else {
//     const { cx, cy, rx, ry } = ele;
//     drawElip(ctx, cx, cy, rx, ry);
// }

// function prerender(w: number, h: number, padding: number, appState: appState, prevState: viewState) {
//     const { dpr, strokeStyle, strokeWidth } = appState;
//     const { scale: zoom } = prevState;
//     const canvas = document.createElement('canvas');
//     const ctx = canvas.getContext('2d')!;

//     const { width, height, scale } = polishedParams(w, h, zoom, padding);

//     canvas.width = width;
//     canvas.height = height;
//     canvas.style.imageRendering = "pixelated";
//     ctx.imageSmoothingEnabled = false;

//     ctx.save();
//     ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);
//     ctx.beginPath();
//     ctx.strokeStyle = strokeStyle;
//     ctx.lineWidth = strokeWidth;
//     ctx.roundRect(padding, padding, w, h, 25);
//     ctx.stroke();
//     ctx.restore();

//     return canvas;
// }

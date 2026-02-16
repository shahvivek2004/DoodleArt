import { cameraState, Shape, textState, themeState } from "../types";
import { getShapeBounds } from "../utils";

export function selector(
  ctx: CanvasRenderingContext2D,
  viewState: cameraState,
  themeState: themeState,
  textState: textState,
  shape: Shape,
) {
  const bounds = getShapeBounds(shape, textState);
  if (!bounds) return;
  ctx.fillStyle = themeState.themeStyle === "b" ? "#000000" : "#ffffff";
  ctx.strokeStyle = themeState.selectorStroke;
  ctx.lineWidth = themeState.selectorStrokeWidth / viewState.scale;
  selectorShape(ctx, viewState, bounds.x, bounds.y, bounds.w, bounds.h);
}

function selectorShape(
  ctx: CanvasRenderingContext2D,
  viewState: cameraState,
  X: number,
  Y: number,
  W: number,
  H: number,
) {
  const { scale } = viewState;
  const P = 8 / scale; // choosen homogenous P-(for padding) (so x=y)
  const sqr = 8 / scale; // square, so width = heigth = 10
  ctx.beginPath();

  // top-circle
  ctx.ellipse(
    (2 * X + W) / 2,
    Y - 3 * P,
    4 / scale,
    4 / scale,
    0,
    0,
    2 * Math.PI,
  );

  // four-sqaures
  ctx.roundRect(X - P - sqr / 2, Y - P - sqr / 2, sqr, sqr, [2.15 / scale]); // top-left sqaure
  ctx.roundRect(X - P - sqr / 2, Y + H + P - sqr / 2, sqr, sqr, [2.15 / scale]); //bottom-left sqaure
  ctx.roundRect(X + W + P - sqr / 2, Y - P - sqr / 2, sqr, sqr, [2.15 / scale]); // top-right sqaure
  ctx.roundRect(X + W + P - sqr / 2, Y + H + P - sqr / 2, sqr, sqr, [
    2.15 / scale,
  ]); // bottom-right sqaure

  // left-line
  ctx.moveTo(X - P, Y - P + sqr / 2);
  ctx.lineTo(X - P, Y + H + P - sqr / 2);

  // top-line
  ctx.moveTo(X - P + sqr / 2, Y - P);
  ctx.lineTo(X + W + P - sqr / 2, Y - P);

  // right-line
  ctx.moveTo(X + W + P, Y - P + sqr / 2);
  ctx.lineTo(X + W + P, Y + H + P - sqr / 2);

  // bottom-line
  ctx.moveTo(X - P + sqr / 2, Y + H + P);
  ctx.lineTo(X + W + P - sqr / 2, Y + H + P);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

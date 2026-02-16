import { getDragMetrics } from "./utils";

export interface canvasState {
  itCtx: CanvasRenderingContext2D;
  itCanvas: HTMLCanvasElement;
  stCtx: CanvasRenderingContext2D;
  stCanvas: HTMLCanvasElement;
}

export interface cameraState {
  panx: number;
  pany: number;
  scale: number;
}

export interface themeState {
  themeStyle: string;
  bgColor: string;
  //---------------------
  fillStyle: string;
  strokeStyle: string;
  strokeWidth: number;
  strokeType: string;
  //----------------------
  selectorStroke: string;
  selectorStrokeWidth: number;
}

export interface selectionState {
  isSelecting: boolean;
  selectedShape: Shape | null;
  detectedShape: Shape | null;
}

export interface textState {
  fontType: string;
  fontColor: string;
  fontSize: number;
  fontVertOffset: number;
}

export type Bounds = { x: number; y: number; w: number; h: number };

export type Rectangle = {
  type: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
  fillStyle?: string;
  strokeStyle?: string;
  strokeWidth?: number;
  strokeType?: string;
};

export type Ellipse = {
  type: "elip";
  centerX: number;
  centerY: number;
  radiusX: number;
  radiusY: number;
  fillStyle?: string;
  strokeStyle?: string;
  strokeWidth?: number;
  strokeType?: string;
};

export type Diamond = {
  type: "diamond";
  x: number;
  y: number;
  width: number;
  height: number;
  fillStyle?: string;
  strokeStyle?: string;
  strokeWidth?: number;
  strokeType?: string;
};

export type Line = {
  type: "line";
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  strokeStyle?: string;
  strokeWidth?: number;
  strokeType?: string;
};

export type Pencil = {
  type: "pencil";
  pencilCoords: Array<{ x: number; y: number }>;
  strokeStyle?: string;
  strokeWidth?: number;
  strokeType?: string;
};

export type TextShape = {
  type: "text";
  x: number;
  y: number;
  content: string;
  width: number;
  nol: number;
  fontType?: string;
  fontColor?: string;
  fontSize?: number;
};

export type Cursor = {
  type: "cursor";
};

export type Grab = {
  type: "grab";
};

export type previewState =
  | Rectangle
  | Ellipse
  | Diamond
  | Pencil
  | Line
  | TextShape;
export type Shape = previewState & { id?: number; pid: string };
export type Tool =
  | "rect"
  | "pencil"
  | "elip"
  | "line"
  | "text"
  | "cursor"
  | "grab"
  | "diamond";

export type ToolBuilder = (ctx: BuildContext) => Shape | null;
export type BuildContext = {
  metrics: ReturnType<typeof getDragMetrics>;
  previewState: previewState | null;
};

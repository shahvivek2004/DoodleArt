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

export const MIN_PENCIL_DIST = 0.6; // world units
export type Pencil = {
  type: "pencil";
  pencilCoords: Array<{ x: number; y: number }>;
  x: number;
  y: number;
  width: number;
  height: number;
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

export const DEFAULT_VIEW_STATE = {
  panx: 0,
  pany: 0,
  scale: 1,
};

export const DEFAULT_THEME_STATE = {
  themeStyle: "b",
  bgColor: "#121212",
  fillStyle: "transparent",
  strokeStyle: "#ffffff",
  strokeWidth: 6,
  strokeType: "solid",
  selectorStroke: "#aba8ff",
  selectorStrokeWidth: 1,
};

export const DEFAULT_TEXT_STATE = {
  fontType: "Finger Paint",
  fontColor: "#ffffff",
  fontSize: 20,
  fontVertOffset: 8,
};

import { WebSocket } from "ws";

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

export const PING_INTERVAL = parseInt(process.env.PING_INTERVAL || "15000");
export const PING_TIMEOUT = parseInt(process.env.PING_TIMEOUT || "30000");

export interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
  pingTimeout?: NodeJS.Timeout;
  connectionTime: Date;
}

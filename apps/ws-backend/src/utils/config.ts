import { WebSocket } from "ws";

export type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
      id?: number;
    }
  | {
      type: "elip";
      centerX: number;
      centerY: number;
      radiusX: number;
      radiusY: number;
      id?: number;
    }
  | {
      type: "line";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      id?: number;
    }
  | {
      type: "pencil";
      pencilCoords: Array<{ x: number; y: number }>;
      id?: number;
    }
  | {
      type: "text";
      x: number;
      y: number;
      content: string;
      id?: number;
      width: number;
      nol: number | 1;
    }
  | {
      type: "cursor";
      id?: number;
    }
  | {
      type: "grab";
      id?: number;
    };

export const PING_INTERVAL = parseInt(process.env.PING_INTERVAL || "15000");
export const PING_TIMEOUT = parseInt(process.env.PING_TIMEOUT || "30000");

export interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
  pingTimeout?: NodeJS.Timeout;
  connectionTime: Date;
}

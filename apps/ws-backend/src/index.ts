import { WebSocketServer, WebSocket } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import env from "dotenv";
import { db } from "@repo/db/prismaClient";

// Global Variables
interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
  pingTimeout?: NodeJS.Timeout;
  connectionTime: Date;
  // messageCount: number
}

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
      color: string;
      strokeWidth: number;
      bgColor: string;
      lineDashX: number;
      lineDashY: number;
    }
  | {
      type: "elip";
      centerX: number;
      centerY: number;
      radiusX: number;
      radiusY: number;
      color: string;
      strokeWidth: number;
      bgColor: string;
      lineDashX: number;
      lineDashY: number;
    }
  | {
      type: "line";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      color: string;
      strokeWidth: number;
      lineDashX: number;
      lineDashY: number;
    }
  | {
      type: "pencil";
      pencilCoords: Array<{ x: number; y: number }>;
      color: string;
      strokeWidth: number;
      lineDashX: number;
      lineDashY: number;
    }
  | {
      type: "text";
      x: number;
      y: number;
      width: number;
      content: string;
      color: string;
      nol: number;
      strokeWidth: number;
      fontSize: number;
    }
  | {
      type: "cursor";
    }
  | {
      type: "grab";
    };

env.config();

let users: User[] = [];
// const MAX_CONNECTIONS = parseInt(process.env.MAX_CONNECTIONS || "1000");
// const MAX_MESSAGE_SIZE = parseInt(process.env.MAX_MESSAGE_SIZE || "10000");

const PING_INTERVAL = parseInt(process.env.PING_INTERVAL || "15000");
const PING_TIMEOUT = parseInt(process.env.PING_TIMEOUT || "30000");

// Rate limiting: 10 messages per minute per user
// const rateLimiter = new Map<string, { count: number, resetTime: number }>();

const wss = new WebSocketServer({
  port: parseInt(process.env.WEBSOCKET_PORT || "8080"),
  clientTracking: true,
  perMessageDeflate: {
    zlibDeflateOptions: {
      level: 6,
      memLevel: 8,
    },
  },
});

// Logging utility
// function log(level: 'info' | 'warn' | 'error', message: string, meta?: any) {
//     const timestamp = new Date().toISOString();
//     const logEntry = {
//         timestamp,
//         level,
//         message,
//         ...meta
//     };

//     if (process.env.NODE_ENV === 'production') {
//         // In production, use a proper logging service
//         console.log(JSON.stringify(logEntry));
//     } else {
//         console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`, meta || '');
//     }
// }

//-------------------------------------------------------------------------------------------------------------------------------

function tokenExtraction(url: string): string {
  const queryParams = new URLSearchParams(url.split("?")[1]);
  return queryParams.get("token") || "";
}

function checkUser(token: string): string | null {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET not configured");
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if (!decoded || !decoded.userId || typeof decoded === "string") {
      return null;
    }
    return decoded.userId;
  } catch (error) {
    //log('warn', 'Invalid token attempt', { error: (error instanceof Error ? error.message : String(error)) });
    return null;
  }
}

//---------------------------------------------------------------------------------------------------------------------------
// Sanitization utilities
function sanitizeString(str: string) {
  if (typeof str !== "string") return "";

  // Remove potentially dangerous characters and limit length
  return str
    .replace(/[<>]/g, "") // Remove HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
    .trim();
}

function sanitizeNumber(num: number, min = -Infinity, max = Infinity) {
  if (typeof num !== "number" || isNaN(num)) return 0;
  return Math.max(min, Math.min(max, num));
}

// function sanitizeColor(color: string) {
//     if (typeof color !== 'string') return '#000000';

//     // Allow hex colors, rgb, rgba, and named colors
//     const validColorPattern = /^(#[0-9a-fA-F]{3,8}|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)|[a-zA-Z]+)$/;

//     if (!validColorPattern.test(color)) {
//         return '#000000';
//     }

//     return color;
// }

function sanitizeShape(shape: Shape) {
  if (!shape) {
    return null;
  }

  // const baseConstraints = {
  //     strokeWidth: { min: 0, max: 50 },
  //     coordinate: { min: -10000, max: 10000 },
  //     size: { min: 0, max: 5000 },
  //     fontSize: { min: 8, max: 200 }
  // };

  switch (shape.type) {
    case "rect":
      return {
        type: "rect",
        x: sanitizeNumber(shape.x),
        y: sanitizeNumber(shape.y),
        width: sanitizeNumber(shape.width),
        height: sanitizeNumber(shape.height),
        // color: sanitizeColor(shape.color),
        // strokeWidth: sanitizeNumber(shape.strokeWidth, baseConstraints.strokeWidth.min, baseConstraints.strokeWidth.max),
        // bgColor: sanitizeColor(shape.bgColor),
        // lineDashX: sanitizeNumber(shape.lineDashX, 0, 100),
        // lineDashY: sanitizeNumber(shape.lineDashY, 0, 100)
      };

    case "elip":
      return {
        type: "elip",
        centerX: sanitizeNumber(shape.centerX),
        centerY: sanitizeNumber(shape.centerY),
        radiusX: sanitizeNumber(shape.radiusX),
        radiusY: sanitizeNumber(shape.radiusY),
        // color: sanitizeColor(shape.color),
        // strokeWidth: sanitizeNumber(shape.strokeWidth, baseConstraints.strokeWidth.min, baseConstraints.strokeWidth.max),
        // bgColor: sanitizeColor(shape.bgColor),
        // lineDashX: sanitizeNumber(shape.lineDashX, 0, 100),
        // lineDashY: sanitizeNumber(shape.lineDashY, 0, 100)
      };

    case "line":
      return {
        type: "line",
        startX: sanitizeNumber(shape.startX),
        startY: sanitizeNumber(shape.startY),
        endX: sanitizeNumber(shape.endX),
        endY: sanitizeNumber(shape.endY),
        // color: sanitizeColor(shape.color),
        // strokeWidth: sanitizeNumber(shape.strokeWidth, baseConstraints.strokeWidth.min, baseConstraints.strokeWidth.max),
        // lineDashX: sanitizeNumber(shape.lineDashX, 0, 100),
        // lineDashY: sanitizeNumber(shape.lineDashY, 0, 100)
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
        // color: sanitizeColor(shape.color),
        // strokeWidth: sanitizeNumber(shape.strokeWidth, baseConstraints.strokeWidth.min, baseConstraints.strokeWidth.max),
        // lineDashX: sanitizeNumber(shape.lineDashX, 0, 100),
        // lineDashY: sanitizeNumber(shape.lineDashY, 0, 100)
      };

    case "text":
      return {
        type: "text",
        x: sanitizeNumber(shape.x),
        y: sanitizeNumber(shape.y),
        width: sanitizeNumber(shape.width),
        content: sanitizeString(shape.content),
        nol: sanitizeNumber(shape.nol),
        // Limit text content
        // color: sanitizeColor(shape.color),
        // strokeWidth: sanitizeNumber(shape.strokeWidth, baseConstraints.strokeWidth.min, baseConstraints.strokeWidth.max),
        // fontSize: sanitizeNumber(shape.fontSize, baseConstraints.fontSize.min, baseConstraints.fontSize.max)
      };

    case "cursor":
      return { type: "cursor" };

    case "grab":
      return { type: "grab" };

    default:
      return null;
  }
}

// Rate limiting function
// function checkRateLimit(userId: string): boolean {
//     const now = Date.now();
//     const userLimit = rateLimiter.get(userId);

//     if (!userLimit || now > userLimit.resetTime) {
//         rateLimiter.set(userId, { count: 1, resetTime: now + 60000 }); // 1 minute window
//         return true;
//     }

//     if (userLimit.count >= 10) { // 10 messages per minute
//         return false;
//     }

//     userLimit.count++;
//     return true;
// }

function heartbeat(userId: string) {
  // Connection monitoring
  const user = users.find((u) => u.userId === userId);
  if (user) {
    if (user.pingTimeout) {
      clearTimeout(user.pingTimeout);
    }

    user.pingTimeout = setTimeout(() => {
      terminateConnection(user.ws, userId, "ping timeout");
    }, PING_TIMEOUT);
  }
}

function terminateConnection(
  ws: WebSocket,
  userId: string,
  reason: string = "unknown",
) {
  //log('info', 'Terminating connection', { userId, reason });

  try {
    ws.terminate();
  } catch (error) {
    //log('error', 'Error terminating connection', { userId, error: error instanceof Error ? error.message : String(error) });
  }

  // Clean up user data
  const userIndex = users.findIndex((u) => u.userId === userId);
  if (userIndex !== -1) {
    const user = users[userIndex];
    if (user?.pingTimeout) {
      clearTimeout(user.pingTimeout);
    }
    users.splice(userIndex, 1);
  }

  // Clean up rate limiter
  // rateLimiter.delete(userId);
}

// Ping all clients periodically
const pingInterval = setInterval(() => {
  users.forEach((user) => {
    if (user.ws.readyState === WebSocket.OPEN) {
      user.ws.ping();
      heartbeat(user.userId);
    } else {
      terminateConnection(user.ws, user.userId, "dead connection");
    }
  });
}, PING_INTERVAL);

// Graceful shutdown
function gracefulShutdown() {
  // log('info', 'Starting graceful shutdown...');

  clearInterval(pingInterval);

  // Close all connections
  users.forEach((user) => {
    if (user.ws.readyState === WebSocket.OPEN) {
      user.ws.close(1001, "Server shutting down");
    }
    if (user.pingTimeout) {
      clearTimeout(user.pingTimeout);
    }
  });

  // Close WebSocket server
  wss.close(() => {
    // log('info', 'WebSocket server closed');
    process.exit(0);
  });

  // Force exit after 10 seconds
  setTimeout(() => {
    //log('error', 'Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
}

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

wss.on("connection", async (ws, req) => {
  const url = req?.url;
  // Token verification
  if (!url) {
    ws.close(1008, "Authentication failed!");
    return;
  }

  const token = tokenExtraction(url);
  const userId = checkUser(token);
  if (!userId) {
    ws.close(1008, "Authentication failed! Please Sign-in Again!");
    return;
  }

  heartbeat(userId);

  // Setup connection monitoring
  ws.on("pong", () => {
    heartbeat(userId);
  });

  // Add user to active users
  users.push({
    userId,
    rooms: [],
    ws,
    connectionTime: new Date(),
  });

  // Message handling
  ws.on("message", async (data) => {
    try {
      const dat = data.toString();
      const parsedData = JSON.parse(dat);
      const roomId = parsedData?.roomId;
      if (!roomId) {
        return;
      }

      // Validate roomId is a number
      const numericRoomId = parseInt(roomId);
      if (isNaN(numericRoomId)) {
        //log('warn', 'Invalid roomId format', { userId, roomId });
        return;
      }

      if (parsedData.type === "join_room") {
        const currentUser = users.find((x) => x.ws === ws);
        const sharedKey = parsedData?.sharedKey;

        if (!currentUser) {
          ws.close(4001, "User not found");
          return;
        }

        if (!currentUser.rooms.includes(roomId)) {
          try {
            const roomDataImp = await db.room.findUnique({
              where: {
                id: Number(roomId),
              },
              select: {
                adminId: true,
                sharedKey: true,
              },
            });

            if (
              roomDataImp?.adminId === userId ||
              roomDataImp?.sharedKey === sharedKey
            ) {
              //console.log("joined");
              currentUser.rooms.push(roomId);
              return;
            }

            //console.log("not joined!");
            ws.close(4003, "Unauthorized access to the room!");
          } catch (error) {
            //console.log(error);
            ws.close(1011, "Internal Server Error!");
          }
        }
      }

      if (parsedData.type === "leave_room") {
        const currentUser = users.find((x) => x.ws === ws);
        if (!currentUser) {
          return;
        }

        //console.log(users.find(x=>x.ws===ws)?.rooms);
        currentUser.rooms = currentUser.rooms.filter((x) => x !== roomId);
        //console.log(users.find(x=>x.ws===ws)?.rooms);
        //log('info', 'User left room', { userId, roomId });
      }

      if (parsedData.type === "chat-insert") {
        const currentUser = users.find((x) => x.ws === ws);
        if (!currentUser) {
          ws.close(4001, "User not found");
          return;
        }

        if (!currentUser.rooms.includes(roomId)) {
          ws.send(
            JSON.stringify({
              type: "error",
              message: "You must join the room before sending messages.",
            }),
          );
          return;
        }

        const message = JSON.parse(parsedData?.message);
        if (!message) {
          return;
        }

        // Sanitize the Shape object

        const sanitizedMessage = sanitizeShape(message);

        if (!sanitizedMessage) {
          //log('warn', 'Invalid or malicious shape data', { userId, roomId });
          ws.send(
            JSON.stringify({
              type: "error",
              message: "Invalid shape data",
            }),
          );
          return;
        }

        const finalMessage = JSON.stringify(sanitizedMessage);

        try {
          const chatRecord = await db.chat.create({
            data: {
              roomId: numericRoomId,
              message: finalMessage, // Store as JSON string
              userId,
            },
          });

          ws.send(
            JSON.stringify({
              type: "self",
              chatId: chatRecord.id,
              message: finalMessage,
            }),
          );

          // Broadcast to room members
          const roomMembers = users.filter(
            (user) =>
              user.rooms.includes(roomId) &&
              user.ws.readyState === WebSocket.OPEN &&
              user.userId !== userId,
          );

          const broadcastMessage = JSON.stringify({
            type: "chat-insert",
            message: finalMessage, // Send sanitized object
            userId: userId,
            timestamp: new Date().toISOString(),
            roomId,
            messageId: chatRecord.id,
          });

          roomMembers.forEach((user) => {
            try {
              user.ws.send(broadcastMessage);
            } catch (error) {
              // log('error', 'Failed to send message to user', {
              //     targetUserId: user.userId,
              //     error: error instanceof Error ? error.message : String(error)
              // });
            }
          });

          // log('info', 'Message broadcast', {
          //     userId,
          //     roomId,
          //     recipients: roomMembers.length,
          //     shapeType: sanitizedMessage.type
          // });
        } catch (error) {
          // log('error', 'Failed to save chat message', {
          //     userId,
          //     roomId,
          //     error: error instanceof Error ? error.message : String(error)
          // });

          ws.send(
            JSON.stringify({
              type: "error",
              message: "Failed to save your message",
            }),
          );
        }
      }

      if (parsedData.type === "chat-update") {
        const currentUser = users.find((x) => x.ws === ws);
        if (!currentUser) {
          ws.close(4001, "User not found");
          return;
        }

        if (!currentUser.rooms.includes(roomId)) {
          ws.send(
            JSON.stringify({
              type: "error",
              message: "You must join the room before sending messages.",
            }),
          );
          return;
        }

        const message = JSON.parse(parsedData?.message);
        if (!message) {
          return;
        }

        // Sanitize the Shape object

        const sanitizedMessage = sanitizeShape(message);

        if (!sanitizedMessage) {
          //log('warn', 'Invalid or malicious shape data', { userId, roomId });
          ws.send(
            JSON.stringify({
              type: "error",
              message: "Invalid shape data",
            }),
          );
          return;
        }

        const finalMessage = JSON.stringify(sanitizedMessage);

        try {
          //console.log(`data update at row : ${parsedData.chatId}`);
          await db.chat.update({
            data: {
              message: finalMessage,
            },
            where: {
              id: parsedData.chatId,
            },
          });

          // Broadcast to room members
          const roomMembers = users.filter(
            (user) =>
              user.rooms.includes(roomId) &&
              user.ws.readyState === WebSocket.OPEN &&
              user.userId !== userId,
          );

          const broadcastMessage = JSON.stringify({
            type: "chat-update",
            message: finalMessage,
            chatId: parsedData.chatId,
            userId: userId,
          });

          roomMembers.forEach((user) => {
            try {
              user.ws.send(broadcastMessage);
            } catch (error) {
              console.log("error: " + error);
            }
          });
        } catch (error) {
          ws.send(
            JSON.stringify({
              type: "error",
              message: "Failed to save your message",
            }),
          );
        }
      }

      if (parsedData.type === "chat-delete") {
        try {
          const currentUser = users.find((x) => x.ws === ws);
          if (!currentUser) {
            ws.close(4001, "User not found");
            return;
          }

          if (!currentUser.rooms.includes(roomId)) {
            ws.send(
              JSON.stringify({
                type: "error",
                message: "You must join the room before sending messages.",
              }),
            );
            return;
          }

          await db.chat.delete({
            where: {
              id: parsedData.chatId,
            },
          });

          const roomMembers = users.filter(
            (user) =>
              user.rooms.includes(roomId) &&
              user.ws.readyState === WebSocket.OPEN &&
              user.userId !== userId,
          );

          const broadcastMessage = JSON.stringify({
            type: "chat-delete",
            chatId: parsedData.chatId,
            userId: userId,
            roomId: roomId,
          });

          roomMembers.forEach((user) => {
            try {
              user.ws.send(broadcastMessage);
            } catch (error) {
              console.log("error: " + error);
            }
          });
        } catch (error) {
          ws.send(
            JSON.stringify({
              type: "error",
              message: "Failed to save your message",
            }),
          );
        }
      }
    } catch (error) {
      // log('error', 'Error processing message', {
      //     userId,
      //     error: error instanceof Error ? error.message : String(error)
      // });

      ws.send(
        JSON.stringify({
          type: "error",
          message: "Invalid message format",
        }),
      );
    }
  });

  ws.on("close", () => {
    //console.log("close");
    const user = users.find((x) => x.ws === ws);
    if (user && user.pingTimeout) {
      clearTimeout(user.pingTimeout);
    }
    //console.log(users);
    users = users.filter((x) => x.ws !== ws);
    //console.log(users)
    // rateLimiter.delete(userId);
  });

  ws.on("error", (error) => {
    // log('error', 'WebSocket error', { userId, error: error.message });
    terminateConnection(ws, userId, "websocket error");
  });
});

wss.on("error", (error) => {
  // log('error', 'WebSocket server error', { error: error.message });
});

// log('info', 'WebSocket server started', {
//     port: process.env.WEBSOCKET_PORT || 8080,
//     // maxConnections: MAX_CONNECTIONS,
//     environment: process.env.NODE_ENV || 'development'
// });

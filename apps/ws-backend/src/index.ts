import { WebSocketServer, WebSocket } from "ws";
import env from "dotenv";
import { db } from "@repo/db/prismaClient";
import { PING_INTERVAL, PING_TIMEOUT, User } from "./utils/config";
import { sanitizeShape } from "./utils/sanitize";
import { checkUser, tokenExtraction } from "./utils/auth";

env.config();

let users: User[] = [];

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

function heartbeat(userId: string) {
  const user = users.find((u) => u.userId === userId);
  if (user) {
    if (user.pingTimeout) {
      clearTimeout(user.pingTimeout);
    }

    user.pingTimeout = setTimeout(() => {
      terminateConnection(user.ws, userId);
    }, PING_TIMEOUT);
  }
}

function terminateConnection(ws: WebSocket, userId: string) {
  ws.terminate();
  // Clean up user data
  const userIndex = users.findIndex((u) => u.userId === userId);
  if (userIndex !== -1) {
    const user = users[userIndex];
    if (user?.pingTimeout) {
      clearTimeout(user.pingTimeout);
    }
    users.splice(userIndex, 1);
  }
}

// Ping all clients periodically
const pingInterval = setInterval(() => {
  users.forEach((user) => {
    if (user.ws.readyState === WebSocket.OPEN) {
      user.ws.ping();
      heartbeat(user.userId);
    } else {
      terminateConnection(user.ws, user.userId);
    }
  });
}, PING_INTERVAL);

// Graceful shutdown
function gracefulShutdown() {
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
    process.exit(0);
  });

  setTimeout(() => {
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

      const numericRoomId = parseInt(roomId);
      if (isNaN(numericRoomId)) {
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
              currentUser.rooms.push(roomId);
              return;
            }
            ws.close(4003, "Unauthorized access to the room!");
          } catch (error) {
            ws.close(1011, "Internal Server Error!");
          }
        }
      }

      if (parsedData.type === "leave_room") {
        const currentUser = users.find((x) => x.ws === ws);
        if (!currentUser) {
          return;
        }

        currentUser.rooms = currentUser.rooms.filter((x) => x !== roomId);
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

        const sanitizedMessage = sanitizeShape(message);

        if (!sanitizedMessage) {
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
          const publicId = parsedData.publicId;
          await db.chat.create({
            data: {
              publicId: publicId,
              roomId: numericRoomId,
              message: finalMessage,
              userId,
            },
          });

          const roomMembers = users.filter(
            (user) =>
              user.rooms.includes(roomId) &&
              user.ws.readyState === WebSocket.OPEN &&
              user.userId !== userId,
          );

          const broadcastMessage = JSON.stringify({
            type: "chat-insert",
            message: finalMessage,
            userId: userId,
            timestamp: new Date().toISOString(),
            roomId,
            publicId: publicId
          });

          roomMembers.forEach((user) => {
            try {
              user.ws.send(broadcastMessage);
            } catch (error) { }
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

      if (parsedData.type === "chat-update") {
        const currentUser = users.find((x) => x.ws === ws);
        if (!currentUser) {
          ws.close(4001, "User not found");
          return;
        }

        if (!currentUser.rooms.includes(roomId)) {
          ws.send(JSON.stringify({
            type: "error",
            message: "You must join the room before sending messages.",
          }));
          return;
        }

        const message = JSON.parse(parsedData?.message);
        if (!message) return;

        const sanitizedMessage = sanitizeShape(message);
        if (!sanitizedMessage) {
          ws.send(JSON.stringify({
            type: "error",
            message: "Invalid shape data",
          }));
          return;
        }

        const { chatId, publicId } = parsedData;
        if (!chatId && !publicId) {
          ws.send(JSON.stringify({
            type: "error",
            message: "Chat ID or Public ID is required",
          }));
          return;
        }

        const finalMessage = JSON.stringify(sanitizedMessage);

        try {
          const whereClause = chatId ? { id: chatId } : { publicId };
          await db.chat.update({
            data: { message: finalMessage },
            where: whereClause,
          });

          // Broadcast to room members
          const roomMembers = users.filter(
            (user) =>
              user.rooms.includes(roomId) &&
              user.ws.readyState === WebSocket.OPEN &&
              user.userId !== userId
          );

          const broadcastMessage = JSON.stringify({
            type: "chat-update",
            message: finalMessage,
            chatId,
            userId,
            publicId,
          });

          roomMembers.forEach((user) => {
            try {
              user.ws.send(broadcastMessage);
            } catch (error) {
              console.log("Error broadcasting to user:", error);
            }
          });
        } catch (error) {
          ws.send(JSON.stringify({
            type: "error",
            message: "Failed to save your message",
          }));
        }
      }

      if (parsedData.type === "chat-delete") {
        const currentUser = users.find((x) => x.ws === ws);

        // Validate user
        if (!currentUser) {
          ws.close(4001, "User not found");
          return;
        }

        if (!currentUser.rooms.includes(roomId)) {
          ws.send(JSON.stringify({
            type: "error",
            message: "You must join the room before sending messages.",
          }));
          return;
        }

        const { chatId, publicId } = parsedData;

        if (!chatId && !publicId) {
          ws.send(JSON.stringify({
            type: "error",
            message: "Chat ID or Public ID is required",
          }));
          return;
        }

        try {
          const whereClause = chatId ? { id: chatId } : { publicId };
          await db.chat.delete({
            where: whereClause,
          });

          const roomMembers = users.filter(
            (user) =>
              user.rooms.includes(roomId) &&
              user.ws.readyState === WebSocket.OPEN &&
              user.userId !== userId
          );

          const broadcastMessage = JSON.stringify({
            type: "chat-delete",
            chatId,
            userId,
            roomId,
            publicId,
          });

          roomMembers.forEach((user) => {
            try {
              user.ws.send(broadcastMessage);
            } catch (error) {
              console.log("Error broadcasting to user:", error);
            }
          });
        } catch (error) {
          ws.send(JSON.stringify({
            type: "error",
            message: "Failed to delete message",
          }));
        }
      }
    } catch (error) {
      ws.send(
        JSON.stringify({
          type: "error",
          message: "Invalid message format",
        }),
      );
    }
  });

  ws.on("close", () => {
    const user = users.find((x) => x.ws === ws);
    if (user && user.pingTimeout) {
      clearTimeout(user.pingTimeout);
    }
    users = users.filter((x) => x.ws !== ws);
  });

  ws.on("error", (error) => {
    terminateConnection(ws, userId);
  });
});

wss.on("error", (error) => { });

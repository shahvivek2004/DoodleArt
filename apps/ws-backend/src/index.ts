// Old Version!

// import { WebSocketServer, WebSocket } from "ws";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import { JWT_SECRET } from "@repo/backend-common/config";
// import { db } from "@repo/db/prismaClient";

// // Global Variables
// interface User {
//     ws: WebSocket,
//     rooms: string[],
//     userId: string
// }

// let users: User[] = [];

// const wss = new WebSocketServer({ port: 8080 });

// function tokenExtraction(url: string) {
//     const queryParams = new URLSearchParams(url.split('?')[1]);
//     const token = queryParams.get('token') || "";
//     return token;
// }

// function checkUser(token: string): string | null {
//     try {
//         const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
//         if (!decoded || !decoded.userId || typeof decoded == "string") {
//             return null;
//         }
//         return decoded.userId;
//     } catch (error) {
//         console.log("corrupted or Invalid Token!")
//         return null;
//     }
// }

// wss.on('connection', (ws, req) => {

//     // Token verification
//     const url = req.url;
//     if (!url) {
//         return;
//     }
//     const token = tokenExtraction(url);
//     const userId = checkUser(token);
//     if (!userId) {
//         ws.close();
//         return;
//     }

//     // Push user to users[] (list of active users)
//     users.push({
//         userId,
//         rooms: [],
//         ws
//     });

//     console.log(`User - ${userId} is connected`);

//     // Messaging Logic
//     ws.on('message', async (data) => {
//         const parsedData = JSON.parse(data as unknown as string);
//         const roomId = parsedData?.roomId

//         if (parsedData.type === "join_room") {
//             // Find that particular user
//             const user = users.find(x => x.ws === ws);

//             // Check if room exist in DB or not
//             if (!user) {
//                 return;
//             }

//             // Push roomId to that user's room list
//             user?.rooms.push(roomId);
//             console.log(`User - ${userId} joined Room - ${roomId}`)
//         }

//         if (parsedData.type === "leave_room") {
//             console.log('User explicity left the room!');
//             const user = users.find(x => x.ws === ws);
//             if (!user) {
//                 return;
//             }
//             // Filter out that user
//             user.rooms = user?.rooms.filter(x => x === roomId);
//             console.log(`User - ${userId} left Room - ${roomId}`)
//         }

//         if (parsedData.type === "chat") {
//             const message = parsedData?.message;

//             // Enter into DB
//             const res = await db.chat.create({
//                 data: {
//                     roomId: Number(roomId),
//                     message,
//                     userId
//                 }
//             });


//             //---------------------------------------------------------------
//             // Better Approach is use asynchronous architecture
//             // Using queues and then push to CI/CD pipelines to eventually DB
//             //---------------------------------------------------------------


//             // Broadcast to everyone in the room
//             // console.log(`MESSAGE : ${message}`);
//             let count = 1;
//             users.forEach(user => {
//                 if (user.rooms.includes(roomId)) {
//                     console.log(`${count} : ${user.userId}`);
//                     user.ws.send(JSON.stringify({
//                         type: "chat",
//                         message: message,
//                         roomId
//                     }))
//                     count = count + 1;
//                 }
//             })
//         }
//     });

//     ws.on('close', () => {
//         console.log(`User closed the tab! User - ${userId} is disconnected!`);
//         users = users.filter(x => x.ws !== ws);
//     });
// })



//--------------------------------------------------------------------------------------------------------------------------------



// Test Version!
// Enhanced server code with comprehensive logging
// import { WebSocketServer, WebSocket } from "ws";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import env from 'dotenv';
// import { db } from "@repo/db/prismaClient";

// // Global Variables
// interface User {
//     ws: WebSocket,
//     rooms: string[],
//     userId: string,
//     connectionId: string,  // Add connection ID for tracking
//     connectedAt: Date,     // Add timestamp
//     pingTimeout?: NodeJS.Timeout
// }

// env.config();

// let users: User[] = [];
// let connectionCounter = 0;

// // Log current connections periodically
// setInterval(() => {
//     console.log(`📊 Current connections: ${users.length}`);
//     users.forEach(user => {
//         console.log(`  - User ${user.userId} (${user.connectionId}) in rooms: [${user.rooms.join(', ')}]`);
//     });
// }, 30000);

// const wss = new WebSocketServer({
//     port: 8080,
//     clientTracking: true,
//     perMessageDeflate: {
//         zlibDeflateOptions: {
//             level: 6,
//             memLevel: 8,
//         }
//     }
// });

// function tokenExtraction(url: string) {
//     const queryParams = new URLSearchParams(url.split('?')[1]);
//     const token = queryParams.get('token') || "";
//     return token;
// }

// function checkUser(token: string): string | null {
//     try {
//         const JWT_SECRET = process.env.JWT_SECRET;
//         const decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload;
//         if (!decoded || !decoded.userId || typeof decoded == "string") {
//             return null;
//         }
//         return decoded.userId;
//     } catch (error) {
//         console.log("corrupted or Invalid Token!")
//         return null;
//     }
// }

// function heartbeat(userId: string, connectionId: string) {
//     const user = users.find(u => u.userId === userId && u.connectionId === connectionId);
//     if (user) {
//         if (user.pingTimeout) {
//             clearTimeout(user.pingTimeout);
//         }
//         user.pingTimeout = setTimeout(() => {
//             terminateConnection(user.ws, userId, connectionId);
//         }, 30000);
//     }
// }

// function terminateConnection(ws: WebSocket, userId: string, connectionId: string) {
//     console.log(`💀 Terminating connection - User: ${userId}, ConnectionId: ${connectionId}`);
//     ws.terminate();
//     const beforeCount = users.length;
//     users = users.filter(u => u.userId !== userId || u.connectionId !== connectionId);
//     const afterCount = users.length;
//     console.log(`📉 Connection terminated - Before: ${beforeCount}, After: ${afterCount}`);
// }

// // Ping all clients periodically
// setInterval(() => {
//     console.log(`🏓 Pinging ${users.length} active connections`);
//     users.forEach(user => {
//         if (user.ws.readyState === WebSocket.OPEN) {
//             user.ws.ping(() => { });
//             heartbeat(user.userId, user.connectionId);
//         } else {
//             console.log(`⚠️  Found dead connection - User: ${user.userId}, ConnectionId: ${user.connectionId}`);
//         }
//     });
// }, 15000);

// wss.on('connection', (ws, req) => {
//     const connectionId = `conn_${++connectionCounter}_${Date.now()}`;
//     console.log(`🔌 New connection attempt - ConnectionId: ${connectionId}, IP: ${req.socket.remoteAddress}`);

//     // Token verification 
//     const url = req?.url;
//     if (!url) {
//         console.log(`❌ Invalid connection request - ConnectionId: ${connectionId}`);
//         ws.close(1008, "Invalid connection request");
//         return;
//     }

//     const token = tokenExtraction(url);
//     const userId = checkUser(token);
//     if (!userId) {
//         console.log(`❌ Authentication failed - ConnectionId: ${connectionId}`);
//         ws.close(1008, "Authentication failed");
//         return;
//     }

//     // Check for existing connections from the same user
//     const existingConnections = users.filter(u => u.userId === userId);
//     console.log(`🔍 Existing connections for User ${userId}: ${existingConnections.length}`);

//     existingConnections.forEach(existingUser => {
//         console.log(`🔄 Closing existing connection - User: ${userId}, Old ConnectionId: ${existingUser.connectionId}`);
//         existingUser.ws.close(1000, "New connection established");
//     });

//     // Remove existing connections
//     users = users.filter(u => u.userId !== userId);

//     // Setup connection monitoring
//     heartbeat(userId, connectionId);
//     ws.on('pong', () => {
//         heartbeat(userId, connectionId);
//     });

//     // Push user to users[] (list of active users) 
//     const newUser: User = {
//         userId,
//         connectionId,
//         connectedAt: new Date(),
//         rooms: [],
//         ws
//     };
//     users.push(newUser);

//     console.log(`✅ User connected - User: ${userId}, ConnectionId: ${connectionId}, Total connections: ${users.length}`);

//     // Messaging Logic
//     ws.on('message', async (data) => {
//         try {
//             const parsedData = JSON.parse(data as unknown as string);
//             const roomId = parsedData?.roomId;
//             console.log(`📨 Message received - User: ${userId}, ConnectionId: ${connectionId}, Type: ${parsedData.type}, Room: ${roomId}`);

//             if (!roomId) {
//                 console.warn(`⚠️  Received message without roomId - User: ${userId}, ConnectionId: ${connectionId}`);
//                 return;
//             }

//             if (parsedData.type === "join_room") {
//                 // Find that particular user 
//                 const user = users.find(x => x.ws === ws);

//                 if (!user) {
//                     console.log(`❌ User not found in join_room - User: ${userId}, ConnectionId: ${connectionId}`);
//                     ws.close();
//                     return;
//                 }

//                 // Check if already in room
//                 if (!user.rooms.includes(roomId)) {
//                     user.rooms.push(roomId);
//                     console.log(`🚪 User joined room - User: ${userId}, ConnectionId: ${connectionId}, Room: ${roomId}`);
//                 } else {
//                     console.log(`⚠️  User already in room - User: ${userId}, ConnectionId: ${connectionId}, Room: ${roomId}`);
//                 }
//             }

//             if (parsedData.type === "leave_room") {
//                 console.log(`🚪 User leaving room - User: ${userId}, ConnectionId: ${connectionId}, Room: ${roomId}`);
//                 const user = users.find(x => x.ws === ws);
//                 if (!user) {
//                     return;
//                 }
//                 user.rooms = user.rooms.filter(x => x !== roomId);
//                 console.log(`✅ User left room - User: ${userId}, ConnectionId: ${connectionId}, Room: ${roomId}`);
//             }

//             if (parsedData.type === "chat") {
//                 const message = parsedData?.message;
//                 if (!message) {
//                     return;
//                 }

//                 try {
//                     const res = await db.chat.create({
//                         data: {
//                             roomId: Number(roomId),
//                             message,
//                             userId
//                         }
//                     });

//                     // Broadcast to everyone in the room
//                     let count = 0;
//                     users.forEach(user => {
//                         if (user.rooms.includes(roomId) && user.ws.readyState === WebSocket.OPEN) {
//                             count++;
//                             user.ws.send(JSON.stringify({
//                                 type: "chat",
//                                 message: message,
//                                 userId: userId,
//                                 timestamp: new Date().toISOString(),
//                                 roomId
//                             }));
//                         }
//                     });
//                     console.log(`📢 Message broadcast - Room: ${roomId}, Recipients: ${count}, Sender: ${userId} (${connectionId})`);
//                 } catch (error) {
//                     console.error(`❌ Failed to save chat message - User: ${userId}, ConnectionId: ${connectionId}:`, error);
//                     ws.send(JSON.stringify({
//                         type: "error",
//                         message: "Failed to save your message"
//                     }));
//                 }
//             }
//         } catch (error) {
//             console.error(`❌ Error processing message - User: ${userId}, ConnectionId: ${connectionId}:`, error);
//         }
//     });

//     ws.on('close', (code, reason) => {
//         console.log(`🔒 Connection closed - User: ${userId}, ConnectionId: ${connectionId}, Code: ${code}, Reason: ${reason}`);
//         const user = users.find(x => x.ws === ws);
//         if (user && user.pingTimeout) {
//             clearTimeout(user.pingTimeout);
//         }
//         const beforeCount = users.length;
//         users = users.filter(x => x.ws !== ws);
//         const afterCount = users.length;
//         console.log(`📉 Connection removed - Before: ${beforeCount}, After: ${afterCount}`);
//     });

//     ws.on('error', (error) => {
//         console.error(`❌ WebSocket error - User: ${userId}, ConnectionId: ${connectionId}:`, error);
//         terminateConnection(ws, userId, connectionId);
//     });
// });

// console.log('🚀 WebSocket server started on port 8080');



//-----------------------------------------------------------------------------------------------------------------------------------



// import { WebSocketServer, WebSocket } from "ws";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import env from 'dotenv';
// import { db } from "@repo/db/prismaClient";

// // Global Variables
// interface User {
//     ws: WebSocket,
//     rooms: string[],
//     userId: string,
//     pingTimeout?: NodeJS.Timeout  // Add ping timeout for connection monitoring
// }

// env.config();

// let users: User[] = [];

// const wss = new WebSocketServer({
//     port: 8080,
//     // Enable ping functionality
//     clientTracking: true,
//     // Set heartbeat interval
//     perMessageDeflate: {
//         zlibDeflateOptions: {
//             // See zlib defaults.
//             level: 6,
//             memLevel: 8,
//         }
//     }
// });

// function tokenExtraction(url: string) {
//     const queryParams = new URLSearchParams(url.split('?')[1]);
//     const token = queryParams.get('token') || "";
//     return token;
// }

// function checkUser(token: string): string | null {
//     try {
//         const JWT_SECRET = process.env.JWT_SECRET;
//         const decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload;
//         if (!decoded || !decoded.userId || typeof decoded == "string") {
//             return null;
//         }
//         return decoded.userId;
//     } catch (error) {
//         console.log("corrupted or Invalid Token!")
//         return null;
//     }
// }

// // Keep track of connections with heartbeats
// function heartbeat(userId: string) {
//     const user = users.find(u => u.userId === userId);
//     if (user) {
//         // Clear existing timeout
//         if (user.pingTimeout) {
//             clearTimeout(user.pingTimeout);
//         }

//         // Set new timeout - if no response in 30 seconds, consider connection dead
//         user.pingTimeout = setTimeout(() => {
//             terminateConnection(user.ws, userId);
//         }, 30000);
//     }
// }

// function terminateConnection(ws: WebSocket, userId: string) {
//     // console.log(`Terminating connection for User - ${userId} due to inactivity`);
//     ws.terminate();
//     users = users.filter(u => u.userId !== userId);
// }

// // Ping all clients periodically to check connection status
// setInterval(() => {
//     users.forEach(user => {
//         if (user.ws.readyState === WebSocket.OPEN) {
//             user.ws.ping(() => { });
//             heartbeat(user.userId);
//         }
//     });
// }, 15000);

// wss.on('connection', (ws, req) => {

//     // Token verification 
//     const url = req?.url;
//     if (!url) {
//         ws.close(1008, "Invalid connection request");
//         return;
//     }

//     const token = tokenExtraction(url);
//     const userId = checkUser(token);
//     if (!userId) {
//         ws.close(1008, "Authentication failed");
//         return;
//     }

//     // Setup connection monitoring
//     heartbeat(userId);
//     ws.on('pong', () => {
//         heartbeat(userId);
//     });

//     // Push user to users[] (list of active users) 
//     users.push({
//         userId,
//         rooms: [],
//         ws
//     });

//     console.log(`User - ${userId} is connected`);

//     // Messaging Logic
//     ws.on('message', async (data) => {
//         try {
//             const parsedData = JSON.parse(data as unknown as string);
//             const roomId = parsedData?.roomId;

//             if (!roomId) {
//                 console.warn(`Received message without roomId from User - ${userId}`);
//                 return;
//             }

//             if (parsedData.type === "join_room") {
//                 // Find that particular user 
//                 const user = users.find(x => x.ws === ws);

//                 // check for if user exist or not
//                 if (!user) {
//                     ws.close();
//                     return;
//                 }

//                 // check for authorization of room access
//                 // console.log(user.rooms);                

//                 // Check if already in room
//                 if (!user.rooms.includes(roomId)) {
//                     // Push roomId to that user's room list
//                     user.rooms.push(roomId);
//                     console.log(`User - ${userId} joined Room - ${roomId}`);
//                 }
//             }

//             if (parsedData.type === "leave_room") {
//                 // console.log('User explicitly left the room!');
//                 const user = users.find(x => x.ws === ws);
//                 if (!user) {
//                     return;
//                 }
//                 // Filter out that room
//                 user.rooms = user.rooms.filter(x => x !== roomId);
//                 // console.log(`User - ${userId} left Room - ${roomId}`);
//             }

//             if (parsedData.type === "chat") {
//                 const message = parsedData?.message;
//                 if (!message) {
//                     return;
//                 }

//                 // Enter into DB
//                 try {
//                     const res = await db.chat.create({
//                         data: {
//                             roomId: Number(roomId),
//                             message,
//                             userId
//                         }
//                     });

//                     // Broadcast to everyone in the room
//                     users.forEach(user => {
//                         if (user.rooms.includes(roomId) && user.ws.readyState === WebSocket.OPEN) {
//                             //console.log(`Message sent to :${user.userId}`);
//                             user.ws.send(JSON.stringify({
//                                 type: "chat",
//                                 message: message,
//                                 userId: userId, // Include sender ID
//                                 timestamp: new Date().toISOString(),
//                                 roomId
//                             }));
//                         }
//                     });

//                     //console.log(`Message broadcast to users in Room - ${roomId}`);
//                 } catch (error) {
//                     // console.error("Failed to save chat message:", error);
//                     ws.send(JSON.stringify({
//                         type: "error",
//                         message: "Failed to save your message"
//                     }));
//                 }
//             }
//         } catch (error) {
//            // console.error("Error processing message:", error);
//            ws;
//         }
//     });

//     ws.on('close', () => {
//         console.log(`User - ${userId} disconnected!`);
//         const user = users.find(x => x.ws === ws);
//         if (user && user.pingTimeout) {
//             clearTimeout(user.pingTimeout);
//         }
//         users = users.filter(x => x.ws !== ws);
//         // console.log("Connected users:", users.map(u => ({
//         //     userId: u.userId,
//         //     rooms: u.rooms
//         // })));
//     });

//     ws.on('error', (error) => {
//         // console.error(`WebSocket error for User - ${userId}:`, error);
//         terminateConnection(ws, userId);
//     });
// });






import { WebSocketServer, WebSocket } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import env from 'dotenv';
import { db } from "@repo/db/prismaClient";

// Global Variables
interface User {
    ws: WebSocket,
    rooms: string[],
    userId: string,
    pingTimeout?: NodeJS.Timeout,
    connectionTime: Date,
    // messageCount: number
}

type Shape = {
   "type": "rect";
   "x": number;
   "y": number;
   "width": number;
   "height": number;
   "color": string;
   "strokeWidth": number;
   "bgColor": string;
   "lineDashX": number;
   "lineDashY": number;
} | {
   "type": "elip";
   "centerX": number;
   "centerY": number;
   "radiusX": number;
   "radiusY": number;
   "color": string;
   "strokeWidth": number;
   "bgColor": string;
   "lineDashX": number;
   "lineDashY": number;
} | {
   "type": "line";
   "startX": number;
   "startY": number;
   "endX": number;
   "endY": number;
   "color": string;
   "strokeWidth": number;
   "lineDashX": number;
   "lineDashY": number;
} | {
   "type": "pencil";
   "pencilCoords": Array<{ "x": number, "y": number }>;
   "color": string;
   "strokeWidth": number;
   "lineDashX": number;
   "lineDashY": number;
} | {
   "type": "text";
   "x": number;
   "y": number;
   "content": string;
   "color": string;
   "strokeWidth": number;
   "fontSize": number;
} | {
   "type": "cursor";
} | {
   "type": "grab";
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
        }
    }
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
    const queryParams = new URLSearchParams(url.split('?')[1]);
    return queryParams.get('token') || "";
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
    if (typeof str !== 'string') return '';

    // Remove potentially dangerous characters and limit length
    return str
        .replace(/[<>]/g, '') // Remove HTML tags
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, '') // Remove event handlers
        .trim();
}

function sanitizeNumber(num: number, min = -Infinity, max = Infinity) {
    if (typeof num !== 'number' || isNaN(num)) return 0;
    return Math.max(min, Math.min(max, num));
}

function sanitizeColor(color: string) {
    if (typeof color !== 'string') return '#000000';

    // Allow hex colors, rgb, rgba, and named colors
    const validColorPattern = /^(#[0-9a-fA-F]{3,8}|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)|[a-zA-Z]+)$/;

    if (!validColorPattern.test(color)) {
        return '#000000';
    }

    return color;
}

function sanitizeShape(shape: Shape) {
    if (!shape) {
        return null;
    }

    const baseConstraints = {
        strokeWidth: { min: 0, max: 50 },
        coordinate: { min: -10000, max: 10000 },
        size: { min: 0, max: 5000 },
        fontSize: { min: 8, max: 200 }
    };

    switch (shape.type) {
        case "rect":
            return {
                type: 'rect',
                x: sanitizeNumber(shape.x, baseConstraints.coordinate.min, baseConstraints.coordinate.max),
                y: sanitizeNumber(shape.y, baseConstraints.coordinate.min, baseConstraints.coordinate.max),
                width: sanitizeNumber(shape.width, baseConstraints.size.min, baseConstraints.size.max),
                height: sanitizeNumber(shape.height, baseConstraints.size.min, baseConstraints.size.max),
                color: sanitizeColor(shape.color),
                strokeWidth: sanitizeNumber(shape.strokeWidth, baseConstraints.strokeWidth.min, baseConstraints.strokeWidth.max),
                bgColor: sanitizeColor(shape.bgColor),
                lineDashX: sanitizeNumber(shape.lineDashX, 0, 100),
                lineDashY: sanitizeNumber(shape.lineDashY, 0, 100)
            };

        case "elip":
            return {
                type: 'elip',
                centerX: sanitizeNumber(shape.centerX, baseConstraints.coordinate.min, baseConstraints.coordinate.max),
                centerY: sanitizeNumber(shape.centerY, baseConstraints.coordinate.min, baseConstraints.coordinate.max),
                radiusX: sanitizeNumber(shape.radiusX, baseConstraints.size.min, baseConstraints.size.max),
                radiusY: sanitizeNumber(shape.radiusY, baseConstraints.size.min, baseConstraints.size.max),
                color: sanitizeColor(shape.color),
                strokeWidth: sanitizeNumber(shape.strokeWidth, baseConstraints.strokeWidth.min, baseConstraints.strokeWidth.max),
                bgColor: sanitizeColor(shape.bgColor),
                lineDashX: sanitizeNumber(shape.lineDashX, 0, 100),
                lineDashY: sanitizeNumber(shape.lineDashY, 0, 100)
            };

        case "line":
            return {
                type: 'line',
                startX: sanitizeNumber(shape.startX, baseConstraints.coordinate.min, baseConstraints.coordinate.max),
                startY: sanitizeNumber(shape.startY, baseConstraints.coordinate.min, baseConstraints.coordinate.max),
                endX: sanitizeNumber(shape.endX, baseConstraints.coordinate.min, baseConstraints.coordinate.max),
                endY: sanitizeNumber(shape.endY, baseConstraints.coordinate.min, baseConstraints.coordinate.max),
                color: sanitizeColor(shape.color),
                strokeWidth: sanitizeNumber(shape.strokeWidth, baseConstraints.strokeWidth.min, baseConstraints.strokeWidth.max),
                lineDashX: sanitizeNumber(shape.lineDashX, 0, 100),
                lineDashY: sanitizeNumber(shape.lineDashY, 0, 100)
            };

        case "pencil":
            if (!Array.isArray(shape.pencilCoords)) {
                return null;
            }

            // Limit number of points to prevent DoS
            const maxPoints = 1000;
            const sanitizedCoords = shape.pencilCoords
                .slice(0, maxPoints)
                .map(coord => {
                    if (!coord || typeof coord !== 'object') return null;
                    return {
                        x: sanitizeNumber(coord.x, baseConstraints.coordinate.min, baseConstraints.coordinate.max),
                        y: sanitizeNumber(coord.y, baseConstraints.coordinate.min, baseConstraints.coordinate.max)
                    };
                })
                .filter(coord => coord !== null);

            if (sanitizedCoords.length === 0) {
                return null;
            }

            return {
                type: 'pencil',
                pencilCoords: sanitizedCoords,
                color: sanitizeColor(shape.color),
                strokeWidth: sanitizeNumber(shape.strokeWidth, baseConstraints.strokeWidth.min, baseConstraints.strokeWidth.max),
                lineDashX: sanitizeNumber(shape.lineDashX, 0, 100),
                lineDashY: sanitizeNumber(shape.lineDashY, 0, 100)
            };

        case "text":
            return {
                type: 'text',
                x: sanitizeNumber(shape.x, baseConstraints.coordinate.min, baseConstraints.coordinate.max),
                y: sanitizeNumber(shape.y, baseConstraints.coordinate.min, baseConstraints.coordinate.max),
                content: sanitizeString(shape.content), // Limit text content
                color: sanitizeColor(shape.color),
                strokeWidth: sanitizeNumber(shape.strokeWidth, baseConstraints.strokeWidth.min, baseConstraints.strokeWidth.max),
                fontSize: sanitizeNumber(shape.fontSize, baseConstraints.fontSize.min, baseConstraints.fontSize.max)
            };

        case "cursor":
            return { type: 'cursor' };

        case "grab":
            return { type: 'grab' };

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
    const user = users.find(u => u.userId === userId);
    if (user) {
        if (user.pingTimeout) {
            clearTimeout(user.pingTimeout);
        }

        user.pingTimeout = setTimeout(() => {
            terminateConnection(user.ws, userId, 'ping timeout');
        }, PING_TIMEOUT);
    }
}

function terminateConnection(ws: WebSocket, userId: string, reason: string = 'unknown') {
    //log('info', 'Terminating connection', { userId, reason });

    try {
        ws.terminate();
    } catch (error) {
        //log('error', 'Error terminating connection', { userId, error: error instanceof Error ? error.message : String(error) });
    }

    // Clean up user data
    const userIndex = users.findIndex(u => u.userId === userId);
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
    users.forEach(user => {
        if (user.ws.readyState === WebSocket.OPEN) {
            user.ws.ping();
            heartbeat(user.userId);
        } else {
            terminateConnection(user.ws, user.userId, 'dead connection');
        }
    });
}, PING_INTERVAL);

// Graceful shutdown
function gracefulShutdown() {
    // log('info', 'Starting graceful shutdown...');

    clearInterval(pingInterval);

    // Close all connections
    users.forEach(user => {
        if (user.ws.readyState === WebSocket.OPEN) {
            user.ws.close(1001, 'Server shutting down');
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

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

wss.on('connection', async (ws, req) => {

    // Check connection limits
    // if (users.length >= MAX_CONNECTIONS) {
    //     ws.close(1013, "Server at capacity");
    //     return;
    // }

    const url = req?.url;
    // Token verification
    if (!url) {
        ws.close(1008, "Invalid connection request");
        return;
    }

    const token = tokenExtraction(url);
    const userId = checkUser(token);
    if (!userId) {
        ws.close(1008, "Authentication failed");
        return;
    }

    // Check for existing connection (prevent duplicates)
    // const existingUser = users.find(u => u.userId === userId);
    // if (existingUser) {
    //     log('warn', 'Duplicate connection attempt', { userId });
    //     existingUser.ws.close(1008, "Connection replaced");
    //     terminateConnection(existingUser.ws, userId, 'duplicate connection');
    // }

    
    heartbeat(userId);

    // Setup connection monitoring
    ws.on('pong', () => {
        heartbeat(userId);
    });

    // Add user to active users
    users.push({
        userId,
        rooms: [],
        ws,
        connectionTime: new Date(),
    });

    //log('info', 'User connected', { userId, totalConnections: users.length });

    // Message handling
    ws.on('message', async (data) => {
        try {
            // Check message size
            // const dataSize = Buffer.isBuffer(data) ? data.byteLength : (data instanceof ArrayBuffer ? data.byteLength : 0);
            // if (dataSize > MAX_MESSAGE_SIZE) {
            //     ws.close(1009, "Message too large");
            //     return;
            // }

            // Rate limiting
            // if (!checkRateLimit(userId)) {
            //     ws.send(JSON.stringify({
            //         type: "error",
            //         message: "Rate limit exceeded. Please slow down."
            //     }));
            //     return;
            // }

            const dat = data.toString();
            const parsedData = JSON.parse(dat);
            const roomId = parsedData?.roomId;
            if (!roomId) {
                //log('warn', 'Message without roomId', { userId });
                return;
            }

            // Validate roomId is a number
            const numericRoomId = parseInt(roomId);
            if (isNaN(numericRoomId)) {
                //log('warn', 'Invalid roomId format', { userId, roomId });
                return;
            }


            if (parsedData.type === "join_room") {
                const currentUser = users.find(x => x.ws === ws);
                if (!currentUser) {
                    ws.close(1008, "User not found");
                    return;
                }

                if (!currentUser.rooms.includes(roomId)) {
                    currentUser.rooms.push(roomId);
                   // log('info', 'User joined room', { userId, roomId });
                }
            }

            if (parsedData.type === "leave_room") {
                const currentUser = users.find(x => x.ws === ws);
                if (!currentUser) {
                    return;
                }

                currentUser.rooms = currentUser.rooms.filter(x => x !== roomId);
                //log('info', 'User left room', { userId, roomId });
            }

            if (parsedData.type === "chat") {
                const message = JSON.parse(parsedData?.message);
                if (!message) {
                    return;
                }

                // Sanitize the Shape object

                const sanitizedMessage = sanitizeShape(message);
    
                if (!sanitizedMessage) {
                    //log('warn', 'Invalid or malicious shape data', { userId, roomId });
                    ws.send(JSON.stringify({
                        type: "error",
                        message: "Invalid shape data"
                    }));
                    return;
                }

                const finalMessage = JSON.stringify(sanitizedMessage);

                try {
                    const chatRecord = await db.chat.create({
                        data: {
                            roomId: numericRoomId,
                            message: finalMessage, // Store as JSON string
                            userId
                        }
                    });

                    // Broadcast to room members
                    const roomMembers = users.filter(user =>
                        user.rooms.includes(roomId) &&
                        user.ws.readyState === WebSocket.OPEN
                    );

                    const broadcastMessage = JSON.stringify({
                        type: "chat",
                        message: finalMessage, // Send sanitized object
                        userId: userId,
                        timestamp: new Date().toISOString(),
                        roomId,
                        messageId: chatRecord.id
                    });

                    roomMembers.forEach(user => {
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

                    ws.send(JSON.stringify({
                        type: "error",
                        message: "Failed to save your message"
                    }));
                }
            }
        } catch (error) {
            // log('error', 'Error processing message', {
            //     userId,
            //     error: error instanceof Error ? error.message : String(error)
            // });

            ws.send(JSON.stringify({
                type: "error",
                message: "Invalid message format"
            }));
        }
    });

    ws.on('close', () => {
        // log('info', 'User disconnected', { userId });
        const user = users.find(x => x.ws === ws);
        if (user && user.pingTimeout) {
            clearTimeout(user.pingTimeout);
        }
        users = users.filter(x => x.ws !== ws);
        // rateLimiter.delete(userId);
    });

    ws.on('error', (error) => {
        // log('error', 'WebSocket error', { userId, error: error.message });
        terminateConnection(ws, userId, 'websocket error');
    });
});

wss.on('error', (error) => {
    // log('error', 'WebSocket server error', { error: error.message });
});

// log('info', 'WebSocket server started', {
//     port: process.env.WEBSOCKET_PORT || 8080,
//     // maxConnections: MAX_CONNECTIONS,
//     environment: process.env.NODE_ENV || 'development'
// });

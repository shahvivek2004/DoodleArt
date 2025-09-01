// // RoomCanvas.tsx

// RoomCanvas.tsx - Debug Version
// "use client";

// import { useEffect, useState, useRef } from "react";
// import { Canvas } from "./Canvas";

// export function RoomCanvas({ roomId }: { roomId: string }) {
//     const [socket, setSocket] = useState<WebSocket | null>(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     const wsRef = useRef<WebSocket | null>(null);
//     const mountedRef = useRef(true);
//     const connectionIdRef = useRef(Math.random().toString(36).substring(7));

//     console.log(`🔧 RoomCanvas render - roomId: ${roomId}, connectionId: ${connectionIdRef.current}`);

//     useEffect(() => {
//         const connectionId = connectionIdRef.current;
//         console.log(`🚀 Starting WebSocket connection attempt - roomId: ${roomId}, connectionId: ${connectionId}`);

//         // Check if there's already a connection
//         if (wsRef.current) {
//             console.log(`⚠️  Previous connection exists, closing it first - connectionId: ${connectionId}`);
//             wsRef.current.close();
//             wsRef.current = null;
//         }

//         let ws: WebSocket | null = null;

//         const cleanupSocket = (reason: string) => {
//             console.log(`🧹 Cleaning up WebSocket - reason: ${reason}, connectionId: ${connectionId}`);
//             if (ws) {
//                 if (ws.readyState === WebSocket.OPEN) {
//                     console.log(`📤 Sending leave_room message - connectionId: ${connectionId}`);
//                     const leaveData = JSON.stringify({
//                         type: "leave_room",
//                         roomId
//                     });
//                     ws.send(leaveData);
//                 }
//                 ws.close();
//                 ws = null;
//             }
//             wsRef.current = null;
//         };

//         // Get authenticated WebSocket URL
//         console.log(`🔑 Fetching WebSocket auth - connectionId: ${connectionId}`);
//         fetch('/api/ws-auth')
//             .then(response => {
//                 console.log(`📡 Auth response received - connectionId: ${connectionId}, status: ${response.status}`);
//                 if (!response.ok) {
//                     throw new Error('Authentication failed');
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 if (!mountedRef.current) {
//                     console.log(`🛑 Component unmounted before connection - connectionId: ${connectionId}`);
//                     return;
//                 }

//                 console.log(`🔌 Creating WebSocket connection - connectionId: ${connectionId}, url: ${data.wsUrl}`);
//                 ws = new WebSocket(data.wsUrl);
//                 wsRef.current = ws;

//                 ws.onopen = () => {
//                     console.log(`✅ WebSocket opened - connectionId: ${connectionId}`);
//                     if (!mountedRef.current) {
//                         console.log(`🛑 Component unmounted after open - connectionId: ${connectionId}`);
//                         cleanupSocket("component unmounted after open");
//                         return;
//                     }

//                     setSocket(ws);
//                     setIsLoading(false);
//                     setError(null);

//                     // Join the room once connected
//                     const joinData = JSON.stringify({
//                         type: "join_room",
//                         roomId
//                     });
//                     console.log(`📤 Sending join_room message - connectionId: ${connectionId}, roomId: ${roomId}`);
//                     ws!.send(joinData);
//                 };

//                 ws.onerror = (error) => {
//                     console.error(`❌ WebSocket error - connectionId: ${connectionId}:`, error);
//                     setError("Failed to connect to server");
//                     setIsLoading(false);
//                 };

//                 ws.onclose = (event) => {
//                     console.log(`🔒 WebSocket closed - connectionId: ${connectionId}, code: ${event.code}, reason: ${event.reason}`);
//                     setSocket(null);
//                     if (mountedRef.current) {
//                         setError("Connection closed");
//                     }
//                 };

//                 // Add message handler for debugging
//                 ws.onmessage = (event) => {
//                     console.log(`📨 WebSocket message received - connectionId: ${connectionId}:`, event.data);
//                 };
//             })
//             .catch(error => {
//                 console.error(`❌ Failed to get WebSocket authentication - connectionId: ${connectionId}:`, error);
//                 setError("Authentication failed");
//                 setIsLoading(false);
//             });

//         // Cleanup function
//         return () => {
//             console.log(`🧹 useEffect cleanup called - connectionId: ${connectionId}`);
//             cleanupSocket("useEffect cleanup");
//         };
//     }, [roomId]);

//     // Component unmount cleanup
//     useEffect(() => {
//         const cleanupConnectionId = connectionIdRef.current;
//         return () => {
//             console.log(`🏁 Component unmounting - connectionId: ${cleanupConnectionId}`);
//             mountedRef.current = false;
//             if (wsRef.current) {
//                 wsRef.current.close();
//             }
//         };
//     }, []);

//     if (isLoading) {
//         return <div className="flex justify-center items-center py-8">Connecting to server... (ID: {connectionIdRef.current})</div>;
//     }

//     if (error) {
//         return <div className="text-red-500 py-4">{error} (ID: {connectionIdRef.current})</div>;
//     }

//     if (!socket) {
//         return <div className="py-4">Connection not established (ID: {connectionIdRef.current})</div>;
//     }

//     return (
//         <div>
//             <div className="text-xs text-gray-400 mb-2">Connection ID: {connectionIdRef.current}</div>
//             <Canvas roomId={roomId} socket={socket} />
//         </div>
//     );
// }








"use client";

import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import { Loader } from "../Fetch/Loader";

export function RoomCanvas({ roomId, sharedKey }: { roomId: string, sharedKey: string }) {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Initializing WS connection
    // useEffect(() => {
    //     let ws: WebSocket | null = null;

    //     if (socket) return; // prevent duplicate if already connected

    //     const cleanupSocket = () => {
    //         if (ws && ws.readyState === WebSocket.OPEN) {
    //             ws.send(JSON.stringify({ type: "leave_room", roomId }));
    //             ws.close();
    //         }
    //     };

    //     const connect = async () => {
    //         try {
    //             const res = await fetch('/api/ws-auth');
    //             if (!res.ok) throw new Error('Auth failed');
    //             const data = await res.json();
    //             ws = new WebSocket(data.wsUrl);

    //             ws.onopen = () => {
    //                 setSocket(ws);
    //                 setIsLoading(false);
    //                 ws?.send(JSON.stringify({ type: "join_room", roomId }));
    //             };

    //             ws.onerror = () => {
    //                 setError("Failed to connect to server");
    //                 setIsLoading(false);
    //             };

    //             ws.onclose = () => {
    //                 setSocket(null);
    //                 setError("Connection closed");
    //             };
    //         } catch {
    //             setError("Authentication failed");
    //             setIsLoading(false);
    //         }
    //     };

    //     connect();

    //     return () => {
    //         cleanupSocket();
    //     };
    // }, [socket, roomId]);

    useEffect(() => {
        let ws: WebSocket | null = null;

        // Helper function to clean up the WebSocket connection
        const cleanupSocket = () => {
            if (ws && ws.readyState === WebSocket.OPEN) {
                // Send a leave_room message before closing
                const leaveData = JSON.stringify({
                    type: "leave_room",
                    roomId
                });
                ws.send(leaveData);
                localStorage.clear();
                ws.close();
                console.log("WebSocket connection closed cleanly");
            }
        };

        // Get authenticated WebSocket URL from our middleware
        fetch('/api/ws-auth')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Authentication failed');
                }
                return response.json();
            })
            .then(data => {
                // Connect using the authenticated URL provided by our middleware
                ws = new WebSocket(data.wsUrl);

                ws.onopen = () => {
                    setSocket(ws);
                    setIsLoading(false);

                    // Join the room once connected
                    const joinData = JSON.stringify({
                        type: "join_room",
                        roomId
                    });
                    if (ws) {
                        ws.send(joinData);
                    }
                };

                ws.onerror = (error) => {
                    console.error("WebSocket error:", error);
                    setError("Failed to connect to server");
                    setIsLoading(false);
                };

                ws.onclose = () => {
                    setSocket(null);
                    setError("Connection closed, Please refresh the page!");
                };
            })
            .catch(() => {
                // console.error("Failed to get WebSocket authentication:", error);
                setError("Authentication failed");
                setIsLoading(false);
            });

        // Clean up function
        return () => {
            cleanupSocket();
        };
    }, [roomId]);

    if (isLoading) {
        return (
            <Loader/>
        )
    }

    if (error) {
        return <div className="text-red-500 py-4">{error}</div>;
    }

    if (!socket) {
        return <div className="py-4">Connection not established</div>;
    }

    return (
        <div>
            <Canvas roomId={roomId} socket={socket} sharedKey={sharedKey} />
        </div>
    );
}

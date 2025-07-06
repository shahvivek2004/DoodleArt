// hooks/useWebSocket.ts
import { useEffect, useState, useRef, useCallback } from "react";

interface UseWebSocketProps {
    roomId: string;
    onMessage?: (data: object) => void;
}

export function useWebSocket({ roomId, onMessage }: UseWebSocketProps) {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
    
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const connectionAttemptRef = useRef<boolean>(false);

    const connect = useCallback(async () => {
        if (connectionAttemptRef.current) {
            return;
        }
        connectionAttemptRef.current = true;

        try {
            const response = await fetch('/api/ws-auth');
            if (!response.ok) {
                throw new Error('Authentication failed');
            }
            const data = await response.json();

            const ws = new WebSocket(data.wsUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                setSocket(ws);
                setIsLoading(false);
                setError(null);
                setConnectionState('connected');
                
                // Join the room once connected
                const joinData = JSON.stringify({
                    type: "join_room",
                    roomId
                });
                ws.send(joinData);
            };

            ws.onmessage = (event) => {
                if (onMessage) {
                    try {
                        const data = JSON.parse(event.data);
                        onMessage(data);
                    } catch (error) {
                        console.error('Failed to parse WebSocket message:', error);
                    }
                }
            };

            ws.onerror = (error) => {
                console.error("WebSocket error:", error);
                setError("Failed to connect to server");
                setConnectionState('disconnected');
            };

            ws.onclose = (event) => {
                setSocket(null);
                setConnectionState('disconnected');
                connectionAttemptRef.current = false;
                
                // Auto-reconnect if connection was not closed intentionally
                if (event.code !== 1000 && !error) {
                    console.log('Connection lost, attempting to reconnect...');
                    reconnectTimeoutRef.current = setTimeout(() => {
                        connect();
                    }, 3000);
                }
            };

        } catch (error) {
            console.error("Failed to get WebSocket authentication:", error);
            setError("Authentication failed");
            setIsLoading(false);
            setConnectionState('disconnected');
            connectionAttemptRef.current = false;
        }
    }, [roomId, onMessage, error]);

    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }
        
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            const leaveData = JSON.stringify({
                type: "leave_room",
                roomId
            });
            wsRef.current.send(leaveData);
            wsRef.current.close(1000, 'Component unmounting');
        }
        
        connectionAttemptRef.current = false;
        setSocket(null);
        setConnectionState('disconnected');
    }, [roomId]);

    const sendMessage = useCallback((message: object) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
        }
    }, [socket]);

    useEffect(() => {
        connect();
        return () => {
            disconnect();
        };
    }, [connect, disconnect]);

    return {
        socket,
        isLoading,
        error,
        connectionState,
        sendMessage,
        reconnect: connect
    };
}
"use client";

import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import { Loader } from "../Fetch/Loader";
import { useRouter } from "next/navigation";
import { AuthComp } from "../Fetch/AuthComp";
import { Authorized } from "../Fetch/Authorized";

export function RoomCanvas({
  roomId,
  sharedKey,
}: {
  roomId: string;
  sharedKey: string;
}) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(true);
  const [theme, setTheme] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    setTheme(storedTheme ?? "b");
  }, []);

  const handleQuit = () => {
    try {
      router.push("/dashboard");
    } catch {
      alert("Wait for a second...");
    }
  };

  useEffect(() => {
    let ws: WebSocket | null = null;

    const cleanupSocket = () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        const leaveData = JSON.stringify({
          type: "leave_room",
          roomId,
        });
        ws.send(leaveData);
        // localStorage.clear();
        ws.close();
      }
    };

    // Get authenticated WebSocket URL from our middleware
    fetch("/api/ws-auth")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Authentication failed");
        }
        return response.json();
      })
      .then((data) => {
        // Connect using the authenticated URL provided by our middleware
        ws = new WebSocket(data.wsUrl);

        ws.onopen = () => {
          setSocket(ws);
          setIsLoading(false);

          // Join the room once connected
          const joinData = JSON.stringify({
            type: "join_room",
            roomId,
            sharedKey,
          });
          if (ws) {
            ws.send(joinData);
          }
        };

        ws.onerror = () => {
          setError("Failed to connect to server");
          setIsLoading(false);
        };

        ws.onclose = (event) => {
          setSocket(null);
          switch (event.code) {
            case 1008:
              setIsAuthenticated(false);
              break;
            case 4001:
              setError("Session not found. Please refresh.");
              break;
            case 4003:
              setIsAuthorized(false);
              break;
            case 1011:
              setError("Server error. Try again later.");
              break;
            default:
              setError("Connection timeout, Please refresh!.");
          }
        };
      })
      .catch(() => {
        setIsLoading(false);
        setIsAuthenticated(false);
      });

    // Clean up function
    return () => {
      cleanupSocket();
    };
  }, [roomId, sharedKey]);

  if (theme === null) return null;

  if (isLoading || !socket) {
    return <Loader theme={theme} />;
  }

  if (!isAuthenticated) {
    return <AuthComp quitfunc={handleQuit} />;
  }

  if (!isAuthorized) {
    return <Authorized quitfunc={handleQuit} />;
  }

  if (error) {
    return <div className="text-red-500 py-4">{error}</div>;
  }

  return (
    <div>
      <Canvas
        roomId={roomId}
        socket={socket}
        sharedKey={sharedKey}
      />
    </div>
  );
}

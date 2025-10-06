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
  const router = useRouter();

  const handleQuit = () => {
    try {
      router.push("/dashboard");
    } catch {
      alert("Wait for a second...");
    }
  };

  useEffect(() => {
    let ws: WebSocket | null = null;

    // Helper function to clean up the WebSocket connection
    const cleanupSocket = () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        // Send a leave_room message before closing
        const leaveData = JSON.stringify({
          type: "leave_room",
          roomId,
        });
        ws.send(leaveData);
        localStorage.clear();
        ws.close();
        //console.log("WebSocket connection closed cleanly");
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

        ws.onerror = (error) => {
          //console.error("WebSocket error:", error);
          setError("Failed to connect to server");
          setIsLoading(false);
        };

        ws.onclose = (event) => {
          //console.log("Hello");
          setSocket(null);
          switch (event.code) {
            case 1008:
              //setError("Unauthorized: Please log in again.");
              //console.log("Not authenticated!");
              setIsAuthenticated(false);
              break;
            case 4001:
              //console.log("User not found!");
              setError("Session not found. Please refresh.");
              break;
            case 4003:
              //setError("Access denied to this room.");
              //console.log("not Authorized");
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
        // console.error("Failed to get WebSocket authentication:", error);
        //setError("Authentication failed");
        setIsLoading(false);
        setIsAuthenticated(false);
      });

    // Clean up function
    return () => {
      cleanupSocket();
    };
  }, [roomId]);

  if (isLoading) {
    return <Loader />;
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

  if (!socket) {
    return <div className="py-4">Connection not established</div>;
  }

  return (
    <div>
      <Canvas roomId={roomId} socket={socket} sharedKey={sharedKey} />
    </div>
  );
}

// CreateRoomModal.tsx
"use client";
import { X } from "lucide-react";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { HTTP_URL } from "@/middleware";

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoomCreated: () => void;
}

export function CreateRoomModal({
  isOpen,
  onClose,
  onRoomCreated,
}: CreateRoomModalProps) {
  const [roomName, setRoomName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!roomName.trim()) {
      setError("Room name cannot be empty");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Replace this with your actual API endpoint for creating a room
      await axios.post(
        `${HTTP_URL}/api/v1/user/room`,
        {
          name: roomName,
        },
        { withCredentials: true },
      );

      setRoomName("");
      onRoomCreated();
      onClose();
    } catch (error) {
      // console.error("Error creating room:", error);
      const axiosError = error as AxiosError;
      setError(
        (axiosError.response?.data as { message: string })?.message ||
          "Failed to create room",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Dark overlay */}
      <div
        className="absolute inset-0 bg-[#121212] bg-opacity-70"
        onClick={onClose}
      ></div>

      {/* Modal content */}
      <div className="bg-[#232329] rounded-lg shadow-xl p-6 w-full max-w-md z-10 relative">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Create New Drawing</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="roomName"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Room Name
            </label>
            <input
              type="text"
              id="roomName"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Enter room name"
              className="w-full px-4 py-2 bg-[#0a0a19] border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9a00e1] focus:border-transparent"
              autoFocus
            />
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-[#9494944a] rounded-md mr-2"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium rounded-md text-white bg-[#9a00e1] hover:bg-[#ae00ff8f] focus:outline-none disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Drawing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ShareRoomModal.tsx
"use client";
import { FE_URL } from "@/middleware";
import { Check, Clipboard, X } from "lucide-react";
import { useState } from "react";

interface shareRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  sharedKey: string;
  roomId: string;
  theme: "light" | "dark";
}

export function ShareRoomModal({
  isOpen,
  onClose,
  sharedKey,
  roomId,
  theme,
}: shareRoomModalProps) {
  const [copied, setCopied] = useState(false);
  const url = `${FE_URL}/canvas/${roomId}?sharedKey=${sharedKey}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (!isOpen) return null;

  // Theme styles
  const styles = {
    light: {
      modalBg: "bg-white text-gray-900",
      inputBg: "bg-gray-100 text-gray-600 border-gray-300",
      buttonBg: "bg-purple-600 hover:bg-purple-700",
      overlay: "bg-white bg-opacity-30",
      title: "text-gray-900",
    },
    dark: {
      modalBg: "bg-[#232329] text-white",
      inputBg: "bg-gray-800 text-gray-200 border-gray-700",
      buttonBg: "bg-[#5f00a3] hover:bg-[#5f00a3b4]",
      overlay: "bg-[#121212] bg-opacity-70",
      title: "text-white",
    },
  }[theme];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div
        className={`absolute inset-0 cursor-default ${styles.overlay}`}
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div
        className={`${styles.modalBg} rounded-lg shadow-[0_0_4px_rgba(0,0,0,0.25)] p-6 w-full max-w-md z-10 relative cursor-default`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-xl font-bold ${styles.title}`}>
            Copy the Sharable Link
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-current transition-colors cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="w-full max-w-sm">
          <label className="text-sm font-medium">Verify your website:</label>

          <div className="relative flex items-center mt-2">
            <span className="shrink-0 inline-flex items-center py-2.5 px-4 text-sm font-medium bg-gray-600 text-white rounded-s-lg">
              URL
            </span>

            <input
              type="text"
              value={url}
              readOnly
              disabled
              className={`w-full p-2.5 text-sm border border-s-0 rounded-none ${styles.inputBg}`}
            />

            <button
              onClick={handleCopy}
              className={`cursor-pointer shrink-0 inline-flex items-center justify-center py-3 px-4 text-sm font-medium text-white border rounded-e-lg transition-colors ${styles.buttonBg}`}
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-300" />
              ) : (
                <Clipboard className="w-4 h-4" />
              )}
            </button>

            <span
              className={`absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs px-2 py-1 rounded bg-black text-white transition-opacity duration-300 ${copied ? "opacity-100" : "opacity-0"}`}
            >
              {copied ? "Copied!" : "Copy link"}
            </span>
          </div>

          <p className="mt-8 text-sm text-red-500 font-medium flex items-center gap-1">
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M4.93 4.93a10 10 0 1 1 14.14 14.14A10 10 0 0 1 4.93 4.93z"
              />
            </svg>
            Do not share this link with anonymous users.
          </p>
        </div>
      </div>
    </div>
  );
}

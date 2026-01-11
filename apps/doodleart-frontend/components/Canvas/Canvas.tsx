// Canvas.tsx

import { useEffect, useRef, useState } from "react";

import { Github, HelpCircle, Moon, Share2, Sun } from "lucide-react";
import { Game } from "@/draw/Game";
import { ShareRoomModal } from "../Dashboard/PopupComponent/ShareRoomModal";
import { Instruction } from "./Instruction";
import { ToolBar } from "./ToolBar";

export type Tool =
  | "rect"
  | "pencil"
  | "elip"
  | "line"
  | "text"
  | "cursor"
  | "grab"
  | "diamond";

export function Canvas({
  roomId,
  socket,
  sharedKey,
}: {
  roomId: string;
  socket: WebSocket;
  sharedKey: string;
}) {
  const [themeState, setThemeState] = useState({
    value: localStorage.getItem("theme") || "b",
  });
  const [selectedTool, setSelectedTool] = useState<Tool>("grab");
  const [selectShape, setSelectShape] = useState<boolean>(false);
  const [panningStatus, setPanningStatus] = useState<boolean>(false);
  const [lock, setLock] = useState(false);

  const gameRef = useRef<Game | null>(null);
  const bgcanvasRef = useRef<HTMLCanvasElement>(null);

  const [isShareModalOpen, setIsShareModalOpen] = useState({
    check: false,
    sharedKey: "",
    roomId: "",
  });
  const [instructionModal, setInstructionModal] = useState({
    isOpen: false,
  });

  const handleShareRoomModalClose = () => {
    setIsShareModalOpen({ check: false, sharedKey: "", roomId: "" });
  };

  const handleInstructionModalClose = () => {
    setInstructionModal({ isOpen: false });
  };

  const getCursorClass = (tool: Tool) => {
    switch (tool) {
      case "grab":
        if (panningStatus) return "cursor-grabbing";
        return "cursor-grab";
      case "cursor":
        if (selectShape) return "cursor-move";
        return "cursor-default";
      default:
        return "cursor-crosshair";
    }
  };

  // Initialize Game Instance
  useEffect(() => {
    if (bgcanvasRef.current) {
      const g = new Game(bgcanvasRef.current, roomId, socket, sharedKey);
      gameRef.current = g;

      g.registerToolChangeCallback(setSelectedTool);
      g.registerPanningCallback(setPanningStatus);
      g.registerSelectingCallback(setSelectShape);

      const resizeCanvas = () => {
        const dpr = window.devicePixelRatio ?? 1;

        requestAnimationFrame(() => {
          // high DPI means : scale up canvas width height scale down canvas css width height
          g.highDPI(dpr);
          g.render();
        });
      };

      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      return () => {
        window.removeEventListener("resize", resizeCanvas);
        g.destroyHandlers();
      };
    }
  }, [roomId, socket, sharedKey]);

  // syncing theme state
  useEffect(() => {
    if (gameRef.current) {
      gameRef.current.setTheme(themeState.value);
      gameRef.current.render();
    }
  }, [themeState.value]);

  // syncing tool state
  useEffect(() => {
    if (gameRef.current) {
      gameRef.current.setTool(selectedTool);
    }
  }, [selectedTool]);

  // syncing lock state
  useEffect(() => {
    if (gameRef.current) {
      gameRef.current.setLock(lock);
    }
  }, [lock]);

  return (
    <div
      className={`relative h-screen w-screen overflow-hidden ${getCursorClass(selectedTool)}`}
    >
      {/* Canvas */}
      <canvas
        ref={bgcanvasRef}
        className={`absolute top-0 left-0 w-full h-full z-0 overflow-hidden touch-none select-none`}
      />

      {/* Tool-bar */}
      <div
        className={`absolute left-1/2 transform -translate-x-1/2 z-10 ${panningStatus ? "pointer-events-none" : "pointer-events-auto"} select-none`}
      >
        <ToolBar
          selectedTool={selectedTool}
          setSelectedTool={setSelectedTool}
          themeState={themeState}
          lock={lock}
          setLock={setLock}
        />
      </div>

      <div
        className={`absolute z-10 ${panningStatus ? "pointer-events-none" : "pointer-events-auto"} xl:right-4 xl:top-4 xl:flex-row xl:gap-2 right-4 bottom-4 flex-row gap-2 flex h-9`}
      >
        {/* Theme Button */}
        <button
          className={`${themeState.value === "b" ? "bg-[#ffffff] active:bg-[#e5e5e5]" : "bg-[#27272a] active:bg-[#363636]"} flex flex-row h-9 w-10 xl:w-14 rounded-lg justify-center items-center cursor-pointer hover:scale-105 transition-transform select-none`}
          onClick={() => {
            const nextVal = themeState.value === "b" ? "w" : "b";
            localStorage.setItem("theme", nextVal);
            setThemeState({ value: nextVal });
          }}
          title="Theme"
        >
          {themeState.value === "b" ? (
            <Sun width={15} height={15} className="text-black" />
          ) : (
            <Moon width={15} height={15} className="text-white" />
          )}
        </button>

        {/* Share Button */}
        <button
          className={`${themeState.value === "b" ? "text-black bg-[#aba8ff] active:bg-[#807cff]" : "text-white bg-[#ae4aff] active:bg-[#a231ff]"} flex flex-row h-9 w-10 xl:w-14 rounded-lg justify-center items-center cursor-pointer hover:scale-105 transition-transform select-none`}
          onClick={() => {
            setIsShareModalOpen({
              check: true,
              sharedKey: sharedKey,
              roomId: roomId,
            });
          }}
          title="Share Room"
        >
          <div className="block xl:hidden">
            <Share2 width={15} height={15} />
          </div>
          <div className="hidden xl:block text-xs">Share</div>
        </button>

        {/* Help Button */}
        <button
          className={`${themeState.value === "w" ? "bg-[#e8e8ef] active:bg-[#bbbbbb] text-black" : "bg-[#232329] active:bg-[#363636] text-white"} flex flex-row h-9 w-10 xl:w-14 rounded-lg justify-center items-center cursor-pointer hover:scale-105 transition-transform select-none`}
          onClick={() => {
            setInstructionModal({ isOpen: true });
          }}
          title="Help & Instructions"
        >
          <HelpCircle
            width={18}
            height={18}
            strokeWidth={`${themeState.value === "w" ? 1.7 : 2}`}
          />
        </button>

        {/* Credit Button */}

        <a
          href="https://github.com/shahvivek2004/DoodleArt"
          target="_blank"
          rel="noopener noreferrer"
          title="View on GitHub"
          className={`${themeState.value === "w" ? "bg-[#e8e8ef] active:bg-[#bbbbbb] text-black" : "bg-[#232329] active:bg-[#363636] text-white"} flex flex-row h-9 w-10 xl:w-14 rounded-lg justify-center items-center cursor-pointer hover:scale-105 transition-transform select-none`}
        >
          <Github
            width={18}
            height={18}
            strokeWidth={`${themeState.value === "w" ? 1.7 : 2}`}
          />
        </a>
      </div>

      {/* Share pop-up */}
      <ShareRoomModal
        isOpen={isShareModalOpen.check}
        sharedKey={isShareModalOpen.sharedKey}
        roomId={isShareModalOpen.roomId}
        onClose={handleShareRoomModalClose}
        theme={themeState.value === "b" ? "dark" : "light"}
      />

      {/* Instruction pop-up */}
      <Instruction
        isOpen={instructionModal.isOpen}
        onClose={handleInstructionModalClose}
      />
    </div>
  );
}

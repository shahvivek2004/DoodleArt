// Canvas.tsx

import { useEffect, useRef, useState } from "react";
import { Github, HelpCircle, Moon, Share2, Sun } from "lucide-react";
import { Game } from "@/services/Game";
import { ShareRoomModal } from "../Dashboard/PopupComponent/ShareRoomModal";
import { Instruction } from "./Instruction";
import { ToolBar } from "./ToolBar";
import {
  DEFAULT_TEXT_STATE,
  DEFAULT_THEME_STATE,
  DEFAULT_VIEW_STATE,
  Shape,
  textState,
  themeState,
  Tool,
} from "@/services/types";
import { ThemeBar } from "./ThemeBar";

export function Canvas({
  roomId,
  socket,
  sharedKey,
}: {
  roomId: string;
  socket: WebSocket;
  sharedKey: string;
}) {
  const [viewState] = useState(
    () =>
      JSON.parse(localStorage.getItem("view") ?? "null") ?? DEFAULT_VIEW_STATE,
  );

  const [themeConfig, setThemeConfig] = useState<themeState>(
    () =>
      JSON.parse(localStorage.getItem("themeConfig") ?? "null") ??
      DEFAULT_THEME_STATE,
  );

  const [textConfig, setTextConfig] = useState<textState>(
    () =>
      JSON.parse(localStorage.getItem("textConfig") ?? "null") ??
      DEFAULT_TEXT_STATE,
  );

  const [selectedTool, setSelectedTool] = useState<Tool>("grab");
  const [detectedShape, setDetectedShape] = useState<boolean>(false);
  const [selectedShape, setSelectedShape] = useState<Shape | null>(null);
  const [panningStatus, setPanningStatus] = useState<boolean>(false);
  const [lock, setLock] = useState(false);

  const gameRef = useRef<Game | null>(null);
  const stCanvasRef = useRef<HTMLCanvasElement>(null);
  const itCanvasRef = useRef<HTMLCanvasElement>(null);

  const [isShareModalOpen, setIsShareModalOpen] = useState({
    check: false,
    sharedKey: "",
    roomId: "",
  });
  const [instructionModal, setInstructionModal] = useState({ isOpen: false });

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
        if (detectedShape) return "cursor-move";
        return "cursor-default";
      default:
        return "cursor-crosshair";
    }
  };

  const openThemeUI = (): boolean => {
    return (
      selectedTool === "rect" ||
      selectedTool === "diamond" ||
      selectedTool === "elip" ||
      selectedTool === "line" ||
      selectedTool === "pencil" ||
      selectedTool === "text" ||
      (selectedShape !== null && selectedTool === "cursor")
    );
  };

  const handleThemeToggle = () => {
    const nextVal = themeConfig.themeStyle === "b" ? "w" : "b";
    const nextBgColor = themeConfig.themeStyle === "b" ? "#ffffff" : "#121212";
    const nextSelectorStroke =
      themeConfig.themeStyle === "b" ? "#834aff" : "#aba8ff";
    let nextStrokeStyle = themeConfig.strokeStyle;
    let nextFontColor = textConfig.fontColor;
    let textChange = false;

    if (themeConfig.themeStyle === "b") {
      if (themeConfig.strokeStyle === "#ffffff") {
        nextStrokeStyle = "#000000";
      }
      if (textConfig.fontColor === "#ffffff") {
        nextFontColor = "#000000";
        textChange = true;
      }
    }

    if (themeConfig.themeStyle === "w") {
      if (themeConfig.strokeStyle === "#000000") {
        nextStrokeStyle = "#ffffff";
      }
      if (textConfig.fontColor === "#000000") {
        nextFontColor = "#ffffff";
        textChange = true;
      }
    }

    const nextTheme = {
      themeStyle: nextVal,
      bgColor: nextBgColor,
      selectorStroke: nextSelectorStroke,
      strokeStyle: nextStrokeStyle,
      strokeType: themeConfig.strokeType,
      fillStyle: themeConfig.fillStyle,
      strokeWidth: themeConfig.strokeWidth,
      selectorStrokeWidth: 1,
    };

    setThemeConfig(nextTheme);
    localStorage.setItem("themeConfig", JSON.stringify(nextTheme));

    if (textChange) {
      const nextTextConfig = {
        fontType: "Finger Paint",
        fontColor: nextFontColor,
        fontSize: 20,
        fontVertOffset: 8,
      };
      setTextConfig(nextTextConfig);
      localStorage.setItem("textConfig", JSON.stringify(nextTextConfig));
    }
  };

  const updateSelectedShapeTheme = (updates: {
    strokeStyle?: string;
    strokeWidth?: number;
    strokeType?: string;
    fillStyle?: string;
    fontColor?: string;
    fontSize?: number;
    fontType?: string;
  }) => {
    if (gameRef.current && selectedShape) {
      setSelectedShape({ ...selectedShape, ...updates });
      gameRef.current.updateSelectedShape(updates);
    }
  };

  // Initialize Game Instance
  useEffect(() => {
    if (!stCanvasRef.current) return;
    if (!itCanvasRef.current) return;

    const g = new Game(
      stCanvasRef.current,
      itCanvasRef.current,
      roomId,
      socket,
      sharedKey,
    );
    gameRef.current = g;

    g.registerToolChangeCallback(setSelectedTool);
    g.registerPanningCallback(setPanningStatus);
    g.registerDetectingCallback(setDetectedShape);
    g.registerSelectingCallback(setSelectedShape);

    const resizeCanvas = () => {
      g.resize();
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      g.destroyEventListeneres();
    };
  }, [roomId, socket, sharedKey]);

  // syncing text config
  useEffect(() => {
    if (gameRef.current) {
      gameRef.current.setText(textConfig);
    }
  }, [textConfig]);

  // syncing theme config
  useEffect(() => {
    if (gameRef.current) {
      gameRef.current.setTheme(themeConfig);
    }
  }, [themeConfig]);

  // syncing view state
  useEffect(() => {
    if (gameRef.current) {
      gameRef.current.setView(viewState);
    }
  }, [viewState]);

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
        ref={stCanvasRef}
        className={`absolute top-0 left-0 w-full h-full z-1 overflow-hidden touch-none select-none`}
      />
      <canvas
        ref={itCanvasRef}
        className={`absolute top-0 left-0 w-full h-full z-2 overflow-hidden touch-none select-none`}
      />

      {/* Tool-bar */}
      <ToolBar
        panningStatus={panningStatus}
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
        toggledTheme={themeConfig.themeStyle}
        lock={lock}
        setLock={setLock}
      />

      {/* Top Right Controls */}
      <div
        className={`absolute z-3 ${
          panningStatus ? "pointer-events-none" : "pointer-events-auto"
        } xl:right-4 xl:top-4 xl:flex-row xl:gap-2 right-4 bottom-4 flex-row gap-2 flex h-9`}
      >
        {/* Theme Button */}
        <button
          className={`${
            themeConfig.themeStyle === "b"
              ? "bg-[#ffffff] active:bg-[#e5e5e5]"
              : "bg-[#27272a] active:bg-[#363636]"
          } flex flex-row h-9 w-10 xl:w-14 rounded-lg justify-center items-center cursor-pointer hover:scale-105 transition-transform select-none`}
          onClick={handleThemeToggle}
          title="Toggle Theme"
        >
          {themeConfig.themeStyle === "b" ? (
            <Sun width={15} height={15} className="text-black" />
          ) : (
            <Moon width={15} height={15} className="text-white" />
          )}
        </button>

        {/* Share Button */}
        <button
          className={`${
            themeConfig.themeStyle === "b"
              ? "text-black bg-[#aba8ff] active:bg-[#807cff]"
              : "text-white bg-[#ae4aff] active:bg-[#a231ff]"
          } flex flex-row h-9 w-10 xl:w-14 rounded-lg justify-center items-center cursor-pointer hover:scale-105 transition-transform select-none`}
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
          className={`${
            themeConfig.themeStyle === "w"
              ? "bg-[#e8e8ef] active:bg-[#bbbbbb] text-black"
              : "bg-[#232329] active:bg-[#363636] text-white"
          } flex flex-row h-9 w-10 xl:w-14 rounded-lg justify-center items-center cursor-pointer hover:scale-105 transition-transform select-none`}
          onClick={() => {
            setInstructionModal({ isOpen: true });
          }}
          title="Help & Instructions"
        >
          <HelpCircle
            width={18}
            height={18}
            strokeWidth={`${themeConfig.themeStyle === "w" ? 1.7 : 2}`}
          />
        </button>

        {/* GitHub Button */}
        <a
          href="https://github.com/shahvivek2004/DoodleArt"
          target="_blank"
          rel="noopener noreferrer"
          title="View on GitHub"
          className={`${
            themeConfig.themeStyle === "w"
              ? "bg-[#e8e8ef] active:bg-[#bbbbbb] text-black"
              : "bg-[#232329] active:bg-[#363636] text-white"
          } flex flex-row h-9 w-10 xl:w-14 rounded-lg justify-center items-center cursor-pointer hover:scale-105 transition-transform select-none`}
        >
          <Github
            width={18}
            height={18}
            strokeWidth={`${themeConfig.themeStyle === "w" ? 1.7 : 2}`}
          />
        </a>
      </div>

      {/* Theme Configuration Bar */}
      <ThemeBar
        updateSelectedShapeTheme={updateSelectedShapeTheme}
        selectedShape={selectedShape}
        panningStatus={panningStatus}
        openThemeUI={openThemeUI}
        themeConfig={themeConfig}
        setTextConfig={setTextConfig}
        setThemeConfig={setThemeConfig}
        textConfig={textConfig}
        selectedTool={selectedTool}
      />

      {/* Share Modal */}
      <ShareRoomModal
        isOpen={isShareModalOpen.check}
        sharedKey={isShareModalOpen.sharedKey}
        roomId={isShareModalOpen.roomId}
        onClose={handleShareRoomModalClose}
        theme={themeConfig.themeStyle === "b" ? "dark" : "light"}
      />

      {/* Instruction Modal */}
      <Instruction
        isOpen={instructionModal.isOpen}
        onClose={handleInstructionModalClose}
      />
    </div>
  );
}

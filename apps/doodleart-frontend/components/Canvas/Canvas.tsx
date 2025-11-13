// Canvas.tsx
import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import {
  Circle,
  Github,
  Hand,
  HelpCircle,
  Moon,
  MousePointer,
  Pencil,
  RectangleHorizontalIcon,
  Share2,
  Slash,
  Sun,
  Type,
} from "lucide-react";
import { Game } from "@/draw/Game";
import { ShareRoomModal } from "../Dashboard/pop-ups/ShareRoomModal";
import { Instruction } from "./Instruction";

export type Tool =
  | "rect"
  | "pencil"
  | "elip"
  | "line"
  | "text"
  | "cursor"
  | "grab";

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
  const [game, setGame] = useState<Game>();
  const bgcanvasRef = useRef<HTMLCanvasElement>(null);
  const [panningStatus, setPanningStatus] = useState<boolean>(false);
  const [selectShape, setSelectShape] = useState<boolean>(false);
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

  const handleToolChange = (tool: Tool) => {
    setSelectedTool(tool);
  };

  const handleGameToolChange = (tool: Tool) => {
    if (game) {
      game.setTool(tool);
    }
  };

  const handlePanChange = (status: boolean) => {
    setPanningStatus(status);
  };

  const handleSelectionChange = (status: boolean) => {
    setSelectShape(status);
  };

  useEffect(() => {
    if (bgcanvasRef.current) {
      const g = new Game(bgcanvasRef.current, roomId, socket, sharedKey);
      setGame(g);

      g.registerToolChangeCallback(handleToolChange);
      g.registerPanningCallback(handlePanChange);
      g.registerSelectingCallback(handleSelectionChange);

      const resizeCanvas = () => {
        const dpr = window.devicePixelRatio || 1;

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
        g.destroyMouseHandlers();
      };
    }
  }, [bgcanvasRef, roomId, socket, sharedKey]);

  return (
    <div
      className={`relative h-screen w-screen overflow-hidden ${getCursorClass(selectedTool)}`}
    >
      {/* Canvas */}

      <canvas
        ref={bgcanvasRef}
        className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden touch-none select-none"
      />

      {/* Tool-bar */}
      <div
        className={`absolute left-1/2 transform -translate-x-1/2 z-10 ${panningStatus ? "pointer-events-none" : "pointer-events-auto"} select-none`}
      >
        <ToolBar
          selectedTool={selectedTool}
          setSelectedTool={handleToolChange}
          themeState={themeState}
          setGameTool={handleGameToolChange}
        />
      </div>

      <div
        className={`absolute z-10 ${panningStatus ? "pointer-events-none" : "pointer-events-auto"} xl:right-4 xl:top-4 xl:flex-row xl:gap-2 right-4 bottom-4 flex-row gap-2 flex h-9`}
      >
        {/* Theme Button */}
        <button
          className={`${themeState.value === "b" ? "bg-[#ffffff] active:bg-[#e5e5e5]" : "bg-[#27272a] active:bg-[#363636]"} flex flex-row h-9 w-10 xl:w-14 rounded-lg justify-center items-center cursor-pointer hover:scale-105 transition-transform select-none`}
          onClick={() => {
            const val = themeState.value === "b" ? "w" : "b";
            localStorage.setItem("theme", val);
            setThemeState({ value: val });
            if (game) {
              game.setTheme(val);
              game.render();
            }
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
          className={`bg-[#a12fff] active:bg-[#7400aa] ${themeState.value === "b" ? "text-black" : "text-white"} flex flex-row h-9 w-10 xl:w-14 rounded-lg justify-center items-center cursor-pointer hover:scale-105 transition-transform select-none`}
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
          className={`${themeState.value === "w" ? "bg-[#e8e8ef] active:bg-[#bbbbbb] text-black" : "bg-[#27272a] active:bg-[#363636] text-white"} flex flex-row h-9 w-10 xl:w-14 rounded-lg justify-center items-center cursor-pointer hover:scale-105 transition-transform select-none`}
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
        <button
          className={`${themeState.value === "w" ? "bg-[#e8e8ef] active:bg-[#bbbbbb] text-black" : "bg-[#27272a] active:bg-[#363636] text-white"} flex flex-row h-9 w-10 xl:w-14 rounded-lg justify-center items-center cursor-pointer hover:scale-105 transition-transform select-none`}
        >
          <a
            href="https://github.com/shahvivek2004/DoodleArt"
            target="_blank"
            rel="noopener noreferrer"
            title="View on GitHub"
            className="w-full h-full flex flex-row justify-center items-center"
          >
            <Github
              width={18}
              height={18}
              strokeWidth={`${themeState.value === "w" ? 1.7 : 2}`}
            />
          </a>
        </button>
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

function ToolBar({
  selectedTool,
  setSelectedTool,
  themeState,
  setGameTool,
}: {
  selectedTool: Tool;
  setSelectedTool: (s: Tool) => void;
  themeState: { value: string };
  setGameTool: (s: Tool) => void;
}) {
  return (
    <div
      className={`flex flex-row ${themeState.value === "w" ? "bg-[#ffffff] shadow-[0_0_5px_rgba(0,0,0,0.25)] " : "bg-[#232329]"} h-12 w-[320px] rounded-xl mt-4 text-center justify-around cursor-default px-1`}
    >
      <IconButton
        onClick={() => {
          setSelectedTool("grab");
          setGameTool("grab");
        }}
        activated={selectedTool === "grab"}
        icon={
          <Hand
            width={15}
            height={15}
            strokeWidth={`${themeState.value === "w" ? 1.7 : 2}`}
          />
        }
        label="Grab Tool"
        keyVal={1}
        themeDefault={themeState.value === "b"}
      />
      <IconButton
        onClick={() => {
          setSelectedTool("cursor");
          setGameTool("cursor");
        }}
        activated={selectedTool === "cursor"}
        icon={
          <MousePointer
            width={15}
            height={15}
            strokeWidth={`${themeState.value === "w" ? 1.7 : 2}`}
          />
        }
        label="Cursor Tool"
        keyVal={2}
        themeDefault={themeState.value === "b"}
      />
      <IconButton
        onClick={() => {
          setSelectedTool("rect");
          setGameTool("rect");
        }}
        activated={selectedTool === "rect"}
        icon={
          <RectangleHorizontalIcon
            width={15}
            height={15}
            strokeWidth={`${themeState.value === "w" ? 1.7 : 2}`}
          />
        }
        label="Rectangle Tool"
        keyVal={3}
        themeDefault={themeState.value === "b"}
      />
      <IconButton
        onClick={() => {
          setSelectedTool("elip");
          setGameTool("elip");
        }}
        activated={selectedTool === "elip"}
        icon={
          <Circle
            width={15}
            height={15}
            strokeWidth={`${themeState.value === "w" ? 1.7 : 2}`}
          />
        }
        label="Ellipse Tool"
        keyVal={4}
        themeDefault={themeState.value === "b"}
      />
      <IconButton
        onClick={() => {
          setSelectedTool("line");
          setGameTool("line");
        }}
        activated={selectedTool === "line"}
        icon={
          <Slash
            width={15}
            height={15}
            strokeWidth={`${themeState.value === "w" ? 1.7 : 2}`}
          />
        }
        label="Line Tool"
        keyVal={5}
        themeDefault={themeState.value === "b"}
      />
      <IconButton
        onClick={() => {
          setSelectedTool("pencil");
          setGameTool("pencil");
        }}
        activated={selectedTool === "pencil"}
        icon={
          <Pencil
            width={15}
            height={15}
            strokeWidth={`${themeState.value === "w" ? 1.7 : 2}`}
          />
        }
        label="Pencil Tool"
        keyVal={6}
        themeDefault={themeState.value === "b"}
      />
      <IconButton
        onClick={() => {
          setSelectedTool("text");
          setGameTool("text");
        }}
        activated={selectedTool === "text"}
        icon={
          <Type
            width={15}
            height={15}
            strokeWidth={`${themeState.value === "w" ? 1.7 : 2}`}
          />
        }
        label="Text Tool"
        keyVal={7}
        themeDefault={themeState.value === "b"}
      />
    </div>
  );
}

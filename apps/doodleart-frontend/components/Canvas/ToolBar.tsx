// ToolBar.tsx

import {
  Circle,
  Diamond,
  Hand,
  LockKeyhole,
  LockKeyholeOpen,
  Minus,
  MousePointer,
  Pencil,
  RectangleHorizontalIcon,
  Type,
} from "lucide-react";
import { IconButton } from "./IconButton";
import { Tool } from "@/services/types";
export function ToolBar({
  selectedTool,
  setSelectedTool,
  toggledTheme,
  lock,
  setLock,
  panningStatus,
}: {
  selectedTool: Tool;
  setSelectedTool: (s: Tool) => void;
  toggledTheme: string;
  lock: boolean;
  setLock: (s: boolean) => void;
  panningStatus: boolean;
}) {
  return (
    <div
      className={`absolute left-1/2 transform -translate-x-1/2 z-3 ${panningStatus ? "pointer-events-none" : "pointer-events-auto"} select-none`}
    >
      <div
        className={`flex flex-row ${toggledTheme === "w" ? "bg-[#ffffff] shadow-[0_0_5px_rgba(0,0,0,0.25)] " : "bg-[#232329]"} h-12 w-100 rounded-xl mt-4 text-center items-center justify-around cursor-default px-1`}
      >
        <IconButton
          onClick={() => {
            setLock(!lock);
          }}
          activated={lock}
          icon={
            lock ? (
              <LockKeyhole width={15} height={15} strokeWidth={1.5} />
            ) : (
              <LockKeyholeOpen width={15} height={15} strokeWidth={1.5} />
            )
          }
          label="Keep selected tool active after drawing"
          themeDefault={toggledTheme === "b"}
        />

        <div
          className={`${toggledTheme === "b" ? "text-gray-600" : "text-gray-300"} h-8 flex justify-center items-baseline text-lg`}
        >
          |
        </div>

        <IconButton
          onClick={() => {
            setSelectedTool("grab");
          }}
          activated={selectedTool === "grab"}
          icon={<Hand width={15} height={15} strokeWidth={1.5} />}
          label="Grab Tool"
          themeDefault={toggledTheme === "b"}
        />

        <IconButton
          onClick={() => {
            setSelectedTool("cursor");
          }}
          activated={selectedTool === "cursor"}
          icon={<MousePointer width={15} height={15} strokeWidth={1.5} />}
          label="Cursor Tool - 1"
          keyVal={1}
          themeDefault={toggledTheme === "b"}
        />

        <IconButton
          onClick={() => {
            setSelectedTool("rect");
          }}
          activated={selectedTool === "rect"}
          icon={
            <RectangleHorizontalIcon width={15} height={15} strokeWidth={1.5} />
          }
          label="Rectangle Tool - 2"
          keyVal={2}
          themeDefault={toggledTheme === "b"}
        />

        <IconButton
          onClick={() => {
            setSelectedTool("diamond");
          }}
          activated={selectedTool === "diamond"}
          icon={<Diamond width={15} height={15} strokeWidth={1.5} />}
          label="Diamond Tool - 3"
          keyVal={3}
          themeDefault={toggledTheme === "b"}
        />

        <IconButton
          onClick={() => {
            setSelectedTool("elip");
          }}
          activated={selectedTool === "elip"}
          icon={<Circle width={15} height={15} strokeWidth={1.5} />}
          label="Ellipse Tool - 4"
          keyVal={4}
          themeDefault={toggledTheme === "b"}
        />

        <IconButton
          onClick={() => {
            setSelectedTool("line");
          }}
          activated={selectedTool === "line"}
          icon={<Minus width={15} height={15} strokeWidth={1.5} />}
          label="Line Tool - 5"
          keyVal={5}
          themeDefault={toggledTheme === "b"}
        />

        <IconButton
          onClick={() => {
            setSelectedTool("pencil");
          }}
          activated={selectedTool === "pencil"}
          icon={<Pencil width={15} height={15} strokeWidth={1.5} />}
          label="Pencil Tool - 6"
          keyVal={6}
          themeDefault={toggledTheme === "b"}
        />

        <IconButton
          onClick={() => {
            setSelectedTool("text");
          }}
          activated={selectedTool === "text"}
          icon={<Type width={15} height={15} strokeWidth={1.5} />}
          label="Text Tool - 7"
          keyVal={7}
          themeDefault={toggledTheme === "b"}
        />
      </div>
    </div>
  );
}

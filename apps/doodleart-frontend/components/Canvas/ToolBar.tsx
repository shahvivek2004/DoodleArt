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
import { Tool } from "./Canvas";
import { IconButton } from "./IconButton";
export function ToolBar({
  selectedTool,
  setSelectedTool,
  themeState,
  lock,
  setLock,
}: {
  selectedTool: Tool;
  setSelectedTool: (s: Tool) => void;
  themeState: { value: string };
  lock: boolean;
  setLock: (s: boolean) => void;
}) {
  return (
    <div
      className={`flex flex-row ${themeState.value === "w" ? "bg-[#ffffff] shadow-[0_0_5px_rgba(0,0,0,0.25)] " : "bg-[#232329]"} h-12 w-100 rounded-xl mt-4 text-center items-center justify-around cursor-default px-1`}
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
        themeDefault={themeState.value === "b"}
      />

      <div
        className={`${themeState.value === "b" ? "text-gray-600" : "text-gray-300"} h-8 flex justify-center items-baseline text-lg`}
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
        themeDefault={themeState.value === "b"}
      />

      <IconButton
        onClick={() => {
          setSelectedTool("cursor");
        }}
        activated={selectedTool === "cursor"}
        icon={<MousePointer width={15} height={15} strokeWidth={1.5} />}
        label="Cursor Tool - 1"
        keyVal={1}
        themeDefault={themeState.value === "b"}
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
        themeDefault={themeState.value === "b"}
      />

      <IconButton
        onClick={() => {
          setSelectedTool("diamond");
        }}
        activated={selectedTool === "diamond"}
        icon={<Diamond width={15} height={15} strokeWidth={1.5} />}
        label="Diamond Tool - 3"
        keyVal={3}
        themeDefault={themeState.value === "b"}
      />

      <IconButton
        onClick={() => {
          setSelectedTool("elip");
        }}
        activated={selectedTool === "elip"}
        icon={<Circle width={15} height={15} strokeWidth={1.5} />}
        label="Ellipse Tool - 4"
        keyVal={4}
        themeDefault={themeState.value === "b"}
      />

      <IconButton
        onClick={() => {
          setSelectedTool("line");
        }}
        activated={selectedTool === "line"}
        icon={<Minus width={15} height={15} strokeWidth={1.5} />}
        label="Line Tool - 5"
        keyVal={5}
        themeDefault={themeState.value === "b"}
      />

      <IconButton
        onClick={() => {
          setSelectedTool("pencil");
        }}
        activated={selectedTool === "pencil"}
        icon={<Pencil width={15} height={15} strokeWidth={1.5} />}
        label="Pencil Tool - 6"
        keyVal={6}
        themeDefault={themeState.value === "b"}
      />

      <IconButton
        onClick={() => {
          setSelectedTool("text");
        }}
        activated={selectedTool === "text"}
        icon={<Type width={15} height={15} strokeWidth={1.5} />}
        label="Text Tool - 7"
        keyVal={7}
        themeDefault={themeState.value === "b"}
      />
    </div>
  );
}

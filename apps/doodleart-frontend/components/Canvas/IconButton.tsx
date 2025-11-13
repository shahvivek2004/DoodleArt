import { ReactNode } from "react";
import { Tooltip } from "./Tooltip";

export function IconButton({
  icon,
  onClick,
  activated,
  label,
  keyVal,
  themeDefault,
}: {
  icon: ReactNode;
  onClick: () => void;
  activated: boolean;
  label: string;
  keyVal: number;
  themeDefault: boolean;
}) {
  return (
    <Tooltip label={label}>
      <button
        className={`cursor-pointer h-8 w-8 px-1 flex border-1 border-transparent rounded-md ${themeDefault ? "text-white active:border-white" : "text-[#27272a] active:border-purple-500"} ${themeDefault ? (activated ? "bg-[#a12fffa1]" : "hover:bg-[#47425e75]") : activated ? "bg-[#6a00ff8a]" : "hover:bg-[#47425e26]"} flex-row items-center justify-center`}
        onClick={onClick}
      >
        <div className="flex flex-col flex-1 justify-center items-center">
          <div className="mt-1">{icon}</div>
          <div className="flex flex-row w-full justify-end">
            <div
              className={`text-[9px] ${activated ? (themeDefault ? "text-white" : "text-[#27272a]") : themeDefault ? "text-gray-500" : "text-gray-400"}`}
            >
              {keyVal}
            </div>
          </div>
        </div>
      </button>
    </Tooltip>
  );
}

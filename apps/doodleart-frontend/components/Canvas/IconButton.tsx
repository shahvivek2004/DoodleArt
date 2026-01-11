import { ReactNode } from "react";

export function IconButton({
  icon,
  onClick,
  activated,
  keyVal,
  label,
  themeDefault,
}: {
  icon: ReactNode;
  onClick: () => void;
  activated: boolean;
  label: string;
  keyVal?: number;
  themeDefault: boolean;
}) {
  return (
    <button
      className={`cursor-pointer h-8 w-8 px-1 flex border border-transparent rounded-md ${themeDefault ? "text-white active:border-white" : "text-[#27272a] active:border-purple-500"} ${themeDefault ? (activated ? "bg-[#874fff67]" : "hover:bg-[#47425e75]") : activated ? "bg-[#bc8bff7c]" : "hover:bg-[#47425e26]"} flex-row items-center justify-center`}
      onClick={onClick}
      title={label}
    >
      <div className="flex flex-col flex-1 justify-center items-center">
        <div className={`${keyVal ? "mt-1" : "mb-1"}`}>{icon}</div>
        <div className="flex flex-row w-full justify-end">
          <div
            className={`text-[9px] ${activated ? (themeDefault ? "text-white" : "text-[#27272a]") : themeDefault ? "text-gray-500" : "text-gray-400"}`}
          >
            {keyVal}
          </div>
        </div>
      </div>
    </button>
  );
}

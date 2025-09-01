import { ReactNode } from "react";
import { Tooltip } from "./Tooltip";

export function IconButton({
    icon, onClick, activated, label, keyVal
}: {
    icon: ReactNode,
    onClick: () => void,
    activated: boolean,
    label: string,
    keyVal: number
}) {
    return (
        <Tooltip label={label}>
            <button className={`cursor-pointer flex flex-1 w-full p-1 border-1 border-transparent active:border-white rounded-lg ${activated ? ' text-white bg-[#ae00ff7a]  hover:bg-[#ae00ffcb]' : 'text-[#a4a4a4] hover:text-white  hover:bg-[#47425e75]'} flex-row items-center justify-center`} onClick={onClick}>
                <div className="flex flex-col w-full h-full flex-1 justify-center items-center">
                    <div className="mt-1">{icon}</div>
                    <div className="flex flex-row w-full justify-end">
                        <div className="text-[10px]">{keyVal}</div>
                    </div>
                </div>
            </button>
        </Tooltip>
    )
}
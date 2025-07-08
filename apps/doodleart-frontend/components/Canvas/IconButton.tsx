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
            <button className={`flex-1 w-full border-1 border-transparent active:border-white p-1 rounded-lg ${activated ? ' text-white bg-[#51419675]  hover:bg-[#51419675]' : 'text-[#a4a4a4] hover:text-white  hover:bg-[#47425e75]'} flex items-center justify-center`} onClick={onClick}>
                <div className="flex flex-col w-full h-full flex-1 justify-center items-center">
                    <div>{icon} </div>
                    <div className="flex flex-row w-full justify-end">
                        <div className="text-xs">{keyVal}</div>
                    </div>
                </div>
            </button>
        </Tooltip>
    )
}
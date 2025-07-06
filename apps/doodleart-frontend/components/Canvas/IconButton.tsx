import { ReactNode } from "react";
import { Tooltip } from "./Tooltip";

export function IconButton({
    icon, onClick, activated, label
}: {
    icon: ReactNode,
    onClick: () => void,
    activated: boolean,
    label: string
}) {
    return (
        <Tooltip label={label}>
            <button className={`flex-1 w-full border-1 border-transparent active:border-white p-2 rounded-lg ${activated ? ' text-white bg-[#51419675]  hover:bg-[#51419675]' : 'text-[#a4a4a4] hover:text-white  hover:bg-[#47425e75]'} flex items-center justify-center`} onClick={onClick}>
                {icon}
            </button>
        </Tooltip>
    )
}
import { ReactNode, useState } from "react";

export function Tooltip({
    children,
    label,
}: {
    children: ReactNode;
    label: string;
}) {
    const [visible, setVisible] = useState(false);

    return (
        <div
            className="flex flex-1 items-center"
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
        >
            {children}
            {visible && (
                <div className="absolute top-full mt-2 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-md z-10 whitespace-nowrap">
                    {label}
                </div>
            )}
        </div>
    );
}

// Canvas.tsx
import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { Circle, Github, Hand, LetterText, MousePointer, Pencil, RectangleHorizontalIcon, Slash } from "lucide-react";
import { Game } from "@/draw/Game";
// import Image from "next/image";
// import { Tooltip } from "./Tooltip";

export type Tool = "rect" | "pencil" | "elip" | "line" | "text" | "cursor" | "grab";

// export type ToolConfig = {
//     color: string,
//     strokeWidth: number,
//     bgColor: string,
//     lineDashX: number,
//     lineDashY: number,
//     fontSize: number
// };

export function Canvas({ roomId, socket }: { roomId: string, socket: WebSocket }) {

    const [selectedTool, setSelectedTool] = useState<Tool>("cursor");
    // const [toolConfig, setToolConfig] = useState<ToolConfig>({ color: "white", strokeWidth: 4, bgColor: "transparent", lineDashX: 1, lineDashY: 0, fontSize: 20 });
    const [game, setGame] = useState<Game>();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [panningStatus, setPanningStatus] = useState<boolean>(false);
    const [selectShape, setSelectShape] = useState<boolean>(false);


    const getCursorClass = (tool: Tool) => {
        switch (tool) {
            case "grab":
                if (panningStatus) return "cursor-grabbing";
                return "cursor-grab";
            case "cursor":
                if(selectShape) return "cursor-move";
                return "cursor-default";
            default:
                return "cursor-crosshair";
        }
    };

    // const getSidebarCursorClass = (tool: Tool) => {
    //     switch (tool) {
    //         case "grab":
    //             return "hidden";
    //         case "cursor":
    //             return "hidden";
    //         default:
    //             return "block";
    //     }
    // };

    // const getStrokeBorderDisplay = (color: string) => {
    //     if (color == toolConfig.color) {
    //         if (color == "white") {
    //             return "border border-3 border-cyan-400";
    //         }
    //         return `border border-3`;
    //     }
    // };

    // const getBackgroundBorderDisplay = (color: string) => {
    //     if (color == toolConfig.bgColor) {
    //         return "border border-3 border-cyan-400";
    //     }
    // };

    // const getStrokeWidthBorderDisplay = (lineWidth: number) => {
    //     if (lineWidth == toolConfig.strokeWidth) {
    //         return true;
    //     }

    //     return false;
    // };

    // const getColorHex = (color: string) => {
    //     switch (color) {
    //         case "red":
    //             return "#f87171";
    //         case "yellow":
    //             return "#facc15";
    //         case "green":
    //             return "#4ade80";
    //         case "blue":
    //             return "#60a5fa";
    //         case "purple":
    //             return "#c084fc";
    //         default:
    //             return "#ffffff";
    //     }
    // };

    // const getBgColorHex = (color: string) => {
    //     switch (color) {
    //         case "red":
    //             return "#fca5a5";
    //         case "yellow":
    //             return "#fef08a";
    //         case "green":
    //             return "#bbf7d0";
    //         case "blue":
    //             return "#bfdbfe";
    //         case "purple":
    //             return "#e9d5ff";
    //         default:
    //             return "transparent";
    //     }
    // };

    // const getStrokeStyleBorderDisplay = (strokeData: { x: number, y: number }) => {
    //     if (toolConfig.lineDashX === strokeData.x && toolConfig.lineDashY === strokeData.y) {
    //         return true;
    //     }
    //     return false;
    // };

    // const getFontSize = (x: number) => {
    //     if (x == toolConfig.fontSize) {
    //         return true;
    //     }
    //     return false;
    // }

    const handleToolChange = (tool: Tool) => {
        setSelectedTool(tool);
    };

    const handlePanChange = (status: boolean) => {
        setPanningStatus(status);
    };

    const handleSelectionChange = (status: boolean) => {
        setSelectShape(status);
    }

    // useEffect(() => {
    //     if (game) {
    //         const payload: ToolConfig = {
    //             color: getColorHex(toolConfig.color),
    //             bgColor: getBgColorHex(toolConfig.bgColor),
    //             strokeWidth: toolConfig.strokeWidth,
    //             lineDashX: toolConfig.lineDashX,
    //             lineDashY: toolConfig.lineDashY,
    //             fontSize: toolConfig.fontSize
    //         }
    //         game.setToolConfigs(payload);
    //     }
    // }, [toolConfig, game]);

    // Set tool in Game class when selected tool changes from UI

    useEffect(() => {
        if (game) {
            // console.log("tool change!");
            game.setTool(selectedTool);
        }
    }, [selectedTool, game]);

    // Initialize Game instance
    useEffect(() => {
        if (canvasRef.current) {

            const g = new Game(canvasRef.current, roomId, socket);
            setGame(g);
            //console.log("new game initialized");

            // Register callback for tool changes from Game class
            g.registerToolChangeCallback(handleToolChange);
            g.registerPanningCallback(handlePanChange);
            g.registerSelectingCallback(handleSelectionChange);
            //console.log("tool change registered!");

            return () => {
                //console.log("mousehandlers destroyed!");
                g.destroyMouseHandlers();

            }
        }
    }, [canvasRef, roomId, socket]);

    return (
        <div className={`relative h-screen w-screen overflow-hidden ${getCursorClass(selectedTool)}`}>
            {/* Canvas */}
            <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} className="absolute top-0 left-0 w-screen h-screen z-0" />

            {/* Tool-bar */}
            <div className={`absolute left-1/2 transform -translate-x-1/2 z-10 ${panningStatus ? 'pointer-events-none' : 'pointer-events-auto'}`}>
                <ToolBar selectedTool={selectedTool} setSelectedTool={handleToolChange} />
            </div>

            {/* Credit */}
            <div className={`absolute left-85/100 top-90/100 z-10 ${panningStatus ? 'pointer-events-none' : 'pointer-events-auto'}`}>
                <a href="https://github.com/shahvivek2004">
                    <div className="flex flex-row gap-2 bg-[#232329] h-12 w-48 rounded-lg justify-center items-center hover:underline p-1">
                        <div><Github /></div>
                        <div>Created by Vivek</div>
                    </div>
                </a>
            </div>

            {/* Side-bar */}

        </div >
    )
}

function ToolBar({ selectedTool, setSelectedTool }: { selectedTool: Tool, setSelectedTool: (s: Tool) => void }) {
    return (
        <div className="flex flex-row bg-[#232329] h-16 w-md rounded-xl mt-4 gap-3 items-center text-center p-3 justify-center cursor-default">
            <IconButton onClick={() => setSelectedTool("grab")} activated={selectedTool === "grab"} icon={<Hand width={18} height={18} />} label="Grab Tool" keyVal={1} />
            <IconButton onClick={() => setSelectedTool("cursor")} activated={selectedTool === "cursor"} icon={<MousePointer width={18} height={18} />} label="Cursor Tool" keyVal={2} />
            <IconButton onClick={() => setSelectedTool("rect")} activated={selectedTool === "rect"} icon={<RectangleHorizontalIcon width={18} height={18} />} label="Rectangle Tool" keyVal={3} />
            <IconButton onClick={() => setSelectedTool("elip")} activated={selectedTool === "elip"} icon={<Circle width={18} height={18} />} label="Ellipse Tool" keyVal={4} />
            <IconButton onClick={() => setSelectedTool("line")} activated={selectedTool === "line"} icon={<Slash width={18} height={18} />} label="Line Tool" keyVal={5} />
            <IconButton onClick={() => setSelectedTool("pencil")} activated={selectedTool === "pencil"} icon={<Pencil width={18} height={18} />} label="Pencil Tool" keyVal={6} />
            <IconButton onClick={() => setSelectedTool("text")} activated={selectedTool === "text"} icon={<LetterText width={18} height={18} />} label="Text Tool" keyVal={7} />
        </div>
    );
}

// Side bar
// <div className={`h-screen z-10 absolute ${getSidebarCursorClass(selectedTool)}`}>
//     <div className="h-screen flex flex-col justify-center">
//         <div className="flex flex-col gap-5 bg-[#232329] h-120 p-3 rounded-xl text-xs cursor-default">
//             <div className="flex flex-col gap-3">
//                 <div>Stroke</div>
//                 <div className="flex flex-row gap-2">
//                     <button onClick={() => { setToolConfig({ ...toolConfig, color: "white" }) }} className={`${getStrokeBorderDisplay("white")} rounded-md cursor-pointer`}><Tooltip label={getColorHex("white")}><div className="bg-white w-5 h-5 rounded-sm"></div></Tooltip></button>
//                     <button onClick={() => { setToolConfig({ ...toolConfig, color: "red" }) }} className={`${getStrokeBorderDisplay("red")} rounded-md cursor-pointer`}><Tooltip label={getColorHex("red")}><div className="bg-red-400 w-5 h-5 rounded-sm"></div></Tooltip></button>
//                     <button onClick={() => { setToolConfig({ ...toolConfig, color: "yellow" }) }} className={`${getStrokeBorderDisplay("yellow")} rounded-md cursor-pointer`}><Tooltip label={getColorHex("yellow")}><div className="bg-yellow-400 w-5 h-5 rounded-sm"></div></Tooltip></button>
//                     <button onClick={() => { setToolConfig({ ...toolConfig, color: "green" }) }} className={`${getStrokeBorderDisplay("green")} rounded-md cursor-pointer`}><Tooltip label={getColorHex("green")}><div className="bg-green-400 w-5 h-5 rounded-sm"></div></Tooltip></button>
//                     <button onClick={() => { setToolConfig({ ...toolConfig, color: "blue" }) }} className={`${getStrokeBorderDisplay("blue")} rounded-md cursor-pointer`}><Tooltip label={getColorHex("blue")}><div className="bg-blue-400 w-5 h-5 rounded-sm"></div></Tooltip></button>
//                     <button onClick={() => { setToolConfig({ ...toolConfig, color: "purple" }) }} className={`${getStrokeBorderDisplay("purple")} rounded-md cursor-pointer`}><Tooltip label={getColorHex("purple")}><div className="bg-purple-400 w-5 h-5 rounded-sm"></div></Tooltip></button>
//                 </div>
//             </div>

//             <div className="flex flex-col gap-3">
//                 <div>Background</div>
//                 <div className="flex flex-row gap-2">
//                     <button className={`${getBackgroundBorderDisplay("transparent")} rounded-md cursor-pointer`} onClick={() => { setToolConfig({ ...toolConfig, bgColor: "transparent" }) }} ><Tooltip label={getBgColorHex("transparent")}><Image src="/t2.png" alt="transparent" width={1} height={1} className="w-5 h-5 rounded-sm bg-[#2f2f37]" /></Tooltip></button>
//                     <button className={`${getBackgroundBorderDisplay("red")} rounded-md cursor-pointer`} onClick={() => { setToolConfig({ ...toolConfig, bgColor: "red" }) }} ><Tooltip label={getBgColorHex("red")}><div className="bg-red-300 w-5 h-5 rounded-sm"></div></Tooltip></button>
//                     <button className={`${getBackgroundBorderDisplay("yellow")} rounded-md cursor-pointer`} onClick={() => { setToolConfig({ ...toolConfig, bgColor: "yellow" }) }} ><Tooltip label={getBgColorHex("yellow")}><div className="bg-yellow-200 w-5 h-5 rounded-sm"></div></Tooltip></button>
//                     <button className={`${getBackgroundBorderDisplay("green")} rounded-md cursor-pointer`} onClick={() => { setToolConfig({ ...toolConfig, bgColor: "green" }) }} ><Tooltip label={getBgColorHex("green")}><div className="bg-green-200 w-5 h-5 rounded-sm"></div></Tooltip></button>
//                     <button className={`${getBackgroundBorderDisplay("blue")} rounded-md cursor-pointer`} onClick={() => { setToolConfig({ ...toolConfig, bgColor: "blue" }) }} ><Tooltip label={getBgColorHex("blue")}><div className="bg-blue-200 w-5 h-5 rounded-sm"></div></Tooltip></button>
//                     <button className={`${getBackgroundBorderDisplay("purple")} rounded-md cursor-pointer`} onClick={() => { setToolConfig({ ...toolConfig, bgColor: "purple" }) }} ><Tooltip label={getBgColorHex("purple")}><div className="bg-purple-200 w-5 h-5 rounded-sm"></div></Tooltip></button>
//                 </div>
//             </div>

//             <div className="flex flex-col gap-3">
//                 <div>Stroke width</div>
//                 <div className="flex flex-row gap-2">
//                     <button className={`p-1 rounded-lg cursor-pointer ${((getStrokeWidthBorderDisplay(2)) ? "bg-[#51419675]" : "bg-[#2e2d39] hover:bg-[#47425ed2]")}`} onClick={() => { setToolConfig({ ...toolConfig, strokeWidth: 2 }) }}><Tooltip label="Thin-line"><Image src="/line.svg" alt="thin-line" width={23} height={23} /></Tooltip></button>
//                     <button className={`p-1 rounded-lg cursor-pointer ${((getStrokeWidthBorderDisplay(4)) ? "bg-[#51419675]" : "bg-[#2e2d39] hover:bg-[#47425ed2]")}`} onClick={() => { setToolConfig({ ...toolConfig, strokeWidth: 4 }) }}><Tooltip label="Normal-line"><Image src="/line2.svg" alt="normal-line" width={23} height={23} /></Tooltip></button>
//                     <button className={`p-1 rounded-lg cursor-pointer ${((getStrokeWidthBorderDisplay(8)) ? "bg-[#51419675]" : "bg-[#2e2d39] hover:bg-[#47425ed2]")}`} onClick={() => { setToolConfig({ ...toolConfig, strokeWidth: 8 }) }}><Tooltip label="Thick-line"><Image src="/line3.svg" alt="thick-line" width={23} height={23} /></Tooltip></button>
//                 </div>
//             </div>

//             <div className="flex flex-col gap-3">
//                 <div>Stroke style</div>
//                 <div className="flex flex-row gap-2">
//                     <button className={`p-1 rounded-lg cursor-pointer ${((getStrokeStyleBorderDisplay({ x: 1, y: 0 })) ? "bg-[#51419675]" : "bg-[#2e2d39] hover:bg-[#47425ed2]")}`} onClick={() => { setToolConfig({ ...toolConfig, lineDashX: 1, lineDashY: 0 }) }}><Tooltip label="Normal-line"><Image src="/line.svg" alt="straight-line" width={23} height={23} /></Tooltip></button>
//                     <button className={`p-1 rounded-lg cursor-pointer ${((getStrokeStyleBorderDisplay({ x: 16, y: 12 })) ? "bg-[#51419675]" : "bg-[#2e2d39] hover:bg-[#47425ed2]")}`} onClick={() => { setToolConfig({ ...toolConfig, lineDashX: 16, lineDashY: 12 }) }}><Tooltip label="Dashed-line"><Image src="/dashedLine.svg" alt="straight-line" width={23} height={23} /></Tooltip></button>
//                     <button className={`p-1 rounded-lg cursor-pointer ${((getStrokeStyleBorderDisplay({ x: 5, y: 8 })) ? "bg-[#51419675]" : "bg-[#2e2d39] hover:bg-[#47425ed2]")}`} onClick={() => { setToolConfig({ ...toolConfig, lineDashX: 5, lineDashY: 8 }) }}><Tooltip label="Dotted-line"><Image src="/dottedLine.svg" alt="straight-line" width={23} height={23} /></Tooltip></button>
//                 </div>
//             </div>

//             <div className="flex flex-col gap-3">
//                 <div>Font-size</div>
//                 <div className="flex flex-row gap-2">
//                     <button className={`p-1 rounded-lg cursor-pointer ${((getFontSize(20)) ? "bg-[#51419675]" : "bg-[#2e2d39] hover:bg-[#47425ed2]")}`} onClick={() => { setToolConfig({ ...toolConfig, fontSize: 20 }) }}><Tooltip label="Small"><Image src="/small.svg" alt="small-font" width={23} height={23} /></Tooltip></button>
//                     <button className={`p-1 rounded-lg cursor-pointer ${((getFontSize(40)) ? "bg-[#51419675]" : "bg-[#2e2d39] hover:bg-[#47425ed2]")}`} onClick={() => { setToolConfig({ ...toolConfig, fontSize: 40 }) }}><Tooltip label="Medium"><Image src="/medium.svg" alt="medium-font" width={23} height={23} /></Tooltip></button>
//                     <button className={`p-1 rounded-lg cursor-pointer ${((getFontSize(80)) ? "bg-[#51419675]" : "bg-[#2e2d39] hover:bg-[#47425ed2]")}`} onClick={() => { setToolConfig({ ...toolConfig, fontSize: 80 }) }}><Tooltip label="Large"><Image src="/large.svg" alt="large-font" width={23} height={23} /></Tooltip></button>
//                 </div>
//             </div>

//         </div>
//     </div>
// </div>
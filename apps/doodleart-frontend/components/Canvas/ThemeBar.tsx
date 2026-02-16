// import { Shape, textState, themeState, Tool } from "@/services/types";
// import { Ellipsis, Minus } from "lucide-react";

// const closeShapes = (tool: Tool): boolean => {
//   return tool === "elip" || tool === "rect" || tool === "diamond";
// };

// const linearShapes = (tool: Tool): boolean => {
//   return tool === "line" || tool === "pencil";
// };

// const textShape = (tool: Tool): boolean => {
//   return tool === "text";
// };

// const TransparentButton = ({
//   selectedShape,
//   themeConfig,
//   fillStyle,
//   setThemeConfig,
//   updateSelectedShapeTheme,
// }: {
//   selectedShape: Shape | null;
//   themeConfig: themeState;
//   fillStyle: string;
//   setThemeConfig?: (s: themeState) => void;
//   updateSelectedShapeTheme: (updates: {
//     strokeStyle?: string;
//     strokeWidth?: number;
//     strokeType?: string;
//     fillStyle?: string;
//     fontColor?: string;
//     fontSize?: number;
//     fontType?: string;
//   }) => void;
// }) => {
//   return (
//     <button
//       className={`${fillStyle ? "transform hover:scale-110" : ""} ${fillStyle === "transparent" ? "ring-2 ring-sky-400" : ""} w-6 h-6 rounded-md relative cursor-pointer`}
//       onClick={() => {
//         if (!selectedShape) {
//           setThemeConfig?.({ ...themeConfig, fillStyle: "transparent" });
//         } else {
//           updateSelectedShapeTheme({ fillStyle: "transparent" });
//         }
//       }}
//     >
//       {/* checkerboard */}
//       <div
//         className="absolute inset-0 rounded-md"
//         style={{
//           backgroundImage:
//             "linear-gradient(45deg, #ccc 25%, transparent 25%)," +
//             "linear-gradient(-45deg, #ccc 25%, transparent 25%)," +
//             "linear-gradient(45deg, transparent 75%, #ccc 75%)," +
//             "linear-gradient(-45deg, transparent 75%, #ccc 75%)",
//           backgroundSize: "6px 6px",
//           backgroundPosition: "0 0, 0 3px, 3px -3px, -3px 0px",
//         }}
//       />
//     </button>
//   );
// };

// export const ThemeBar = ({
//   selectedShape,
//   selectedTool,
//   openThemeUI,
//   themeConfig,
//   setThemeConfig,
//   textConfig,
//   panningStatus,
//   updateSelectedShapeTheme,
// }: {
//   selectedShape: Shape | null;
//   selectedTool: Tool;
//   openThemeUI: () => boolean;
//   themeConfig: themeState;
//   setThemeConfig: (s: themeState) => void;
//   textConfig: textState;
//   panningStatus: boolean;
//   updateSelectedShapeTheme: (updates: {
//     strokeStyle?: string;
//     strokeWidth?: number;
//     strokeType?: string;
//     fillStyle?: string;
//     fontColor?: string;
//     fontSize?: number;
//     fontType?: string;
//   }) => void;
// }) => {
//   // Predefined color palette
//   const strokeColors = [
//     themeConfig.themeStyle === "b" ? "#ffffff" : "#000000",
//     "#d93b3b",
//     "#2f9e44",
//     "#1971c2",
//     "#f08c00",
//   ];

//   const fillColors = ["#ffc9c9", "#b2f2bb", "#a5d8ff", "#ffec99"];

//   const strokeWidths = [
//     { width: 6, type: "thin" },
//     { width: 10, type: "bold" },
//     { width: 16, type: "extra bold" },
//   ];
//   const strokeTypes = [
//     { type: "solid", comp: <Minus strokeWidth={2} size={20} /> },
//     { type: "dotted", comp: <Ellipsis strokeWidth={2} size={16} /> },
//     { type: "dashed", comp: <div>---</div> },
//   ];

//   let sS = themeConfig.strokeStyle;
//   let sT = themeConfig.strokeType;
//   let sW = themeConfig.strokeWidth;
//   let fS = themeConfig.fillStyle;

//   // add text ones in future

//   if (selectedShape && selectedShape.type !== "text") {
//     if (selectedShape.strokeStyle) sS = selectedShape.strokeStyle;
//     if (selectedShape.strokeType) sT = selectedShape.strokeType;
//     if (selectedShape.strokeWidth) sW = selectedShape.strokeWidth;
//     if (
//       (selectedShape.type === "diamond" ||
//         selectedShape.type === "elip" ||
//         selectedShape.type === "rect") &&
//       selectedShape.fillStyle
//     ) {
//       fS = selectedShape.fillStyle;
//     }
//   }

//   return (
//     <div
//       className={`${openThemeUI() ? "block" : "hidden"} ${themeConfig.themeStyle === "w" ? "bg-[#ffffff] shadow-[0_0_5px_rgba(0,0,0,0.25)] text-[#121212]" : "bg-[#232329] text-white"} absolute z-3 w-53 h-auto rounded-xl left-1/100 top-1/10 ${panningStatus ? "pointer-events-none" : "pointer-events-auto"} select-none cursor-default`}
//     >
//       <div className="flex flex-col h-full p-3 text-xs gap-4">
//         <div className="flex flex-col gap-3">
//           <div>Stroke</div>
//           <div className="flex flex-row items-center gap-1.5">
//             {strokeColors.map((color, idx) => {
//               return (
//                 <button
//                   className={`${color === sS ? "ring-2 ring-sky-400" : ""} w-6 h-6 rounded-md cursor-pointer transform hover:scale-110`}
//                   key={idx}
//                   style={{ backgroundColor: color }}
//                   title={color}
//                   onClick={() => {
//                     if (!selectedShape) {
//                       setThemeConfig({ ...themeConfig, strokeStyle: color });
//                     } else {
//                       updateSelectedShapeTheme({ strokeStyle: color });
//                     }
//                   }}
//                 />
//               );
//             })}

//             <div
//               className={`${themeConfig.themeStyle === "b" ? "text-gray-500" : "text-gray-300"}`}
//             >
//               |
//             </div>
//             <button
//               className={`w-6 h-6 rounded-md`}
//               style={{ backgroundColor: sS }}
//             ></button>
//           </div>
//         </div>

//         <div className={`$flex flex-col gap-3`}>
//           <div>Background</div>
//           <div className="flex flex-row items-center gap-1.5">
//             <TransparentButton
//               selectedShape={selectedShape}
//               fillStyle={fS}
//               themeConfig={themeConfig}
//               setThemeConfig={setThemeConfig}
//               updateSelectedShapeTheme={updateSelectedShapeTheme}
//             />
//             {fillColors.map((color, idx) => {
//               return (
//                 <button
//                   className={`${color === fS ? "ring-2 ring-sky-400" : ""} w-6 h-6 rounded-md cursor-pointer transform hover:scale-110`}
//                   key={idx}
//                   style={{ backgroundColor: color }}
//                   title={color}
//                   onClick={() => {
//                     if (!selectedShape) {
//                       setThemeConfig({ ...themeConfig, fillStyle: color });
//                     } else {
//                       updateSelectedShapeTheme({ fillStyle: color });
//                     }
//                   }}
//                 />
//               );
//             })}

//             <div
//               className={`${themeConfig.themeStyle === "b" ? "text-gray-500" : "text-gray-300"}`}
//             >
//               {" "}
//               |{" "}
//             </div>

//             {fS === "transparent" ? (
//               <TransparentButton
//                 selectedShape={null}
//                 fillStyle=""
//                 themeConfig={themeConfig}
//                 updateSelectedShapeTheme={updateSelectedShapeTheme}
//               />
//             ) : (
//               <button
//                 className={`w-6 h-6 rounded-md`}
//                 style={{ backgroundColor: fS }}
//               ></button>
//             )}
//           </div>
//         </div>

//         <div className="flex flex-col gap-3">
//           <div>Stroke width</div>
//           <div className="flex flex-row items-center gap-2">
//             {strokeWidths.map((value, idx) => {
//               return (
//                 <button
//                   key={idx}
//                   className={`${themeConfig.themeStyle === "b" ? (sW === value.width ? "bg-[#874fff67]" : "bg-[#47425e75]") : sW === value.width ? "bg-[#bc8bff7c]" : "bg-[#b1b1b126]"} w-8 h-8 rounded-md flex items-center justify-center cursor-pointer`}
//                   title={value.type}
//                   onClick={() => {
//                     if (!selectedShape) {
//                       setThemeConfig({
//                         ...themeConfig,
//                         strokeWidth: value.width,
//                       });
//                     } else {
//                       updateSelectedShapeTheme({ strokeWidth: value.width });
//                     }
//                   }}
//                 >
//                   <Minus strokeWidth={idx + 1.5} size={18} />
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         <div className="flex flex-col gap-3">
//           <div>Stroke type</div>
//           <div className="flex flex-row items-center gap-2">
//             {strokeTypes.map((value, idx) => {
//               return (
//                 <button
//                   key={idx}
//                   className={`${themeConfig.themeStyle === "b" ? (sT === value.type ? "bg-[#874fff67]" : "bg-[#47425e75]") : sT === value.type ? "bg-[#bc8bff7c]" : "bg-[#b1b1b126]"} w-8 h-8 rounded-md flex items-center justify-center cursor-pointer`}
//                   title={value.type}
//                   onClick={() => {
//                     if (!selectedShape) {
//                       setThemeConfig({
//                         ...themeConfig,
//                         strokeType: value.type,
//                       });
//                     } else {
//                       updateSelectedShapeTheme({ strokeType: value.type });
//                     }
//                   }}
//                 >
//                   {value.comp}
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// import { Shape, textState, themeState, Tool } from "@/services/types";
// import { Ellipsis, Minus } from "lucide-react";

// const closeShapes = (tool: Tool): boolean => {
//   return tool === "elip" || tool === "rect" || tool === "diamond";
// };

// // const linearShapes = (tool: Tool): boolean => {
// //   return tool === "line" || tool === "pencil";
// // };

// // const textShape = (tool: Tool): boolean => {
// //   return tool === "text";
// // };

// const TransparentButton = ({
//   selectedShape,
//   themeConfig,
//   fillStyle,
//   setThemeConfig,
//   updateSelectedShapeTheme,
// }: {
//   selectedShape: Shape | null;
//   themeConfig: themeState;
//   fillStyle: string;
//   setThemeConfig?: (s: themeState) => void;
//   updateSelectedShapeTheme: (updates: {
//     strokeStyle?: string;
//     strokeWidth?: number;
//     strokeType?: string;
//     fillStyle?: string;
//     fontColor?: string;
//     fontSize?: number;
//     fontType?: string;
//   }) => void;
// }) => {
//   return (
//     <button
//       className={`${fillStyle ? "transform hover:scale-110" : ""} ${fillStyle === "transparent" ? "ring-2 ring-sky-400" : ""} w-6 h-6 rounded-md relative cursor-pointer`}
//       onClick={() => {
//         if (!selectedShape) {
//           setThemeConfig?.({ ...themeConfig, fillStyle: "transparent" });
//         } else {
//           updateSelectedShapeTheme({ fillStyle: "transparent" });
//         }
//       }}
//     >
//       {/* checkerboard */}
//       <div
//         className="absolute inset-0 rounded-md"
//         style={{
//           backgroundImage:
//             "linear-gradient(45deg, #ccc 25%, transparent 25%)," +
//             "linear-gradient(-45deg, #ccc 25%, transparent 25%)," +
//             "linear-gradient(45deg, transparent 75%, #ccc 75%)," +
//             "linear-gradient(-45deg, transparent 75%, #ccc 75%)",
//           backgroundSize: "6px 6px",
//           backgroundPosition: "0 0, 0 3px, 3px -3px, -3px 0px",
//         }}
//       />
//     </button>
//   );
// };

// export const ThemeBar = ({
//   selectedShape,
//   selectedTool,
//   openThemeUI,
//   themeConfig,
//   setThemeConfig,
//   textConfig,
//   panningStatus,
//   updateSelectedShapeTheme,
// }: {
//   selectedShape: Shape | null;
//   selectedTool: Tool;
//   openThemeUI: () => boolean;
//   themeConfig: themeState;
//   setThemeConfig: (s: themeState) => void;
//   textConfig: textState;
//   panningStatus: boolean;
//   updateSelectedShapeTheme: (updates: {
//     strokeStyle?: string;
//     strokeWidth?: number;
//     strokeType?: string;
//     fillStyle?: string;
//     fontColor?: string;
//     fontSize?: number;
//     fontType?: string;
//   }) => void;
// }) => {
//   // Predefined color palette
//   const strokeColors = [
//     themeConfig.themeStyle === "b" ? "#ffffff" : "#000000",
//     "#d93b3b",
//     "#2f9e44",
//     "#1971c2",
//     "#f08c00",
//   ];

//   const fillColors = ["#ffc9c9", "#b2f2bb", "#a5d8ff", "#ffec99"];

//   const strokeWidths = [
//     { width: 6, type: "thin" },
//     { width: 10, type: "bold" },
//     { width: 16, type: "extra bold" },
//   ];
//   const strokeTypes = [
//     { type: "solid", comp: <Minus strokeWidth={2} size={20} /> },
//     { type: "dotted", comp: <Ellipsis strokeWidth={2} size={16} /> },
//     { type: "dashed", comp: <div>---</div> },
//   ];

//   let sS = themeConfig.strokeStyle;
//   let sT = themeConfig.strokeType;
//   let sW = themeConfig.strokeWidth;
//   let fS = themeConfig.fillStyle;

//   let fT = textConfig.fontType;
//   let fC = textConfig.fontColor;
//   let fW = textConfig.fontSize;

//   // add text ones in future

//   if (selectedShape) {
//     if (selectedShape.type !== "text") {
//       if (selectedShape.strokeStyle) sS = selectedShape.strokeStyle;
//       if (selectedShape.strokeType) sT = selectedShape.strokeType;
//       if (selectedShape.strokeWidth) sW = selectedShape.strokeWidth;
//       if (
//         (selectedShape.type === "diamond" ||
//           selectedShape.type === "elip" ||
//           selectedShape.type === "rect") &&
//         selectedShape.fillStyle
//       ) {
//         fS = selectedShape.fillStyle;
//       }
//     } else {

//     }
//   }

//   // Check if fill style should be shown
//   const showFillStyle = selectedShape
//     ? selectedShape.type === "rect" ||
//       selectedShape.type === "diamond" ||
//       selectedShape.type === "elip"
//     : closeShapes(selectedTool);

//   return (
//     <div
//       className={`${openThemeUI() ? "block" : "hidden"} ${themeConfig.themeStyle === "w" ? "bg-[#ffffff] shadow-[0_0_5px_rgba(0,0,0,0.25)] text-[#121212]" : "bg-[#232329] text-white"} absolute z-3 w-53 h-auto py-2 rounded-xl left-1/100 top-1/10 ${panningStatus ? "pointer-events-none" : "pointer-events-auto"} select-none cursor-default`}
//     >
//       <div className="flex flex-col h-full p-3 text-xs gap-4">
//         <div className="flex flex-col gap-3">
//           <div>Stroke</div>
//           <div className="flex flex-row items-center gap-1.5">
//             {strokeColors.map((color, idx) => {
//               return (
//                 <button
//                   className={`${color === sS ? "ring-2 ring-sky-400" : ""} w-6 h-6 rounded-md cursor-pointer transform hover:scale-110`}
//                   key={idx}
//                   style={{ backgroundColor: color }}
//                   title={color}
//                   onClick={() => {
//                     if (!selectedShape) {
//                       setThemeConfig({ ...themeConfig, strokeStyle: color });
//                     } else {
//                       updateSelectedShapeTheme({ strokeStyle: color });
//                     }
//                   }}
//                 />
//               );
//             })}

//             <div
//               className={`${themeConfig.themeStyle === "b" ? "text-gray-500" : "text-gray-300"}`}
//             >
//               |
//             </div>
//             <button
//               className={`w-6 h-6 rounded-md`}
//               style={{ backgroundColor: sS }}
//             ></button>
//           </div>
//         </div>

//         {showFillStyle && (
//           <div className="flex flex-col gap-3">
//             <div>Background</div>
//             <div className="flex flex-row items-center gap-1.5">
//               <TransparentButton
//                 selectedShape={selectedShape}
//                 fillStyle={fS}
//                 themeConfig={themeConfig}
//                 setThemeConfig={setThemeConfig}
//                 updateSelectedShapeTheme={updateSelectedShapeTheme}
//               />
//               {fillColors.map((color, idx) => {
//                 return (
//                   <button
//                     className={`${color === fS ? "ring-2 ring-sky-400" : ""} w-6 h-6 rounded-md cursor-pointer transform hover:scale-110`}
//                     key={idx}
//                     style={{ backgroundColor: color }}
//                     title={color}
//                     onClick={() => {
//                       if (!selectedShape) {
//                         setThemeConfig({ ...themeConfig, fillStyle: color });
//                       } else {
//                         updateSelectedShapeTheme({ fillStyle: color });
//                       }
//                     }}
//                   />
//                 );
//               })}

//               <div
//                 className={`${themeConfig.themeStyle === "b" ? "text-gray-500" : "text-gray-300"}`}
//               >
//                 {" "}
//                 |{" "}
//               </div>

//               {fS === "transparent" ? (
//                 <TransparentButton
//                   selectedShape={null}
//                   fillStyle=""
//                   themeConfig={themeConfig}
//                   updateSelectedShapeTheme={updateSelectedShapeTheme}
//                 />
//               ) : (
//                 <button
//                   className={`w-6 h-6 rounded-md`}
//                   style={{ backgroundColor: fS }}
//                 ></button>
//               )}
//             </div>
//           </div>
//         )}

//         <div className="flex flex-col gap-3">
//           <div>Stroke width</div>
//           <div className="flex flex-row items-center gap-2">
//             {strokeWidths.map((value, idx) => {
//               return (
//                 <button
//                   key={idx}
//                   className={`${themeConfig.themeStyle === "b" ? (sW === value.width ? "bg-[#874fff67]" : "bg-[#47425e75]") : sW === value.width ? "bg-[#bc8bff7c]" : "bg-[#b1b1b126]"} w-8 h-8 rounded-md flex items-center justify-center cursor-pointer`}
//                   title={value.type}
//                   onClick={() => {
//                     if (!selectedShape) {
//                       setThemeConfig({
//                         ...themeConfig,
//                         strokeWidth: value.width,
//                       });
//                     } else {
//                       updateSelectedShapeTheme({ strokeWidth: value.width });
//                     }
//                   }}
//                 >
//                   <Minus strokeWidth={idx + 1.5} size={18} />
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         <div className="flex flex-col gap-3">
//           <div>Stroke type</div>
//           <div className="flex flex-row items-center gap-2">
//             {strokeTypes.map((value, idx) => {
//               return (
//                 <button
//                   key={idx}
//                   className={`${themeConfig.themeStyle === "b" ? (sT === value.type ? "bg-[#874fff67]" : "bg-[#47425e75]") : sT === value.type ? "bg-[#bc8bff7c]" : "bg-[#b1b1b126]"} w-8 h-8 rounded-md flex items-center justify-center cursor-pointer`}
//                   title={value.type}
//                   onClick={() => {
//                     if (!selectedShape) {
//                       setThemeConfig({
//                         ...themeConfig,
//                         strokeType: value.type,
//                       });
//                     } else {
//                       updateSelectedShapeTheme({ strokeType: value.type });
//                     }
//                   }}
//                 >
//                   {value.comp}
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

import { Shape, textState, themeState, Tool } from "@/services/types";
import { Ellipsis, Minus } from "lucide-react";

const closeShapes = (tool: Tool): boolean => {
  return tool === "elip" || tool === "rect" || tool === "diamond";
};

const TransparentButton = ({
  selectedShape,
  themeConfig,
  fillStyle,
  setThemeConfig,
  updateSelectedShapeTheme,
}: {
  selectedShape: Shape | null;
  themeConfig: themeState;
  fillStyle: string;
  setThemeConfig?: (s: themeState) => void;
  updateSelectedShapeTheme: (updates: {
    strokeStyle?: string;
    strokeWidth?: number;
    strokeType?: string;
    fillStyle?: string;
    fontColor?: string;
    fontSize?: number;
    fontType?: string;
  }) => void;
}) => {
  return (
    <button
      className={`${fillStyle ? "transform hover:scale-110" : ""} ${fillStyle === "transparent" ? "ring-2 ring-sky-400" : ""} w-6 h-6 rounded-md relative cursor-pointer`}
      onClick={() => {
        if (!selectedShape) {
          setThemeConfig?.({ ...themeConfig, fillStyle: "transparent" });
        } else {
          updateSelectedShapeTheme({ fillStyle: "transparent" });
        }
      }}
    >
      {/* checkerboard */}
      <div
        className="absolute inset-0 rounded-md"
        style={{
          backgroundImage:
            "linear-gradient(45deg, #ccc 25%, transparent 25%)," +
            "linear-gradient(-45deg, #ccc 25%, transparent 25%)," +
            "linear-gradient(45deg, transparent 75%, #ccc 75%)," +
            "linear-gradient(-45deg, transparent 75%, #ccc 75%)",
          backgroundSize: "6px 6px",
          backgroundPosition: "0 0, 0 3px, 3px -3px, -3px 0px",
        }}
      />
    </button>
  );
};

export const ThemeBar = ({
  selectedShape,
  selectedTool,
  openThemeUI,
  themeConfig,
  setThemeConfig,
  textConfig,
  setTextConfig,
  panningStatus,
  updateSelectedShapeTheme,
}: {
  selectedShape: Shape | null;
  selectedTool: Tool;
  openThemeUI: () => boolean;
  themeConfig: themeState;
  setThemeConfig: (s: themeState) => void;
  textConfig: textState;
  setTextConfig: (s: textState) => void;
  panningStatus: boolean;
  updateSelectedShapeTheme: (updates: {
    strokeStyle?: string;
    strokeWidth?: number;
    strokeType?: string;
    fillStyle?: string;
    fontColor?: string;
    fontSize?: number;
    fontType?: string;
  }) => void;
}) => {
  // Predefined color palette
  const strokeColors = [
    themeConfig.themeStyle === "b" ? "#ffffff" : "#000000", // Default: white for dark, black for light
    "#d93b3b",
    "#2f9e44",
    "#1971c2",
    "#f08c00",
  ];

  const fillColors = ["#ffc9c9", "#b2f2bb", "#a5d8ff", "#ffec99"];

  const strokeWidths = [
    { width: 6, type: "thin" },
    { width: 10, type: "bold" },
    { width: 16, type: "extra bold" },
  ];

  const strokeTypes = [
    { type: "solid", comp: <Minus strokeWidth={2} size={20} /> },
    { type: "dotted", comp: <Ellipsis strokeWidth={2} size={16} /> },
    { type: "dashed", comp: <div>---</div> },
  ];

  // Font options for text
  const fontTypes = [
    { type: "Finger Paint", label: "Finger" },
    { type: "sans-serif", label: "Sans" },
    { type: "serif", label: "Serif" },
    { type: "monospace", label: "Mono" },
  ];

  const fontSizes = [
    { size: 16, label: "S" },
    { size: 20, label: "M" },
    { size: 28, label: "L" },
    { size: 36, label: "XL" },
  ];

  let sS = themeConfig.strokeStyle;
  let sT = themeConfig.strokeType;
  let sW = themeConfig.strokeWidth;
  let fS = themeConfig.fillStyle;

  let fT = textConfig.fontType;
  let fC = textConfig.fontColor;
  let fW = textConfig.fontSize;

  if (selectedShape) {
    if (selectedShape.type !== "text") {
      if (selectedShape.strokeStyle) sS = selectedShape.strokeStyle;
      if (selectedShape.strokeType) sT = selectedShape.strokeType;
      if (selectedShape.strokeWidth) sW = selectedShape.strokeWidth;
      if (
        (selectedShape.type === "diamond" ||
          selectedShape.type === "elip" ||
          selectedShape.type === "rect") &&
        selectedShape.fillStyle
      ) {
        fS = selectedShape.fillStyle;
      }
    } else {
      // Text shape - use text-specific properties
      if (selectedShape.fontType) fT = selectedShape.fontType;
      if (selectedShape.fontColor) fC = selectedShape.fontColor;
      if (selectedShape.fontSize) fW = selectedShape.fontSize;
    }
  }

  // Check if fill style should be shown (only for closed shapes)
  const showFillStyle = selectedShape
    ? selectedShape.type === "rect" ||
      selectedShape.type === "diamond" ||
      selectedShape.type === "elip"
    : closeShapes(selectedTool);

  // Check if text styling should be shown
  const showTextStyle = selectedShape
    ? selectedShape.type === "text"
    : selectedTool === "text";

  // Check if stroke styling should be shown (not for text)
  const showStrokeStyle = !showTextStyle;

  return (
    <div
      className={`${openThemeUI() ? "block" : "hidden"} ${themeConfig.themeStyle === "w" ? "bg-[#ffffff] shadow-[0_0_5px_rgba(0,0,0,0.25)] text-[#121212]" : "bg-[#232329] text-white"} absolute z-3 w-auto h-auto py-2 rounded-xl left-1/100 top-1/10 ${panningStatus ? "pointer-events-none" : "pointer-events-auto"} select-none cursor-default`}
    >
      <div className="flex flex-col h-full p-3 text-xs gap-4">
        {/* Stroke Section - for non-text shapes */}
        {showStrokeStyle && (
          <>
            <div className="flex flex-col gap-3">
              <div>Stroke</div>
              <div className="flex flex-row items-center gap-1.5">
                {strokeColors.map((color, idx) => {
                  return (
                    <button
                      className={`${color === sS ? "ring-2 ring-sky-400" : ""} w-6 h-6 rounded-md cursor-pointer transform hover:scale-110`}
                      key={idx}
                      style={{ backgroundColor: color }}
                      title={color}
                      onClick={() => {
                        if (!selectedShape) {
                          setThemeConfig({
                            ...themeConfig,
                            strokeStyle: color,
                          });
                        } else {
                          updateSelectedShapeTheme({ strokeStyle: color });
                        }
                      }}
                    />
                  );
                })}

                <div
                  className={`${themeConfig.themeStyle === "b" ? "text-gray-500" : "text-gray-300"}`}
                >
                  |
                </div>
                <button
                  className={`w-6 h-6 rounded-md`}
                  style={{ backgroundColor: sS }}
                ></button>
              </div>
            </div>

            {/* Background Section - only for closed shapes */}
            {showFillStyle && (
              <div className="flex flex-col gap-3">
                <div>Background</div>
                <div className="flex flex-row items-center gap-1.5">
                  <TransparentButton
                    selectedShape={selectedShape}
                    fillStyle={fS}
                    themeConfig={themeConfig}
                    setThemeConfig={setThemeConfig}
                    updateSelectedShapeTheme={updateSelectedShapeTheme}
                  />
                  {fillColors.map((color, idx) => {
                    return (
                      <button
                        className={`${color === fS ? "ring-2 ring-sky-400" : ""} w-6 h-6 rounded-md cursor-pointer transform hover:scale-110`}
                        key={idx}
                        style={{ backgroundColor: color }}
                        title={color}
                        onClick={() => {
                          if (!selectedShape) {
                            setThemeConfig({
                              ...themeConfig,
                              fillStyle: color,
                            });
                          } else {
                            updateSelectedShapeTheme({ fillStyle: color });
                          }
                        }}
                      />
                    );
                  })}

                  <div
                    className={`${themeConfig.themeStyle === "b" ? "text-gray-500" : "text-gray-300"}`}
                  >
                    {" "}
                    |{" "}
                  </div>

                  {fS === "transparent" ? (
                    <TransparentButton
                      selectedShape={null}
                      fillStyle=""
                      themeConfig={themeConfig}
                      updateSelectedShapeTheme={updateSelectedShapeTheme}
                    />
                  ) : (
                    <button
                      className={`w-6 h-6 rounded-md`}
                      style={{ backgroundColor: fS }}
                    ></button>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <div>Stroke width</div>
              <div className="flex flex-row items-center gap-2">
                {strokeWidths.map((value, idx) => {
                  return (
                    <button
                      key={idx}
                      className={`${themeConfig.themeStyle === "b" ? (sW === value.width ? "bg-[#874fff67]" : "bg-[#47425e75]") : sW === value.width ? "bg-[#bc8bff7c]" : "bg-[#b1b1b126]"} w-8 h-8 rounded-md flex items-center justify-center cursor-pointer`}
                      title={value.type}
                      onClick={() => {
                        if (!selectedShape) {
                          setThemeConfig({
                            ...themeConfig,
                            strokeWidth: value.width,
                          });
                        } else {
                          updateSelectedShapeTheme({
                            strokeWidth: value.width,
                          });
                        }
                      }}
                    >
                      <Minus strokeWidth={idx + 1.5} size={18} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div>Stroke type</div>
              <div className="flex flex-row items-center gap-2">
                {strokeTypes.map((value, idx) => {
                  return (
                    <button
                      key={idx}
                      className={`${themeConfig.themeStyle === "b" ? (sT === value.type ? "bg-[#874fff67]" : "bg-[#47425e75]") : sT === value.type ? "bg-[#bc8bff7c]" : "bg-[#b1b1b126]"} w-8 h-8 rounded-md flex items-center justify-center cursor-pointer`}
                      title={value.type}
                      onClick={() => {
                        if (!selectedShape) {
                          setThemeConfig({
                            ...themeConfig,
                            strokeType: value.type,
                          });
                        } else {
                          updateSelectedShapeTheme({ strokeType: value.type });
                        }
                      }}
                    >
                      {value.comp}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {showTextStyle && (
          <>
            <div className="flex flex-col gap-3">
              <div>Text Color</div>
              <div className="flex flex-row items-center gap-2">
                {strokeColors.map((color, idx) => {
                  return (
                    <button
                      className={`${color === fC ? "ring-2 ring-sky-400" : ""} w-6 h-6 rounded-md cursor-pointer transform hover:scale-110`}
                      key={idx}
                      style={{ backgroundColor: color }}
                      title={color}
                      onClick={() => {
                        if (!selectedShape) {
                          setTextConfig({ ...textConfig, fontColor: color });
                        } else {
                          updateSelectedShapeTheme({ fontColor: color });
                        }
                      }}
                    />
                  );
                })}

                <div
                  className={`${themeConfig.themeStyle === "b" ? "text-gray-500" : "text-gray-300"}`}
                >
                  |
                </div>
                <button
                  className={`w-6 h-6 rounded-md`}
                  style={{ backgroundColor: fC }}
                ></button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div>Font Family</div>
              <div className="flex flex-row items-center gap-2">
                {fontTypes.map((value, idx) => {
                  return (
                    <button
                      key={idx}
                      className={`${themeConfig.themeStyle === "b" ? (fT === value.type ? "bg-[#874fff67]" : "bg-[#47425e75]") : fT === value.type ? "bg-[#bc8bff7c]" : "bg-[#b1b1b126]"} px-2 h-8 rounded-md flex items-center justify-center cursor-pointer text-xs`}
                      title={value.type}
                      style={{ fontFamily: value.type }}
                      onClick={() => {
                        if (!selectedShape) {
                          setTextConfig({
                            ...textConfig,
                            fontType: value.type,
                          });
                        } else {
                          updateSelectedShapeTheme({ fontType: value.type });
                        }
                      }}
                    >
                      {value.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div>Font Size</div>
              <div className="flex flex-row items-center gap-2">
                {fontSizes.map((value, idx) => {
                  return (
                    <button
                      key={idx}
                      className={`${themeConfig.themeStyle === "b" ? (fW === value.size ? "bg-[#874fff67]" : "bg-[#47425e75]") : fW === value.size ? "bg-[#bc8bff7c]" : "bg-[#b1b1b126]"} w-11 h-8 rounded-md flex items-center justify-center cursor-pointer text-xs`}
                      title={`${value.size}px`}
                      onClick={() => {
                        if (!selectedShape) {
                          setTextConfig({
                            ...textConfig,
                            fontSize: value.size,
                          });
                        } else {
                          updateSelectedShapeTheme({ fontSize: value.size });
                        }
                      }}
                    >
                      {value.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

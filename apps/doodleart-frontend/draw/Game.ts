// My own version 🥹🥹
// ===================================================================
// Game.ts
// import { Tool } from "@/components/Canvas/Canvas";
// import { getExistingShapes } from "./Http";
// import { TextBox } from "./TextBox";

// type Shape = {
//     type: "rect";
//     x: number;
//     y: number;
//     width: number;
//     height: number;
// } | {
//     type: "elip";
//     centerX: number;
//     centerY: number;
//     radiusX: number;
//     radiusY: number;
// } | {
//     type: "line";
//     startX: number;
//     startY: number;
//     endX: number;
//     endY: number;
// } | {
//     type: "pencil";
//     pencilCoords: Array<{ x: number, y: number }>;
// } | {
//     type: "text";
//     x: number;
//     y: number;
//     content: string;
// } | {
//     type: "cursor";
// } | {
//     type: "grab";
// };

// export class Game {
//     private scale: number;
//     private activeTextBox: TextBox | undefined;
//     private canvas: HTMLCanvasElement;
//     private context: CanvasRenderingContext2D;
//     private existingShapes: Shape[];
//     private roomId: string;
//     private clicked: boolean;
//     private startX = 0;
//     private startY = 0;
//     private panX: number;
//     private panY: number;
//     private lastMouseX = 0;
//     private lastMouseY = 0;
//     private selectedTool = "cursor";
//     private pencilCoords: Array<{ x: number, y: number }> = [];
//     private isDrawing = false;
//     private lastSavedPan: { x: number, y: number } = { x: 0, y: 0 };
//     private saveTimeout: number | undefined;
//     socket: WebSocket;
//     private onToolChange: ((tool: Tool) => void) | null = null;

//     constructor(
//         canvas: HTMLCanvasElement,
//         roomId: string,
//         socket: WebSocket,
//         onToolChange?: (tool: Tool) => void
//     ) {
//         console.log("constructor called!");
//         this.canvas = canvas;
//         this.context = canvas.getContext('2d')!;
//         this.context.lineWidth = 3;
//         this.existingShapes = [];
//         this.roomId = roomId;
//         this.socket = socket;
//         this.clicked = false;
//         this.scale = 1;
//         this.panX = Number(localStorage.getItem("px")) || 0;
//         this.panY = Number(localStorage.getItem("py")) || 0;
//         this.onToolChange = onToolChange || null;

//         this.init();

//         this.initHandlers();

//         this.initMouseHandlers();
//         console.log("constructor init!");
//     }

//     setTool(tool: Tool) {
//         console.log("setTool called with:", tool);

//         // Store current pan values to prevent them from being reset
//         const currentPanX = this.panX;
//         const currentPanY = this.panY;

//         this.selectedTool = tool;

//         // Restore pan values immediately after setting tool
//         this.panX = currentPanX;
//         this.panY = currentPanY;

//         // Only clear canvas if we're not in the middle of other operations
//         if (!this.isDrawing && !this.clicked) {
//             this.clearCanvas();
//         }

//         this.isDrawing = false;
//         this.clicked = false;
//         this.pencilCoords = [];

//         console.log("setTool completed, panX:", this.panX, "panY:", this.panY);
//     }

//     async init() {
//         console.log("init called");
//         try {
//             this.existingShapes = await getExistingShapes(this.roomId);
//         } catch (error) {
//             console.error("Failed to load existing shapes:", error);
//             this.existingShapes = [];
//         }
//         this.clearCanvas();
//     }

//     initHandlers() {
//         console.log("initHandlers called!");

//         let redrawTimeout: NodeJS.Timeout | null = null;

//         this.socket.onmessage = (event) => {
//             const message = JSON.parse(event.data);

//             if (message.type === "chat") {
//                 const parsedShape = JSON.parse(message.message);
//                 this.panX = Number((localStorage.getItem("px")));
//                 this.panY = Number((localStorage.getItem("py")));
//                 console.log("🔵 BEFORE push/clearCanvas → panX:", this.panX, "panY:", this.panY);
//                 this.existingShapes.push(parsedShape);
//                 console.log("🟡 AFTER push → panX:", this.panX, "panY:", this.panY);
//                 if (redrawTimeout) clearTimeout(redrawTimeout);
//                 redrawTimeout = setTimeout(() => {
//                     this.clearCanvas();
//                 }, 10);
//                 console.log("🔴 AFTER clearCanvas → panX:", this.panX, "panY:", this.panY);
//             }
//         };

//     }

//     getCanvasCoordinates(clientX: number, clientY: number) {
//         return {
//             x: clientX - this.canvas.getBoundingClientRect().left,
//             y: clientY - this.canvas.getBoundingClientRect().top
//         };
//     }

//     initMouseHandlers() {
//         console.log("initMouseHandlers called");
//         this.canvas.addEventListener('mousedown', this.mouseDownHandler);
//         this.canvas.addEventListener('mouseup', this.mouseUpHandler);
//         this.canvas.addEventListener('mousemove', this.mouseMoveHandler);
//     }

//     destroyMouseHandlers() {
//         // console.log("destroyMouseHandlers Called!");
//         this.canvas.removeEventListener('mousedown', this.mouseDownHandler);
//         this.canvas.removeEventListener('mouseup', this.mouseUpHandler);
//         this.canvas.removeEventListener('mousemove', this.mouseMoveHandler);
//     }

//     registerToolChangeCallback(callback: (tool: Tool) => void) {
//         // console.log("registerToolChangeCallback called!");
//         this.onToolChange = callback;
//     }

//     clearCanvas() {
//         // console.trace("clearCanvas got called!");
//         // console.log(`panx : ${this.panX} | pany : ${this.panY}`);
//         // this.context.setTransform(this.scale, 0, 0, this.scale, this.panX, this.panY);
//         // this.context.clearRect(-this.panX / this.scale, -this.panY / this.scale, this.canvas.width/this.scale, this.canvas.height/this.scale);
//         // this.context.fillStyle = "rgba(10, 10, 25)";
//         // this.context.fillRect(-this.panX / this.scale, -this.panY / this.scale, this.canvas.width/this.scale, this.canvas.height/this.scale);
//         this.context.save();
//         this.context.setTransform(1, 0, 0, 1, 0, 0);
//         this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
//         this.context.fillStyle = "rgba(10, 10, 25)";
//         this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
//         this.context.restore();

//         this.context.save();
//         this.context.setTransform(this.scale, 0, 0, this.scale, this.panX, this.panY);

//         this.existingShapes.map((shape) => {
//             if (shape.type === "rect") {
//                 // If the shape is a rectangle, draw its border
//                 this.context.strokeStyle = "rgba(255,255,255)"  // white color for border
//                 this.context.strokeRect(shape.x, shape.y, shape.width, shape.height);

//             } else if (shape.type === "elip") {
//                 this.context.beginPath();
//                 this.context.ellipse(shape.centerX, shape.centerY, Math.abs(shape.radiusX), Math.abs(shape.radiusY), 0, 0, 2 * Math.PI);
//                 this.context.stroke();
//                 this.context.closePath();
//             } else if (shape.type === "line") {
//                 this.context.beginPath();
//                 this.context.moveTo(shape.startX, shape.startY);
//                 this.context.lineTo(shape.endX, shape.endY);
//                 this.context.stroke();
//                 this.context.closePath();
//             } else if (shape.type === "pencil") {
//                 if (shape.pencilCoords.length > 0) {
//                     this.context.beginPath();
//                     this.context.lineCap = "round";
//                     this.context.lineJoin = "round";

//                     // Move to the first point
//                     this.context.moveTo(shape.pencilCoords[0].x, shape.pencilCoords[0].y);

//                     // Draw lines to all subsequent points
//                     for (let i = 1; i < shape.pencilCoords.length; i++) {
//                         this.context.lineTo(shape.pencilCoords[i].x, shape.pencilCoords[i].y);
//                     }
//                     this.context.stroke();
//                     this.context.closePath();
//                 }
//             } else if (shape.type === "text") {
//                 this.context.save();
//                 this.context.font = '20px sans-serif';
//                 this.context.fillStyle = 'white';
//                 this.context.fillText(shape.content, shape.x, shape.y + 20); // Add offset for baseline
//                 this.context.restore();
//             }
//         })
//     }

//     mouseDownHandler = (e: MouseEvent) => {
//         //console.log("mousedown called");
//         this.clicked = true;
//         const canvasCoords = this.getCanvasCoordinates(e.clientX, e.clientY);
//         this.startX = canvasCoords.x;
//         this.startY = canvasCoords.y;

//         if (this.selectedTool === "pencil") {
//             //console.log("mousedown if->pencil called")

//             this.isDrawing = true;
//             this.pencilCoords = [];
//             this.pencilCoords.push({ x: canvasCoords.x, y: canvasCoords.y });
//             this.context.beginPath();
//             this.context.lineCap = "round";
//             this.context.lineJoin = "round";
//             this.context.moveTo(canvasCoords.x - this.panX, canvasCoords.y - this.panY);
//             return;
//         }

//         if (this.selectedTool === "grab") {
//             //console.log("mousedown if->grab called");
//             this.lastMouseX = canvasCoords.x;
//             this.lastMouseY = canvasCoords.y;
//             return;
//         }
//     }

//     mouseMoveHandler = (e: MouseEvent) => {
//         // console.log("mousemove called");
//         const canvasCoords = this.getCanvasCoordinates(e.clientX, e.clientY);

//         if (this.clicked) {
//             // console.log("mousemove clicked called");
//             // Convert client coordinates to canvas coordinates
//             const width = canvasCoords.x - this.startX;
//             const height = canvasCoords.y - this.startY;
//             const selectedTool = this.selectedTool;

//             if (selectedTool === "grab") {
//                 //console.log("mousemove clicked if->grab called");
//                 const deltaX = canvasCoords.x - this.lastMouseX;
//                 const deltaY = canvasCoords.y - this.lastMouseY;

//                 this.panX += deltaX;
//                 this.panY += deltaY;

//                 this.lastMouseX = canvasCoords.x;
//                 this.lastMouseY = canvasCoords.y;
//             }

//             if (selectedTool !== "pencil") {
//                 //console.log(`mousemove clicked ${selectedTool} called`);
//                 this.clearCanvas();
//             }

//             this.context.strokeStyle = "rgba(255, 255, 255)";

//             if (selectedTool === "rect") {
//                 this.context.strokeRect(this.startX - this.panX, this.startY - this.panY, width, height);

//             } else if (selectedTool === "elip") {

//                 const centerX = (((this.startX + canvasCoords.x) / 2));
//                 const centerY = (((this.startY + canvasCoords.y) / 2));
//                 const radiusX = Math.abs(width / 2);
//                 const radiusY = Math.abs(height / 2);
//                 this.context.beginPath();
//                 this.context.ellipse(centerX - this.panX, centerY - this.panY, Math.abs(radiusX), Math.abs(radiusY), 0, 0, 2 * Math.PI);
//                 this.context.stroke();
//                 this.context.closePath();
//             } else if (selectedTool === "line") {
//                 this.context.beginPath();
//                 this.context.moveTo(this.startX - this.panX, this.startY - this.panY);
//                 this.context.lineTo(canvasCoords.x - this.panX, canvasCoords.y - this.panY);
//                 this.context.stroke();
//                 this.context.closePath();
//             } else if (selectedTool === "pencil") {
//                 if (this.isDrawing) {
//                     // Special handling for freehand drawing
//                     this.pencilCoords.push({ x: canvasCoords.x, y: canvasCoords.y });

//                     // Draw the line segment directly without clearing canvas
//                     this.context.lineTo(canvasCoords.x - this.panX, canvasCoords.y - this.panY);
//                     this.context.stroke();
//                 }
//             }
//         }
//     }

//     mouseUpHandler = (e: MouseEvent) => {
//         //console.log("mouseup called");
//         if (!this.clicked) return;
//         this.clicked = false;

//         const canvasCoords = this.getCanvasCoordinates(e.clientX, e.clientY);
//         const width = canvasCoords.x - this.startX;
//         const height = canvasCoords.y - this.startY;

//         const selectedTool = this.selectedTool;
//         let shape: Shape | null = null;

//         if (selectedTool === "rect") {
//             shape = {
//                 type: "rect",
//                 x: this.startX - this.panX,
//                 y: this.startY - this.panY,
//                 height,
//                 width
//             };
//         } else if (selectedTool === "elip") {
//             shape = {
//                 type: "elip",
//                 radiusX: Math.abs(width / 2),
//                 radiusY: Math.abs(height / 2),
//                 centerX: ((this.startX + canvasCoords.x) / 2) - this.panX,
//                 centerY: ((this.startY + canvasCoords.y) / 2) - this.panY
//             }
//         } else if (selectedTool === "line") {
//             shape = {
//                 type: "line",
//                 startX: this.startX - this.panX,
//                 startY: this.startY - this.panY,
//                 endX: canvasCoords.x - this.panX,
//                 endY: canvasCoords.y - this.panY
//             }
//         } else if (selectedTool === "pencil") {
//             if (this.isDrawing) {
//                 this.isDrawing = false;
//                 if (this.pencilCoords.length === 1) {
//                     this.pencilCoords.push({
//                         x: this.pencilCoords[0].x + 1 - this.panX,
//                         y: this.pencilCoords[0].y + 1 - this.panY
//                     });
//                 } else {
//                     for (let i = 0; i < this.pencilCoords.length; i++) {
//                         this.pencilCoords[i].x -= this.panX;
//                         this.pencilCoords[i].y -= this.panY;
//                     }
//                 }

//                 shape = {
//                     type: "pencil",
//                     pencilCoords: [...this.pencilCoords], // Clone the array
//                 };

//                 this.context.closePath();
//             }
//         } else if (selectedTool === "text") {
//             this.activeTextBox = new TextBox(e.clientX, e.clientY, canvasCoords.x - this.panX, canvasCoords.y - this.panY, "", this.context, this.scale, this);
//             return;
//         } else if (selectedTool === "grab") {
//             if (this.panX !== this.lastSavedPan.x || this.panY !== this.lastSavedPan.y) {
//                 clearTimeout(this.saveTimeout);
//                 this.saveTimeout = window.setTimeout(() => {
//                     localStorage.setItem("px", String(this.panX));
//                     localStorage.setItem("py", String(this.panY));
//                 }, 100);
//                 this.lastSavedPan = { x: this.panX, y: this.panY };
//             }
//         }

//         // this.clearCanvas();
//         if (!shape) {
//             return; // If somehow no shape was created, stop
//         }

//         this.existingShapes.push(shape);
//         this.context.save();
//         this.socket.send(JSON.stringify({
//             type: "chat", // (Maybe 'chat' type used for all messages)
//             message: JSON.stringify(shape),
//             roomId: this.roomId
//         }));

//         this.setTool("cursor");

//         if (this.onToolChange) {
//             this.onToolChange("cursor");
//         }
//     }
// }







//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Our Code
// Polished version
// import { Tool, ToolConfig } from "@/components/Canvas/Canvas";
// import { getExistingShapes } from "./Http";
// import { TextBox } from "./TextBox";

// export type Shape = {
//     type: "rect";
//     x: number;
//     y: number;
//     width: number;
//     height: number;
//     color: string;
//     strokeWidth: number;
//     bgColor: string;
//     lineDashX: number;
//     lineDashY: number;
// } | {
//     type: "elip";
//     centerX: number;
//     centerY: number;
//     radiusX: number;
//     radiusY: number;
//     color: string;
//     strokeWidth: number;
//     bgColor: string;
//     lineDashX: number;
//     lineDashY: number;
// } | {
//     type: "line";
//     startX: number;
//     startY: number;
//     endX: number;
//     endY: number;
//     color: string;
//     strokeWidth: number;
//     lineDashX: number;
//     lineDashY: number;
// } | {
//     type: "pencil";
//     pencilCoords: Array<{ x: number, y: number }>;
//     color: string;
//     strokeWidth: number;
//     lineDashX: number;
//     lineDashY: number;
// } | {
//     type: "text";
//     x: number;
//     y: number;
//     content: string;
//     color: string;
//     strokeWidth: number;
//     fontSize: number;
// } | {
//     type: "cursor";
// } | {
//     type: "grab";
// };

// export class Game {
//     private scale: number;
//     private minScale: number = 0.2;
//     private maxScale: number = 15;
//     public activeTextBox: TextBox | undefined;
//     private canvas: HTMLCanvasElement;
//     private context: CanvasRenderingContext2D;
//     public existingShapes: Shape[];
//     public roomId: string;
//     private clicked: boolean;
//     private startX = 0;
//     private startY = 0;
//     private panX: number;
//     private panY: number;
//     private lastMouseX = 0;
//     private lastMouseY = 0;
//     private selectedTool = "cursor";
//     private pencilCoords: Array<{ x: number, y: number }> = [];
//     private isDrawing = false;
//     socket: WebSocket;
//     private canvasRect: DOMRect;
//     public onToolChange: ((tool: Tool) => void) | null = null;
//     private lastScale: number;
//     private lastSavedPan: { x: number, y: number } = { x: 0, y: 0 };
//     private savePanTimeout: number | undefined;
//     private saveScaleTimeout: number | undefined;
//     private strokeWidth: number = 4;
//     private color: string = "#ffffff";
//     private bgColor: string = "transparent";
//     private lineDashX: number = 1;
//     private lineDashY: number = 0;
//     private fontSize: number = 20;

//     constructor(
//         canvas: HTMLCanvasElement,
//         roomId: string,
//         socket: WebSocket,
//         onToolChange?: (tool: Tool) => void
//     ) {
//         this.canvas = canvas;
//         this.context = canvas.getContext('2d')!;
//         this.context.lineWidth = 2;
//         this.existingShapes = [];
//         this.roomId = roomId;
//         this.socket = socket;
//         this.clicked = false;
//         this.lastScale = this.scale = Number(localStorage.getItem("scale")) || 1;
//         this.lastSavedPan.x = this.panX = Number(localStorage.getItem("px")) || 0;
//         this.lastSavedPan.y = this.panY = Number(localStorage.getItem("py")) || 0;

//         this.canvasRect = canvas.getBoundingClientRect();
//         this.onToolChange = onToolChange || null;

//         this.init();
//         this.initHandlers();
//         this.initMouseHandlers();
//         this.initZoomHandlers();
//     }

//     setToolConfigs(toolConfig: ToolConfig) {
//         this.strokeWidth = toolConfig.strokeWidth;
//         this.color = toolConfig.color;
//         this.bgColor = toolConfig.bgColor;
//         this.lineDashX = toolConfig.lineDashX;
//         this.lineDashY = toolConfig.lineDashY;
//         this.fontSize = toolConfig.fontSize;
//     }


//     updateCanvasRect = () => {
//         const newRect = this.canvas.getBoundingClientRect();

//         // Only update if there's a significant change to prevent unnecessary updates
//         if (!this.canvasRect ||
//             Math.abs(newRect.left - this.canvasRect.left) > 1 ||
//             Math.abs(newRect.top - this.canvasRect.top) > 1 ||
//             Math.abs(newRect.width - this.canvasRect.width) > 1 ||
//             Math.abs(newRect.height - this.canvasRect.height) > 1) {
//             this.canvasRect = newRect;
//         }
//     }

//     savePanPostions = () => {
//         if (this.panX !== this.lastSavedPan.x || this.panY !== this.lastSavedPan.y) {
//             clearTimeout(this.savePanTimeout);
//             this.savePanTimeout = window.setTimeout(() => {
//                 localStorage.setItem("px", String(this.panX));
//                 localStorage.setItem("py", String(this.panY));
//             }, 300);
//             this.lastSavedPan = { x: this.panX, y: this.panY };
//         }
//     }

//     saveScale = () => {
//         if (this.scale !== this.lastScale) {
//             clearTimeout(this.saveScaleTimeout);
//             this.saveScaleTimeout = window.setTimeout(() => {
//                 localStorage.setItem("scale", String(this.scale));
//             }, 300);
//             this.lastScale = this.scale;
//         }
//     }

//     setTool(tool: Tool) {
//         // Store current state before changing tool
//         // const wasDrawing = this.isDrawing;
//         // const wasClicked = this.clicked;

//         this.selectedTool = tool;

//         // Reset any ongoing drawing
//         this.isDrawing = false;
//         this.clicked = false;
//         this.pencilCoords = [];

//         // Force canvas rect update when tool changes
//         this.updateCanvasRect();

//         // Clear and redraw without changing viewport
//         this.render();
//     }

//     async init() {
//         try {
//             this.existingShapes = await getExistingShapes(this.roomId);
//         } catch (error) {
//             console.error("Failed to load existing shapes:", error);
//             this.existingShapes = [];
//         }
//         this.render();
//     }

//     initHandlers() {
//         this.socket.onmessage = (event) => {
//             const message = JSON.parse(event.data);
//             if (message.type === "chat") {
//                 // console.log(`🚩 before initHandlers => panx : ${this.panX} and pany : ${this.panY} and scale : ${this.scale}`);
//                 this.panX = Number(localStorage.getItem("px")) || 0;
//                 this.panY = Number(localStorage.getItem("py")) || 0;
//                 this.scale = Number(localStorage.getItem("scale")) || 1;
//                 // console.log(`✅ after initHandlers => panx : ${this.panX} and pany : ${this.panY} and scale : ${this.scale}`);
//                 const parsedShape = JSON.parse(message.message);
//                 this.existingShapes.push(parsedShape);
//                 this.render();
//                 // if (this.redrawTimeout) clearTimeout(this.redrawTimeout);
//                 // this.redrawTimeout = setTimeout(() => {
//                 //     this.render();
//                 // }, 10);
//             }
//         }
//     }

//     initMouseHandlers() {
//         this.canvas.addEventListener('mousedown', this.mouseDownHandler);
//         this.canvas.addEventListener('mouseup', this.mouseUpHandler);
//         this.canvas.addEventListener('mousemove', this.mouseMoveHandler);
//         // Add mouse leave handler to clean up state
//         this.canvas.addEventListener('mouseleave', this.mouseLeaveHandler);
//         this.canvas.addEventListener('dblclick', this.doubleClickHandler);
//     }

//     initZoomHandlers() {
//         this.canvas.addEventListener('wheel', this.wheelHandler, { passive: false });
//     }

//     // New mouse leave handler
//     mouseLeaveHandler = (e: MouseEvent) => {
//         // Clean up any ongoing operations when mouse leaves canvas
//         if (this.selectedTool === "pencil" && this.isDrawing) {
//             // Finish the pencil stroke
//             this.mouseUpHandler(e);
//         }
//         // Reset click state but don't interfere with grab operations
//         if (this.selectedTool !== "grab") {
//             this.clicked = false;
//             this.isDrawing = false;
//         }
//     }

//     destroyMouseHandlers() {
//         this.canvas.removeEventListener('mousedown', this.mouseDownHandler);
//         this.canvas.removeEventListener('mouseup', this.mouseUpHandler);
//         this.canvas.removeEventListener('mousemove', this.mouseMoveHandler);
//         this.canvas.removeEventListener('mouseleave', this.mouseLeaveHandler);
//         this.canvas.removeEventListener('wheel', this.wheelHandler);
//         this.canvas.addEventListener('dblclick', this.doubleClickHandler);
//     }

//     registerToolChangeCallback(callback: (tool: Tool) => void) {
//         this.onToolChange = callback;
//     }

//     screenToWorld(screenX: number, screenY: number) {
//         const canvasCoords = this.getCanvasCoordinates(screenX, screenY);
//         return {
//             x: (canvasCoords.x - this.panX) / this.scale,
//             y: (canvasCoords.y - this.panY) / this.scale
//         };
//     }

//     getCanvasCoordinates(clientX: number, clientY: number) {
//         // Always use fresh canvas rect for critical operations
//         // but use cached version for less critical operations
//         return {
//             x: clientX - this.canvasRect.left,
//             y: clientY - this.canvasRect.top
//         };
//     }

//     render() {
//         this.context.save();
//         this.context.setTransform(1, 0, 0, 1, 0, 0);
//         this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
//         this.context.fillStyle = "rgba(0, 0, 0)";
//         this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
//         this.context.restore();

//         this.context.save();
//         this.context.setTransform(this.scale, 0, 0, this.scale, this.panX, this.panY);

//         // Draw all existing shapes
//         this.existingShapes.forEach((shape) => {
//             this.drawShape(shape);
//         });

//         // Restore transform state
//         this.context.restore();
//     }

//     drawShape(shape: Shape) {
//         if (shape.type === "rect") {
//             this.context.strokeStyle = shape.color;
//             this.context.fillStyle = shape.bgColor;
//             this.context.lineWidth = shape.strokeWidth;
//             this.context.setLineDash([shape.lineDashX, shape.lineDashY]);
//             this.context.fillRect(shape.x, shape.y, shape.width, shape.height);
//             this.context.strokeRect(shape.x, shape.y, shape.width, shape.height);
//         } else if (shape.type === "elip") {
//             this.context.strokeStyle = shape.color;
//             this.context.fillStyle = shape.bgColor;
//             this.context.lineWidth = shape.strokeWidth;
//             this.context.beginPath();
//             this.context.ellipse(shape.centerX, shape.centerY, Math.abs(shape.radiusX), Math.abs(shape.radiusY), 0, 0, 2 * Math.PI);
//             this.context.setLineDash([shape.lineDashX, shape.lineDashY]);
//             this.context.fill();
//             this.context.stroke();
//         } else if (shape.type === "line") {
//             this.context.strokeStyle = shape.color;
//             this.context.lineWidth = shape.strokeWidth;
//             this.context.beginPath();
//             this.context.setLineDash([shape.lineDashX, shape.lineDashY]);
//             this.context.moveTo(shape.startX, shape.startY);
//             this.context.lineTo(shape.endX, shape.endY);
//             this.context.stroke();
//         } else if (shape.type === "pencil") {
//             this.context.strokeStyle = shape.color;
//             this.context.lineWidth = shape.strokeWidth;
//             if (shape.pencilCoords.length > 0) {
//                 this.context.beginPath();
//                 this.context.lineCap = "round";
//                 this.context.lineJoin = "round";
//                 this.context.setLineDash([shape.lineDashX, shape.lineDashY]);
//                 this.context.moveTo(shape.pencilCoords[0].x, shape.pencilCoords[0].y);
//                 for (let i = 1; i < shape.pencilCoords.length; i++) {
//                     this.context.lineTo(shape.pencilCoords[i].x, shape.pencilCoords[i].y);
//                 }
//                 this.context.stroke();
//             }
//         } else if (shape.type === "text") {
//             this.context.fillStyle = shape.color;
//             this.context.lineWidth = shape.strokeWidth;
//             this.context.save();

//             this.context.font = `${shape.fontSize}px sans-serif`;
//             this.context.fillText(shape.content, shape.x, shape.y + shape.fontSize + 8);
//             this.context.restore();
//         }
//     }

//     drawPreview(worldStart: { x: number, y: number }, worldEnd: { x: number, y: number }) {
//         const width = worldEnd.x - worldStart.x;
//         const height = worldEnd.y - worldStart.y;

//         this.context.save();

//         this.context.strokeStyle = this.color;
//         this.context.lineWidth = this.strokeWidth;
//         this.context.setLineDash([this.lineDashX, this.lineDashY]);

//         if (this.selectedTool === "rect") {
//             this.context.fillStyle = this.bgColor;
//             this.context.fillRect(worldStart.x, worldStart.y, width, height);
//             this.context.strokeRect(worldStart.x, worldStart.y, width, height);
//         } else if (this.selectedTool === "elip") {
//             this.context.fillStyle = this.bgColor;
//             const centerX = (worldStart.x + worldEnd.x) / 2;
//             const centerY = (worldStart.y + worldEnd.y) / 2;
//             const radiusX = Math.abs(width / 2);
//             const radiusY = Math.abs(height / 2);
//             this.context.beginPath();
//             this.context.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
//             this.context.fill();
//             this.context.stroke();
//         } else if (this.selectedTool === "line") {
//             this.context.beginPath();
//             this.context.moveTo(worldStart.x, worldStart.y);
//             this.context.lineTo(worldEnd.x, worldEnd.y);
//             this.context.stroke();
//         }

//         this.context.restore();
//     }

//     wheelHandler = (e: WheelEvent) => {
//         e.preventDefault();
//         const zoomIntensity = 0.15;
//         const wheel = e.deltaY < 0 ? 1 : -1;
//         const zoom = Math.exp(wheel * zoomIntensity);

//         this.updateCanvasRect();
//         const mouseCanvasPos = this.getCanvasCoordinates(e.clientX, e.clientY);
//         const worldPosBefore = {
//             x: (mouseCanvasPos.x - this.panX) / this.scale,
//             y: (mouseCanvasPos.y - this.panY) / this.scale
//         };

//         const newScale = this.scale * zoom;
//         if (newScale >= this.minScale && newScale <= this.maxScale) {
//             this.scale = newScale;
//             this.panX = mouseCanvasPos.x - worldPosBefore.x * this.scale;
//             this.panY = mouseCanvasPos.y - worldPosBefore.y * this.scale;

//             this.savePanPostions();
//             this.saveScale();

//             // if (!this.zoomQueued) {
//             //     this.zoomQueued = true;
//             //     requestAnimationFrame(() => {
//             //         this.render();
//             //         this.zoomQueued = false;
//             //     });
//             // }

//             this.render();
//         }
//     };

//     mouseDownHandler = (e: MouseEvent) => {
//         // Ensure canvas rect is current before any coordinate calculations
//         this.updateCanvasRect();

//         this.clicked = true;

//         const worldCoords = this.screenToWorld(e.clientX, e.clientY);
//         this.startX = worldCoords.x;
//         this.startY = worldCoords.y;

//         if (this.selectedTool === "pencil") {
//             this.isDrawing = true;
//             this.pencilCoords = [{ x: worldCoords.x, y: worldCoords.y }];
//         }

//         if (this.selectedTool === "grab") {
//             const screenCoords = this.getCanvasCoordinates(e.clientX, e.clientY);
//             this.lastMouseX = screenCoords.x;
//             this.lastMouseY = screenCoords.y;
//         }
//     }

//     mouseMoveHandler = (e: MouseEvent) => {
//         if (!this.clicked) return;
//         const worldCoords = this.screenToWorld(e.clientX, e.clientY);
//         const screenCoords = this.getCanvasCoordinates(e.clientX, e.clientY);

//         if (this.selectedTool === "grab") {
//             // Handle panning
//             const deltaX = screenCoords.x - this.lastMouseX;
//             const deltaY = screenCoords.y - this.lastMouseY;

//             this.panX += deltaX;
//             this.panY += deltaY;

//             this.lastMouseX = screenCoords.x;
//             this.lastMouseY = screenCoords.y;

//             // if (!this.isPanQueued) {
//             //     this.isPanQueued = true;
//             //     requestAnimationFrame(() => {
//             //         this.render();
//             //         this.isPanQueued = false;
//             //     });
//             // }
//             this.render();
//         } else if (this.selectedTool === "pencil") {
//             if (this.isDrawing) {
//                 this.pencilCoords.push({ x: worldCoords.x, y: worldCoords.y });
//                 this.render();

//                 // Draw current pencil stroke
//                 this.context.save();
//                 this.context.setTransform(this.scale, 0, 0, this.scale, this.panX, this.panY);
//                 this.context.strokeStyle = this.color;
//                 this.context.lineWidth = this.strokeWidth; // Scale-independent line width
//                 this.context.lineCap = "round";
//                 this.context.lineJoin = "round";
//                 this.context.setLineDash([this.lineDashX, this.lineDashY]);

//                 if (this.pencilCoords.length > 0) {
//                     this.context.beginPath();
//                     this.context.moveTo(this.pencilCoords[0].x, this.pencilCoords[0].y);
//                     for (let i = 1; i < this.pencilCoords.length; i++) {
//                         this.context.lineTo(this.pencilCoords[i].x, this.pencilCoords[i].y);
//                     }
//                     this.context.stroke();
//                 }
//                 this.context.restore();
//             }
//         } else {
//             // Handle preview for other tools
//             this.render();
//             // Draw preview
//             this.context.save();
//             this.context.setTransform(this.scale, 0, 0, this.scale, this.panX, this.panY);
//             this.drawPreview(
//                 { x: this.startX, y: this.startY },
//                 { x: worldCoords.x, y: worldCoords.y }
//             );
//             this.context.restore();
//         }
//     }

//     mouseUpHandler = (e: MouseEvent) => {
//         if (!this.clicked) return;
//         this.clicked = false;

//         const worldCoords = this.screenToWorld(e.clientX, e.clientY);
//         const width = worldCoords.x - this.startX;
//         const height = worldCoords.y - this.startY;

//         let shape: Shape | null = null;

//         if (this.selectedTool === "rect") {
//             // Prevent creating zero-size rectangles
//             if (Math.abs(width) > 1 && Math.abs(height) > 1) {
//                 shape = {
//                     type: "rect",
//                     x: Math.min(this.startX, worldCoords.x),
//                     y: Math.min(this.startY, worldCoords.y),
//                     width: Math.abs(width),
//                     height: Math.abs(height),
//                     color: this.color,
//                     strokeWidth: this.strokeWidth,
//                     bgColor: this.bgColor,
//                     lineDashX: this.lineDashX,
//                     lineDashY: this.lineDashY
//                 };
//             }
//         } else if (this.selectedTool === "elip") {
//             // Prevent creating zero-size ellipses
//             if (Math.abs(width) > 1 && Math.abs(height) > 1) {
//                 shape = {
//                     type: "elip",
//                     centerX: (this.startX + worldCoords.x) / 2,
//                     centerY: (this.startY + worldCoords.y) / 2,
//                     radiusX: Math.abs(width / 2),
//                     radiusY: Math.abs(height / 2),
//                     color: this.color,
//                     strokeWidth: this.strokeWidth,
//                     bgColor: this.bgColor,
//                     lineDashX: this.lineDashX,
//                     lineDashY: this.lineDashY
//                 };
//             }
//         } else if (this.selectedTool === "line") {
//             // Prevent creating zero-length lines
//             const distance = Math.sqrt(width * width + height * height);
//             if (distance > 1) {
//                 shape = {
//                     type: "line",
//                     startX: this.startX,
//                     startY: this.startY,
//                     endX: worldCoords.x,
//                     endY: worldCoords.y,
//                     color: this.color,
//                     strokeWidth: this.strokeWidth,
//                     lineDashX: this.lineDashX,
//                     lineDashY: this.lineDashY
//                 };
//             }
//         } else if (this.selectedTool === "pencil") {
//             if (this.isDrawing) {
//                 this.isDrawing = false;

//                 // Ensure we have at least two points
//                 if (this.pencilCoords.length === 1) {
//                     this.pencilCoords.push({
//                         x: this.pencilCoords[0].x + 0.1,
//                         y: this.pencilCoords[0].y + 0.1
//                     });
//                 }

//                 shape = {
//                     type: "pencil",
//                     color: this.color,
//                     strokeWidth: this.strokeWidth,
//                     lineDashX: this.lineDashX,
//                     lineDashY: this.lineDashY,
//                     pencilCoords: [...this.pencilCoords]
//                 };
//             }
//         } else if (this.selectedTool === "text") {
//             this.activeTextBox = new TextBox(
//                 e.clientX,
//                 e.clientY,
//                 worldCoords.x,
//                 worldCoords.y,
//                 "",
//                 this.context,
//                 this.scale,
//                 this,
//                 this.color,
//                 this.strokeWidth,
//                 this.fontSize
//             );
//             return;
//         } else if (this.selectedTool === "grab") {
//             // Just finish the grab operation
//             this.savePanPostions();
//             this.saveScale();
//         }

//         if (shape) {
//             this.existingShapes.push(shape);

//             this.socket.send(JSON.stringify({
//                 type: "chat",
//                 message: JSON.stringify(shape),
//                 roomId: this.roomId
//             }));

//             // Set tool to cursor after drawing is complete
//             this.setTool("cursor");

//             // Notify parent component about tool change
//             if (this.onToolChange) {
//                 this.onToolChange("cursor");
//             }
//         }

//         //this.render();
//     }

//     doubleClickHandler = (e: MouseEvent) => {
//         if (this.selectedTool === "cursor") {
//             const worldCoords = this.screenToWorld(e.clientX, e.clientY);
//             this.activeTextBox = new TextBox(
//                 e.clientX,
//                 e.clientY,
//                 worldCoords.x,
//                 worldCoords.y,
//                 "",
//                 this.context,
//                 this.scale,
//                 this,
//                 this.color,
//                 this.strokeWidth,
//                 this.fontSize
//             );
//             this.render();
//         }
//     }
// }







// newest version
//-----------------------------------------------------------------------------------------------------------------------------------------

// import { Tool, ToolConfig } from "@/components/Canvas/Canvas";
// import { getExistingShapes } from "./Http";
// import { TextBox } from "./TextBox";

// export type Shape = {
//     type: "rect";
//     x: number;
//     y: number;
//     width: number;
//     height: number;
//     color: string;
//     strokeWidth: number;
//     bgColor: string;
//     lineDashX: number;
//     lineDashY: number;
// } | {
//     type: "elip";
//     centerX: number;
//     centerY: number;
//     radiusX: number;
//     radiusY: number;
//     color: string;
//     strokeWidth: number;
//     bgColor: string;
//     lineDashX: number;
//     lineDashY: number;
// } | {
//     type: "line";
//     startX: number;
//     startY: number;
//     endX: number;
//     endY: number;
//     color: string;
//     strokeWidth: number;
//     lineDashX: number;
//     lineDashY: number;
// } | {
//     type: "pencil";
//     pencilCoords: Array<{ x: number, y: number }>;
//     color: string;
//     strokeWidth: number;
//     lineDashX: number;
//     lineDashY: number;
// } | {
//     type: "text";
//     x: number;
//     y: number;
//     content: string;
//     color: string;
//     strokeWidth: number;
//     fontSize: number;
// } | {
//     type: "cursor";
// } | {
//     type: "grab";
// };

// export class Game {
//     private scale: number;
//     private minScale: number = 0.1;
//     private maxScale: number = 30;
//     public activeTextBox: TextBox | undefined;
//     private canvas: HTMLCanvasElement;
//     private context: CanvasRenderingContext2D;
//     public existingShapes: Shape[];
//     public roomId: string;
//     private clicked: boolean;
//     private startX = 0;
//     private startY = 0;
//     private panX: number;
//     private panY: number;
//     private lastMouseX = 0;
//     private lastMouseY = 0;
//     private selectedTool = "cursor";
//     private pencilCoords: Array<{ x: number, y: number }> = [];
//     private isDrawing = false;
//     socket: WebSocket;
//     private canvasRect: DOMRect;
//     public onToolChange: ((tool: Tool) => void) | null = null;
//     private lastScale: number;
//     private lastSavedPan: { x: number, y: number } = { x: 0, y: 0 };
//     private savePanTimeout: number | undefined;
//     private saveScaleTimeout: number | undefined;
//     private strokeWidth: number = 4;
//     private color: string = "#ffffff";
//     private bgColor: string = "transparent";
//     private lineDashX: number = 1;
//     private lineDashY: number = 0;
//     private fontSize: number = 20;

//     // Performance optimization properties
//     private animationId: number | null = null;
//     private needsRedraw: boolean = false;
//     private isAnimating: boolean = false;
//     private lastFrameTime: number = 0;
//     private targetFPS: number = 100;
//     private frameInterval: number = 1000 / this.targetFPS;

//     // Smooth zoom/pan properties
//     private targetScale: number = 1;
//     private targetPanX: number = 0;
//     private targetPanY: number = 0;
//     private zoomEasing: number = 0.15;
//     private panEasing: number = 0.2;
//     private isZooming: boolean = false;
//     private isPanning: boolean = false;

//     // Viewport culling
//     private viewportBounds: {
//         left: number;
//         top: number;
//         right: number;
//         bottom: number;
//     } = { left: 0, top: 0, right: 0, bottom: 0 };

//     // Event throttling
//     private wheelTimeout: number | null = null;
//     // private mouseMoveTimeout: number | null = null;

//     constructor(
//         canvas: HTMLCanvasElement,
//         roomId: string,
//         socket: WebSocket,
//         onToolChange?: (tool: Tool) => void
//     ) {
//         this.canvas = canvas;
//         this.context = canvas.getContext('2d')!;

//         // Enable hardware acceleration hints
//         this.context.imageSmoothingEnabled = true;
//         this.context.imageSmoothingQuality = 'high';

//         this.existingShapes = [];
//         this.roomId = roomId;
//         this.socket = socket;
//         this.clicked = false;
//         
//         this.targetScale = this.scale;
//         this.lastScale = this.scale = Number(localStorage.getItem("scale")) || 1;
//         this.lastSavedPan.x = this.panX = Number(localStorage.getItem("px")) || 0;
//         this.lastSavedPan.y = this.panY = Number(localStorage.getItem("py")) || 0;
//         this.targetPanX = this.panX;
//         this.targetPanY = this.panY;

//         this.canvasRect = canvas.getBoundingClientRect();
//         this.onToolChange = onToolChange || null;

//         this.init();
//         this.initHandlers();
//         this.initMouseHandlers();
//         this.initZoomHandlers();
//         this.startAnimationLoop();
//     }

//     setToolConfigs(toolConfig: ToolConfig) {
//         this.strokeWidth = toolConfig.strokeWidth;
//         this.color = toolConfig.color;
//         this.bgColor = toolConfig.bgColor;
//         this.lineDashX = toolConfig.lineDashX;
//         this.lineDashY = toolConfig.lineDashY;
//         this.fontSize = toolConfig.fontSize;
//     }

//     private startAnimationLoop() {
//         const animate = (currentTime: number) => {
//             if (currentTime - this.lastFrameTime >= this.frameInterval) {
//                 this.updateAnimations();
//                 if (this.needsRedraw || this.isAnimating) {
//                     this.render();
//                     this.needsRedraw = false;
//                 }
//                 this.lastFrameTime = currentTime;
//             }
//             this.animationId = requestAnimationFrame(animate);
//         };
//         this.animationId = requestAnimationFrame(animate);
//     }

//     private updateAnimations() {
//         let hasAnimation = false;

//         // Smooth zoom animation
//         if (this.isZooming && Math.abs(this.targetScale - this.scale) > 0.001) {
//             this.scale += (this.targetScale - this.scale) * this.zoomEasing;
//             hasAnimation = true;
//         } else if (this.isZooming) {
//             this.scale = this.targetScale;
//             this.isZooming = false;
//         }

//         // Smooth pan animation
//         if (this.isPanning && (Math.abs(this.targetPanX - this.panX) > 0.1 || Math.abs(this.targetPanY - this.panY) > 0.1)) {
//             this.panX += (this.targetPanX - this.panX) * this.panEasing;
//             this.panY += (this.targetPanY - this.panY) * this.panEasing;
//             hasAnimation = true;
//         } else if (this.isPanning) {
//             this.panX = this.targetPanX;
//             this.panY = this.targetPanY;
//             this.isPanning = false;
//         }

//         this.isAnimating = hasAnimation;
//         if (hasAnimation) {
//             this.updateViewportBounds();
//         }
//     }

//     private updateViewportBounds() {
//         const margin = 100; // Extra margin for smoother culling
//         this.viewportBounds = {
//             left: (-this.panX / this.scale) - margin,
//             top: (-this.panY / this.scale) - margin,
//             right: (this.canvas.width - this.panX) / this.scale + margin,
//             bottom: (this.canvas.height - this.panY) / this.scale + margin
//         };
//     }

//     private isShapeInViewport(shape: Shape): boolean {
//         const bounds = this.viewportBounds;

//         switch (shape.type) {
//             case "rect":
//                 return !(shape.x + shape.width < bounds.left ||
//                     shape.x > bounds.right ||
//                     shape.y + shape.height < bounds.top ||
//                     shape.y > bounds.bottom);

//             case "elip":
//                 return !(shape.centerX + shape.radiusX < bounds.left ||
//                     shape.centerX - shape.radiusX > bounds.right ||
//                     shape.centerY + shape.radiusY < bounds.top ||
//                     shape.centerY - shape.radiusY > bounds.bottom);

//             case "line":
//                 const minX = Math.min(shape.startX, shape.endX);
//                 const maxX = Math.max(shape.startX, shape.endX);
//                 const minY = Math.min(shape.startY, shape.endY);
//                 const maxY = Math.max(shape.startY, shape.endY);
//                 return !(maxX < bounds.left || minX > bounds.right ||
//                     maxY < bounds.top || minY > bounds.bottom);

//             case "pencil":
//                 if (shape.pencilCoords.length === 0) return false;
//                 const coords = shape.pencilCoords;
//                 const minPX = Math.min(...coords.map(c => c.x));
//                 const maxPX = Math.max(...coords.map(c => c.x));
//                 const minPY = Math.min(...coords.map(c => c.y));
//                 const maxPY = Math.max(...coords.map(c => c.y));
//                 return !(maxPX < bounds.left || minPX > bounds.right ||
//                     maxPY < bounds.top || minPY > bounds.bottom);

//             case "text":
//                 return !(shape.x < bounds.left || shape.x > bounds.right ||
//                     shape.y < bounds.top || shape.y > bounds.bottom);

//             default:
//                 return true;
//         }
//     }

//     private scheduleRedraw() {
//         this.needsRedraw = true;
//     }

//     updateCanvasRect = () => {
//         const newRect = this.canvas.getBoundingClientRect();
//         if (!this.canvasRect ||
//             Math.abs(newRect.left - this.canvasRect.left) > 1 ||
//             Math.abs(newRect.top - this.canvasRect.top) > 1 ||
//             Math.abs(newRect.width - this.canvasRect.width) > 1 ||
//             Math.abs(newRect.height - this.canvasRect.height) > 1) {
//             this.canvasRect = newRect;
//             this.updateViewportBounds();
//         }
//     }

//     savePanPostions = () => {
//         if (this.panX !== this.lastSavedPan.x || this.panY !== this.lastSavedPan.y) {
//             clearTimeout(this.savePanTimeout);
//             this.savePanTimeout = window.setTimeout(() => {
//                 localStorage.setItem("px", String(this.panX));
//                 localStorage.setItem("py", String(this.panY));
//             }, 300);
//             this.lastSavedPan = { x: this.panX, y: this.panY };
//         }
//     }

//     saveScale = () => {
//         if (this.scale !== this.lastScale) {
//             clearTimeout(this.saveScaleTimeout);
//             this.saveScaleTimeout = window.setTimeout(() => {
//                 localStorage.setItem("scale", String(this.scale));
//             }, 300);
//             this.lastScale = this.scale;
//         }
//     }

//     setTool(tool: Tool) {
//         this.selectedTool = tool;
//         this.isDrawing = false;
//         this.clicked = false;
//         this.pencilCoords = [];
//         this.updateCanvasRect();
//         this.scheduleRedraw();
//     }

//     async init() {
//         try {
//             this.existingShapes = await getExistingShapes(this.roomId);
//         } catch (error) {
//             console.error("Failed to load existing shapes:", error);
//             this.existingShapes = [];
//         }
//         this.updateViewportBounds();
//         this.scheduleRedraw();
//     }

//     initHandlers() {
//         this.socket.onmessage = (event) => {
//             const message = JSON.parse(event.data);
//             if (message.type === "chat") {
//                 this.panX = Number(localStorage.getItem("px")) || 0;
//                 this.panY = Number(localStorage.getItem("py")) || 0;
//                 this.scale = Number(localStorage.getItem("scale")) || 1;
//                 this.targetPanX = this.panX;
//                 this.targetPanY = this.panY;
//                 this.targetScale = this.scale;

//                 const parsedShape = JSON.parse(message.message);
//                 this.existingShapes.push(parsedShape);
//                 this.scheduleRedraw();
//             }
//         }
//     }

//     initMouseHandlers() {
//         this.canvas.addEventListener('mousedown', this.mouseDownHandler);
//         this.canvas.addEventListener('mouseup', this.mouseUpHandler);
//         this.canvas.addEventListener('mousemove', this.mouseMoveHandler);
//         this.canvas.addEventListener('mouseleave', this.mouseLeaveHandler);
//         this.canvas.addEventListener('dblclick', this.doubleClickHandler);
//     }

//     initZoomHandlers() {
//         this.canvas.addEventListener('wheel', this.wheelHandler, { passive: false });
//     }

//     mouseLeaveHandler = (e: MouseEvent) => {
//         if (this.selectedTool === "pencil" && this.isDrawing) {
//             this.mouseUpHandler(e);
//         }
//         if (this.selectedTool !== "grab") {
//             this.clicked = false;
//             this.isDrawing = false;
//         }
//     }

//     destroyMouseHandlers() {
//         if (this.animationId) {
//             cancelAnimationFrame(this.animationId);
//         }
//         this.canvas.removeEventListener('mousedown', this.mouseDownHandler);
//         this.canvas.removeEventListener('mouseup', this.mouseUpHandler);
//         this.canvas.removeEventListener('mousemove', this.mouseMoveHandler);
//         this.canvas.removeEventListener('mouseleave', this.mouseLeaveHandler);
//         this.canvas.removeEventListener('wheel', this.wheelHandler);
//         this.canvas.removeEventListener('dblclick', this.doubleClickHandler);
//     }

//     registerToolChangeCallback(callback: (tool: Tool) => void) {
//         this.onToolChange = callback;
//     }

//     screenToWorld(screenX: number, screenY: number) {
//         const canvasCoords = this.getCanvasCoordinates(screenX, screenY);
//         return {
//             x: (canvasCoords.x - this.panX) / this.scale,
//             y: (canvasCoords.y - this.panY) / this.scale
//         };
//     }

//     getCanvasCoordinates(clientX: number, clientY: number) {
//         return {
//             x: clientX - this.canvasRect.left,
//             y: clientY - this.canvasRect.top
//         };
//     }

//     render() {
//         // Clear canvas efficiently
//         this.context.save();
//         this.context.setTransform(1, 0, 0, 1, 0, 0);
//         this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
//         this.context.fillStyle = "rgba(0, 0, 0, 1)";
//         this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
//         this.context.restore();

//         // Set up world transform
//         this.context.save();
//         this.context.setTransform(this.scale, 0, 0, this.scale, this.panX, this.panY);

//         // Update viewport bounds for culling
//         this.updateViewportBounds();

//         // Draw only visible shapes
//         this.existingShapes.forEach((shape) => {
//             if (this.isShapeInViewport(shape)) {
//                 this.drawShape(shape);
//             }
//         });

//         this.context.restore();
//     }

//     drawShape(shape: Shape) {
//         // Use Path2D for better performance where possible
//         this.context.save();

//         if (shape.type === "rect") {
//             this.context.strokeStyle = shape.color;
//             this.context.fillStyle = shape.bgColor;
//             this.context.lineWidth = shape.strokeWidth;
//             this.context.setLineDash([shape.lineDashX, shape.lineDashY]);

//             const path = new Path2D();
//             path.rect(shape.x, shape.y, shape.width, shape.height);
//             this.context.fill(path);
//             this.context.stroke(path);

//         } else if (shape.type === "elip") {
//             this.context.strokeStyle = shape.color;
//             this.context.fillStyle = shape.bgColor;
//             this.context.lineWidth = shape.strokeWidth;
//             this.context.setLineDash([shape.lineDashX, shape.lineDashY]);

//             const path = new Path2D();
//             path.ellipse(shape.centerX, shape.centerY, Math.abs(shape.radiusX), Math.abs(shape.radiusY), 0, 0, 2 * Math.PI);
//             this.context.fill(path);
//             this.context.stroke(path);

//         } else if (shape.type === "line") {
//             this.context.strokeStyle = shape.color;
//             this.context.lineWidth = shape.strokeWidth;
//             this.context.setLineDash([shape.lineDashX, shape.lineDashY]);

//             const path = new Path2D();
//             path.moveTo(shape.startX, shape.startY);
//             path.lineTo(shape.endX, shape.endY);
//             this.context.stroke(path);

//         } else if (shape.type === "pencil") {
//             this.context.strokeStyle = shape.color;
//             this.context.lineWidth = shape.strokeWidth;
//             this.context.lineCap = "round";
//             this.context.lineJoin = "round";
//             this.context.setLineDash([shape.lineDashX, shape.lineDashY]);

//             if (shape.pencilCoords.length > 0) {
//                 const path = new Path2D();
//                 path.moveTo(shape.pencilCoords[0].x, shape.pencilCoords[0].y);
//                 for (let i = 1; i < shape.pencilCoords.length; i++) {
//                     path.lineTo(shape.pencilCoords[i].x, shape.pencilCoords[i].y);
//                 }
//                 this.context.stroke(path);
//             }

//         } else if (shape.type === "text") {
//             this.context.fillStyle = shape.color;
//             this.context.font = `${shape.fontSize}px sans-serif`;
//             this.context.fillText(shape.content, shape.x, shape.y + shape.fontSize + 8);
//         }

//         this.context.restore();
//     }

//     drawPreview(worldStart: { x: number, y: number }, worldEnd: { x: number, y: number }) {
//         const width = worldEnd.x - worldStart.x;
//         const height = worldEnd.y - worldStart.y;

//         this.context.save();
//         this.context.strokeStyle = this.color;
//         this.context.lineWidth = this.strokeWidth;
//         this.context.setLineDash([this.lineDashX, this.lineDashY]);

//         if (this.selectedTool === "rect") {
//             this.context.fillStyle = this.bgColor;
//             const path = new Path2D();
//             path.rect(worldStart.x, worldStart.y, width, height);
//             this.context.fill(path);
//             this.context.stroke(path);
//         } else if (this.selectedTool === "elip") {
//             this.context.fillStyle = this.bgColor;
//             const centerX = (worldStart.x + worldEnd.x) / 2;
//             const centerY = (worldStart.y + worldEnd.y) / 2;
//             const radiusX = Math.abs(width / 2);
//             const radiusY = Math.abs(height / 2);
//             const path = new Path2D();
//             path.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
//             this.context.fill(path);
//             this.context.stroke(path);
//         } else if (this.selectedTool === "line") {
//             const path = new Path2D();
//             path.moveTo(worldStart.x, worldStart.y);
//             path.lineTo(worldEnd.x, worldEnd.y);
//             this.context.stroke(path);
//         }

//         this.context.restore();
//     }

//     wheelHandler = (e: WheelEvent) => {
//         e.preventDefault();

//         // Throttle wheel events for smoother experience
//         if (this.wheelTimeout) {
//             clearTimeout(this.wheelTimeout);
//         }

//         this.wheelTimeout = window.setTimeout(() => {
//             const zoomIntensity = 0.1;
//             const wheel = e.deltaY < 0 ? 1 : -1;
//             const zoom = Math.exp(wheel * zoomIntensity);

//             this.updateCanvasRect();
//             const mouseCanvasPos = this.getCanvasCoordinates(e.clientX, e.clientY);
//             const worldPosBefore = {
//                 x: (mouseCanvasPos.x - this.panX) / this.scale,
//                 y: (mouseCanvasPos.y - this.panY) / this.scale
//             };

//             const newScale = this.scale * zoom;
//             if (newScale >= this.minScale && newScale <= this.maxScale) {
//                 this.targetScale = newScale;
//                 this.targetPanX = mouseCanvasPos.x - worldPosBefore.x * this.targetScale;
//                 this.targetPanY = mouseCanvasPos.y - worldPosBefore.y * this.targetScale;

//                 this.isZooming = true;

//                 this.savePanPostions();
//                 this.saveScale();
//             }
//         }, 16); // ~60fps throttling
//     };

//     mouseDownHandler = (e: MouseEvent) => {
//         this.updateCanvasRect();
//         this.clicked = true;

//         const worldCoords = this.screenToWorld(e.clientX, e.clientY);
//         this.startX = worldCoords.x;
//         this.startY = worldCoords.y;

//         if (this.selectedTool === "pencil") {
//             this.isDrawing = true;
//             this.pencilCoords = [{ x: worldCoords.x, y: worldCoords.y }];
//         }

//         if (this.selectedTool === "grab") {
//             const screenCoords = this.getCanvasCoordinates(e.clientX, e.clientY);
//             this.lastMouseX = screenCoords.x;
//             this.lastMouseY = screenCoords.y;
//         }
//     }

//     mouseMoveHandler = (e: MouseEvent) => {
//         if (!this.clicked) return;

//         const worldCoords = this.screenToWorld(e.clientX, e.clientY);
//         const screenCoords = this.getCanvasCoordinates(e.clientX, e.clientY);

//         if (this.selectedTool === "grab") {
//             const deltaX = screenCoords.x - this.lastMouseX;
//             const deltaY = screenCoords.y - this.lastMouseY;

//             this.panX += deltaX;
//             this.panY += deltaY;
//             this.targetPanX = this.panX;
//             this.targetPanY = this.panY;

//             this.lastMouseX = screenCoords.x;
//             this.lastMouseY = screenCoords.y;

//             this.scheduleRedraw();
//         } else if (this.selectedTool === "pencil") {
//             if (this.isDrawing) {
//                 // this.pencilCoords.push({ x: worldCoords.x, y: worldCoords.y });
//                 // this.scheduleRedraw();
//                 this.pencilCoords.push({ x: worldCoords.x, y: worldCoords.y });
//                 this.render();

//                 // Draw current pencil stroke
//                 this.context.save();
//                 this.context.setTransform(this.scale, 0, 0, this.scale, this.panX, this.panY);
//                 this.context.strokeStyle = this.color;
//                 this.context.lineWidth = this.strokeWidth; // Scale-independent line width
//                 this.context.lineCap = "round";
//                 this.context.lineJoin = "round";
//                 this.context.setLineDash([this.lineDashX, this.lineDashY]);

//                 if (this.pencilCoords.length > 0) {
//                     const path = new Path2D();
//                     path.moveTo(this.pencilCoords[0].x, this.pencilCoords[0].y);
//                     for (let i = 1; i < this.pencilCoords.length; i++) {
//                         path.lineTo(this.pencilCoords[i].x, this.pencilCoords[i].y);
//                     }
//                     this.context.stroke(path);
//                 }
//                 this.context.restore();

//             }
//         } else {
//             this.render();
//             this.context.save();
//             this.context.setTransform(this.scale, 0, 0, this.scale, this.panX, this.panY);
//             this.drawPreview(
//                 { x: this.startX, y: this.startY },
//                 { x: worldCoords.x, y: worldCoords.y }
//             )
//             this.context.restore();

//         }
//     }

//     mouseUpHandler = (e: MouseEvent) => {
//         if (!this.clicked) return;
//         this.clicked = false;

//         const worldCoords = this.screenToWorld(e.clientX, e.clientY);
//         const width = worldCoords.x - this.startX;
//         const height = worldCoords.y - this.startY;

//         let shape: Shape | null = null;

//         if (this.selectedTool === "rect") {
//             if (Math.abs(width) > 1 && Math.abs(height) > 1) {
//                 shape = {
//                     type: "rect",
//                     x: Math.min(this.startX, worldCoords.x),
//                     y: Math.min(this.startY, worldCoords.y),
//                     width: Math.abs(width),
//                     height: Math.abs(height),
//                     color: this.color,
//                     strokeWidth: this.strokeWidth,
//                     bgColor: this.bgColor,
//                     lineDashX: this.lineDashX,
//                     lineDashY: this.lineDashY
//                 };
//             }
//         } else if (this.selectedTool === "elip") {
//             if (Math.abs(width) > 1 && Math.abs(height) > 1) {
//                 shape = {
//                     type: "elip",
//                     centerX: (this.startX + worldCoords.x) / 2,
//                     centerY: (this.startY + worldCoords.y) / 2,
//                     radiusX: Math.abs(width / 2),
//                     radiusY: Math.abs(height / 2),
//                     color: this.color,
//                     strokeWidth: this.strokeWidth,
//                     bgColor: this.bgColor,
//                     lineDashX: this.lineDashX,
//                     lineDashY: this.lineDashY
//                 };
//             }
//         } else if (this.selectedTool === "line") {
//             const distance = Math.sqrt(width * width + height * height);
//             if (distance > 1) {
//                 shape = {
//                     type: "line",
//                     startX: this.startX,
//                     startY: this.startY,
//                     endX: worldCoords.x,
//                     endY: worldCoords.y,
//                     color: this.color,
//                     strokeWidth: this.strokeWidth,
//                     lineDashX: this.lineDashX,
//                     lineDashY: this.lineDashY
//                 };
//             }
//         } else if (this.selectedTool === "pencil") {
//             if (this.isDrawing) {
//                 this.isDrawing = false;
//                 if (this.pencilCoords.length === 1) {
//                     this.pencilCoords.push({
//                         x: this.pencilCoords[0].x + 0.1,
//                         y: this.pencilCoords[0].y + 0.1
//                     });
//                 }
//                 shape = {
//                     type: "pencil",
//                     color: this.color,
//                     strokeWidth: this.strokeWidth,
//                     lineDashX: this.lineDashX,
//                     lineDashY: this.lineDashY,
//                     pencilCoords: [...this.pencilCoords]
//                 };
//             }
//         } else if (this.selectedTool === "text") {
//             this.activeTextBox = new TextBox(
//                 e.clientX,
//                 e.clientY,
//                 worldCoords.x,
//                 worldCoords.y,
//                 "",
//                 this.context,
//                 this.scale,
//                 this,
//                 this.color,
//                 this.strokeWidth,
//                 this.fontSize
//             );
//             return;
//         } else if (this.selectedTool === "grab") {
//             this.savePanPostions();
//             this.saveScale();
//         }

//         if (shape) {
//             this.existingShapes.push(shape);
//             this.socket.send(JSON.stringify({
//                 type: "chat",
//                 message: JSON.stringify(shape),
//                 roomId: this.roomId
//             }));

//             this.setTool("cursor");
//             if (this.onToolChange) {
//                 this.onToolChange("cursor");
//             }
//         }
//     }

//     doubleClickHandler = (e: MouseEvent) => {
//         if (this.selectedTool === "cursor") {
//             const worldCoords = this.screenToWorld(e.clientX, e.clientY);
//             this.activeTextBox = new TextBox(
//                 e.clientX,
//                 e.clientY,
//                 worldCoords.x,
//                 worldCoords.y,
//                 "",
//                 this.context,
//                 this.scale,
//                 this,
//                 this.color,
//                 this.strokeWidth,
//                 this.fontSize
//             );
//             this.scheduleRedraw();
//         }
//     }
// }







// Oldest polished version
// zoom and pan works fast as excalidraw
//----------------------------------------------------------------------------------------------------------------------------------------------

import { Tool } from "@/components/Canvas/Canvas";
import { getExistingShapes } from "./Http";
import { TextBox } from "./TextBox";

export type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    type: "elip";
    centerX: number;
    centerY: number;
    radiusX: number;
    radiusY: number;
} | {
    type: "line";
    startX: number;
    startY: number;
    endX: number;
    endY: number;
} | {
    type: "pencil";
    pencilCoords: Array<{ x: number, y: number }>;
} | {
    type: "text";
    x: number;
    y: number;
    content: string;
} | {
    type: "cursor";
} | {
    type: "grab";
};

export class Game {
    private scale: number;
    private minScale: number = 0.3;
    private maxScale: number = 10;
    activeTextBox: TextBox | undefined;
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    existingShapes: Shape[];
    roomId: string;
    private clicked: boolean;
    private startX = 0;
    private startY = 0;
    private panX: number;
    private panY: number;
    private lastMouseX = 0;
    private lastMouseY = 0;
    private selectedTool = "cursor";
    private pencilCoords: Array<{ x: number, y: number }> = [];
    private isDrawing = false;
    socket: WebSocket;
    private canvasRect: DOMRect;
    onToolChange: ((tool: Tool) => void) | null = null;
    onPanChange: ((status: boolean) => void) | null = null;
    private lastScale: number;
    private lastSavedPan: { x: number, y: number } = { x: 0, y: 0 };
    private savePanTimeout: number | undefined;
    private isPanning: boolean;
    private saveScaleTimeout: number | undefined;
    // Add debouncing for canvas rect updates
    private resizeTimeout: number | null = null;
    private rectUpdateTimeout: number | null = null;

    constructor(
        canvas: HTMLCanvasElement,
        roomId: string,
        socket: WebSocket,
        onToolChange?: (tool: Tool) => void,
    ) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d', { alpha: false })!;
        this.context.lineWidth = 2;
        this.existingShapes = [];
        this.roomId = roomId;
        this.socket = socket;
        this.clicked = false;
        this.scale = 1;
        this.panX = 0;
        this.panY = 0;
        this.canvasRect = canvas.getBoundingClientRect();
        this.onToolChange = onToolChange || null;
        this.lastScale = this.scale = Number(localStorage.getItem("scale")) || 1;
        this.lastSavedPan.x = this.panX = Number(localStorage.getItem("px")) || 0;
        this.lastSavedPan.y = this.panY = Number(localStorage.getItem("py")) || 0;
        this.isPanning = false;

        this.init();
        this.initHandlers();
        this.initMouseHandlers();
        this.initZoomHandlers();
        window.addEventListener('resize', this.debouncedUpdateCanvasRect);

        // Also listen for scroll events that might affect canvas position
        window.addEventListener('scroll', this.debouncedUpdateCanvasRect, { passive: true });
    }

    savePanPostions = () => {
        if (this.panX !== this.lastSavedPan.x || this.panY !== this.lastSavedPan.y) {
            clearTimeout(this.savePanTimeout);
            this.savePanTimeout = window.setTimeout(() => {
                localStorage.setItem("px", String(this.panX));
                localStorage.setItem("py", String(this.panY));
            }, 300);
            this.lastSavedPan = { x: this.panX, y: this.panY };
        }
    }

    saveScale = () => {
        if (this.scale !== this.lastScale) {
            clearTimeout(this.saveScaleTimeout);
            this.saveScaleTimeout = window.setTimeout(() => {
                localStorage.setItem("scale", String(this.scale));
            }, 300);
            this.lastScale = this.scale;
        }
    }

    // Debounced canvas rect update to prevent frequent recalculations
    debouncedUpdateCanvasRect = () => {
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        this.resizeTimeout = window.setTimeout(() => {
            this.updateCanvasRect();
        }, 100); // Reduced from 300ms for more responsiveness
    }

    updateCanvasRect = () => {
        const newRect = this.canvas.getBoundingClientRect();

        // Only update if there's a significant change to prevent unnecessary updates
        if (!this.canvasRect ||
            Math.abs(newRect.left - this.canvasRect.left) > 1 ||
            Math.abs(newRect.top - this.canvasRect.top) > 1 ||
            Math.abs(newRect.width - this.canvasRect.width) > 1 ||
            Math.abs(newRect.height - this.canvasRect.height) > 1) {
            this.canvasRect = newRect;
        }
    }

    setTool(tool: Tool) {
        // Store current state before changing tool

        this.selectedTool = tool;

        // Reset any ongoing drawing
        this.isDrawing = false;
        this.clicked = false;
        this.pencilCoords = [];

        // Force canvas rect update when tool changes
        this.updateCanvasRect();

        // Clear and redraw without changing viewport
        // this.render();
    }

    async init() {
        try {
            this.existingShapes = await getExistingShapes(this.roomId);
        } catch (error) {
            console.error("Failed to load existing shapes:", error);
            this.existingShapes = [];
        }
        this.render();
    }

    initHandlers() {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === "chat") {
                this.panX = Number(localStorage.getItem("px")) || 0;
                this.panY = Number(localStorage.getItem("py")) || 0;
                this.scale = Number(localStorage.getItem("scale")) || 1;

                const parsedShape = JSON.parse(message.message);
                this.existingShapes.push(parsedShape);
                this.render();
            }
        }
    }

    initMouseHandlers() {
        this.canvas.addEventListener('mousedown', this.mouseDownHandler);
        this.canvas.addEventListener('mouseup', this.mouseUpHandler);
        this.canvas.addEventListener('mousemove', this.mouseMoveHandler);
        // Add mouse leave handler to clean up state
        this.canvas.addEventListener('mouseleave', this.mouseLeaveHandler);
    }

    initZoomHandlers() {
        this.canvas.addEventListener('wheel', this.wheelHandler, { passive: false });
    }

    // New mouse leave handler
    mouseLeaveHandler = (e: MouseEvent) => {
        // Clean up any ongoing operations when mouse leaves canvas
        if (this.selectedTool === "pencil" && this.isDrawing) {
            // Finish the pencil stroke
            this.mouseUpHandler(e);
        }
        // Reset click state but don't interfere with grab operations
        if (this.selectedTool !== "grab") {
            this.clicked = false;
            this.isDrawing = false;
        }
    }

    destroyMouseHandlers() {
        this.canvas.removeEventListener('mousedown', this.mouseDownHandler);
        this.canvas.removeEventListener('mouseup', this.mouseUpHandler);
        this.canvas.removeEventListener('mousemove', this.mouseMoveHandler);
        this.canvas.removeEventListener('mouseleave', this.mouseLeaveHandler);
        this.canvas.removeEventListener('wheel', this.wheelHandler);
        window.removeEventListener('resize', this.debouncedUpdateCanvasRect);
        window.removeEventListener('scroll', this.debouncedUpdateCanvasRect);

        // Clear timeouts
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        if (this.rectUpdateTimeout) {
            clearTimeout(this.rectUpdateTimeout);
        }
    }

    registerToolChangeCallback(callback: (tool: Tool) => void) {
        this.onToolChange = callback;
    }

    registerPanningCallback(callback: (status: boolean) => void) {
        this.onPanChange = callback;
    }

    // Zoom functionality
    wheelHandler = (e: WheelEvent) => {
        e.preventDefault();

        const zoomIntensity = 0.09;
        const wheel = e.deltaY < 0 ? 1 : -1;
        const zoom = Math.exp(wheel * zoomIntensity);

        // Ensure canvas rect is current before zoom calculation
        this.updateCanvasRect();

        // Get mouse position relative to canvas
        const mouseCanvasPos = this.getCanvasCoordinates(e.clientX, e.clientY);

        // Calculate world position before zoom
        const worldPosBefore = {
            x: (mouseCanvasPos.x - this.panX) / this.scale,
            y: (mouseCanvasPos.y - this.panY) / this.scale
        };

        // Apply zoom with limits
        const newScale = this.scale * zoom;
        if (newScale >= this.minScale && newScale <= this.maxScale) {
            this.scale = newScale;

            // Calculate the new pan position to keep the mouse position fixed
            this.panX = mouseCanvasPos.x - worldPosBefore.x * this.scale;
            this.panY = mouseCanvasPos.y - worldPosBefore.y * this.scale;
            this.savePanPostions();
            this.saveScale();
            this.render();
        }
    }

    screenToWorld(screenX: number, screenY: number) {
        const canvasCoords = this.getCanvasCoordinates(screenX, screenY);
        return {
            x: (canvasCoords.x - this.panX) / this.scale,
            y: (canvasCoords.y - this.panY) / this.scale
        };
    }

    getCanvasCoordinates(clientX: number, clientY: number) {
        // Always use fresh canvas rect for critical operations
        // but use cached version for less critical operations
        return {
            x: clientX - this.canvasRect.left,
            y: clientY - this.canvasRect.top
        };
    }

    render() {
        // Save current transform state
        this.context.save();

        // Reset transform to identity
        this.context.setTransform(1, 0, 0, 1, 0, 0);

        // Clear entire canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // this.context.fillStyle = "rgba(10, 10, 25)";
        this.context.fillStyle = "rgba(0, 0, 0, 1)";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.context.setTransform(this.scale, 0, 0, this.scale, this.panX, this.panY);

        this.context.strokeStyle = "rgba(255, 255, 255)";
        // this.context.fillStyle = "rgba(255, 255, 255)";
        this.context.lineWidth = 2; // Scale-independent line width

        // Draw all existing shapes
        this.existingShapes.forEach((shape) => {
            this.drawShape(shape);
        });

        // Restore transform state
        this.context.restore();
    }

    drawShape(shape: Shape) {
        if (shape.type === "rect") {
            this.context.strokeRect(shape.x, shape.y, shape.width, shape.height);
        } else if (shape.type === "elip") {
            this.context.beginPath();
            this.context.ellipse(shape.centerX, shape.centerY, Math.abs(shape.radiusX), Math.abs(shape.radiusY), 0, 0, 2 * Math.PI);
            // Sthis.context.closePath();
            this.context.stroke();
        } else if (shape.type === "line") {
            this.context.beginPath();
            this.context.moveTo(shape.startX, shape.startY);
            this.context.lineTo(shape.endX, shape.endY);
            this.context.closePath();
            this.context.stroke();
        } else if (shape.type === "pencil") {

            // old
            // if (shape.pencilCoords.length > 0) {
            //     this.context.beginPath();
            //     this.context.lineCap = "round";
            //     this.context.lineJoin = "round";
            //     this.context.moveTo(shape.pencilCoords[0].x, shape.pencilCoords[0].y);
            //     for (let i = 1; i < shape.pencilCoords.length; i++) {
            //         this.context.lineTo(shape.pencilCoords[i].x, shape.pencilCoords[i].y);
            //     }
            //     this.context.stroke();
            // }

            if (shape.pencilCoords && shape.pencilCoords.length > 0) {
                this.context.beginPath();
                this.context.lineCap = "round";
                this.context.lineJoin = "round";

                const coords = shape.pencilCoords;

                if (coords.length < 3) {
                    // Not enough points for smoothing, draw normally
                    this.context.moveTo(coords[0].x, coords[0].y);
                    for (let i = 1; i < coords.length; i++) {
                        this.context.lineTo(coords[i].x, coords[i].y);
                    }
                } else {
                    // Use quadratic curves for smoothing
                    this.context.moveTo(coords[0].x, coords[0].y);

                    for (let i = 1; i < coords.length - 1; i++) {
                        const currentPoint = coords[i];
                        const nextPoint = coords[i + 1];

                        // Control point is the current point
                        // End point is midway between current and next
                        const endX = (currentPoint.x + nextPoint.x) / 2;
                        const endY = (currentPoint.y + nextPoint.y) / 2;

                        this.context.quadraticCurveTo(currentPoint.x, currentPoint.y, endX, endY);
                    }

                    // Draw final segment
                    const lastPoint = coords[coords.length - 1];
                    this.context.lineTo(lastPoint.x, lastPoint.y);
                }

                this.context.stroke();
            }
        } else if (shape.type === "text") {
            const fontSize = 20;
            this.context.font = `${fontSize}px sans-serif`;
            this.context.fillStyle = "white";
            this.context.fillText(shape.content, shape.x, shape.y + fontSize + 8);
        }
    }

    drawPreview(worldStart: { x: number, y: number }, worldEnd: { x: number, y: number }) {
        this.context.save();

        // Set common styles once
        this.context.strokeStyle = "rgba(255, 255, 255, 0.8)";
        this.context.setLineDash([5 / this.scale, 5 / this.scale]);
        this.context.lineWidth = 2;

        const width = worldEnd.x - worldStart.x;
        const height = worldEnd.y - worldStart.y;

        if (this.selectedTool === "rect") {
            this.context.strokeRect(worldStart.x, worldStart.y, width, height);
        } else if (this.selectedTool === "elip") {
            const centerX = (worldStart.x + worldEnd.x) / 2;
            const centerY = (worldStart.y + worldEnd.y) / 2;
            const radiusX = Math.abs(width / 2);
            const radiusY = Math.abs(height / 2);
            this.context.beginPath();
            this.context.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
            this.context.stroke();
        } else if (this.selectedTool === "line") {
            this.context.beginPath();
            this.context.moveTo(worldStart.x, worldStart.y);
            this.context.lineTo(worldEnd.x, worldEnd.y);
            this.context.stroke();
        }

        this.context.restore();
    }

    mouseDownHandler = (e: MouseEvent) => {
        // Ensure canvas rect is current before any coordinate calculations
        this.updateCanvasRect();

        this.clicked = true;

        const worldCoords = this.screenToWorld(e.clientX, e.clientY);
        this.startX = worldCoords.x;
        this.startY = worldCoords.y;

        if (this.onPanChange) {
            this.onPanChange(true);
        }

        if (this.selectedTool === "pencil") {
            this.isDrawing = true;
            this.pencilCoords = [{ x: worldCoords.x, y: worldCoords.y }];
        }

        if (this.selectedTool === "grab") {
            const screenCoords = this.getCanvasCoordinates(e.clientX, e.clientY);
            this.lastMouseX = screenCoords.x;
            this.lastMouseY = screenCoords.y;
        }
    }

    mouseMoveHandler = (e: MouseEvent) => {
        if (!this.clicked) return;

        const worldCoords = this.screenToWorld(e.clientX, e.clientY);
        const screenCoords = this.getCanvasCoordinates(e.clientX, e.clientY);

        if (this.selectedTool === "grab") {
            // Handle panning
            const deltaX = screenCoords.x - this.lastMouseX;
            const deltaY = screenCoords.y - this.lastMouseY;

            this.panX += deltaX;
            this.panY += deltaY;

            this.lastMouseX = screenCoords.x;
            this.lastMouseY = screenCoords.y;

            this.render();
        }

        else if (this.selectedTool === "pencil") {
            if (this.isDrawing) {
                const newPoint = { x: worldCoords.x, y: worldCoords.y };
                this.pencilCoords.push(newPoint);

                // Only draw the new segment, not the entire stroke
                if (this.pencilCoords.length > 1) {
                    const lastIndex = this.pencilCoords.length - 1;
                    const prevPoint = this.pencilCoords[lastIndex - 1];

                    this.context.save();
                    this.context.setTransform(this.scale, 0, 0, this.scale, this.panX, this.panY);

                    this.context.beginPath();
                    this.context.strokeStyle = "rgba(255, 255, 255)";
                    this.context.lineWidth = 2 / this.scale;
                    this.context.lineCap = "round";
                    this.context.lineJoin = "round";
                    this.context.moveTo(prevPoint.x, prevPoint.y);
                    this.context.lineTo(newPoint.x, newPoint.y);
                    this.context.stroke();

                    this.context.restore();
                }
            }
        }

        else {
            // Handle preview for other tools
            this.render();

            // Draw preview
            this.context.save();
            this.context.setTransform(this.scale, 0, 0, this.scale, this.panX, this.panY);
            this.drawPreview(
                { x: this.startX, y: this.startY },
                { x: worldCoords.x, y: worldCoords.y }
            );
            this.context.restore();
        }
    }

    mouseUpHandler = (e: MouseEvent) => {
        if (!this.clicked) return;
        this.clicked = false;

        const worldCoords = this.screenToWorld(e.clientX, e.clientY);
        const width = worldCoords.x - this.startX;
        const height = worldCoords.y - this.startY;

        let shape: Shape | null = null;

        if (this.selectedTool === "rect") {
            // Prevent creating zero-size rectangles
            if (Math.abs(width) > 1 && Math.abs(height) > 1) {
                shape = {
                    type: "rect",
                    x: Math.min(this.startX, worldCoords.x),
                    y: Math.min(this.startY, worldCoords.y),
                    width: Math.abs(width),
                    height: Math.abs(height)
                };
            }
        } else if (this.selectedTool === "elip") {
            // Prevent creating zero-size ellipses
            if (Math.abs(width) > 1 && Math.abs(height) > 1) {
                shape = {
                    type: "elip",
                    centerX: (this.startX + worldCoords.x) / 2,
                    centerY: (this.startY + worldCoords.y) / 2,
                    radiusX: Math.abs(width / 2),
                    radiusY: Math.abs(height / 2)
                };
            }
        } else if (this.selectedTool === "line") {
            // Prevent creating zero-length lines
            const distance = Math.sqrt(width * width + height * height);
            if (distance > 1) {
                shape = {
                    type: "line",
                    startX: this.startX,
                    startY: this.startY,
                    endX: worldCoords.x,
                    endY: worldCoords.y
                };
            }
        } else if (this.selectedTool === "pencil") {
            if (this.isDrawing) {
                this.isDrawing = false;

                // Ensure we have at least two points
                if (this.pencilCoords.length === 1) {
                    this.pencilCoords.push({
                        x: this.pencilCoords[0].x + 0.1,
                        y: this.pencilCoords[0].y + 0.1
                    });
                }

                shape = {
                    type: "pencil",
                    pencilCoords: [...this.pencilCoords]
                };
            }
        } else if (this.selectedTool === "text") {
            this.activeTextBox = new TextBox(
                e.clientX,
                e.clientY,
                worldCoords.x,
                worldCoords.y,
                "",
                this.context,
                this.scale,
                this, "#ffffff", 2, 20
            );
            return;
        } else if (this.selectedTool === "grab") {
            // Just finish the grab operation
            this.savePanPostions();
            this.saveScale();
        }

        if (shape) {
            this.existingShapes.push(shape);

            this.socket.send(JSON.stringify({
                type: "chat",
                message: JSON.stringify(shape),
                roomId: this.roomId
            }));

            // Set tool to cursor after drawing is complete
            this.setTool("cursor");

            // Notify parent component about tool change
            if (this.onToolChange) {
                this.onToolChange("cursor");
            }
        }

        if (this.onPanChange) {
            this.onPanChange(false);
        }
    }
}


// else if (this.selectedTool === "pencil") {
//     if (this.isDrawing) {
//         this.pencilCoords.push({ x: worldCoords.x, y: worldCoords.y });
//         this.render();

//         // Draw current pencil stroke
//         this.context.save();
//         this.context.setTransform(this.scale, 0, 0, this.scale, this.panX, this.panY);


//         if (this.pencilCoords.length > 0) {
//             this.context.beginPath();
//             this.context.strokeStyle = "rgba(255, 255, 255)";
//             this.context.lineWidth = 2 / this.scale; // Scale-independent line width
//             this.context.lineCap = "round";
//             this.context.lineJoin = "round";
//             this.context.moveTo(this.pencilCoords[0].x, this.pencilCoords[0].y);
//             for (let i = 1; i < this.pencilCoords.length; i++) {
//                 this.context.lineTo(this.pencilCoords[i].x, this.pencilCoords[i].y);
//             }
//             this.context.stroke();
//         }
//         this.context.restore();
//     }
// }





// resetZoom() {
//     this.scale = 1;
//     this.panX = 0;
//     this.panY = 0;
//     this.render();
// }

// fitToCanvas() {
//     if (this.existingShapes.length === 0) {
//         this.resetZoom();
//         return;
//     }

//     // Calculate bounding box of all shapes
//     let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

//     this.existingShapes.forEach(shape => {
//         if (shape.type === "rect") {
//             minX = Math.min(minX, shape.x);
//             minY = Math.min(minY, shape.y);
//             maxX = Math.max(maxX, shape.x + shape.width);
//             maxY = Math.max(maxY, shape.y + shape.height);
//         } else if (shape.type === "elip") {
//             minX = Math.min(minX, shape.centerX - shape.radiusX);
//             minY = Math.min(minY, shape.centerY - shape.radiusY);
//             maxX = Math.max(maxX, shape.centerX + shape.radiusX);
//             maxY = Math.max(maxY, shape.centerY + shape.radiusY);
//         } else if (shape.type === "line") {
//             minX = Math.min(minX, shape.startX, shape.endX);
//             minY = Math.min(minY, shape.startY, shape.endY);
//             maxX = Math.max(maxX, shape.startX, shape.endX);
//             maxY = Math.max(maxY, shape.startY, shape.endY);
//         } else if (shape.type === "pencil") {
//             shape.pencilCoords.forEach(coord => {
//                 minX = Math.min(minX, coord.x);
//                 minY = Math.min(minY, coord.y);
//                 maxX = Math.max(maxX, coord.x);
//                 maxY = Math.max(maxY, coord.y);
//             });
//         } else if (shape.type === "text") {
//             minX = Math.min(minX, shape.x);
//             minY = Math.min(minY, shape.y);
//             maxX = Math.max(maxX, shape.x + 200); // Approximate text width
//             maxY = Math.max(maxY, shape.y + 20);
//         }
//     });

//     const contentWidth = maxX - minX;
//     const contentHeight = maxY - minY;
//     const padding = 50;

//     const scaleX = (this.canvas.width - padding * 2) / contentWidth;
//     const scaleY = (this.canvas.height - padding * 2) / contentHeight;

//     this.scale = Math.min(scaleX, scaleY, this.maxScale);
//     this.scale = Math.max(this.scale, this.minScale);

//     // Center the content
//     const centerX = (minX + maxX) / 2;
//     const centerY = (minY + maxY) / 2;

//     this.panX = this.canvas.width / 2 - centerX * this.scale;
//     this.panY = this.canvas.height / 2 - centerY * this.scale;

//     this.render();
// }

    // // Zoom control methods
    // zoomIn(factor: number = 1.2, centerX?: number, centerY?: number) {
    //     const newScale = this.scale * factor;
    //     if (newScale <= this.maxScale) {
    //         this.zoomToPoint(newScale, centerX, centerY);
    //     }
    // }

    // zoomOut(factor: number = 1.2, centerX?: number, centerY?: number) {
    //     const newScale = this.scale / factor;
    //     if (newScale >= this.minScale) {
    //         this.zoomToPoint(newScale, centerX, centerY);
    //     }
    // }

    // // Helper method to zoom to a specific point
    // private zoomToPoint(newScale: number, centerX?: number, centerY?: number) {
    //     // Default to canvas center if no point specified
    //     const zoomCenterX = centerX ?? this.canvas.width / 2;
    //     const zoomCenterY = centerY ?? this.canvas.height / 2;

    //     // Calculate world position before zoom
    //     const worldPosBefore = {
    //         x: (zoomCenterX - this.panX) / this.scale,
    //         y: (zoomCenterY - this.panY) / this.scale
    //     };

    //     // Apply new scale
    //     this.scale = newScale;

    //     // Adjust pan to keep the zoom center point fixed
    //     this.panX = zoomCenterX - worldPosBefore.x * this.scale;
    //     this.panY = zoomCenterY - worldPosBefore.y * this.scale;

    //     this.render();
    // }
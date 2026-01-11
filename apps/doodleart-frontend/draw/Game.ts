// Oldest polished version
// zoom and pan works fast as excalidraw
//----------------------------------------------------------------------------------------------------------------------------------------------

import { Tool } from "@/components/Canvas/Canvas";
import { getExistingShapes, getID } from "./Http";
import { TextBox } from "./TextBox";

export type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
      id?: number;
      pid?: string;
    }
  | {
      type: "elip";
      centerX: number;
      centerY: number;
      radiusX: number;
      radiusY: number;
      id?: number;
      pid?: string;
    }
  | {
      type: "line";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      id?: number;
      pid?: string;
    }
  | {
      type: "pencil";
      pencilCoords: Array<{ x: number; y: number }>;
      id?: number;
      pid?: string;
    }
  | {
      type: "text";
      x: number;
      y: number;
      content: string;
      id?: number;
      pid?: string;
      width: number;
      nol: number;
    }
  | {
      type: "diamond";
      x: number;
      y: number;
      width: number;
      height: number;
      id?: number;
      pid?: string;
    }
  | {
      type: "cursor";
      id?: number;
      pid?: string;
    }
  | {
      type: "grab";
      id?: number;
      pid?: string;
    };

export class Game {
  private scale: number;
  private minScale: number = 0.1;
  private maxScale: number = 10;
  activeTextBox: TextBox | undefined;
  canvas: HTMLCanvasElement;
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
  private selectedTool = "grab";
  private pencilCoords: Array<{ x: number; y: number }> = [];
  private isDrawing = false;
  socket: WebSocket;
  private canvasRect: DOMRect;
  onToolChange: ((tool: Tool) => void) | null = null;
  onPanChange: ((status: boolean) => void) | null = null;
  onSelectChange: ((status: boolean) => void) | null = null;
  private lastScale: number;
  private lastSavedPan: { x: number; y: number } = { x: 0, y: 0 };
  private savePanTimeout: number | undefined;
  private saveScaleTimeout: number | undefined;
  public isSelecting: boolean;
  public detectedShape: Shape | null;
  public selectedShape: Shape | null;
  private lastMouseShapeX = 0;
  private lastMouseShapeY = 0;
  isWriting: boolean;
  private sharedKey: string;
  private clipboard: Shape | null;
  private liveMouseX: number;
  private liveMouseY: number;
  private canvasThemeStyle: string;
  private canvasBgColor: string;
  private canvasStrokeColor: string;
  private canvasStrokeWidth: number;
  private canvasFontType: string;
  private canvasFontColor: string;
  private canvasPreviewStrokeColor: string;
  private canvasPreviewStrokeWidth: number;
  private canvasSelectorStroke: string;
  private canvasSelectorStrokeWidth: number;
  private canvasFontSize: number;
  private canvasFontVerticalOffset: number;
  private dpr: number;
  private isLocked: boolean;

  // Constructor
  constructor(
    canvas: HTMLCanvasElement,
    roomId: string,
    socket: WebSocket,
    sharedKey: string,
  ) {
    this.dpr = window.devicePixelRatio || 1;
    this.canvas = canvas;
    this.context = canvas.getContext("2d", { alpha: false })!;
    this.existingShapes = [];
    this.roomId = roomId;
    this.socket = socket;
    this.clicked = false;
    this.scale = 1;
    this.panX = 0;
    this.panY = 0;
    this.canvasRect = canvas.getBoundingClientRect();
    this.lastScale = this.scale = Number(localStorage.getItem("scale")) || 1;
    this.lastSavedPan.x = this.panX = Number(localStorage.getItem("px")) || 0;
    this.lastSavedPan.y = this.panY = Number(localStorage.getItem("py")) || 0;
    this.isSelecting = false;
    this.detectedShape = null;
    this.selectedShape = null;
    this.isWriting = false;
    this.sharedKey = sharedKey;
    this.clipboard = null;
    this.liveMouseX = 0;
    this.liveMouseY = 0;
    this.canvasThemeStyle = "b";
    this.canvasBgColor = "#121212";
    this.canvasStrokeColor = "white";
    this.canvasStrokeWidth = 3;
    this.canvasPreviewStrokeColor = "white";
    this.canvasPreviewStrokeWidth = 3;
    this.canvasSelectorStroke = "#aba8ff";
    this.canvasSelectorStrokeWidth = 1;

    this.canvasFontType = "Finger Paint";
    this.canvasFontColor = "white";
    this.canvasFontSize = 20;
    this.canvasFontVerticalOffset = 8;
    this.isLocked = false;
    this.init();
    this.initHandlers();
    this.initMouseHandlers();
    this.initZoomHandlers();
  }

  // Canvas intializers (helper functions)
  async init() {
    try {
      this.existingShapes = await getExistingShapes(
        this.roomId,
        this.sharedKey,
      );
      const themeState = localStorage.getItem("theme") || "b";
      this.setTheme(themeState);
      if (this.onToolChange) {
        this.onToolChange("grab");
      }
    } catch {
      this.existingShapes = [];
    }
    this.render();
  }

  initHandlers() {
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "chat-insert") {
        const publicId = message.publicId;
        this.panX = Number(localStorage.getItem("px")) || 0;
        this.panY = Number(localStorage.getItem("py")) || 0;
        this.scale = Number(localStorage.getItem("scale")) || 1;

        const parsedShape: Shape = JSON.parse(message.message);
        const newShape: Shape = {
          ...parsedShape,
          id: undefined,
          pid: publicId,
        };

        this.existingShapes.push(newShape);
        this.render();
      } else if (message.type === "chat-update") {
        this.panX = Number(localStorage.getItem("px")) || 0;
        this.panY = Number(localStorage.getItem("py")) || 0;
        this.scale = Number(localStorage.getItem("scale")) || 1;
        const newShape: Shape = JSON.parse(message.message);
        const chatId = message.chatId;
        const publicId = message.publicId;
        const finalShape = { ...newShape, id: chatId, pid: publicId };

        this.removeShape(chatId, publicId);
        this.existingShapes.push(finalShape);

        this.render();
      } else if (message.type === "chat-delete") {
        const chatId = message.chatId;
        const publicId = message.publicId;
        this.removeShape(chatId, publicId);
        this.render();
      }
    };
  }

  initMouseHandlers() {
    this.canvas.addEventListener("pointerdown", this.pointDownHandler);
    window.addEventListener("pointerup", this.pointUpHandler);
    window.addEventListener("pointermove", this.pointMoveHandler);
    this.canvas.addEventListener("dblclick", this.doubleClickHandler);
    window.addEventListener("keydown", this.keyDownHandler);
  }

  initZoomHandlers() {
    this.canvas.addEventListener("wheel", this.wheelHandler, {
      passive: false,
    });
    document.addEventListener("wheel", this.preventBrowserZoom, {
      passive: false,
    });
  }

  // Canvas State setters
  setTool(tool: Tool) {
    this.selectedTool = tool;

    // Reset any ongoing drawing
    this.isDrawing = false;
    this.clicked = false;
    this.pencilCoords = [];

    this.updateCanvasRect();
  }

  setTheme(themeStateValue: string) {
    this.canvasThemeStyle = themeStateValue;
    if (this.canvasThemeStyle === "b") {
      // dark theme enable
      this.canvasBgColor = "#121212";
      this.canvasStrokeColor = "white";
      this.canvasFontColor = "white";
      this.canvasPreviewStrokeColor = "white";
      this.canvasSelectorStroke = "#aba8ff";
    } else {
      // light theme enable
      this.canvasBgColor = "#ffffff";
      this.canvasStrokeColor = "black";
      this.canvasFontColor = "black";
      this.canvasPreviewStrokeColor = "black";
      this.canvasSelectorStroke = "#834aff";
    }
  }

  setLock(lock: boolean) {
    this.isLocked = lock;
  }

  // CallbackFunc for UI
  registerToolChangeCallback(callback: (tool: Tool) => void) {
    this.onToolChange = callback;
  }

  registerPanningCallback(callback: (status: boolean) => void) {
    this.onPanChange = callback;
  }

  registerSelectingCallback(callback: (status: boolean) => void) {
    this.onSelectChange = callback;
  }

  preventBrowserZoom = (e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
    }
  };

  // EventHandlers
  pointDownHandler = (e: PointerEvent) => {
    this.updateCanvasRect();

    this.clicked = true;

    const worldCoords = this.screenToWorld(e.clientX, e.clientY);
    this.startX = worldCoords.x;
    this.startY = worldCoords.y;
    this.detectedShape = null;
    this.selectedShape = null;
    this.isSelecting = false;

    if (this.onPanChange) {
      this.onPanChange(true);
    }

    if (this.selectedTool === "cursor") {
      const shapeOnClick = this.getElement(worldCoords.x, worldCoords.y);
      if (shapeOnClick) {
        this.detectedShape = shapeOnClick;
        this.selectedShape = shapeOnClick;
        this.isSelecting = true;
        const screenCoords = this.getCanvasCoordinates(e.clientX, e.clientY);
        this.lastMouseShapeX = screenCoords.x;
        this.lastMouseShapeY = screenCoords.y;
      }
      this.render();
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
  };

  pointMoveHandler = (e: PointerEvent) => {
    const worldCoords = this.screenToWorld(e.clientX, e.clientY);
    const screenCoords = this.getCanvasCoordinates(e.clientX, e.clientY);

    if (!this.clicked) {
      this.liveMouseX = worldCoords.x;
      this.liveMouseY = worldCoords.y;
      if (this.selectedTool === "cursor") {
        const worldCoords = this.screenToWorld(e.clientX, e.clientY);
        const shape = this.getElement(worldCoords.x, worldCoords.y);

        if (shape!) {
          if (this.onSelectChange) {
            this.onSelectChange(true);
          }
          return;
        }

        if (this.onSelectChange) {
          this.onSelectChange(false);
        }
      }
      return;
    }

    // individual shape movement
    if (
      this.selectedTool === "cursor" &&
      this.isSelecting &&
      this.selectedShape
    ) {
      const deltaX = screenCoords.x - this.lastMouseShapeX;
      const deltaY = screenCoords.y - this.lastMouseShapeY;

      const worldDeltaX = deltaX / this.scale;
      const worldDeltaY = deltaY / this.scale;

      this.lastMouseShapeX = screenCoords.x;
      this.lastMouseShapeY = screenCoords.y;
      this.removeShape(this.selectedShape.id, this.selectedShape.pid);
      if (this.selectedShape?.type === "rect") {
        const newShape = { ...this.selectedShape };
        newShape.x += worldDeltaX;
        newShape.y += worldDeltaY;
        this.selectedShape = newShape;
        this.existingShapes.push(newShape);
      } else if (this.selectedShape.type === "elip") {
        const newShape = { ...this.selectedShape };
        newShape.centerX += worldDeltaX;
        newShape.centerY += worldDeltaY;
        this.selectedShape = newShape;
        this.existingShapes.push(newShape);
      } else if (this.selectedShape.type === "line") {
        const newShape = { ...this.selectedShape };
        newShape.startX += worldDeltaX;
        newShape.startY += worldDeltaY;
        newShape.endX += worldDeltaX;
        newShape.endY += worldDeltaY;
        this.selectedShape = newShape;
        this.existingShapes.push(newShape);
      } else if (this.selectedShape.type === "pencil") {
        const newShape = {
          ...this.selectedShape,
          pencilCoords: this.selectedShape.pencilCoords.map((p) => ({ ...p })),
        };
        const len = newShape.pencilCoords.length;
        for (let i = 0; i < len; i++) {
          newShape.pencilCoords[i].x += worldDeltaX;
          newShape.pencilCoords[i].y += worldDeltaY;
        }
        this.selectedShape = newShape;
        this.existingShapes.push(newShape);
      } else if (this.selectedShape.type === "text") {
        const newShape = { ...this.selectedShape };
        newShape.x += worldDeltaX;
        newShape.y += worldDeltaY;
        this.selectedShape = newShape;
        this.existingShapes.push(newShape);
      } else if (this.selectedShape.type === "diamond") {
        const newShape = { ...this.selectedShape };
        newShape.x += worldDeltaX;
        newShape.y += worldDeltaY;
        this.selectedShape = newShape;
        this.existingShapes.push(newShape);
      }

      this.render();
    }

    // panning
    else if (this.selectedTool === "grab") {
      // Handle panning
      const deltaX = screenCoords.x - this.lastMouseX;
      const deltaY = screenCoords.y - this.lastMouseY;

      this.panX += deltaX;
      this.panY += deltaY;

      this.lastMouseX = screenCoords.x;
      this.lastMouseY = screenCoords.y;

      this.render();
    } else if (this.selectedTool === "pencil") {
      if (this.isDrawing) {
        const newPoint = { x: worldCoords.x, y: worldCoords.y };
        this.pencilCoords.push(newPoint);

        // Only draw the new segment, not the entire stroke
        if (this.pencilCoords.length > 1) {
          const lastIndex = this.pencilCoords.length - 1;
          const prevPoint = this.pencilCoords[lastIndex - 1];

          this.context.save();
          this.context.setTransform(
            this.scale * this.dpr,
            0,
            0,
            this.scale * this.dpr,
            this.panX * this.dpr,
            this.panY * this.dpr,
          );

          this.context.beginPath();
          this.context.strokeStyle = this.canvasPreviewStrokeColor;
          this.context.lineWidth = this.canvasPreviewStrokeWidth;
          this.context.lineCap = "round";
          this.context.lineJoin = "round";
          this.context.moveTo(prevPoint.x, prevPoint.y);
          this.context.lineTo(newPoint.x, newPoint.y);
          this.context.stroke();

          this.context.restore();
        }
      }
    } else if (
      this.selectedTool === "rect" ||
      this.selectedTool === "elip" ||
      this.selectedTool === "line" ||
      this.selectedTool === "diamond"
    ) {
      this.render();

      this.context.save();
      this.context.strokeStyle = this.canvasPreviewStrokeColor;
      this.context.lineWidth = this.canvasPreviewStrokeWidth;
      this.context.setTransform(
        this.scale * this.dpr,
        0,
        0,
        this.scale * this.dpr,
        this.panX * this.dpr,
        this.panY * this.dpr,
      );
      this.drawPreview(
        { x: this.startX, y: this.startY },
        { x: worldCoords.x, y: worldCoords.y },
      );
      this.context.restore();
    }
  };

  pointUpHandler = (e: PointerEvent) => {
    if (!this.clicked) return;
    this.clicked = false;

    const worldCoords = this.screenToWorld(e.clientX, e.clientY);
    const width = worldCoords.x - this.startX;
    const height = worldCoords.y - this.startY;
    this.liveMouseX = worldCoords.x;
    this.liveMouseY = worldCoords.y;

    let shape: Shape | null = null;

    if (this.onPanChange) {
      this.onPanChange(false);
    }

    if (this.selectedTool === "rect") {
      // Prevent creating zero-size rectangles
      if (Math.abs(width) > 1 && Math.abs(height) > 1) {
        shape = {
          type: "rect",
          x: Math.min(this.startX, worldCoords.x),
          y: Math.min(this.startY, worldCoords.y),
          width: Math.abs(width),
          height: Math.abs(height),
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
          radiusY: Math.abs(height / 2),
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
          endY: worldCoords.y,
        };
      }
    } else if (this.selectedTool === "pencil") {
      if (this.isDrawing) {
        this.isDrawing = false;

        // Ensure we have at least two points
        if (this.pencilCoords.length === 1) {
          this.pencilCoords.push({
            x: this.pencilCoords[0].x + 0.1,
            y: this.pencilCoords[0].y + 0.1,
          });
        }

        shape = {
          type: "pencil",
          pencilCoords: [...this.pencilCoords],
        };
      }
    } else if (this.selectedTool === "diamond") {
      if (Math.abs(width) > 1 && Math.abs(height) > 1) {
        shape = {
          type: "diamond",
          x: Math.min(this.startX, worldCoords.x),
          y: Math.min(this.startY, worldCoords.y),
          width: Math.abs(width),
          height: Math.abs(height),
        };
      }
    } else if (this.selectedTool === "grab") {
      // Just finish the grab operation
      this.savePanPostions();
      this.saveScale();
    } else if (
      this.selectedTool === "cursor" &&
      this.selectedShape &&
      this.detectedShape
    ) {
      if (this.checkDifference(this.selectedShape, this.detectedShape)) {
        this.socket.send(
          JSON.stringify({
            type: "chat-update",
            message: JSON.stringify(this.selectedShape),
            roomId: this.roomId,
            chatId: this.selectedShape?.id,
            publicId: this.selectedShape.pid,
          }),
        );
      }
    } else if (this.selectedTool === "text" && !this.isWriting) {
      this.activeTextBox = new TextBox(
        e.clientX,
        e.clientY,
        worldCoords.x,
        worldCoords.y,
        this.context,
        this.scale,
        this,
        this.canvasFontColor,
        this.canvasFontSize,
        this.canvasFontType,
        this.canvasFontVerticalOffset,
        this.isLocked,
      );
    }

    if (shape) {
      const chatid = getID();
      const newShape: Shape = { ...shape, id: undefined, pid: chatid };
      this.existingShapes.push(newShape);

      if (!this.isLocked) {
        this.detectedShape = newShape;
        this.selectedShape = newShape;
        this.isSelecting = true;
        this.setTool("cursor");
        if (this.onToolChange) {
          this.onToolChange("cursor");
        }
      }

      this.render();

      this.socket.send(
        JSON.stringify({
          type: "chat-insert",
          message: JSON.stringify(shape),
          roomId: this.roomId,
          publicId: chatid,
        }),
      );
    }
  };

  doubleClickHandler = (e: MouseEvent) => {
    if (
      this.selectedTool === "cursor" &&
      !this.isSelecting &&
      !this.isWriting
    ) {
      const worldCoords = this.screenToWorld(e.clientX, e.clientY);
      this.activeTextBox = new TextBox(
        e.clientX,
        e.clientY,
        worldCoords.x,
        worldCoords.y,
        this.context,
        this.scale,
        this,
        this.canvasFontColor,
        this.canvasFontSize,
        this.canvasFontType,
        this.canvasFontVerticalOffset,
        this.isLocked,
      );
    }
  };

  keyDownHandler = (e: KeyboardEvent) => {
    if (!this.isWriting) {
      if (e.key === "1") {
        this.setTool("cursor");
        if (this.onToolChange) {
          this.onToolChange("cursor");
        }
      } else if (e.key === "2") {
        this.setTool("rect");
        if (this.onToolChange) {
          this.onToolChange("rect");
        }
      } else if (e.key === "3") {
        this.setTool("diamond");
        if (this.onToolChange) {
          this.onToolChange("diamond");
        }
      } else if (e.key === "4") {
        this.setTool("elip");
        if (this.onToolChange) {
          this.onToolChange("elip");
        }
      } else if (e.key === "5") {
        this.setTool("line");
        if (this.onToolChange) {
          this.onToolChange("line");
        }
      } else if (e.key === "6") {
        this.setTool("pencil");
        if (this.onToolChange) {
          this.onToolChange("pencil");
        }
      } else if (e.key === "7") {
        this.setTool("text");
        if (this.onToolChange) {
          this.onToolChange("text");
        }
      } else if (e.key === "Delete" && this.selectedShape) {
        const shapeId = this.selectedShape.id;
        const publicId = this.selectedShape.pid;
        this.removeShape(shapeId, publicId);
        this.detectedShape = null;
        this.selectedShape = null;
        this.isSelecting = false;
        this.render();
        if (this.onSelectChange) {
          this.onSelectChange(false);
        }
        this.socket.send(
          JSON.stringify({
            type: "chat-delete",
            roomId: this.roomId,
            chatId: shapeId,
            publicId: publicId,
          }),
        );
      } else if (
        e.ctrlKey &&
        (e.key === "c" || e.key === "C") &&
        this.selectedShape
      ) {
        const data = this.selectedShape;
        const type = data.type;
        if (type === "rect") {
          this.clipboard = {
            type: type,
            x: this.liveMouseX,
            y: this.liveMouseY,
            width: data.width,
            height: data.height,
          };
        } else if (type === "elip") {
          this.clipboard = {
            type: type,
            centerX: this.liveMouseX,
            centerY: this.liveMouseY,
            radiusX: data.radiusX,
            radiusY: data.radiusY,
          };
        } else if (type === "line") {
          const w = data.endX - data.startX;
          const h = data.endY - data.startY;
          this.clipboard = {
            type: type,
            startX: this.liveMouseX,
            startY: this.liveMouseY,
            endX: this.liveMouseX + w,
            endY: this.liveMouseY + h,
          };
        } else if (type === "text") {
          this.clipboard = {
            type: type,
            x: this.liveMouseX,
            y: this.liveMouseY,
            content: data.content,
            width: data.width,
            nol: data.nol,
          };
        } else if (type === "diamond") {
          const sx = this.liveMouseX - data.width / 2;
          const sy = this.liveMouseY - data.height / 2;
          this.clipboard = {
            type: type,
            x: sx,
            y: sy,
            width: data.width,
            height: data.height,
          };
        }
      } else if (
        e.ctrlKey &&
        (e.key === "v" || e.key === "V") &&
        this.clipboard
      ) {
        const data = this.clipboard;
        const type = data.type;
        if (type === "rect") {
          this.clipboard = {
            type: type,
            x: this.liveMouseX,
            y: this.liveMouseY,
            width: data.width,
            height: data.height,
          };
        } else if (type === "elip") {
          this.clipboard = {
            type: type,
            centerX: this.liveMouseX,
            centerY: this.liveMouseY,
            radiusX: data.radiusX,
            radiusY: data.radiusY,
          };
        } else if (type === "line") {
          const w = data.endX - data.startX;
          const h = data.endY - data.startY;
          this.clipboard = {
            type: type,
            startX: this.liveMouseX,
            startY: this.liveMouseY,
            endX: this.liveMouseX + w,
            endY: this.liveMouseY + h,
          };
        } else if (type === "text") {
          this.clipboard = {
            type: type,
            x: this.liveMouseX,
            y: this.liveMouseY,
            content: data.content,
            width: data.width,
            nol: data.nol,
          };
        } else if (type === "diamond") {
          const sx = this.liveMouseX - data.width / 2;
          const sy = this.liveMouseY - data.height / 2;
          this.clipboard = {
            type: type,
            x: sx,
            y: sy,
            width: data.width,
            height: data.height,
          };
        }

        const payload = this.clipboard;

        // Nerfing it to the one time operation, because I am Broke
        this.clipboard = null;
        this.selectedShape = null;
        const chatid = getID();
        const newShape: Shape = { ...payload, id: undefined, pid: chatid };
        this.detectedShape = newShape;
        this.selectedShape = newShape;
        this.isSelecting = true;
        this.existingShapes.push(newShape);
        this.render();
        this.socket.send(
          JSON.stringify({
            type: "chat-insert",
            message: JSON.stringify(payload),
            roomId: this.roomId,
            publicId: chatid,
          }),
        );
      }
    }
  };

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
      y: (mouseCanvasPos.y - this.panY) / this.scale,
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
  };

  // Canvas coordinates manipulate functions
  savePanPostions = () => {
    if (
      this.panX !== this.lastSavedPan.x ||
      this.panY !== this.lastSavedPan.y
    ) {
      clearTimeout(this.savePanTimeout);
      this.savePanTimeout = window.setTimeout(() => {
        localStorage.setItem("px", String(this.panX));
        localStorage.setItem("py", String(this.panY));
      }, 300);
      this.lastSavedPan = { x: this.panX, y: this.panY };
    }
  };

  saveScale = () => {
    if (this.scale !== this.lastScale) {
      clearTimeout(this.saveScaleTimeout);
      this.saveScaleTimeout = window.setTimeout(() => {
        localStorage.setItem("scale", String(this.scale));
      }, 300);
      this.lastScale = this.scale;
    }
  };

  updateCanvasRect = () => {
    const newRect = this.canvas.getBoundingClientRect();

    // Only update if there's a significant change to prevent unnecessary updates
    if (
      !this.canvasRect ||
      Math.abs(newRect.left - this.canvasRect.left) > 1 ||
      Math.abs(newRect.top - this.canvasRect.top) > 1 ||
      Math.abs(newRect.width - this.canvasRect.width) > 1 ||
      Math.abs(newRect.height - this.canvasRect.height) > 1
    ) {
      this.canvasRect = newRect;
    }
  };

  screenToWorld(screenX: number, screenY: number) {
    const canvasCoords = this.getCanvasCoordinates(screenX, screenY);
    return {
      x: (canvasCoords.x - this.panX) / this.scale,
      y: (canvasCoords.y - this.panY) / this.scale,
    };
  }

  getCanvasCoordinates(clientX: number, clientY: number) {
    return {
      x: clientX - this.canvasRect.left,
      y: clientY - this.canvasRect.top,
    };
  }

  // Display Functions
  isShapeVisible(shape: Shape): boolean {
    const margin = 50; // Extra margin for partially visible shapes
    const viewportLeft = -this.panX / this.scale - margin;
    const viewportTop = -this.panY / this.scale - margin;
    const viewportRight =
      viewportLeft + this.canvas.width / this.scale + margin;
    const viewportBottom =
      viewportTop + this.canvas.height / this.scale + margin;

    // Check bounds based on shape type
    switch (shape.type) {
      case "rect":
        return (
          shape.x < viewportRight &&
          shape.x + shape.width > viewportLeft &&
          shape.y < viewportBottom &&
          shape.y + shape.height > viewportTop
        );
      case "elip":
        return (
          shape.centerX - shape.radiusX < viewportRight &&
          shape.centerX + shape.radiusX > viewportLeft &&
          shape.centerY - shape.radiusY < viewportBottom &&
          shape.centerY + shape.radiusY > viewportTop
        );
      case "line":
        const minX = Math.min(shape.startX, shape.endX);
        const maxX = Math.max(shape.startX, shape.endX);
        const minY = Math.min(shape.startY, shape.endY);
        const maxY = Math.max(shape.startY, shape.endY);
        return (
          minX < viewportRight &&
          maxX > viewportLeft &&
          minY < viewportBottom &&
          maxY > viewportTop
        );
      case "pencil":
        // Check if any part of pencil stroke is visible
        return shape.pencilCoords.some(
          (coord) =>
            coord.x >= viewportLeft &&
            coord.x <= viewportRight &&
            coord.y >= viewportTop &&
            coord.y <= viewportBottom,
        );
      default:
        return true;
    }
  }

  highDPI(dpr: number) {
    const rect = this.canvas.getBoundingClientRect();

    this.dpr = dpr;

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;

    this.updateCanvasRect();
  }

  render() {
    this.context.save();

    this.context.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.fillStyle = this.canvasBgColor;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.setTransform(
      this.scale * this.dpr,
      0,
      0,
      this.scale * this.dpr,
      this.panX * this.dpr,
      this.panY * this.dpr,
    );

    this.context.strokeStyle = this.canvasStrokeColor;
    this.context.lineWidth = this.canvasStrokeWidth;
    this.context.font = `${this.canvasFontSize}px ${this.canvasFontType}`;
    this.context.fillStyle = this.canvasFontColor;

    this.existingShapes.forEach((shape) => {
      if (this.isShapeVisible(shape)) {
        this.drawShape(shape);
      }
    });

    if (this.selectedShape && this.isSelecting) {
      this.selector(this.selectedShape);
    }

    this.context.restore();
  }

  // Shape Detection Functions
  getElement = (x: number, y: number) => {
    for (let i = this.existingShapes.length - 1; i >= 0; i--) {
      if (this.checkElement(this.existingShapes[i], x, y)) {
        return this.existingShapes[i];
      }
    }
    return undefined;
  };

  checkElement = (shape: Shape, x: number, y: number) => {
    if (shape.type === "rect") {
      const x1 = shape.x;
      const y1 = shape.y;
      const x2 = shape.x + shape.width;
      const y2 = shape.y + shape.height;

      // return (x > x1 && x < x2 && y > y1 && y < y2);
      const tolerance = 10 / this.scale;
      const onLeft = y >= y1 && y <= y2 && Math.abs(x - x1) <= tolerance;
      const onRight = y >= y1 && y <= y2 && Math.abs(x - x2) <= tolerance;
      const onTop = x >= x1 && x <= x2 && Math.abs(y - y1) <= tolerance;
      const onBottom = x >= x1 && x <= x2 && Math.abs(y - y2) <= tolerance;

      return onLeft || onRight || onTop || onBottom;
    } else if (shape.type === "elip") {
      const h = shape.centerX;
      const k = shape.centerY;
      const a = shape.radiusX;
      const b = shape.radiusY;
      const p = ((x - h) * (x - h)) / (a * a) + ((y - k) * (y - k)) / (b * b);
      // return p <= 1.0;
      const tolerance = 0.15 / this.scale; // smaller → stricter edge detection
      return Math.abs(p - 1) <= tolerance;
    } else if (shape.type === "line") {
      return this.lineCheck(
        x,
        y,
        shape.startX,
        shape.startY,
        shape.endX,
        shape.endY,
      );
    } else if (shape.type === "pencil") {
      const len = shape.pencilCoords.length;

      for (let i = 1; i < len; i++) {
        const xi = shape.pencilCoords[i - 1].x;
        const yi = shape.pencilCoords[i - 1].y;
        const xf = shape.pencilCoords[i].x;
        const yf = shape.pencilCoords[i].y;
        if (this.lineCheck(x, y, xi, yi, xf, yf)) {
          return true;
        }
      }

      return false;
    } else if (shape.type === "text") {
      const textWidth = shape.width || 150;
      const nol = shape.nol || 1;
      const offset = this.canvasFontVerticalOffset;
      const lineHeight = 1.2 * this.canvasFontSize;

      // tolerance in pixels
      const tol = 12 / this.scale;

      const sx = shape.x - tol;
      const sy = shape.y + offset - tol;
      const ex = shape.x + textWidth + tol;
      const ey = shape.y + nol * lineHeight + offset + tol;

      return sx <= x && x <= ex && sy <= y && y <= ey;
    } else if (shape.type === "diamond") {
      const cx = shape.x + shape.width / 2;
      const cy = shape.y + shape.height / 2;
      const hw = shape.width / 2;
      const hh = shape.height / 2;

      const dx = Math.abs(x - cx);
      const dy = Math.abs(y - cy);
      const t = 0.1;
      const d = dx / hw + dy / hh;

      return d >= 1 - t && d <= 1 + t;
    } else {
      return false;
    }
  };

  lineCheck = (
    x: number,
    y: number,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
  ) => {
    const a1 = startX;
    const b1 = startY;
    const a2 = endX;
    const b2 = endY;

    const dx = a2 - a1;
    const dy = b2 - b1;

    const length = Math.hypot(dx, dy);
    if (length === 0) return false; // Avoid divide by zero on a degenerate line

    const cross = dy * (x - a1) - dx * (y - b1);
    const distToLine = Math.abs(cross) / length;

    const tolerance = 10 / this.scale;
    if (distToLine > tolerance) return false;

    const withinX =
      x >= Math.min(a1, a2) - tolerance && x <= Math.max(a1, a2) + tolerance;
    const withinY =
      y >= Math.min(b1, b2) - tolerance && y <= Math.max(b1, b2) + tolerance;

    return withinX && withinY;
  };

  // Shape Highlighter Functions
  selector = (shape: Shape) => {
    this.context.strokeStyle = this.canvasSelectorStroke;
    this.context.lineWidth = this.canvasSelectorStrokeWidth / this.scale;
    if (shape.type === "rect") {
      const X = shape.x;
      const Y = shape.y;
      const H = shape.height;
      const W = shape.width;
      this.selectorShape(X, Y, W, H);
    } else if (shape.type === "elip") {
      const X = shape.centerX - shape.radiusX;
      const Y = shape.centerY - shape.radiusY;
      const W = 2 * shape.radiusX;
      const H = 2 * shape.radiusY;
      this.selectorShape(X, Y, W, H);
    } else if (shape.type === "line") {
      const sx = shape.startX;
      const sy = shape.startY;
      const ex = shape.endX;
      const ey = shape.endY;

      if (sx < ex && sy < ey) {
        const X = sx;
        const Y = sy;
        const W = ex - sx;
        const H = ey - sy;
        this.selectorShape(X, Y, W, H);
      } else if (ex < sx && ey < sy) {
        const X = ex;
        const Y = ey;
        const W = sx - ex;
        const H = sy - ey;
        this.selectorShape(X, Y, W, H);
      } else if (sx == ex && sy < ey) {
        const X = sx - 2;
        const Y = sy;
        const W = 4;
        const H = ey - sy;
        this.selectorShape(X, Y, W, H);
      } else if (sx == ex && ey < sy) {
        const X = ex - 2;
        const Y = ey;
        const W = 4;
        const H = sy - ey;
        this.selectorShape(X, Y, W, H);
      } else if (sx < ex && ey < sy) {
        const X = sx;
        const Y = ey;
        const W = ex - sx;
        const H = sy - ey;
        this.selectorShape(X, Y, W, H);
      } else if (ex < sx && sy < ey) {
        const X = ex;
        const Y = sy;
        const W = sx - ex;
        const H = ey - sy;
        this.selectorShape(X, Y, W, H);
      } else if (sx < ex && sy == ey) {
        const X = sx;
        const Y = sy - 2;
        const W = ex - sx;
        const H = 4;
        this.selectorShape(X, Y, W, H);
      } else if (ex < sx && sy == ey) {
        const X = ex;
        const Y = ey - 2;
        const W = sx - ex;
        const H = 4;
        this.selectorShape(X, Y, W, H);
      }
    } else if (shape.type === "text") {
      const nol = shape.nol || 1;
      const offset = this.canvasFontVerticalOffset;
      const lineHeight = 1.2 * this.canvasFontSize;

      const X = shape.x;
      const Y = shape.y + offset;
      const W = shape.width || 150;
      const H = nol * lineHeight + offset;

      this.selectorShape(X, Y, W, H);
    } else if (shape.type === "pencil") {
      const len = shape.pencilCoords.length;
      let lx = shape.pencilCoords[0].x;
      let ly = shape.pencilCoords[0].y;
      let hx = shape.pencilCoords[0].x;
      let hy = shape.pencilCoords[0].y;
      for (let i = 0; i < len; i++) {
        const x = shape.pencilCoords[i].x;
        const y = shape.pencilCoords[i].y;
        hx = Math.max(hx, x);
        hy = Math.max(hy, y);
        lx = Math.min(lx, x);
        ly = Math.min(ly, y);
      }

      const X = lx;
      const Y = ly;
      const W = hx - lx;
      const H = hy - ly;
      this.selectorShape(X, Y, W, H);
    } else if (shape.type === "diamond") {
      const X = shape.x;
      const Y = shape.y;
      const H = shape.height;
      const W = shape.width;
      this.selectorShape(X, Y, W, H);
    }
  };

  selectorShape = (X: number, Y: number, W: number, H: number) => {
    const P = 8 / this.scale; // choosen homogenous P-(for padding) (so x=y)
    const sqr = 8 / this.scale; // square, so width = heigth = 10
    this.context.beginPath();

    // top-circle
    this.context.ellipse(
      (2 * X + W) / 2,
      Y - 3 * P,
      4 / this.scale,
      4 / this.scale,
      0,
      0,
      2 * Math.PI,
    );

    // four-sqaures
    this.context.roundRect(X - P - sqr / 2, Y - P - sqr / 2, sqr, sqr, [
      2.15 / this.scale,
    ]); // top-left sqaure
    this.context.roundRect(X - P - sqr / 2, Y + H + P - sqr / 2, sqr, sqr, [
      2.15 / this.scale,
    ]); //bottom-left sqaure
    this.context.roundRect(X + W + P - sqr / 2, Y - P - sqr / 2, sqr, sqr, [
      2.15 / this.scale,
    ]); // top-right sqaure
    this.context.roundRect(X + W + P - sqr / 2, Y + H + P - sqr / 2, sqr, sqr, [
      2.15 / this.scale,
    ]); // bottom-right sqaure

    // left-line
    this.context.moveTo(X - P, Y - P + sqr / 2);
    this.context.lineTo(X - P, Y + H + P - sqr / 2);

    // top-line
    this.context.moveTo(X - P + sqr / 2, Y - P);
    this.context.lineTo(X + W + P - sqr / 2, Y - P);

    // right-line
    this.context.moveTo(X + W + P, Y - P + sqr / 2);
    this.context.lineTo(X + W + P, Y + H + P - sqr / 2);

    // bottom-line
    this.context.moveTo(X - P + sqr / 2, Y + H + P);
    this.context.lineTo(X + W + P - sqr / 2, Y + H + P);
    this.context.closePath();
    this.context.stroke();
  };

  // Shape Manipulation Functions
  drawRect(x: number, y: number, w: number, h: number) {
    this.context.beginPath();
    this.context.roundRect(x, y, w, h, [25]);
    this.context.stroke();
  }

  drawEllipse(cx: number, cy: number, rx: number, ry: number) {
    this.context.beginPath();
    this.context.ellipse(cx, cy, Math.abs(rx), Math.abs(ry), 0, 0, 2 * Math.PI);
    this.context.stroke();
  }

  drawLine(sx: number, sy: number, ex: number, ey: number) {
    this.context.beginPath();
    this.context.moveTo(sx, sy);
    this.context.lineTo(ex, ey);
    this.context.closePath();
    this.context.stroke();
  }

  drawDiamond(x: number, y: number, w: number, h: number) {
    const cx = x + w / 2;
    const cy = y + h / 2;

    const pts = [
      { x: cx, y: y }, // top
      { x: x + w, y: cy }, // right
      { x: cx, y: y + h }, // bottom
      { x: x, y: cy }, // left
    ];

    const roundness = 0.1;

    const halfW = w / 2;
    const halfH = h / 2;
    const edge = Math.sqrt(halfW * halfW + halfH * halfH);
    const r = edge * roundness;

    const ctx = this.context;
    ctx.beginPath();
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    for (let i = 0; i < pts.length; i++) {
      const prev = pts[(i + 3) % 4];
      const curr = pts[i];
      const next = pts[(i + 1) % 4];

      // vectors
      const v1x = curr.x - prev.x;
      const v1y = curr.y - prev.y;
      const v2x = next.x - curr.x;
      const v2y = next.y - curr.y;

      // normalize
      const l1 = Math.hypot(v1x, v1y);
      const l2 = Math.hypot(v2x, v2y);

      const p1x = curr.x - (v1x / l1) * r;
      const p1y = curr.y - (v1y / l1) * r;
      const p2x = curr.x + (v2x / l2) * r;
      const p2y = curr.y + (v2y / l2) * r;

      if (i === 0) ctx.moveTo(p1x, p1y);
      else ctx.lineTo(p1x, p1y);

      ctx.quadraticCurveTo(curr.x, curr.y, p2x, p2y);
    }

    ctx.closePath();
    ctx.stroke();
  }

  drawPencil(pencilCoords: Array<{ x: number; y: number }>) {
    if (pencilCoords && pencilCoords.length > 0) {
      this.context.beginPath();
      this.context.lineCap = "round";
      this.context.lineJoin = "round";

      const coords = pencilCoords;

      if (coords.length < 3) {
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

          const endX = (currentPoint.x + nextPoint.x) / 2;
          const endY = (currentPoint.y + nextPoint.y) / 2;

          this.context.quadraticCurveTo(
            currentPoint.x,
            currentPoint.y,
            endX,
            endY,
          );
        }

        // Draw final segment
        const lastPoint = coords[coords.length - 1];
        this.context.lineTo(lastPoint.x, lastPoint.y);
      }
      this.context.stroke();
    }
  }

  drawText(x: number, y: number, content: string) {
    const fontSize = this.canvasFontSize;
    const lineHeight = 1.2 * fontSize;
    const offset = this.canvasFontVerticalOffset;

    const lines = content.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      this.context.fillText(
        lines[i],
        x,
        y + fontSize + offset + i * lineHeight,
      );
    }
  }

  drawShape(shape: Shape) {
    if (shape.type === "rect") {
      const { x, y, width: w, height: h } = shape;
      this.drawRect(x, y, w, h);
    } else if (shape.type === "elip") {
      const { centerX: cx, centerY: cy, radiusX: rx, radiusY: ry } = shape;
      this.drawEllipse(cx, cy, rx, ry);
    } else if (shape.type === "line") {
      const { startX: sx, startY: sy, endX: ex, endY: ey } = shape;
      this.drawLine(sx, sy, ex, ey);
    } else if (shape.type === "pencil") {
      const { pencilCoords: Arr } = shape;
      this.drawPencil(Arr);
    } else if (shape.type === "text") {
      const { x, y, content: c } = shape;
      this.drawText(x, y, c);
    } else if (shape.type === "diamond") {
      const { x, y, width: w, height: h } = shape;
      this.drawDiamond(x, y, w, h);
    }
  }

  drawPreview(
    worldStart: { x: number; y: number },
    worldEnd: { x: number; y: number },
  ) {
    // Set common styles once
    const w = worldEnd.x - worldStart.x;
    const h = worldEnd.y - worldStart.y;
    const sx = worldStart.x;
    const sy = worldStart.y;
    const ex = worldEnd.x;
    const ey = worldEnd.y;

    if (this.selectedTool === "rect") {
      this.drawRect(sx, sy, w, h);
    } else if (this.selectedTool === "elip") {
      const cx = (sx + ex) / 2;
      const cy = (sy + ey) / 2;
      const rx = Math.abs(w / 2);
      const ry = Math.abs(h / 2);
      this.drawEllipse(cx, cy, rx, ry);
    } else if (this.selectedTool === "line") {
      this.drawLine(sx, sy, ex, ey);
    } else if (this.selectedTool === "diamond") {
      this.drawDiamond(sx, sy, w, h);
    }
  }

  removeShape(id?: number, pid?: string) {
    this.existingShapes = this.existingShapes.filter(
      (x) => !((id && x.id === id) || (pid && x.pid === pid)),
    );
  }

  // miscellaneous Functions
  checkDifference = (s1: Shape, s2: Shape) => {
    if (s1.id === s2.id) {
      if (s1.type === "rect" && s2.type === "rect") {
        return (
          s1.height !== s2.height ||
          s1.width !== s2.width ||
          s1.x !== s2.x ||
          s1.y !== s2.y
        );
      } else if (s1.type === "elip" && s2.type === "elip") {
        return (
          s1.centerX !== s2.centerX ||
          s1.centerY !== s2.centerY ||
          s1.radiusX !== s2.radiusX ||
          s1.radiusY !== s2.radiusY
        );
      } else if (s1.type === "line" && s2.type === "line") {
        return (
          s1.startX !== s2.startX ||
          s1.endX !== s2.endX ||
          s1.startY !== s2.startY ||
          s1.endY !== s2.endY
        );
      } else if (s1.type === "pencil" && s2.type === "pencil") {
        if (s1.pencilCoords.length !== s2.pencilCoords.length) return true;
        return (
          s1.pencilCoords[0].x !== s2.pencilCoords[0].x ||
          s1.pencilCoords[0].y !== s2.pencilCoords[0].y
        );
      } else if (s1.type === "text" && s2.type === "text") {
        return (
          s1.content !== s2.content ||
          s1.nol !== s2.nol ||
          s1.width !== s2.width ||
          s1.x !== s2.x ||
          s1.y !== s2.y
        );
      } else if (s1.type === "diamond" && s2.type === "diamond") {
        return (
          s1.height !== s2.height ||
          s1.width !== s2.width ||
          s1.x !== s2.x ||
          s1.y !== s2.y
        );
      }
    }

    return false;
  };

  // Canvas cleanup function(s)
  destroyHandlers() {
    this.canvas.removeEventListener("pointerdown", this.pointDownHandler);
    window.removeEventListener("pointerup", this.pointUpHandler);
    window.removeEventListener("pointermove", this.pointMoveHandler);
    this.canvas.removeEventListener("wheel", this.wheelHandler, {
      passive: false,
    } as AddEventListenerOptions);
    document.removeEventListener("wheel", this.preventBrowserZoom, {
      passive: false,
    } as AddEventListenerOptions);
    this.canvas.removeEventListener("dblclick", this.doubleClickHandler);
    window.removeEventListener("keydown", this.keyDownHandler);
  }
}

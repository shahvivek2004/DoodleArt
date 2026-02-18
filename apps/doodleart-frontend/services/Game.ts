import { getExistingShapes, getID } from "./Http";
import { TextBox } from "./TextBox";
import {
  cameraState,
  canvasState,
  MIN_PENCIL_DIST,
  previewState,
  selectionState,
  Shape,
  textState,
  themeState,
  Tool,
} from "./types";
import {
  clearInteractiveCanvas,
  interactiveCanvasRender,
  staticCanvasRender,
} from "./renderer/renderCanvas";
import {
  checkDifference,
  computePencilBounds,
  getDragMetrics,
  hitTest,
  simplifyRDP,
  TOOL_BUILDERS,
} from "./utils";
import { handleToolShortcut } from "./actions/keyDown/numPress";
import { buildClipboardShape } from "./actions/keyDown/copyPaste";
import { translateShapes } from "./actions/shapeMutation/translateShape";
import {
  DEFAULT_TEXT_STATE,
  DEFAULT_THEME_STATE,
  DEFAULT_VIEW_STATE,
} from "@/services/types";

export class Game {
  private viewState: cameraState;
  private lastViewState: cameraState;
  private textState: textState;
  private themeState: themeState;
  public selectionState: selectionState;
  canvasState: canvasState;

  activeTextBox: TextBox | undefined;
  private shapeStore = new Map<string, Shape>();
  roomId: string;
  private clicked: boolean;
  private startX = 0;
  private startY = 0;
  private lastMouseX = 0;
  private lastMouseY = 0;
  private selectedTool = "grab";
  private isDrawing = false;
  socket: WebSocket;

  onToolChange: ((tool: Tool) => void) | null = null;
  onPanChange: ((status: boolean) => void) | null = null;
  onDetectChange: ((status: boolean) => void) | null = null;
  onSelectChange: ((status: Shape | null) => void) | null = null;

  private lastMouseShapeX = 0;
  private lastMouseShapeY = 0;
  isWriting: boolean;
  private sharedKey: string;
  private clipboard: Shape | null;
  private liveMouseX: number;
  private liveMouseY: number;
  private dpr: number;
  private isLocked: boolean;

  // --- RAF loop state ---
  private rafId: number = 0;
  private rafRunning: boolean = false;
  staticDirty: boolean = false;
  interactiveDirty: boolean = false;

  previewState: previewState | null = null;

  private viewSaveTimer: number | null = null;

  // Constructor
  constructor(
    stCanvas: HTMLCanvasElement,
    itCanvas: HTMLCanvasElement,
    roomId: string,
    socket: WebSocket,
    sharedKey: string,
  ) {
    this.dpr = window.devicePixelRatio ?? 1;
    this.roomId = roomId;
    this.socket = socket;
    this.clicked = false;
    this.isWriting = false;
    this.sharedKey = sharedKey;
    this.clipboard = null;
    this.liveMouseX = 0;
    this.liveMouseY = 0;

    this.isLocked = false;
    this.selectionState = {
      isSelecting: false,
      detectedShape: null,
      selectedShape: null,
    };

    this.canvasState = {
      itCanvas,
      stCanvas,
      itCtx: itCanvas.getContext("2d")!,
      stCtx: stCanvas.getContext("2d", { alpha: false })!,
    };

    this.lastViewState = DEFAULT_VIEW_STATE;
    this.viewState = DEFAULT_VIEW_STATE;
    this.textState = DEFAULT_TEXT_STATE;
    this.themeState = DEFAULT_THEME_STATE;
    this.init();
  }

  // Canvas intializers (helper functions)
  async init() {
    try {
      this.shapeStore = await getExistingShapes(
        this.roomId,
        this.sharedKey,
        this.themeState.themeStyle,
      );
    } catch (error) {
      console.error("Failed to load shapes from server: ", error);
    }

    this.initEventListeneres();
    this.initSocketHandler();
    this.markBothDirty();
  }

  initSocketHandler() {
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "chat-insert") {
        const publicId = message.publicId;
        const parsedShape: Shape = JSON.parse(message.message);
        const finalShape: Shape = {
          ...parsedShape,
          id: undefined,
          pid: publicId,
        };

        this.insertShape(finalShape);
      } else if (message.type === "chat-update") {
        const parsedShape: Shape = JSON.parse(message.message);
        const chatId = message.chatId;
        const publicId = message.publicId;
        const finalShape = { ...parsedShape, id: chatId, pid: publicId };

        this.updateShape(finalShape);
      } else if (message.type === "chat-delete") {
        const publicId = message.publicId;
        this.removeShape(publicId);
      }
      this.markStaticDirty();
    };
  }

  initEventListeneres() {
    this.canvasState.itCanvas.addEventListener(
      "pointerdown",
      this.pointDownHandler,
    );
    this.canvasState.itCanvas.addEventListener(
      "dblclick",
      this.doubleClickHandler,
    );
    this.canvasState.itCanvas.addEventListener("wheel", this.wheelHandler, {
      passive: false,
    });
    document.addEventListener("wheel", this.preventBrowserZoom, {
      passive: false,
    });
    window.addEventListener("pointerup", this.pointUpHandler);
    window.addEventListener("pointermove", this.pointMoveHandler);
    window.addEventListener("keydown", this.keyDownHandler);
  }

  // Canvas State setters
  setTool(tool: Tool) {
    this.selectedTool = tool;

    // Reset any ongoing drawing
    this.previewState = null;
    this.isDrawing = false;
    this.clicked = false;
    if (
      this.selectionState.isSelecting &&
      this.selectionState.selectedShape &&
      tool !== "cursor"
    ) {
      this.commitShape(this.selectionState.selectedShape);
      this.selectionState = {
        isSelecting: false,
        detectedShape: null,
        selectedShape: null,
      };
      this.onSelectChange?.(null);

      this.markBothDirty();
    }
  }

  setTheme(config: themeState) {
    const isThemeToggled = this.themeState.bgColor !== config.bgColor;
    this.themeState = { ...config };
    if (isThemeToggled) {
      this.markStaticDirty();
    }

    if (this.selectionState.isSelecting) {
      this.markInteractiveDirty();
    }
  }

  setText(config: textState) {
    this.textState = { ...config };
    this.markStaticDirty();
    if (this.selectionState.isSelecting) {
      this.markInteractiveDirty();
    }
  }

  setView(value: cameraState) {
    this.lastViewState.panx = this.viewState.panx = value.panx;
    this.lastViewState.pany = this.viewState.pany = value.pany;
    this.lastViewState.scale = this.viewState.scale = value.scale;
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

  registerDetectingCallback(callback: (status: boolean) => void) {
    this.onDetectChange = callback;
  }

  registerSelectingCallback(callback: (status: Shape | null) => void) {
    this.onSelectChange = callback;
  }

  updateSelectedShape(updates: {
    strokeStyle?: string;
    strokeWidth?: number;
    strokeType?: string;
    fillStyle?: string;
    fontColor?: string;
    fontSize?: number;
    fontType?: string;
  }) {
    if (this.selectionState.selectedShape) {
      let dirty = false;

      if (
        this.selectionState.selectedShape.type === "text" &&
        updates.fontSize !== this.selectionState.selectedShape.fontSize
      ) {
        dirty = true;
      }

      this.selectionState.selectedShape = {
        ...this.selectionState.selectedShape,
        ...updates,
      } as Shape;

      if (this.selectionState.selectedShape.type === "text" && dirty) {
        const content = this.selectionState.selectedShape.content;
        const lines = content.split(/\r?\n/);
        const ctx = document.createElement("canvas").getContext("2d");
        let textWidth = 0;
        if (ctx) {
          ctx.font = `${this.selectionState.selectedShape.fontSize}px ${this.selectionState.selectedShape.fontType}`;
          for (let i = 0; i < lines.length; i++) {
            const w = Math.round(ctx.measureText(lines[i]).width);
            if (w > textWidth) textWidth = w;
          }
        }
        this.selectionState.selectedShape = {
          ...this.selectionState.selectedShape,
          width: textWidth,
        };
      }

      this.markInteractiveDirty();
      this.socket.send(
        JSON.stringify({
          type: "chat-update",
          message: JSON.stringify(this.selectionState.selectedShape),
          roomId: this.roomId,
          chatId: this.selectionState.selectedShape?.id,
          publicId: this.selectionState.selectedShape.pid,
        }),
      );
    }
  }

  resize() {
    this.dpr = window.devicePixelRatio ?? 1;
    const itRect = this.canvasState.itCanvas.getBoundingClientRect();
    const stRect = this.canvasState.stCanvas.getBoundingClientRect();

    this.canvasState.stCanvas.width = stRect.width * this.dpr;
    this.canvasState.stCanvas.height = stRect.height * this.dpr;
    this.canvasState.itCanvas.width = itRect.width * this.dpr;
    this.canvasState.itCanvas.height = itRect.height * this.dpr;

    this.markStaticDirty();
    if (this.selectionState.selectedShape) {
      this.markInteractiveDirty();
    }
  }

  private ensureRafRunning() {
    if (!this.rafRunning) {
      this.rafRunning = true;
      this.rafId = requestAnimationFrame(this.renderLoop);
    }
  }

  private renderLoop = () => {
    //console.log("render");
    if (this.staticDirty) {
      staticCanvasRender(
        this.canvasState,
        this.themeState,
        this.viewState,
        this.textState,
        this.shapeStore,
        this.dpr,
      );
      this.staticDirty = false;
    }

    if (this.interactiveDirty) {
      if (this.previewState) {
        interactiveCanvasRender(
          this.canvasState,
          this.themeState,
          this.viewState,
          this.textState,
          this.dpr,
          this.previewState,
          this.selectionState.selectedShape,
          true,
        );
      } else if (
        this.selectionState.isSelecting &&
        this.selectionState.selectedShape
      ) {
        interactiveCanvasRender(
          this.canvasState,
          this.themeState,
          this.viewState,
          this.textState,
          this.dpr,
          this.previewState,
          this.selectionState.selectedShape,
          false,
        );
      } else {
        clearInteractiveCanvas(this.canvasState);
      }
      this.interactiveDirty = false;
    }

    // Only continue loop if there's ongoing work
    if (this.staticDirty || this.interactiveDirty) {
      this.rafId = requestAnimationFrame(this.renderLoop);
    } else {
      this.rafRunning = false;
      this.rafId = 0;
    }
  };

  markStaticDirty() {
    this.staticDirty = true;
    this.ensureRafRunning();
  }

  markInteractiveDirty() {
    this.interactiveDirty = true;
    this.ensureRafRunning();
  }

  markBothDirty() {
    this.staticDirty = true;
    this.interactiveDirty = true;
    this.ensureRafRunning();
  }

  // EventHandlers
  pointDownHandler = (e: PointerEvent) => {
    this.clicked = true;

    const worldCoords = this.screenToWorld(e.clientX, e.clientY);
    this.startX = worldCoords.x;
    this.startY = worldCoords.y;

    if (this.onPanChange) {
      this.onPanChange(true);
    }

    if (this.selectedTool === "cursor") {
      const shapeOnClick = this.detectElement(worldCoords.x, worldCoords.y);
      if (shapeOnClick) {
        let dirtyCheck = false;

        // case : 1, when selected shape is different and mouse is on different shape detecting it
        // so we have to push selected shape back to store and insert on static canvas
        if (
          this.selectionState.selectedShape &&
          this.selectionState.selectedShape !== shapeOnClick
        ) {
          this.commitShape(this.selectionState.selectedShape);
          dirtyCheck = true;
        }

        // case : 2, on selecting detected shape we have to remove it from the static canvas and,
        // will be it into the interactive canvas so both canvas render needed
        if (this.getShapeById(shapeOnClick.pid)) {
          this.removeShape(shapeOnClick.pid);
          dirtyCheck = true;
        }

        this.selectionState = {
          isSelecting: true,
          detectedShape: shapeOnClick,
          selectedShape: shapeOnClick,
        };
        this.onSelectChange?.(shapeOnClick);

        const screenCoords = this.getCanvasCoordinates(e.clientX, e.clientY);
        this.lastMouseShapeX = screenCoords.x;
        this.lastMouseShapeY = screenCoords.y;
        if (dirtyCheck) {
          this.markBothDirty();
        }
      } else if (this.selectionState.selectedShape) {
        this.commitShape(this.selectionState.selectedShape);
        this.selectionState = {
          isSelecting: false,
          detectedShape: null,
          selectedShape: null,
        };
        this.onSelectChange?.(null);
        this.markBothDirty();
      }
    } else if (this.selectedTool === "grab") {
      const screenCoords = this.getCanvasCoordinates(e.clientX, e.clientY);
      this.lastMouseX = screenCoords.x;
      this.lastMouseY = screenCoords.y;
    } else {
      if (this.selectedTool === "pencil") {
        this.isDrawing = true;
        this.previewState = {
          type: "pencil",
          x: worldCoords.x,
          y: worldCoords.y,
          width: 0,
          height: 0,
          pencilCoords: [{ x: worldCoords.x, y: worldCoords.y }],
          strokeStyle: this.themeState.strokeStyle,
          strokeType: this.themeState.strokeType,
          strokeWidth: this.themeState.strokeWidth,
        };
      }
    }
  };

  pointMoveHandler = (e: PointerEvent) => {
    const worldCoords = this.screenToWorld(e.clientX, e.clientY);
    const screenCoords = this.getCanvasCoordinates(e.clientX, e.clientY);

    if (!this.clicked) {
      this.liveMouseX = worldCoords.x;
      this.liveMouseY = worldCoords.y;
      if (this.selectedTool === "cursor") {
        const shape = this.detectElement(worldCoords.x, worldCoords.y);

        if (shape) {
          this.onDetectChange?.(true);
          return;
        }
        this.onDetectChange?.(false);
      }
      return;
    }

    if (
      this.selectedTool === "cursor" &&
      this.selectionState.isSelecting &&
      this.selectionState.selectedShape
    ) {
      const deltaX = screenCoords.x - this.lastMouseShapeX;
      const deltaY = screenCoords.y - this.lastMouseShapeY;

      const worldDeltaX = deltaX / this.viewState.scale;
      const worldDeltaY = deltaY / this.viewState.scale;

      this.lastMouseShapeX = screenCoords.x;
      this.lastMouseShapeY = screenCoords.y;

      this.selectionState.selectedShape = translateShapes(
        this.selectionState.selectedShape,
        worldDeltaX,
        worldDeltaY,
      );
      this.markInteractiveDirty();
    } else if (this.selectedTool === "grab") {
      // Handle panning
      const deltaX = screenCoords.x - this.lastMouseX;
      const deltaY = screenCoords.y - this.lastMouseY;

      this.viewState.panx += deltaX;
      this.viewState.pany += deltaY;

      this.lastMouseX = screenCoords.x;
      this.lastMouseY = screenCoords.y;

      this.markStaticDirty();
    } else {
      const metrics = getDragMetrics(
        this.startX,
        this.startY,
        worldCoords.x,
        worldCoords.y,
        this.themeState,
        this.textState,
      );

      if (this.selectedTool === "pencil") {
        // In pointMoveHandler, pencil branch
        if (this.isDrawing) {
          if (!this.previewState || this.previewState.type !== "pencil") {
            this.previewState = {
              type: "pencil",
              x: worldCoords.x,
              y: worldCoords.y,
              width: 0,
              height: 0,
              pencilCoords: [],
              strokeStyle: this.themeState.strokeStyle,
              strokeType: this.themeState.strokeType,
              strokeWidth: this.themeState.strokeWidth,
            };
          }
          const len = this.previewState.pencilCoords.length;
          const last = this.previewState.pencilCoords[len - 1];
          if (
            !last ||
            Math.hypot(worldCoords.x - last.x, worldCoords.y - last.y) >
              MIN_PENCIL_DIST
          ) {
            this.previewState.pencilCoords.push({
              x: worldCoords.x,
              y: worldCoords.y,
            });
          }
        }
      } else {
        this.previewState = TOOL_BUILDERS[this.selectedTool as Tool]?.({
          metrics,
          previewState: null,
        }) as previewState | null;
      }

      this.markInteractiveDirty();
    }
  };

  pointUpHandler = (e: PointerEvent) => {
    if (!this.clicked) return;
    this.clicked = false;

    const worldCoords = this.screenToWorld(e.clientX, e.clientY);
    this.liveMouseX = worldCoords.x;
    this.liveMouseY = worldCoords.y;

    if (this.onPanChange) {
      this.onPanChange(false);
    }

    if (this.selectedTool === "grab") {
      this.saveView();
    } else if (
      this.selectedTool === "cursor" &&
      this.selectionState.selectedShape &&
      this.selectionState.detectedShape
    ) {
      if (
        checkDifference(
          this.selectionState.selectedShape,
          this.selectionState.detectedShape,
        )
      ) {
        this.socket.send(
          JSON.stringify({
            type: "chat-update",
            message: JSON.stringify(this.selectionState.selectedShape),
            roomId: this.roomId,
            chatId: this.selectionState.selectedShape?.id,
            publicId: this.selectionState.selectedShape.pid,
          }),
        );
      }
    } else if (this.selectedTool === "text" && !this.isWriting) {
      this.activeTextBox = new TextBox(
        e.clientX,
        e.clientY,
        worldCoords.x,
        worldCoords.y,
        this.canvasState.itCtx,
        this.viewState.scale,
        this,
        this.textState,
        this.isLocked,
      );
    } else {
      const metrics = getDragMetrics(
        this.startX,
        this.startY,
        worldCoords.x,
        worldCoords.y,
        this.themeState,
        this.textState,
      );

      let shape = TOOL_BUILDERS[this.selectedTool as Tool]?.({
        metrics,
        previewState: this.previewState,
      });

      if (shape) {
        if (shape.type === "pencil") {
          const pencilCoords = simplifyRDP(shape.pencilCoords, 4);
          const bounds = computePencilBounds(pencilCoords);
          // const l1 = shape.pencilCoords.length;
          // const l2 = pencilCoords.length;
          // console.log(`before: ${l1} and after: ${l2} , reduction by ${Math.round(((l1-l2)*100)/l1)}%`)
          shape = { ...shape, ...bounds, pencilCoords };
        }

        const chatid = getID();
        const newShape: Shape = { ...shape, id: undefined, pid: chatid };

        if (!this.isLocked) {
          this.setTool("cursor");
          if (this.onToolChange) {
            this.onToolChange("cursor");
          }
          this.selectionState = {
            isSelecting: true,
            detectedShape: newShape,
            selectedShape: newShape,
          };
          this.onSelectChange?.(newShape);
        } else {
          this.insertShape(newShape);
          this.markStaticDirty();
        }

        this.socket.send(
          JSON.stringify({
            type: "chat-insert",
            message: JSON.stringify(shape),
            roomId: this.roomId,
            publicId: chatid,
          }),
        );
      }

      this.previewState = null;
      this.markInteractiveDirty();
    }
  };

  doubleClickHandler = (e: MouseEvent) => {
    if (
      this.selectedTool === "cursor" &&
      !this.selectionState.isSelecting &&
      !this.isWriting
    ) {
      const worldCoords = this.screenToWorld(e.clientX, e.clientY);
      this.activeTextBox = new TextBox(
        e.clientX,
        e.clientY,
        worldCoords.x,
        worldCoords.y,
        this.canvasState.itCtx,
        this.viewState.scale,
        this,
        this.textState,
        this.isLocked,
      );
    }
  };

  keyDownHandler = (e: KeyboardEvent) => {
    if (this.isWriting || this.previewState) return;

    const tool = handleToolShortcut(e.key);
    if (tool) {
      this.setTool(tool);
      this.onToolChange?.(tool);
    }

    if (e.key === "Delete") {
      const s = this.selectionState.selectedShape;
      if (!s) return;

      this.selectionState = {
        isSelecting: false,
        detectedShape: null,
        selectedShape: null,
      };
      this.onSelectChange?.(null);
      this.onDetectChange?.(false);
      this.markInteractiveDirty();

      this.socket.send(
        JSON.stringify({
          type: "chat-delete",
          roomId: this.roomId,
          chatId: s.id,
          publicId: s.pid,
        }),
      );
      return;
    }

    if (
      e.ctrlKey &&
      (e.key === "c" || e.key === "C") &&
      this.selectionState.selectedShape
    ) {
      this.clipboard = buildClipboardShape(
        this.selectionState.selectedShape,
        this.liveMouseX,
        this.liveMouseY,
      );
      return;
    } else if (
      e.ctrlKey &&
      (e.key === "v" || e.key === "V") &&
      this.clipboard
    ) {
      const payload = buildClipboardShape(
        this.clipboard,
        this.liveMouseX,
        this.liveMouseY,
      );

      this.clipboard = null; // one-time paste

      if (this.selectionState.selectedShape) {
        this.commitShape(this.selectionState.selectedShape);
      }

      const chatid = getID();
      const newShape: Shape = { ...payload, id: undefined, pid: chatid };

      this.selectionState = {
        isSelecting: true,
        detectedShape: newShape,
        selectedShape: newShape,
      };
      this.onSelectChange?.(newShape);
      this.markBothDirty();

      this.socket.send(
        JSON.stringify({
          type: "chat-insert",
          message: JSON.stringify(payload),
          roomId: this.roomId,
          publicId: chatid,
        }),
      );
    }
  };

  wheelHandler = (e: WheelEvent) => {
    e.preventDefault();
    const minScale = 0.1;
    const maxScale = 10;
    const zoomIntensity = 0.09;
    const wheel = e.deltaY < 0 ? 1 : -1;
    const zoom = Math.exp(wheel * zoomIntensity);

    const mouseCanvasPos = this.getCanvasCoordinates(e.clientX, e.clientY);

    const worldPosBefore = {
      x: (mouseCanvasPos.x - this.viewState.panx) / this.viewState.scale,
      y: (mouseCanvasPos.y - this.viewState.pany) / this.viewState.scale,
    };

    const newScale = this.viewState.scale * zoom;
    if (newScale >= minScale && newScale <= maxScale) {
      this.viewState.scale = newScale;

      this.viewState.panx =
        mouseCanvasPos.x - worldPosBefore.x * this.viewState.scale;
      this.viewState.pany =
        mouseCanvasPos.y - worldPosBefore.y * this.viewState.scale;

      if (
        this.selectionState.isSelecting &&
        this.selectionState.selectedShape
      ) {
        this.markInteractiveDirty();
      }
      this.markStaticDirty();
      this.saveView();
    }
  };

  preventBrowserZoom = (e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
    }
  };

  saveView = () => {
    if (
      this.viewState.panx !== this.lastViewState.panx ||
      this.viewState.pany !== this.lastViewState.pany ||
      this.viewState.scale !== this.lastViewState.scale
    ) {
      if (this.viewSaveTimer) clearTimeout(this.viewSaveTimer);
      this.viewSaveTimer = window.setTimeout(() => {
        this.lastViewState = {
          panx: this.viewState.panx,
          pany: this.viewState.pany,
          scale: this.viewState.scale,
        };
        localStorage.setItem("view", JSON.stringify(this.lastViewState));
      }, 500);
    }
  };

  screenToWorld(screenX: number, screenY: number) {
    const canvasCoords = this.getCanvasCoordinates(screenX, screenY);
    return {
      x: (canvasCoords.x - this.viewState.panx) / this.viewState.scale,
      y: (canvasCoords.y - this.viewState.pany) / this.viewState.scale,
    };
  }

  getCanvasCoordinates(clientX: number, clientY: number) {
    const canvasCoords = this.canvasState.itCanvas.getBoundingClientRect();
    return {
      x: clientX - canvasCoords.left,
      y: clientY - canvasCoords.top,
    };
  }

  // Shape Detection Functions
  detectElement = (x: number, y: number) => {
    if (
      this.selectionState.selectedShape &&
      hitTest(
        this.selectionState.selectedShape,
        x,
        y,
        this.viewState,
        this.textState,
        true,
      )
    ) {
      return this.selectionState.selectedShape;
    }

    for (const shape of this.shapeStore.values()) {
      let checkFill = false;
      if (
        shape.type === "diamond" ||
        shape.type === "elip" ||
        shape.type === "rect"
      ) {
        checkFill = !!shape.fillStyle && shape.fillStyle !== "transparent";
      }
      if (hitTest(shape, x, y, this.viewState, this.textState, checkFill)) {
        return shape;
      }
    }

    return undefined;
  };

  //====================================================================

  commitShape(shape: Shape) {
    this.insertShape(shape);
  }

  //====================================================================

  getShapeById(pid: string) {
    return this.shapeStore.get(pid);
  }

  removeShape(pid: string) {
    // const shape = this.shapeStore.get(pid);
    // if (!shape) return;
    // this.removeShapeByStyle(shape, pid);
    this.shapeStore.delete(pid);
  }

  insertShape(shape: Shape) {
    // this.insertShapeByStyle(shape);
    this.shapeStore.set(shape.pid, shape);
  }

  updateShape(shape: Shape) {
    this.shapeStore.set(shape.pid, shape);
  }

  // Canvas cleanup function(s)
  destroyEventListeneres() {
    if (this.activeTextBox) {
      this.activeTextBox.destroy();
      this.activeTextBox = undefined;
    }

    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }

    if (this.viewSaveTimer) {
      clearTimeout(this.viewSaveTimer);
    }

    this.canvasState.itCanvas.removeEventListener(
      "pointerdown",
      this.pointDownHandler,
    );
    this.canvasState.itCanvas.removeEventListener(
      "dblclick",
      this.doubleClickHandler,
    );
    this.canvasState.itCanvas.removeEventListener("wheel", this.wheelHandler, {
      passive: false,
    } as AddEventListenerOptions);

    document.removeEventListener("wheel", this.preventBrowserZoom, {
      passive: false,
    } as AddEventListenerOptions);
    window.removeEventListener("keydown", this.keyDownHandler);
    window.removeEventListener("pointerup", this.pointUpHandler);
    window.removeEventListener("pointermove", this.pointMoveHandler);
  }
}

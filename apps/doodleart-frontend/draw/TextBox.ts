import { Game, Shape } from "./Game";
import { getID } from "./Http";

export class TextBox {
  private textbox: HTMLTextAreaElement;
  private context: CanvasRenderingContext2D;
  private x: number;
  private y: number;
  private app: Game;
  private isFinalized: boolean = false;
  private lineHeight: number;
  private fontColor: string;
  private fontSize: number;
  private fontType: string;
  private fontOffset: number;
  private isLocked: boolean;
  private onBlur = this.handleBlur.bind(this);
  private onKeyDown = this.handleKeyDown.bind(this);
  private onInput = this.handleInput.bind(this);

  constructor(
    parX: number,
    parY: number,
    x: number,
    y: number,
    context: CanvasRenderingContext2D,
    scale: number,
    app: Game,
    color: string,
    fontSize: number,
    fontType: string,
    fontOffset: number,
    isLocked: boolean,
  ) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.app = app;
    this.fontColor = color;
    this.fontSize = fontSize;
    this.fontType = fontType;
    this.fontOffset = fontOffset;

    this.isLocked = isLocked;
    this.app.isWriting = true;

    this.textbox = document.createElement("textarea");
    this.textbox.style.resize = "none";
    this.textbox.style.overflow = "hidden";
    this.textbox.spellcheck = false;
    this.textbox.autocapitalize = "off";
    this.textbox.autocorrect = true;
    this.textbox.setAttribute("aria-label", "Text input");

    this.textbox.style.fontSize = `${this.fontSize * scale}px`;
    this.textbox.style.fontFamily = this.fontType;
    this.textbox.style.fontWeight = "bold";
    this.textbox.style.color = this.fontColor;
    this.textbox.style.backgroundColor = "transparent";
    this.textbox.style.border = "none";
    this.textbox.style.outline = "none";
    this.textbox.style.position = "absolute";
    this.textbox.value = "";

    const canvasRect = this.app.canvas.getBoundingClientRect();
    const absLeft = Math.round(canvasRect.left + parX);
    const absTop = Math.round(canvasRect.top + parY);

    const maxWidth = Math.max(10, this.app.canvas.clientWidth - parX);
    const maxHeight = Math.max(10, this.app.canvas.clientHeight - parY);

    this.textbox.style.left = `${absLeft}px`;
    this.textbox.style.top = `${absTop}px`;
    this.textbox.style.width = `${maxWidth}px`;
    this.textbox.style.maxHeight = `${maxHeight}px`;
    this.textbox.style.lineHeight = "normal";
    this.textbox.style.whiteSpace = "pre-wrap";
    this.textbox.style.wordBreak = "break-word";
    this.textbox.style.zIndex = "5";
    this.textbox.style.padding = "0";
    this.textbox.style.margin = "0";
    this.textbox.style.boxSizing = "border-box";

    this.app.canvas.parentElement?.appendChild(this.textbox);

    this.lineHeight = Math.round(this.fontSize * 1.2);

    this.autoResize();

    this.textbox.focus();
    this.textbox.selectionStart = this.textbox.selectionEnd =
      this.textbox.value.length;

    // events
    this.textbox.addEventListener("blur", this.onBlur);
    this.textbox.addEventListener("keydown", this.onKeyDown);
    this.textbox.addEventListener("input", this.onInput);

    if (!this.isLocked) {
      this.app.setTool?.("cursor");
      if (this.app.onToolChange) this.app.onToolChange("cursor");
    }
  }

  private handleInput() {
    this.autoResize();
  }

  private handleBlur() {
    this.finalize();
  }

  private handleKeyDown(e: KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      this.finalize();
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      this.cancel();
      return;
    }
  }

  private autoResize() {
    this.textbox.style.height = "auto";
    const sh = this.textbox.scrollHeight;
    this.textbox.style.height = `${sh}px`;
  }

  public finalize() {
    if (this.isFinalized) return;
    this.isFinalized = true;

    const trimmedValue = this.textbox.value ?? "";

    const doFinalize = async () => {
      try {
        if ("fonts" in document) {
          await (document.fonts as FontFaceSet).ready.catch(() => {});
        }

        if (trimmedValue.length > 0) {
          const lines = trimmedValue.split(/\r?\n/);
          this.context.save();
          this.context.font = `${this.fontSize}px ${this.fontType}`;
          this.context.fillStyle = this.fontColor;

          const baselineOffset = this.fontOffset;
          let textWidth = 0;
          for (let i = 0; i < lines.length; i++) {
            const lineY =
              this.y + this.fontSize + baselineOffset + i * this.lineHeight;
            this.context.fillText(lines[i], this.x, lineY);
            const w = Math.round(this.context.measureText(lines[i]).width);
            if (w > textWidth) textWidth = w;
          }
          this.context.restore();

          const textShape: Shape = {
            type: "text",
            x: this.x,
            y: this.y,
            content: trimmedValue,
            width: textWidth,
            nol: lines.length,
          };

          try {
            const chatid = getID();
            const newShape: Shape = {
              ...textShape,
              id: undefined,
              pid: chatid,
            };
            this.app.detectedShape = newShape;
            this.app.selectedShape = newShape;
            this.app.isSelecting = true;
            this.app.existingShapes.push(newShape);
            this.app.render();

            const payload = {
              type: "chat-insert",
              message: JSON.stringify(textShape),
              roomId: this.app.roomId,
              publicId: chatid,
            };

            this.app.socket.send(JSON.stringify(payload));
          } catch (err) {
            console.error("socket.send failed", err);
          }
        }
      } finally {
        this.cleanup();
      }
    };

    void doFinalize();
  }

  public cancel() {
    if (this.isFinalized) return;
    this.isFinalized = true;
    this.cleanup();
  }

  private cleanup() {
    this.textbox.removeEventListener("blur", this.onBlur);
    this.textbox.removeEventListener("keydown", this.onKeyDown);
    this.textbox.removeEventListener("input", this.onInput);

    if (this.textbox.parentElement) {
      this.textbox.parentElement.removeChild(this.textbox);
    }

    this.app.isWriting = false;
    this.app.activeTextBox = undefined;
  }

  public destroy() {
    if (!this.isFinalized) {
      this.cancel();
    } else {
      this.cleanup();
    }
  }
}

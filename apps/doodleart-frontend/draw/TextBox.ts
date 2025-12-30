import { Game, Shape } from "./Game";
import { getID } from "./Http";

export class TextBox {
  private textbox: HTMLTextAreaElement;
  private context: CanvasRenderingContext2D;
  private x: number;
  private y: number;
  private app: Game; // Reference to your main application
  private isFinalized: boolean = false;
  private color: string;
  private strokeWidth: number;
  private fontSize: number;

  constructor(
    parX: number,
    parY: number,
    x: number,
    y: number,
    context: CanvasRenderingContext2D,
    scale: number,
    app: Game,
    color: string,
    strokeWidth: number,
    fontSize: number,
    themeDefault: boolean,
    dpr: number,
  ) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.app = app;
    this.app.isWriting = true;
    this.color = color;
    this.strokeWidth = strokeWidth;
    this.fontSize = fontSize;

    this.textbox = document.createElement("textarea");
    this.textbox.style.resize = "none";
    this.textbox.style.overflow = "hidden";
    this.textbox.style.backgroundColor = "transparent";
    this.textbox.style.width = `${this.app.canvas.width / dpr - parX}px`;
    this.textbox.style.height = `${this.app.canvas.height / dpr - parY}px`;
    this.textbox.style.position = "absolute";
    this.textbox.style.top = `${parY}px`;
    this.textbox.style.left = `${parX}px`;
    this.textbox.style.border = "none";
    this.textbox.style.outline = "none";
    this.textbox.style.color = `${themeDefault ? "white" : "black"}`;
    this.textbox.style.fontWeight = "bold";
    this.textbox.style.fontSize = `${fontSize * scale}px`;
    this.textbox.style.fontFamily = "Finger Paint";
    this.textbox.style.caretColor = `${themeDefault ? "white" : "black"}`;
    this.textbox.value = "";
    this.app.canvas.parentElement?.appendChild(this.textbox);
    this.textbox.focus();
    this.textbox.addEventListener("blur", this.blurEvent);
  }

  blurEvent = () => {
    if (this.isFinalized) return;
    this.isFinalized = true;

    const trimmedValue = this.textbox.value;
    const lines = this.textbox.value.split(/\r?\n/);

    this.app.isWriting = false;
    this.app.activeTextBox = undefined;
    this.app.setTool("cursor");
    if (this.app.onToolChange) {
      this.app.onToolChange("cursor");
    }

    if (trimmedValue.length > 0) {
      this.context.save();
      this.context.font = `${this.fontSize}px "Finger Paint"`;
      let textWidth = 0;
      this.context.fillStyle = this.color;
      this.context.lineWidth = this.strokeWidth;
      for (let i = 0; i < lines.length; i++) {
        this.context.fillText(lines[i], this.x, this.y + this.fontSize + 8 + i * 24);
        textWidth = Math.max(
          textWidth,
          Math.round(this.context.measureText(lines[i]).width),
        );
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

      const chatid = getID();
      const newShape: Shape = { ...textShape, id: undefined, pid: chatid };
      this.app.detectedShape = newShape;
      this.app.selectedShape = newShape;
      this.app.isSelecting = true;
      this.app.existingShapes.push(newShape);
      this.app.render();

      this.app.socket.send(
        JSON.stringify({
          type: "chat-insert",
          message: JSON.stringify(textShape),
          roomId: this.app.roomId,
          publicId: chatid
        }),
      );
    }

    this.textbox.removeEventListener("blur", this.blurEvent);
    if (this.textbox.parentElement) {
      this.app.canvas.parentElement?.removeChild(this.textbox);
    }
  };
}

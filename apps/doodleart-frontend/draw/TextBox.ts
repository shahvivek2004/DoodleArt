import { Game, Shape } from "./Game";

export class TextBox {
    private textbox: HTMLTextAreaElement;
    private context: CanvasRenderingContext2D;
    private x: number;
    private y: number;
    private app: Game; // Reference to your main application
    private isFinalized: boolean = false;


    constructor(parX: number, parY: number, x: number, y: number, content: string, context: CanvasRenderingContext2D, scale: number, app: Game, color: string, strokeWidth: number, fontSize: number) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.app = app;
        this.app.isWriting = true;

        this.textbox = document.createElement('textarea');
        this.textbox.style.resize = "none";
        this.textbox.style.overflow = "hidden";
        this.textbox.style.backgroundColor = "transparent";
        this.textbox.style.width = `${this.app.canvas.width - parX}px`;
        this.textbox.style.height = `${this.app.canvas.height - parY}px`;
        this.textbox.style.position = "absolute";
        this.textbox.style.top = `${parY}px`;
        this.textbox.style.left = `${parX}px`;
        this.textbox.style.border = "none";
        this.textbox.style.outline = "none";
        this.textbox.style.color = "white";
        this.textbox.style.fontWeight = "bold";
        this.textbox.style.fontSize = `${fontSize * scale}px`;
        this.textbox.style.fontFamily = "Finger Paint";
        this.textbox.value = content;
        // this.textbox.placeholder = "Type here...";
        this.app.canvas.parentElement?.appendChild(this.textbox);
        this.textbox.focus();

        const blurEvent = () => {
            finalize();
        }

        const finalize = () => {
            if (this.isFinalized) return;
            this.isFinalized = true;

            const trimmedValue = this.textbox.value;
            const lines = this.textbox.value.split(/\r?\n/);
            //console.log(lines);

            if (trimmedValue.length > 0) {
                this.context.save();
                this.context.font = `${fontSize}px "Finger Paint"`;
                let textWidth = 0;
                this.context.fillStyle = color;
                this.context.lineWidth = strokeWidth;
                for (let i = 0; i < lines.length; i++) {
                    this.context.fillText(lines[i], x, y + fontSize + 8 + i * 24);
                    textWidth = Math.max(textWidth, Math.round(this.context.measureText(lines[i]).width));
                }
                this.context.restore();

                const textShape: Shape = {
                    type: "text",
                    x: x,
                    y: y,
                    content: trimmedValue,
                    width: textWidth,
                    nol: lines.length,
                };

                // this.app.existingShapes.push(textShape);

                this.app.socket.send(JSON.stringify({
                    type: "chat-insert",
                    message: JSON.stringify(textShape),
                    roomId: this.app.roomId
                }));
            }

            this.textbox.removeEventListener('blur', blurEvent);

            if (this.textbox.parentElement) {
                this.app.canvas.parentElement?.removeChild(this.textbox);
            }
            this.app.isWriting = false;
            this.app.activeTextBox = undefined;
            this.app.setTool("cursor");
            if (this.app.onToolChange) {
                this.app.onToolChange("cursor");
            }
        };
        this.textbox.addEventListener('blur', blurEvent);
    }
}
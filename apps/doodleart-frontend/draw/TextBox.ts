import { Game, Shape } from "./Game";

export class TextBox {
    private textbox: HTMLInputElement;
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

        this.textbox = document.createElement('input');
        this.textbox.style.backgroundColor = "transparent";
        this.textbox.style.width = `${(200 + fontSize) * scale}px`;
        this.textbox.style.height = `${(20 + fontSize) * scale}px`;
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
        this.textbox.placeholder = "Type here...";
        document.body.appendChild(this.textbox);
        this.textbox.focus();

        const finalize = () => {
            if (this.isFinalized) return;
            this.isFinalized = true;

            const trimmedValue = this.textbox.value.trim();

            if (trimmedValue.length > 0) {
                this.context.save();
                this.context.font = `${fontSize}px "Finger Paint"`;
                const textWidth = Math.round(this.context.measureText(trimmedValue).width);
                this.context.fillStyle = color;
                this.context.lineWidth = strokeWidth;
                this.context.fillText(trimmedValue, x, y + fontSize + 8);
                this.context.restore();

                const textShape: Shape = {
                    type: "text",
                    x: x,
                    y: y,
                    content: trimmedValue,
                    width: textWidth
                };

                // this.app.existingShapes.push(textShape);

                this.app.socket.send(JSON.stringify({
                    type: "chat",
                    message: JSON.stringify(textShape),
                    roomId: this.app.roomId
                }));
            }

            if (this.textbox.parentElement) {
                document.body.removeChild(this.textbox);
            }
            this.app.isWriting = false;
            this.app.activeTextBox = undefined;
            this.app.setTool("cursor");
            if (this.app.onToolChange) {
                this.app.onToolChange("cursor");
            }
        };

        this.textbox.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                finalize();
            }
        });

        this.textbox.addEventListener('blur', () => {
            finalize();
        });
    }
}
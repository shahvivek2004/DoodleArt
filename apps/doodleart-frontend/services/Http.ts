// Http.ts

import { nanoid } from "nanoid";
import axios from "axios";
import { HTTP_URL } from "@/proxy";
import { Shape } from "./types";

// Helper function to apply default styles based on theme
function applyDefaultStyles(shape: Shape, themeStyle: string): Shape {
  const defaultStrokeColor = themeStyle === "b" ? "#ffffff" : "#000000";

  if (shape.type === "text") {
    return {
      ...shape,
      fontType: shape.fontType ?? "Finger Paint",
      fontColor: shape.fontColor ?? "#ffffff",
      fontSize: shape.fontSize ?? 20,
    };
  }

  if (shape.type === "line" || shape.type === "pencil") {
    return {
      ...shape,
      strokeStyle: shape.strokeStyle ?? defaultStrokeColor,
      strokeWidth: shape.strokeWidth ?? 4,
      strokeType: shape.strokeType ?? "solid",
    };
  }

  // For rect, elip, diamond
  return {
    ...shape,
    fillStyle: shape.fillStyle ?? "transparent",
    strokeStyle: shape.strokeStyle ?? defaultStrokeColor,
    strokeWidth: shape.strokeWidth ?? 4,
    strokeType: shape.strokeType ?? "solid",
  };
}

export async function getExistingShapes(
  roomId: string,
  sharedKey: string,
  themeStyle: string, // Add theme parameter with default
) {
  try {
    const res = await axios.get(
      `${HTTP_URL}/api/v1/user/chats/${roomId}?sharedKey=${sharedKey}`,
      { withCredentials: true },
    );
    const messages = res.data.messages;

    const shapesById = new Map<string, Shape>();
    //const shapesByStyle = new Map<string, Set<string>>();

    for (const msg of messages) {
      const pid = msg.publicId;
      const messageId = msg.id;
      const messageData: Shape = JSON.parse(msg.message);

      const shapeWithDefaults = applyDefaultStyles(messageData, themeStyle);

      shapesById.set(pid, {
        ...shapeWithDefaults,
        id: messageId,
        pid: pid,
      });

      // const styleKey = createStyleKey(shapeWithDefaults, themeStyle);
      // if (!shapesByStyle.get(styleKey)) {
      //   shapesByStyle.set(styleKey, new Set<string>())
      // }

      // shapesByStyle.get(styleKey)?.add(pid);
    }

    return shapesById;
  } catch (error) {
    throw error;
  }
}

export function getID() {
  const id = nanoid();
  return id;
}

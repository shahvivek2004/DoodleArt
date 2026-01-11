// Http.ts

import { nanoid } from "nanoid";
import axios from "axios";
import { HTTP_URL } from "@/proxy";

export async function getExistingShapes(roomId: string, sharedKey: string) {
  try {
    const res = await axios.get(
      `${HTTP_URL}/api/v1/user/chats/${roomId}?sharedKey=${sharedKey}`,
      { withCredentials: true },
    );
    const messages = res.data.messages;
    const shapes = messages.map(
      (x: { message: string; id: number; publicId?: string }) => {
        const publicId = x.publicId;
        const messageId = x.id;
        const messageData = JSON.parse(x.message);
        const newData = { ...messageData, id: messageId, pid: publicId };
        return newData;
      },
    );

    return shapes;
  } catch (error) {
    throw error;
  }
}

export function getID() {
  const id = nanoid();
  return id;
}

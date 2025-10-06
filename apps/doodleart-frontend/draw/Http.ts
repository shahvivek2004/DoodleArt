// Http.ts

import axios from "axios";
import { HTTP_URL } from "@/middleware";

export async function getExistingShapes(roomId: string, sharedKey: string) {
    try {
        const res = await axios.get(`${HTTP_URL}/api/v1/user/chats/${roomId}?sharedKey=${sharedKey}`, { withCredentials: true });
        const messages = res.data.messages;
        //console.log(messages);
        const shapes = messages.map((x: { message: string, id: number }) => {
            const messageId = x.id;
            const messageData = JSON.parse(x.message);
            const newData = { ...messageData, id: messageId };
            return newData;
        });
    
        return shapes;
    } catch (error) {
        throw error;
    }
}

// Http.ts

import axios from "axios";
import { HTTP_URL } from "@/config";

export async function getExistingShapes(roomId: string) {
    const res = await axios.get(`${HTTP_URL}/api/v1/user/chats/${roomId}`, { withCredentials: true });
    const messages = res.data.messages;
    //console.log(messages);
    const shapes = messages.map((x: { message: string }) => {
        const messageData = JSON.parse(x.message);
        return messageData;
    });

    return shapes;
}

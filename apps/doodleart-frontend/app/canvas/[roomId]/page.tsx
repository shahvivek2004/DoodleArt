import { SharedRooms } from "@/components/Auth/SharedRooms";

export default async function CanvasPage({ params }: {
    params: {
        roomId: string
    }
}) {
    const roomId = (await params).roomId;
    // console.log(roomId);
    return <SharedRooms id={roomId}/>
}
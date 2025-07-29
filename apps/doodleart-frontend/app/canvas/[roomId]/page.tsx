import { SharedRooms } from "@/components/Auth/SharedRooms";

interface PageProps {
  params: Promise<{
    roomId: string;
  }>;
}

export default async function CanvasPage({ params }: PageProps) {
  const { roomId } = await params;
  // console.log(roomId);
  return <SharedRooms id={roomId} />;
}
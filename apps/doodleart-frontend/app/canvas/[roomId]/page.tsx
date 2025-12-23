//import { SharedRooms } from "@/components/Auth/SharedRooms";
import { CanvasPg } from "@/components/Auth/CanvasPage";

interface PageProps {
  params: Promise<{
    roomId: string;
  }>;
}

export default async function CanvasPage({ params }: PageProps) {
  const { roomId } = await params;
  return <CanvasPg roomId={roomId} />;
}

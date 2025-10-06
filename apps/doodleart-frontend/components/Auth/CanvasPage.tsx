"use client";

import { useSearchParams } from "next/navigation";
import { RoomCanvas } from "../Canvas/RoomCanvas";

export const CanvasPg = ({ roomId }: { roomId: string }) => {
  const searchParams = useSearchParams();
  const SharedKey = searchParams.get("sharedKey") || "";

  return <RoomCanvas roomId={roomId} sharedKey={SharedKey} />;
};

"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { RoomCanvas } from "../Canvas/RoomCanvas";
import { Lock, ShieldX } from "lucide-react";
import { HTTP_URL } from "@/config";
import { useSearchParams } from "next/navigation";



export const SharedRooms = ({ id }: { id: string }) => {
    const router = useSearchParams();
    const [authorized, setAuthorized] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const sharedKey = router.get('sharedKey');
    // console.log(sharedKey);
    useEffect(() => {
        async function fetch() {
            try {
                const response = await axios.get(`${HTTP_URL}/api/v1/room/status/${id}?sharedKey=${sharedKey}`, { withCredentials: true });
                if (response.data.check) {
                    setAuthorized(true);
                }
                setLoading(false);
            } catch {
                setLoading(false);
                setAuthorized(false);
            }
        }
        fetch();
    }, [id, sharedKey]);

    if (loading) {
        return <div>Loading...</div>
    }

    if (authorized) {
        return <RoomCanvas roomId={id} />
    }

    return (
        <div className="h-screen w-screen flex flex-col justify-center items-center bg-[#0a0a19]">
            <div className="bg-[#191933] p-8 rounded-2xl shadow-xl border border-red-100 max-w-md mx-4 text-center">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="bg-red-100 p-4 rounded-full">
                        <ShieldX className="w-12 h-12 text-[#5f00a3]" />
                    </div>
                </div>

                {/* Main heading */}
                <h1 className="text-3xl font-bold text-white mb-3">
                    Access Denied
                </h1>

                {/* Subheading */}
                <p className="text-lg text-gray-400 mb-6">
                    You do not have permission to access this room
                </p>

                {/* Description */}
                <div className="bg-red-50 order border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-center mb-2">
                        <Lock className="w-5 h-5 text-[#5f00a3] mr-2" />
                        <span className="text-[#5f00a3] font-medium">Private Room</span>
                    </div>
                    <p className="text-[#5f00a3] font-medium text-sm">
                        This room is restricted to authorized users only. Please contact the room owner for access.
                    </p>
                </div>

                {/* Action buttons */}
                <div className="space-y-3">
                    <button
                        onClick={() => window.location.href = '/dashboard'}
                        className="w-full bg-[#5f00a3] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#5f00a392] transition-colors"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        </div>
    )
}
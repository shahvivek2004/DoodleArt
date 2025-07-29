"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { RoomCanvas } from "../Canvas/RoomCanvas";
import { HTTP_URL } from "@/middleware";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthComp } from "../Fetch/AuthComp";
import { Loader } from "../Fetch/Loader";


export const SharedRooms = ({ id }: { id: string }) => {
    const router = useSearchParams();
    const [authorized, setAuthorized] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const sharedKey = router.get('sharedKey');
    const roter = useRouter();
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

    const handleSignout = async () => {
        // setActiveTab('logout');
        try {
            await axios.post(`${HTTP_URL}/api/v1/auth/signout`, {}, { withCredentials: true });
            localStorage.clear();
            roter.push('/signin');
        } catch {
            alert("Wait for a second!..");
        }
    }

    if (loading) {
        return (
            <Loader />
        )
    }

    if (authorized) {
        return <RoomCanvas roomId={id} />
    }

    return (
        <AuthComp quitfunc={handleSignout} />
    )
}
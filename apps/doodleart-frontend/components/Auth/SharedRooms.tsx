"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { RoomCanvas } from "../Canvas/RoomCanvas";
import { HTTP_URL } from "@/middleware";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader } from "../Fetch/Loader";
import { Authorized } from "../Fetch/Authorized";


export const SharedRooms = ({ id }: { id: string }) => {
    const router = useSearchParams();
    const [authorized, setAuthorized] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [sKey,setsKey] = useState<string>("");
    const sharedKey = router.get('sharedKey');
    const roter = useRouter();
    useEffect(() => {
        async function fetch() {
            try {
                const response = await axios.get(`${HTTP_URL}/api/v1/room/status/${id}?sharedKey=${sharedKey}`, { withCredentials: true });
                if (response.data.check) {
                    setAuthorized(true);
                    setsKey(response.data.sharedKey);
                    console.log(response.data.sharedKey);
                }
                setLoading(false);
            } catch {
                setLoading(false);
                setAuthorized(false);
            }
        }
        fetch();
    }, [id, sharedKey]);

    const handleSignout = () => {
        // setActiveTab('logout');
        try {
            roter.push('/dashboard');
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
        return <RoomCanvas roomId={id} sharedKey={sKey} />
    }

    return (
        <Authorized quitfunc={handleSignout} />
    )
}
"use client"
import { Clock, FolderOpen, HelpCircle, Layers, LogOut, Menu, Plus, Search, Settings, Share2, Star, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { CreateRoomModal } from "./pop-ups/CreateRoomModal"; // Import the modal component
import { useRouter } from "next/navigation";
import { HTTP_URL } from "@/middleware";
import { getFavorites, setFavorite } from "@/draw/indexedDB";
import { ShareRoomModal } from "./pop-ups/ShareRoomModal";
import { Loader } from "../Fetch/Loader";
import { AuthComp } from "../Fetch/AuthComp";

type ProjectColor = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'teal';

interface Room {
    id: number;
    slug: string;
    createAt: string;
    sharedKey: string;
}

interface RoomWithUI extends Room {
    title: string;
    thumbnail: ProjectColor;
    isFavourite: boolean;
}

export function DashBoard() {

    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticatd] = useState(false);
    const [firstLetter, setFirstLetter] = useState("A");
    const [activeTab, setActiveTab] = useState('recent');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [data, setData] = useState<RoomWithUI[]>([]);
    const [projects, setProjects] = useState<RoomWithUI[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // State for modal visibility
    const [isShareModalOpen, setIsShareModalOpen] = useState({ check: false, sharedKey: "", roomId: "" });


    useEffect(() => {
        fetchRooms();
    }, []);

    // Function to fetch rooms
    async function fetchRooms() {
        try {
            const response = await axios.get(`${HTTP_URL}/api/v1/user/rooms/all`, { withCredentials: true });

            // console.log('API Response:', response.data);
            // Check if the response has the rooms property
            const roomsData = response.data.rooms || [];
            const nfl: string = response.data.nfl;

            const favMap = await getFavorites();

            // Transform the data to match our UI requirements
            const transformedRooms = roomsData.map((room: Room) => {
                // Generate a random color for room thumbnails
                return {
                    ...room,
                    title: `${room.slug}`,
                    isFavourite: favMap[room.id] || false,
                    // Use slug as part of the title
                };
            });

            // console.log(response.data);
            const recentRooms = transformedRooms.slice(-5);
            setFirstLetter(nfl.toUpperCase());
            setData(transformedRooms);
            setProjects(recentRooms);
            setIsAuthenticatd(true);
            setLoading(false);
        } catch (error) {
            const err = error as AxiosError;
            console.log(err.response?.status);
            setIsAuthenticatd(false);
            setLoading(false);
            if (err.response?.status === 401) {
                setIsAuthenticatd(false);
            }
        }
    }

    const toggleFavorite = async (roomId: number) => {
        const updatedProjects = projects.map((project) =>
            project.id === roomId
                ? { ...project, isFavourite: !project.isFavourite }
                : project
        );
        setProjects(updatedProjects);
        setData(updatedProjects);
        const updatedRoom = updatedProjects.find((r) => r.id === roomId);
        if (updatedRoom) {
            await setFavorite(roomId, updatedRoom.isFavourite);
        }
    };

    const handleShareRoomModalClose = () => {
        setIsShareModalOpen({ check: false, sharedKey: "", roomId: "" });
    };

    // Handle open modal
    const handleOpenCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    // Handle close modal
    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
    };

    // Handle after room is created
    const handleRoomCreated = () => {
        // Refresh the rooms list
        fetchRooms();
    };

    // Handle Signout
    const handleSignout = async () => {
        // setActiveTab('logout');
        try {
            await axios.post(`${HTTP_URL}/api/v1/auth/signout`, {}, { withCredentials: true });
            localStorage.clear();
            router.push('/signin');
        } catch {
            alert("Wait for a second!..");
        }
    }

    // Project card thumbnail component
    const ProjectThumbnail = ({ color }: { color: ProjectColor }) => {
        const bgColor = {
            blue: 'bg-blue-200',
            green: 'bg-green-200',
            purple: 'bg-purple-200',
            orange: 'bg-orange-200',
            red: 'bg-red-200',
            teal: 'bg-teal-200'
        }[color];

        return (
            <div className={`w-full h-32 rounded-t-lg ${bgColor} flex items-center justify-center`}>
                <Layers className="text-gray-600" size={40} />
            </div>
        );
    };

    if (loading) {
        return (
            <Loader />
        )
    }

    if (!isAuthenticated) {
        return (
              <AuthComp quitfunc={handleSignout}/>
        )
    }
    return (
        <div className="bg-[#0a0a19] min-h-screen">
            {/* Nav-bar */}
            <nav className="shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="flex justify-between h-16">
                        {/* Title and Logo */}
                        <div className="flex items-center gap-2">
                            <Image
                                className="w-7 h-7"
                                src="/weblogo.svg"
                                alt="logo"
                                width={35}
                                height={35}
                                draggable="false"
                            />
                            <span className="text-xl md:text-2xl lg:text-3xl font-bold text-white">DoodleArt</span>
                        </div>

                        {/* Desktop menu */}
                        <div className="hidden md:flex items-center">
                            <div className="relative mx-4">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>

                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Search drawings..."
                                />
                            </div>

                            <button className="p-2 rounded-full text-gray-400 hover:text-gray-500">
                                <HelpCircle className="h-6 w-6" />
                            </button>

                            <button className="p-2 rounded-full text-gray-400 hover:text-gray-500">
                                <Settings className="h-6 w-6" />
                            </button>

                            <div className="ml-3 relative">
                                <div>
                                    <button className="bg-gray-800 flex text-sm rounded-full focus:outline-none">
                                        <span className="h-8 w-8 rounded-full bg-[#5f00a3] flex items-center justify-center text-white font-medium">
                                            {firstLetter}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Mobile menu buttons */}
                        <div className="flex items-center md:hidden">
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className="p-2 rounded-full text-gray-400 hover:text-gray-500"
                            >
                                <Search className="h-6 w-6" />
                            </button>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 rounded-full text-gray-400 hover:text-gray-500 ml-2"
                            >
                                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile search bar */}
                    {isSearchOpen && (
                        <div className="pt-2 pb-3 md:hidden">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Search drawings..."
                                />
                            </div>
                        </div>
                    )}

                    {/* Mobile menu */}
                    {isMenuOpen && (
                        <div className="pt-2 pb-3 space-y-1 md:hidden">
                            <div className="flex items-center justify-around">
                                <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 flex flex-col items-center">
                                    <HelpCircle className="h-6 w-6" />
                                    <span className="text-xs mt-1">Help</span>
                                </button>

                                <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 flex flex-col items-center">
                                    <Settings className="h-6 w-6" />
                                    <span className="text-xs mt-1">Settings</span>
                                </button>

                                <div className="flex flex-col items-center">
                                    <button className="bg-gray-800 flex text-sm rounded-full focus:outline-none">
                                        <span className="h-8 w-8 rounded-full bg-[#5f00a3] flex items-center justify-center text-white font-medium">
                                            {firstLetter}
                                        </span>
                                    </button>
                                    <span className="text-xs mt-1 text-gray-400">Profile</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Nav-bar bottom border */}
            <div className="border-t border-gray-700"></div>

            {/* Main component */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-wrap md:flex-nowrap">

                    {/* Left sidebar */}
                    <div className="w-full md:w-64 mb-6 md:mb-0 md:mr-8">
                        <nav className="space-y-1">
                            <button onClick={() => { setActiveTab('recent'); const filltered = data.slice(-5); setProjects(filltered); }} className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'recent' ? 'bg-[#5f00a353] text-[#e3bcff]' : 'hover:bg-[#5f00a353]'}`}>
                                <Clock className="mr-3 h-5 w-5" />
                                <span>Recent</span>
                            </button>
                            <button onClick={() => { setActiveTab('starred'); const filltered = data.filter(p => p.isFavourite); setProjects(filltered) }} className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'starred' ? 'bg-[#5f00a353] text-[#e3bcff]' : 'hover:bg-[#5f00a353]'}`}>
                                <Star className="mr-3 h-5 w-5" />
                                <span>Starred</span>
                            </button>
                            <button onClick={() => { setActiveTab('alldraw'); setProjects(data); }} className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'alldraw' ? 'bg-[#5f00a353] text-[#e3bcff]' : 'hover:bg-[#5f00a353]'}`}>
                                <FolderOpen className="mr-3 h-5 w-5" />
                                <span>All Drawings</span>
                            </button>
                            {/* <button onClick={() => { setActiveTab('shared') }} className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'shared' ? 'bg-[#5f00a353] text-[#e3bcff]' : 'hover:bg-[#5f00a353]'}`}>
                                <Users className="mr-3 h-5 w-5" />
                                <span>Shared with me</span>
                            </button> */}
                            <button onClick={() => { setActiveTab('trash') }} className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'trash' ? 'bg-[#5f00a353] text-[#e3bcff]' : 'hover:bg-[#5f00a353]'}`}>
                                <Trash2 className="mr-3 h-5 w-5" />
                                <span>Trash</span>
                            </button>
                            <div className="pt-4 border-t border-gray-700">
                                <button onClick={handleSignout} className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-500 ${activeTab === 'logout' ? 'bg-[#ff000047] text-[#e3bcff]' : 'hover:bg-[#ff000047]'}`}>
                                    <LogOut className="mr-3 h-5 w-5" />
                                    <span>Log out</span>
                                </button>
                            </div>
                        </nav>
                    </div>

                    {/* Main content area */}
                    <div className="flex-1">
                        {/* Button and Active tab heading */}
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-white">
                                {activeTab === 'recent' ? 'Recent Drawings' :
                                    activeTab === 'starred' ? 'Starred Drawings' :
                                        activeTab === 'alldraw' ? 'All Drawings' :
                                            activeTab === 'shared' ? 'Shared with me' :
                                                activeTab === 'trash' ? 'Trash' : 'Drawings'}
                            </h1>
                            {(activeTab === 'recent') && <button
                                onClick={handleOpenCreateModal}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#5f00a3] hover:bg-[#5f00a3b4] focus:outline-none"
                            >
                                <Plus className="mr-2 h-5 w-5" />
                                New Drawing
                            </button>}
                        </div>

                        {/* Grid of projects */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project) => (
                                <div key={project.id} className="bg-[#191933] rounded-lg shadow overflow-hidden">
                                    <button onClick={() => { router.push(`/canvas/${project.id}`) }} className="w-full cursor-pointer"><ProjectThumbnail color={project.thumbnail} /></button>
                                    <div className="p-4">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-lg font-medium text-white">{project.title}</h3>
                                            <button className={`text-gray-400 ${project.isFavourite ? 'text-yellow-400' : 'hover:text-yellow-500'}`} onClick={() => toggleFavorite(project.id)}>
                                                <Star className="h-5 w-5" fill={project.isFavourite ? 'currentColor' : 'none'} />
                                            </button>
                                        </div>
                                        <div className="mt-2 flex justify-between items-center">
                                            <p className="text-sm text-gray-500">Created {timeAgo(project.createAt)}</p>
                                            <button className="p-1 rounded-full text-gray-400 hover:text-gray-500" onClick={() => { setIsShareModalOpen({ check: true, sharedKey: project.sharedKey, roomId: String(project.id) }) }}>
                                                <Share2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(activeTab === 'recent') && <div className="bg-[#191933] rounded-lg shadow overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center">
                                <div className="text-center p-6">
                                    <button
                                        className="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-400"
                                        onClick={handleOpenCreateModal}
                                    >
                                        <Plus className="h-6 w-6 text-gray-600" />
                                    </button>
                                    <h3 className="mt-2 text-sm font-medium text-white">Create new drawing</h3>
                                    <p className="mt-1 text-sm text-gray-500">Start with a blank canvas</p>
                                </div>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Room Modal (pop-up) */}
            <CreateRoomModal
                isOpen={isCreateModalOpen}
                onClose={handleCloseCreateModal}
                onRoomCreated={handleRoomCreated}
            />


            <ShareRoomModal
                isOpen={isShareModalOpen.check}
                sharedKey={isShareModalOpen.sharedKey}
                roomId={isShareModalOpen.roomId}
                onClose={handleShareRoomModalClose}
            />
        </div>
    );
}

function timeAgo(dateString: string): string {
    const now = new Date();
    const past = new Date(dateString);
    const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    const intervals: { [key: string]: number } = {
        year: 31536000,
        month: 2592000,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
    };

    for (const [unit, value] of Object.entries(intervals)) {
        const amount = Math.floor(seconds / value);
        if (amount >= 1) {
            return `${amount} ${unit}${amount > 1 ? 's' : ''} ago`;
        }
    }

    return "just now";
}

// color - #5f00a3
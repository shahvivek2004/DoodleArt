"use client";
import {
  Clock,
  FolderOpen,
  HelpCircle,
  Layers,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  Star,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { CreateRoomModal } from "./pop-ups/CreateRoomModal"; // Import the modal component
import { useRouter } from "next/navigation";
import { HTTP_URL } from "@/middleware";
import {
  getFavorites,
  getTrashData,
  setFavorite,
  setTrashData,
} from "@/draw/indexedDB";
import { ShareRoomModal } from "./pop-ups/ShareRoomModal";
import { Loader } from "../Fetch/Loader";
import { AuthComp } from "../Fetch/AuthComp";
import { Dropdown } from "./dropdown/Dropdown";
import { Instruction } from "../Canvas/Instruction";

type ProjectColor = "blue" | "green" | "purple" | "orange" | "red" | "teal";

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
  isInTrash: boolean;
}

type TabType = "recent" | "alldraw" | "trash" | "starred" | "logout";

export function DashBoard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [abuseLoad, setAbuseLoad] = useState(false);
  const [isAuthenticated, setIsAuthenticatd] = useState(false);
  const [firstLetter, setFirstLetter] = useState("A");
  const [activeTab, setActiveTab] = useState<TabType>("recent");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [data, setData] = useState<RoomWithUI[]>([]);
  const [projects, setProjects] = useState<RoomWithUI[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // State for modal visibility
  const [isShareModalOpen, setIsShareModalOpen] = useState({
    check: false,
    sharedKey: "",
    roomId: "",
  });
  const [instructionModal, setInstructionModal] = useState({
    isOpen: false,
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    handleActiveTab(activeTab);
  }, [data, activeTab]);

  // Function to fetch rooms
  async function fetchRooms() {
    try {
      const response = await axios.get(`${HTTP_URL}/api/v1/user/rooms/all`, {
        withCredentials: true,
      });

      // console.log('API Response:', response.data);
      // Check if the response has the rooms property
      const roomsData = response.data.rooms || [];
      const nfl: string = response.data.nfl;

      const favMap = await getFavorites();
      // console.log("Favorites check!");
      // console.log(favMap);
      const trashMap = await getTrashData();
      // console.log("Trash Check!");
      // console.log(trashMap);

      // Transform the data to match our UI requirements
      const transformedRooms = roomsData.map((room: Room) => {
        // Generate a random color for room thumbnails
        return {
          ...room,
          title: `${room.slug}`,
          isFavourite: favMap[room.id] || false,
          isInTrash: trashMap[room.id] || false,
          // Use slug as part of the title
        };
      });

      //console.log(transformedRooms);
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

  const handleActiveTab = (currTab: string) => {
    if (currTab == "recent") {
      const filltered = data.filter((p) => !p.isInTrash);
      const finalFilltered = filltered.slice(-5);
      setProjects(finalFilltered);
    } else if (currTab == "starred") {
      const filltered = data.filter((p) => p.isFavourite && !p.isInTrash);
      setProjects(filltered);
    } else if (currTab == "alldraw") {
      const filltered = data.filter((p) => !p.isInTrash);
      setProjects(filltered);
    } else if (currTab == "trash") {
      const filltered = data.filter((p) => p.isInTrash);
      setProjects(filltered);
    }
    //console.log(projects);
  };

  const toggleFavorite = async (roomId: number) => {
    const updatedProjects = data.map((project) =>
      project.id === roomId
        ? { ...project, isFavourite: !project.isFavourite }
        : project
    );
    setData(updatedProjects);
    const updatedRoom = updatedProjects.find((r) => r.id === roomId);
    if (updatedRoom) {
      await setFavorite(roomId, updatedRoom.isFavourite);
    }
  };

  const handleTrash = async (roomId: number) => {
    const updatedProjects = data.map((project) =>
      project.id === roomId
        ? { ...project, isInTrash: !project.isInTrash }
        : project
    );
    const updatedRoom = updatedProjects.find((ele) => ele.id === roomId);
    if (updatedRoom) {
      await setTrashData(roomId, updatedRoom.isInTrash);
    }

    setData(updatedProjects);
  };

  const handleInstructionModalClose = () => {
    setInstructionModal({ isOpen: false });
  };

  const handleShareRoomModalOpen = (key: string, id: number) => {
    setIsShareModalOpen({
      check: true,
      sharedKey: key,
      roomId: String(id),
    });
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
    setAbuseLoad(true);
    try {
      await axios.post(
        `${HTTP_URL}/api/v1/auth/signout`,
        {},
        { withCredentials: true }
      );
      localStorage.clear();
      router.push("/signin");
    } catch {
      alert("Wait for a second!..");
    } finally {
      setAbuseLoad(false);
    }
  };

  // Project card thumbnail component
  const ProjectThumbnail = ({ color }: { color: ProjectColor }) => {
    const bgColor = {
      blue: "bg-blue-200",
      green: "bg-green-200",
      purple: "bg-purple-200",
      orange: "bg-orange-200",
      red: "bg-red-200",
      teal: "bg-teal-200",
    }[color];

    return (
      <div
        className={`w-full h-32 rounded-t-lg ${bgColor} flex items-center justify-center`}
      >
        <Layers className="text-gray-600" size={40} />
      </div>
    );
  };

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <AuthComp quitfunc={handleSignout} />;
  }
  return (
    <div className="bg-[#121212] h-screen flex flex-col overflow-hidden ">
      {/* Nav-bar */}
      <nav className="shadow-sm flex-shrink-0">
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
              <span className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
                DoodleArt
              </span>
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

              <button
                className="p-2 rounded-full text-gray-400 hover:text-gray-500"
                onClick={() => {
                  setInstructionModal({ isOpen: true });
                }}
              >
                <HelpCircle className="h-6 w-6" />
              </button>

              <button className="p-2 rounded-full text-gray-400 hover:text-gray-500">
                <Settings className="h-6 w-6" />
              </button>

              <div className="ml-3 relative">
                <div>
                  <button className="bg-gray-800 flex text-sm rounded-full focus:outline-none">
                    <span className="h-8 w-8 rounded-full bg-[#9a00e1] flex items-center justify-center text-white font-medium">
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
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
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
                <button
                  className="p-2 rounded-full text-gray-400 hover:text-gray-500 flex flex-col items-center"
                  onClick={() => {
                    setInstructionModal({ isOpen: true });
                  }}
                >
                  <HelpCircle className="h-6 w-6" />
                  <span className="text-xs mt-1">Help</span>
                </button>

                <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 flex flex-col items-center">
                  <Settings className="h-6 w-6" />
                  <span className="text-xs mt-1">Settings</span>
                </button>

                <div className="flex flex-col items-center">
                  <button className="bg-gray-800 flex text-sm rounded-full focus:outline-none">
                    <span className="h-8 w-8 rounded-full bg-[#9a00e1] flex items-center justify-center text-white font-medium">
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
      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full">
          <div className="flex flex-col md:flex-row mx-auto h-full">
            {/* Left sidebar */}
            <div className="w-full md:w-64 mb-6 md:mb-0 md:mr-8 flex-shrink-0">
              <nav className="space-y-1">
                <button
                  onClick={() => {
                    setActiveTab("recent");
                    handleActiveTab("recent");
                  }}
                  className={`w-full cursor-pointer flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === "recent" ? "bg-[#5f00a353] text-[#e3bcff]" : "hover:bg-[#5f00a353] text-white"}`}
                >
                  <Clock className="mr-3 h-5 w-5" />
                  <span>Recent</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab("starred");
                    handleActiveTab("starred");
                  }}
                  className={`w-full cursor-pointer flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === "starred" ? "bg-[#5f00a353] text-[#e3bcff]" : "hover:bg-[#5f00a353] text-white"}`}
                >
                  <Star className="mr-3 h-5 w-5" />
                  <span>Favourites</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab("alldraw");
                    handleActiveTab("alldraw");
                  }}
                  className={`w-full cursor-pointer flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === "alldraw" ? "bg-[#5f00a353] text-[#e3bcff]" : "hover:bg-[#5f00a353] text-white"}`}
                >
                  <FolderOpen className="mr-3 h-5 w-5" />
                  <span>All Drawings</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab("trash");
                    handleActiveTab("trash");
                  }}
                  className={`w-full cursor-pointer flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === "trash" ? "bg-[#5f00a353] text-[#e3bcff]" : "hover:bg-[#5f00a353] text-white"}`}
                >
                  <Trash2 className="mr-3 h-5 w-5" />
                  <span>Trash</span>
                </button>
                <div className="pt-4 border-t border-gray-700">
                  <button
                    disabled={abuseLoad}
                    onClick={handleSignout}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-500 ${abuseLoad ? "bg- cursor-not-allowed" : "cursor-pointer"} ${activeTab === "logout" ? "bg-[#ff000047] text-[#e3bcff]" : "hover:bg-[#ff000047] "}`}
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    <span>Log out</span>
                  </button>
                </div>
              </nav>
            </div>

            {/* Main content area */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* Button and Active tab heading */}
              <div className="flex justify-between items-center mb-6 flex-shrink-0">
                <h1 className="text-2xl font-bold text-white px-4 py-2">
                  {activeTab === "recent"
                    ? "Recent Drawings"
                    : activeTab === "starred"
                      ? "Starred Drawings"
                      : activeTab === "alldraw"
                        ? "All Drawings"
                        : activeTab === "trash"
                          ? "Trash"
                          : "Drawings"}
                </h1>
                {activeTab === "recent" && (
                  <button
                    onClick={handleOpenCreateModal}
                    className="inline-flex items-center cursor-pointer px-2 md:px-4 py-2 border border-transparent text-xs md:text-sm font-medium rounded-md shadow-sm text-white bg-[#9a00e1] hover:bg-[#ae00ff86] focus:outline-none"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    New Drawing
                  </button>
                )}
              </div>

              {/* Grid of projects */}
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                  {/* Projects */}
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-[#232329] rounded-lg shadow overflow-visible"
                    >
                      {activeTab !== "trash" ? (
                        <button
                          onClick={() => {
                            router.push(`/canvas/${project.id}?sharedKey=${project.sharedKey}`);
                          }}
                          className="w-full cursor-pointer"
                        >
                          <ProjectThumbnail color={project.thumbnail} />
                        </button>
                      ) : (
                        <button className="w-full">
                          <ProjectThumbnail color={project.thumbnail} />
                        </button>
                      )}
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-medium text-white">
                            {project.title}
                          </h3>
                        </div>

                        <div className="mt-2 flex justify-between items-center gap-3">
                          <p className="text-sm text-gray-400">
                            Created {timeAgo(project.createAt)}
                          </p>

                          <Dropdown
                            roomId={project.id}
                            sharedKey={project.sharedKey}
                            isFavourite={project.isFavourite}
                            activeTab={activeTab}
                            toggleFavorite={toggleFavorite}
                            shareRoomModal={handleShareRoomModalOpen}
                            trashCollection={handleTrash}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Create new project grid */}
                  {activeTab === "recent" && (
                    <div className="bg-[#232329] rounded-lg shadow overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <div className="text-center p-6">
                        <button
                          className="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-400 cursor-pointer"
                          onClick={handleOpenCreateModal}
                        >
                          <Plus className="h-6 w-6 text-gray-600" />
                        </button>
                        <h3 className="mt-2 text-sm font-medium text-white">
                          Create new drawing
                        </h3>
                        <p className="mt-1 text-sm text-gray-400">
                          Start with a blank canvas
                        </p>
                      </div>
                    </div>
                  )}
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

          <Instruction
            isOpen={instructionModal.isOpen}
            onClose={handleInstructionModalClose}
          />
        </div>
        <style jsx>{`
          .custom-scrollbar {
            scrollbar-gutter: stable;
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #27272a;
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #52525b;
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #71717a;
          }
          .custom-scrollbar::-webkit-scrollbar-corner {
            background: #27272a;
          }
        `}</style>
      </div>
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
    second: 1,
  };

  for (const [unit, value] of Object.entries(intervals)) {
    const amount = Math.floor(seconds / value);
    if (amount >= 1) {
      return `${amount} ${unit}${amount > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

// color - #5f00a3

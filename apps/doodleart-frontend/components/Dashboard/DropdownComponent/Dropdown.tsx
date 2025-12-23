import { History, MoreVertical, Share2, Star, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const Dropdown = ({
  roomId,
  activeTab,
  sharedKey,
  isFavourite,
  toggleFavorite,
  shareRoomModal,
  trashCollection,
}: {
  roomId: number;
  sharedKey: string;
  activeTab: string;
  isFavourite: boolean;
  toggleFavorite: (roomId: number) => void;
  shareRoomModal: (key: string, id: number) => void;
  trashCollection: (roomId: number) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const handleMenuClick = (type: string) => {
    if (type === "f") {
      toggleFavorite(roomId);
    } else if (type === "s") {
      shareRoomModal(sharedKey, roomId);
    } else if (type === "t") {
      trashCollection(roomId);
    } else if (type === "d") {
      // permanent delete
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-600 rounded-full transition-colors duration-200 cursor-pointer"
        aria-label="More options"
      >
        <MoreVertical size={20} className="text-gray-400" />
      </button>

      {/* Dropdown Menu */}
      {isOpen &&
        (activeTab !== "trash" ? (
          <div
            ref={menuRef}
            className="absolute right-0 top-full mt-1 w-48 bg-[#1f1f2d] rounded-lg shadow-lg z-10 text-white text-sm"
          >
            {/* Add to Favourite */}
            <button
              onClick={() => handleMenuClick("f")}
              className={`w-full cursor-pointer px-4 py-2 text-left hover:bg-gray-600 flex items-center gap-3 hover:text-yellow-500 text-yellow-400 transition-colors duration-150 font-medium rounded-lg`}
            >
              <Star size={16} fill={isFavourite ? "currentColor" : "none"} />
              {/* <Heart  className="text-gray-500" /> */}
              {isFavourite ? "Added to Favourites" : "Add to Favourites"}
            </button>

            {/* Share to Others */}
            <button
              onClick={() => handleMenuClick("s")}
              className="w-full px-4 py-2 text-left hover:bg-gray-600 flex items-center gap-3 cursor-pointer transition-colors duration-150 font-medium rounded-lg"
            >
              <Share2 size={16} className="text-blue-500" />
              Share to Others
            </button>

            {/* Divider */}
            <hr className="my-1 border-gray-600" />

            {/* Move to Trash */}
            <button
              onClick={() => handleMenuClick("t")}
              className="w-full px-4 py-2 text-left hover:bg-[#873939] flex items-center gap-3 cursor-pointer text-red-600 transition-colors duration-150 font-medium rounded-lg"
            >
              <Trash2 size={16} className="text-red-500" />
              Move to Trash
            </button>
          </div>
        ) : (
          <div
            ref={menuRef}
            className="absolute right-0 top-full mt-1 w-48 bg-[#1f1f2d] rounded-lg shadow-lg z-10 text-white text-sm"
          >
            <button
              onClick={() => handleMenuClick("t")}
              className={`w-full cursor-pointer px-4 py-2 text-left hover:bg-gray-600 flex items-center gap-3 hover:text-green-500 text-green-400 transition-colors duration-150 font-medium rounded-lg`}
            >
              <History size={16} />
              Restore
            </button>
            {/* <hr className="my-1 border-gray-600" /> */}

            {/* Permanent Delete */}
            {/* <button
              onClick={() => handleMenuClick("d")}
              className="w-full px-4 py-2 text-left hover:bg-[#873939] flex items-center gap-3 cursor-pointer text-red-600 transition-colors duration-150 font-medium rounded-lg"
            >
              <Trash2 size={16} className="text-red-500" />
              Delete Permanently
            </button> */}
          </div>
        ))}
    </div>
  );
};

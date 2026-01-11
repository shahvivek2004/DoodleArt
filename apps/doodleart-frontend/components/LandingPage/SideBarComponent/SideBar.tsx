"use client";
import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import NavButton from "../NavBarComponent/ButtonComponent/NavButton";

export default function SideBar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  return (
    <div>
      {/* NavBar for Mobile screens */}
      <div className="lg:hidden flex justify-between items-center p-4 text-[#5f00a3] bg-white gap-8 font-medium">
        {/* Logo and Title */}
        <NavButton
          style="text-3xl font-bold text-black flex flex-row gap-2 cursor-pointer justify-center items-center"
          route="/"
        >
          <>
            <Image
              src="/weblogo.svg"
              alt="logo"
              width={50}
              height={50}
              draggable="false"
              priority
            />
            <div>DoodleArt</div>
          </>
        </NavButton>

        {/* Menu Button - Scroll Bar */}
        <button
          className="flex flex-row border border-[#b3b3b3] w-20 h-10 rounded-3xl justify-center items-center gap-1 hover:bg-[#b59fc45c] cursor-pointer"
          onClick={() => {
            setIsSidebarOpen(true);
          }}
        >
          <Image
            src="/menu.svg"
            alt="menu"
            width={18}
            height={18}
            loading="eager"
          />
          <div className="text-sm">Menu</div>
        </button>
      </div>

      {/* SideBar */}
      <div
        className={`fixed inset-0 z-50 bg-[#f0f0f0] bg-opacity-50 ${isSidebarOpen ? "block" : "hidden"} lg:hidden  text-[#5f00a3]`}
        onClick={() => setIsSidebarOpen(false)}
      >
        <div
          className="h-full w-55 bg-white p-1 transform transition-transform duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Cross Button */}
          <div className="flex w-full justify-end mb-3">
            <button
              className="hover:bg-[#b59fc45c] p-1 rounded-full cursor-pointer"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={24} />
            </button>
          </div>

          {/* Site Logos */}
          <NavButton
            style="flex flex-row justify-center items-center mb-8 gap-1 cursor-pointer"
            route="/"
          >
            <>
              <Image
                src="/weblogo.svg"
                alt="logo"
                width={50}
                height={50}
                draggable="false"
                priority
              />
              <h2 className="text-3xl font-bold text-black">DoodleArt</h2>
            </>
          </NavButton>

          {/* Buttons */}
          <div className="flex flex-col gap-6 text-lg justify-center items-center font-semibold">
            {/* Routing Buttons */}
            <div className="w-full">
              <NavButton
                style="hover:bg-[#b59fc45c] w-full text-left p-2 rounded-lg flex gap-2 cursor-pointer"
                route="/dashboard"
              >
                <>
                  <div className="w-8 h-8 flex items-center justify-center">
                    <Image
                      src="/dashboard.svg"
                      alt="dashboard"
                      width={24}
                      height={24}
                      draggable="false"
                      loading="eager"
                    />
                  </div>
                  <span>Dashboard</span>
                </>
              </NavButton>

              <NavButton
                style="hover:bg-[#b59fc45c] w-full text-left p-2 rounded-lg flex gap-2 cursor-pointer"
                route="/about"
              >
                <>
                  <div className="w-8 h-8 flex items-center justify-center">
                    <Image
                      src="/platform.svg"
                      alt="platform"
                      width={24}
                      height={24}
                      draggable="false"
                      loading="eager"
                    />
                  </div>
                  <span>About</span>
                </>
              </NavButton>

              <NavButton
                style="hover:bg-[#b59fc45c] w-full text-left p-2 rounded-lg flex gap-2 cursor-pointer"
                route="/contact-us"
              >
                <>
                  <div className="w-8 h-8 flex items-center justify-center">
                    <Image
                      src="/contact.svg"
                      alt="contact"
                      width={24}
                      height={24}
                      draggable="false"
                      loading="eager"
                    />
                  </div>
                  <span>Contact</span>
                </>
              </NavButton>

              <a
                href="https://discord.gg/EPcJrBmjUW"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-[#b59fc45c] w-full text-left p-2 rounded-lg flex gap-2 cursor-pointer transition-colors"
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <Image
                    src="/discord.svg"
                    alt=""
                    width={24}
                    height={24}
                    draggable="false"
                    loading="eager"
                  />
                </div>
                <span>Discord</span>
              </a>
              <a
                href="https://github.com/shahvivek2004/DoodleArt"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-[#b59fc45c] w-full text-left p-2 rounded-lg flex gap-2 cursor-pointer transition-colors"
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <Image
                    src="/github.svg"
                    alt=""
                    width={24}
                    height={24}
                    draggable="false"
                    loading="eager"
                  />
                </div>
                <span>GitHub</span>
              </a>
            </div>

            {/* SignIn and SignUp Buttons */}
            <div className="w-full flex flex-col gap-2 mt-3 items-center">
              <NavButton
                style="hover:bg-[#b59fc45c] w-[90%] p-2 rounded-lg text-center border border-gray-400 cursor-pointer"
                route="/signin"
              >
                <span>Sign In</span>
              </NavButton>

              <NavButton
                style="hover:bg-[#8131e989] w-[90%] p-2 rounded-lg text-center border border-white bg-[#8131e9] text-white cursor-pointer"
                route="/signup"
              >
                <span>Sign Up</span>
              </NavButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

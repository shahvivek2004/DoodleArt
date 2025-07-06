"use client";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SideBar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const router = useRouter();
    return (
        <div>
            {/* NavBar for Mobile screens */}
            <div className="lg:hidden flex justify-between items-center p-4 text-[#5f00a3] bg-white gap-8 font-medium">

                {/* Logo and Title */}
                <button className="text-3xl font-bold text-black flex flex-row gap-2" onClick={()=>{router.push('/')}}>
                    <Image src="/weblogo.svg" alt='logo' width={35} height={35} draggable='false' />
                    <div>
                        DoodleArt
                    </div>
                </button>

                {/* Menu Button - Scroll Bar */}
                <button className="flex flex-row border border-[#b3b3b3] w-20 h-10 rounded-3xl justify-center items-center gap-1 hover:bg-[#b59fc45c]" onClick={() => { setIsSidebarOpen(true) }}>
                    <Image src='/menu.svg' alt="menu" width={18} height={18} />
                    <div className="text-sm">Menu</div>
                </button>
            </div>

            {/* SideBar */}
            <div className={`fixed inset-0 z-50 bg-[#f0f0f0] bg-opacity-50 ${isSidebarOpen ? "block" : "hidden"} lg:hidden  text-[#5f00a3]`} onClick={() => setIsSidebarOpen(false)}>
                <div className="h-full w-55 bg-white p-1 transform transition-transform duration-300" onClick={(e) => e.stopPropagation()} >

                    {/* Cross Button */}
                    <div className="flex w-full justify-end mb-3">
                        <button className="hover:bg-[#b59fc45c] p-1 rounded-full" onClick={() => setIsSidebarOpen(false)}><X size={24} /></button>
                    </div>

                    {/* Site Logos */}
                    <button className="flex items-center mb-8 gap-2.5" onClick={()=>{router.push('/')}}>
                        <Image src="/weblogo.svg" alt='logo' width={30} height={30} draggable='false' />
                        <h2 className="text-3xl font-bold text-black">DoodleArt</h2>
                    </button>

                    {/* Buttons */}
                    <div className="flex flex-col gap-6 text-lg justify-center items-center font-semibold">

                        {/* Routing Buttons */}
                        <div className="w-full">
                            <button className="hover:bg-[#b59fc45c] w-full text-left p-1 rounded-lg flex gap-2" onClick={()=>{router.push('/dashboard')}}>
                                <div className="w-8 h-8 flex items-center justify-center">
                                    <Image src="/dashboard.svg" alt="dashboard" width={24} height={24} draggable="false" />
                                </div>
                                <span>Dashboard</span>
                            </button>
                            <button className="hover:bg-[#b59fc45c] w-full text-left p-1  rounded-lg flex gap-2" onClick={()=>{router.push('/about')}}>
                                <div className="w-8 h-8 flex items-center justify-center">
                                    <Image src="/platform.svg" alt="platform" width={24} height={24} draggable="false" />
                                </div>
                                <span>About</span>
                            </button>
                            <button className="hover:bg-[#b59fc45c] w-full text-left p-1 rounded-lg flex gap-2" onClick={()=>{router.push('/contact-us')}}>
                                <div className="w-8 h-8 flex items-center justify-center">
                                    <Image src="/contact.svg" alt="contact" width={24} height={24} draggable="false" />
                                </div>
                                <span>Contact</span>
                            </button>
                            <a href="https://discord.gg/EPcJrBmjUW">
                                <button className="hover:bg-[#b59fc45c] w-full text-left p-1 rounded-lg flex gap-2">
                                    <div className="w-8 h-8 flex items-center justify-center">
                                        <Image src="/discord.svg" alt="discord" width={24} height={24} draggable="false" />
                                    </div>
                                    <p>Discord</p>
                                </button>
                            </a>

                            <a href="">
                                <button className="hover:bg-[#b59fc45c] w-full text-left p-1 rounded-lg flex gap-2">
                                    <div className="w-8 h-8 flex items-center justify-center">
                                        <Image src="/github.svg" alt="github" width={24} height={24} draggable="false" />
                                    </div>
                                    <p>GitHub</p>
                                </button>
                            </a>
                        </div>

                        {/* SignIn and SignUp Buttons */}
                        <div className="w-full flex flex-col gap-2 mt-3 items-center">
                            <button className="hover:bg-[#b59fc45c] w-[90%] p-2 rounded-lg text-center border border-gray-400" onClick={() => { router.push('/signin') }}>
                                <span>Sign In</span>
                            </button>
                            <button className="hover:bg-[#8131e989] w-[90%] p-2 rounded-lg text-center border border-white bg-[#8131e9] text-white" onClick={() => { router.push('/signup') }}>
                                <span>Sign Up</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
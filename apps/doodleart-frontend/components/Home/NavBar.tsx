"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NavBar() {
    const router = useRouter();
    return (
        <div className="hidden lg:block">
            <div className="flex justify-between items-center p-4 text-[#5f00a3] bg-white gap-8 font-medium">

                {/*Logo Side */}
                <div className="flex flex-row gap-15 justify-center items-center">

                    {/* Logo and Title */}
                    <button className="text-3xl font-bold text-black flex flex-row gap-2 cursor-pointer" onClick={()=>{router.push('/')}}>
                        <Image src="/weblogo.svg" alt='logo' width={35} height={35} draggable='false' />
                        <div>
                            DoodleArt
                        </div>
                    </button>

                    {/* Buttons */}
                    <div className="flex flex-row gap-5">
                        <button className="hover:bg-[#b59fc45c] p-2 rounded-2xl cursor-pointer" onClick={()=>{router.push("/dashboard")}}>Dashboard</button>
                        <button className="hover:bg-[#b59fc45c] p-2 rounded-2xl cursor-pointer" onClick={()=>{router.push("/about")}}>About</button>
                        <button className="hover:bg-[#b59fc45c] p-2 rounded-2xl cursor-pointer" onClick={()=>{router.push("/contact-us")}}>Contact</button>
                    </div>
                </div>

                {/*Sign-In Side*/}
                <div className="flex flex-row gap-5 justify-center items-center">

                    {/*Github and Discord Logos */}
                    <a href="https://discord.gg/EPcJrBmjUW">
                        <button className="p-2 rounded-2xl hover:bg-[#b59fc45c] cursor-pointer">
                            <Image src='/discord.svg' alt="github" width={38} height={38} draggable='false' />
                        </button>
                    </a>
                    <a href="https://github.com/shahvivek2004/DoodleArt">
                        <button className="p-2 rounded-2xl hover:bg-[#b59fc45c] cursor-pointer">
                            <Image src='/github.svg' alt="github" width={35} height={35} draggable='false' />
                        </button>
                    </a>

                    {/* SignIn and SignUp Buttons */}
                    <div className="flex flex-row gap-3 font-semibold">
                        <button className="border border-gray-400 w-30 p-2 rounded-2xl hover:bg-[#b59fc45c] cursor-pointer" onClick={() => { router.push('/signin') }}>Sign In</button>
                        <button className="border border-white w-30 p-2 rounded-2xl bg-[#8131e9] text-white hover:bg-[#8131e989] cursor-pointer" onClick={() => { router.push('/signup') }}>Sign Up</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
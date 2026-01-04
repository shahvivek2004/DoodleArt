import Image from "next/image";
import NavButton from "./ButtonComponent/NavButton";

export default async function NavBar() {
  return (
    <div className="hidden lg:block">
      <div className="flex justify-between items-center p-4 text-[#5f00a3] bg-white gap-8 font-medium">
        {/*Logo Side */}
        <div className="flex flex-row gap-15 justify-center items-center">
          {/* Logo and Title */}
          <NavButton
            route="/"
            style="text-3xl font-bold text-black flex flex-row gap-2 cursor-pointer justify-center items-center"
          >
            <>
              <Image
                src="/weblogo.svg"
                alt="Doodleart-logo"
                width={50}
                height={50}
                draggable="false"
                priority
              />
              <div>DoodleArt</div>
            </>
          </NavButton>

          {/* Buttons */}
          <div className="flex flex-row gap-5">
            <NavButton
              route="/dashboard"
              style="hover:bg-[#b59fc45c] p-2 rounded-2xl cursor-pointer"
            >
              Dashboard
            </NavButton>
            <NavButton
              route="/about"
              style="hover:bg-[#b59fc45c] p-2 rounded-2xl cursor-pointer"
            >
              About
            </NavButton>
            <NavButton
              route="/contact-us"
              style="hover:bg-[#b59fc45c] p-2 rounded-2xl cursor-pointer"
            >
              Contact
            </NavButton>
          </div>
        </div>

        {/*Sign-In Side*/}
        <div className="flex flex-row gap-5 justify-center items-center">
          {/*Github and Discord Logos */}
          <a
            href="https://discord.gg/EPcJrBmjUW"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-2xl hover:bg-[#b59fc45c] cursor-pointer transition-colors inline-block"
            aria-label="Join our Discord community"
          >
            <Image
              src="/discord.svg"
              alt="Discord"
              width={38}
              height={38}
              draggable="false"
              loading="eager"
            />
          </a>

          <a
            href="https://github.com/shahvivek2004/DoodleArt"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-2xl hover:bg-[#b59fc45c] cursor-pointer transition-colors inline-block"
            aria-label="View project on GitHub"
          >
            <Image
              src="/github.svg"
              alt="GitHub"
              width={35}
              height={35}
              draggable="false"
              loading="eager"
            />
          </a>

          {/* SignIn and SignUp Buttons */}
          <div className="flex flex-row gap-3 font-semibold">
            <NavButton
              route="/signin"
              style="border border-gray-400 w-30 p-2 rounded-2xl hover:bg-[#b59fc45c] cursor-pointer"
            >
              Sign In
            </NavButton>
            <NavButton
              route="/signup"
              style="border border-white w-30 p-2 rounded-2xl bg-[#8131e9] text-white hover:bg-[#8131e989] cursor-pointer"
            >
              Sign Up
            </NavButton>
          </div>
        </div>
      </div>
    </div>
  );
}

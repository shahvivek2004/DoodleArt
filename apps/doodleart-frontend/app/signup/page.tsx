import Image from "next/image";
import { HTTP_URL } from "@/proxy";
import SignUpFormComponent from "@/components/Auth/SignUpComponent/SignUpFormComponent";

export default function SignUp() {
  return (
    <div className="flex flex-col w-screen h-screen bg-[#0a0a19] items-center">
      {/* Logo and title */}
      <h1 className="text-4xl lg:text-5xl font-bold text-white flex flex-row gap-2 mt-8 lg:mt-10">
        <Image
          src="/weblogo.svg"
          alt="logo"
          width={45}
          height={45}
          draggable="false"
          priority
        />
        <div>DoodleArt</div>
      </h1>

      {/* Form Body */}
      <div className="flex flex-col bg-[#211e34] items-center w-82 md:w-94 lg:w-md h-max p-6 rounded-3xl mt-15 gap-8 justify-center">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-white">Sign Up</h1>

        {/* Main-Form */}
        <div className="flex flex-col items-center gap-5 w-full">
          {/* Google,Github and Facebook auth */}
          <div className="flex flex-row gap-5">
            <a href={`${HTTP_URL}/api/v1/auth/google`}>
              <button className="w-22 md:w-25 lg:w-30 h-13 border border-gray-400 rounded-lg hover:border-[#d08fff] flex items-center justify-center">
                <Image
                  src="/google.svg"
                  alt="google"
                  width={30}
                  height={30}
                  className="object-contain"
                  draggable="false"
                  loading="eager"
                />
              </button>
            </a>

            <a href={`${HTTP_URL}/api/v1/auth/github`}>
              <button className="w-22 md:w-25 lg:w-30 h-13 border border-gray-400 rounded-lg hover:border-[#d08fff] flex items-center justify-center">
                <Image
                  src="/github2.svg"
                  alt="github"
                  width={30}
                  height={30}
                  className="object-contain"
                  draggable="false"
                  loading="eager"
                />
              </button>
            </a>

            <a href={`${HTTP_URL}/api/v1/auth/facebook`}>
              <button className="w-22 md:w-25 lg:w-30 h-13 border border-gray-400 rounded-lg hover:border-[#d08fff] flex items-center justify-center">
                <Image
                  src="/facebook.svg"
                  alt="facebook"
                  width={30}
                  height={30}
                  className="object-contain"
                  draggable="false"
                  loading="eager"
                />
              </button>
            </a>
          </div>

          {/* __or__ */}
          <div className="flex items-center gap-4 text-gray-400 my-2">
            <div className="grow h-px bg-gray-600"></div>
            <span className="text-sm">───── or ─────</span>
            <div className="grow h-px bg-gray-600"></div>
          </div>

          {/* Error and Message */}
          <SignUpFormComponent />
        </div>
      </div>
    </div>
  );
}

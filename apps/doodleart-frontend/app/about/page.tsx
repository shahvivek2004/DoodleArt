import NavBar from "@/components/LandingPage/NavBarComponent/NavBar";
import SideBar from "@/components/LandingPage/SideBarComponent/SideBar";
import { Github, Linkedin, Mail } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  const techStack = [
    {
      name: "React",
      color: "bg-[#00D8FF]",
      icon: (
        <Image
          src="/reactjs.svg"
          width={30}
          height={30}
          alt="ReactJS"
          className="w-20 h-8"
          draggable="false"
        />
      ),
    },
    { name: "Next.js", color: "bg-black", icon: "▲" },
    { name: "TypeScript", color: "bg-blue-600", icon: "TS" },
    {
      name: "Node.js",
      color: "bg-green-700",
      icon: (
        <Image
          src="/nodejs.svg"
          width={30}
          height={30}
          alt="NodeJS"
          className="w-8 h-8"
          draggable="false"
        />
      ),
    },
    {
      name: "Tailwind CSS",
      color: "bg-black",
      icon: (
        <Image
          src="/tcss.png"
          width={23}
          height={23}
          alt="tailwind css"
          className="w-8 h-5"
          draggable="false"
        />
      ),
    },
    {
      name: "PostgreSQL",
      color: "bg-sky-600",
      icon: (
        <Image
          src="/psql.svg"
          width={23}
          height={23}
          alt="postgresql"
          className="w-10 h-10"
          draggable="false"
        />
      ),
    },
    {
      name: "WebSocket",
      color: "bg-red-600",
      icon: (
        <Image
          src="/websocket.svg"
          width={23}
          height={23}
          alt="websocket"
          className="w-20 h-8"
          draggable="false"
        />
      ),
    },
    {
      name: "Canvas API",
      color: "bg-yellow-600",
      icon: (
        <Image
          src="/canvas.svg"
          width={23}
          height={23}
          alt="canvas"
          className="w-8 h-10"
          draggable="false"
        />
      ),
    },
  ];

  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      {/* Header */}
      <NavBar />
      <SideBar />

      <section className="h-screen container overflow-auto">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-16 h-16 bg-linear-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">VS</span>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    Vivek Shah
                  </h1>
                  <p className="text-xl text-green-600 font-semibold">
                    Full-Stack Developer & Creator
                  </p>
                </div>
              </div>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Hey there! 👋 I&apos;m a fresh CS graduate from Nirma University
                who&apos;s absolutely obsessed with building cool stuff. I
                don&apos;t just write code - I craft digital experiences that
                make people go &quot;wow!&quot;
                <span className="text-purple-600 font-semibold">
                  {" "}
                  DoodleArt is my latest creation
                </span>{" "}
                where I&apos;ve pushed the boundaries of real-time collaboration
                and canvas technology.
              </p>

              <div className="flex space-x-4">
                <a href="https://github.com/shahvivek2004">
                  <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center space-x-2">
                    <Github className="w-5 h-5" />
                    <span>View My Code</span>
                  </button>
                </a>
                <a href="mailto:vivekshahdev@gmail.com">
                  <button className="border border-purple-600 text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors flex items-center space-x-2">
                    <Mail className="w-5 h-5" />
                    <span>Let&apos;s Connect</span>
                  </button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                My Tech Arsenal
              </h2>
              <p className="text-gray-600 text-lg">
                The tools I use to bring ideas to life and build amazing
                experiences
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {techStack.map((tech, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center hover:shadow-lg transition-all hover:scale-105"
                >
                  <div
                    className={`w-12 h-12 ${tech.color} rounded-lg flex items-center justify-center mx-auto mb-3 text-white font-bold`}
                  >
                    {tech.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900">{tech.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-white py-25">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Want to Connect?
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              I&apos;m always excited to discuss new projects, share ideas, or
              just chat about tech!
            </p>
            <div className="flex justify-center space-x-6">
              <a href="https://github.com/shahvivek2004">
                <button className="flex items-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                  <Github className="w-5 h-5" />
                  <span>GitHub</span>
                </button>
              </a>
              <a href="https://www.linkedin.com/in/vivek-shah-34959b225/">
                <button className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  <Linkedin className="w-5 h-5" />
                  <span>LinkedIn</span>
                </button>
              </a>
              <a href="mailto:vivekshahdev@gmail.com">
                <button className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                  <Mail className="w-5 h-5" />
                  <span>Email</span>
                </button>
              </a>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}

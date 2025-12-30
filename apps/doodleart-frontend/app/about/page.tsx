import NavBar from "@/components/LandingPage/NavBarComponent/NavBar";
import SideBar from "@/components/LandingPage/SideBarComponent/SideBar";
import { Github, Linkedin, Mail } from "lucide-react";
import Image from "next/image";

interface SocialLink {
  name: string;
  href: string;
  icon: React.ReactNode;
  color: string;
  hoverColor: string;
}

const socialLinks: SocialLink[] = [
    {
      name: "GitHub",
      href: "https://github.com/shahvivek2004",
      icon: <Github className="w-5 h-5" />,
      color: "bg-gray-900",
      hoverColor: "hover:bg-gray-800",
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/vivek-shah-34959b225/",
      icon: <Linkedin className="w-5 h-5" />,
      color: "bg-blue-600",
      hoverColor: "hover:bg-blue-700",
    },
    {
      name: "Email",
      href: "mailto:vivekshahdev@gmail.com",
      icon: <Mail className="w-5 h-5" />,
      color: "bg-purple-600",
      hoverColor: "hover:bg-purple-700",
    },
  ];

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

      <main className="h-screen overflow-auto">
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
                  <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center space-x-2 cursor-pointer">
                    <Github className="w-5 h-5" />
                    <span>View My Code</span>
                  </button>
                </a>
                <a href="mailto:vivekshahdev@gmail.com">
                  <button className="border border-purple-600 text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors flex items-center space-x-2 cursor-pointer">
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
        {/* Project Showcase Section */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  About DoodleArt
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  A showcase of what&apos;s possible with modern web technologies
                </p>
              </div>

              <div className="bg-linear-to-br from-purple-50 to-blue-50 rounded-2xl p-8 lg:p-12 border border-purple-100">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Key Features
                    </h3>
                    <ul className="space-y-3">
                      {[
                        "Real-time collaborative drawing",
                        "Multi-user simultaneous editing",
                        "Intelligent shape recognition",
                        "Cloud-based storage & backup",
                        "WebSocket-powered synchronization",
                        "Responsive canvas rendering",
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Technical Highlights
                    </h3>
                    <ul className="space-y-3">
                      {[
                        "Built with Next.js 16 & TypeScript",
                        "PostgreSQL for data persistence",
                        "Custom Canvas API implementation",
                        "Optimized WebSocket architecture",
                        "Tailwind CSS for styling",
                        "Scalable backend infrastructure",
                      ].map((tech, index) => (
                        <li key={index} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <span className="text-gray-700">{tech}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-linear-to-br from-purple-600 to-blue-600 py-16 lg:py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Let&apos;s Build Something Amazing
              </h2>
              <p className="text-purple-100 text-lg mb-10">
                I&apos;m always excited to discuss new projects, collaborate on
                interesting ideas, or just chat about the latest in tech. Feel
                free to reach out!
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    target={link.name !== "Email" ? "_blank" : undefined}
                    rel={
                      link.name !== "Email" ? "noopener noreferrer" : undefined
                    }
                    className={`flex items-center space-x-2 ${link.color} text-white px-6 py-3 rounded-lg ${link.hoverColor} transition-all shadow-lg hover:shadow-xl transform hover:scale-105`}
                  >
                    {link.icon}
                    <span className="font-semibold">{link.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="mb-2">
              &copy; {new Date().getFullYear()} Vivek Shah. All rights reserved.
            </p>
            <p className="text-sm">
              Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
            </p>
          </div>
        </footer>
      </main>
      
    </div>
  );
}

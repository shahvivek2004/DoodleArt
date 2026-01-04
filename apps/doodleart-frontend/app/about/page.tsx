import NavBar from "@/components/LandingPage/NavBarComponent/NavBar";
import SideBar from "@/components/LandingPage/SideBarComponent/SideBar";
import { Github, Linkedin, Mail } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
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
                <a
                  href="https://github.com/shahvivek2004"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Connect me on Github"
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center space-x-2 w-fit"
                >
                  <Github className="w-5 h-5" />
                  <span>View My Code</span>
                </a>

                <a
                  href="mailto:vivekshahdev@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Mail me on this email"
                  className="border border-purple-600 text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors flex items-center space-x-2 w-fit"
                >
                  <Mail className="w-5 h-5" />
                  <span>Let&apos;s Connect</span>
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
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center hover:shadow-lg transition-all hover:scale-105">
                <div className="w-12 h-12 bg-[#00D8FF] rounded-lg flex items-center justify-center mx-auto mb-3 text-white font-bold">
                  <Image
                    src="/reactjs.svg"
                    width={30}
                    height={30}
                    alt="ReactJS"
                    className="w-20 h-8"
                    draggable="false"
                    loading="lazy"
                  />
                </div>
                <h3 className="font-semibold text-gray-900">React</h3>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center hover:shadow-lg transition-all hover:scale-105">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mx-auto mb-3 text-white font-bold">
                  ▲
                </div>
                <h3 className="font-semibold text-gray-900">Next.js</h3>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center hover:shadow-lg transition-all hover:scale-105">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3 text-white font-bold">
                  TS
                </div>
                <h3 className="font-semibold text-gray-900">TypeScript</h3>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center hover:shadow-lg transition-all hover:scale-105">
                <div className="w-12 h-12 bg-green-700 rounded-lg flex items-center justify-center mx-auto mb-3 text-white font-bold">
                  <Image
                    src="/nodejs.svg"
                    width={30}
                    height={30}
                    alt="NodeJS"
                    className="w-8 h-8"
                    draggable="false"
                    loading="lazy"
                  />
                </div>
                <h3 className="font-semibold text-gray-900">Node.js</h3>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center hover:shadow-lg transition-all hover:scale-105">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mx-auto mb-3 text-white font-bold">
                  <Image
                    src="/tcss.png"
                    width={23}
                    height={23}
                    alt="tailwind css"
                    className="w-8 h-5"
                    draggable="false"
                    loading="lazy"
                  />
                </div>
                <h3 className="font-semibold text-gray-900">Tailwind CSS</h3>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center hover:shadow-lg transition-all hover:scale-105">
                <div className="w-12 h-12 bg-sky-600 rounded-lg flex items-center justify-center mx-auto mb-3 text-white font-bold">
                  <Image
                    src="/psql.svg"
                    width={23}
                    height={23}
                    alt="postgresql"
                    className="w-10 h-10"
                    draggable="false"
                    loading="lazy"
                  />
                </div>
                <h3 className="font-semibold text-gray-900">PostgreSQL</h3>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center hover:shadow-lg transition-all hover:scale-105">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mx-auto mb-3 text-white font-bold">
                  <Image
                    src="/websocket.svg"
                    width={23}
                    height={23}
                    alt="websocket"
                    className="w-20 h-8"
                    draggable="false"
                    loading="lazy"
                  />
                </div>
                <h3 className="font-semibold text-gray-900">WebSocket</h3>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center hover:shadow-lg transition-all hover:scale-105">
                <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center mx-auto mb-3 text-white font-bold">
                  <Image
                    src="/canvas.svg"
                    width={23}
                    height={23}
                    alt="canvas"
                    className="w-8 h-10"
                    draggable="false"
                    loading="lazy"
                  />
                </div>
                <h3 className="font-semibold text-gray-900">Canvas API</h3>
              </div>
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
                  A showcase of what&apos;s possible with modern web
                  technologies
                </p>
              </div>

              <div className="bg-linear-to-br from-purple-50 to-blue-50 rounded-2xl p-8 lg:p-12 border border-purple-100">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Key Features
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                        <span className="text-gray-700">
                          Real-time collaborative drawing
                        </span>
                      </li>

                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                        <span className="text-gray-700">
                          Multi-user simultaneous editing
                        </span>
                      </li>

                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                        <span className="text-gray-700">
                          Intelligent shape recognition
                        </span>
                      </li>

                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                        <span className="text-gray-700">
                          Cloud-based storage &amp; backup
                        </span>
                      </li>

                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                        <span className="text-gray-700">
                          WebSocket-powered synchronization
                        </span>
                      </li>

                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                        <span className="text-gray-700">
                          Responsive canvas rendering
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Technical Highlights
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-gray-700">
                          Built with Next.js 16 &amp; TypeScript
                        </span>
                      </li>

                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-gray-700">
                          PostgreSQL for data persistence
                        </span>
                      </li>

                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-gray-700">
                          Custom Canvas API implementation
                        </span>
                      </li>

                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-gray-700">
                          Optimized WebSocket architecture
                        </span>
                      </li>

                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-gray-700">
                          Tailwind CSS for styling
                        </span>
                      </li>

                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-gray-700">
                          Scalable backend infrastructure
                        </span>
                      </li>
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
                <a
                  href="https://github.com/shahvivek2004"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Github className="w-5 h-5" />
                  <span className="font-semibold">GitHub</span>
                </a>

                <a
                  href="https://www.linkedin.com/in/vivek-shah-34959b225/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Linkedin className="w-5 h-5" />
                  <span className="font-semibold">LinkedIn</span>
                </a>

                <a
                  href="mailto:vivekshahdev@gmail.com"
                  className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Mail className="w-5 h-5" />
                  <span className="font-semibold">Email</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="mb-2">&copy; 2026 Vivek Shah. All rights reserved.</p>
            <p className="text-sm">
              Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

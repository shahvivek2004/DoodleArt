import Card from "@/components/Home/Card";
import NavBar from "@/components/Home/NavBar";
import SideBar from "@/components/Home/SideBar";

export default function Home() {
  return (
    // Landing Page

    <div className="h-screen w-screen bg-white flex flex-col overflow-hidden">
      {/* Navbar for Desktop Screens */}
      <NavBar />

      {/* Sidebar for Mobile Screens */}
      <SideBar />

      {/* Main Content */}
      <div className="flex-grow flex flex-col text-center lg:mt-15 overflow-auto">
        {/* Heading */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl text-[#6223b4] mt-10 font-semibold">
          Online <span className="bg-[#23cb6369] rounded-xl p-1">Canvas</span>{" "}
          For Your Imagination
        </h1>

        {/* Tagline */}
        <p className="text-[#280f48] mt-10 lg:text-lg font-semibold mb-25">
          Ideate, Create and Share. Simply with{" "}
          <span className="font-extrabold bg-amber-200 p-1 lg:p-2 rounded-xl">
            DoodleArt
          </span>
        </p>

        {/* Cards - (Outer padding wrapper) */}
        <div className="px-6 md:px-8 lg:px-12">
          {/* Cards */}
          <div className="flex flex-col lg:flex-row gap-6 text-black justify-around">
            {/* Card 1 */}
            <Card img="share.svg" alt="share" title="Real-time Collaboration">
              Work together with your team in real-time. Share your drawings
              instantly with a simple link.
            </Card>

            {/* Card 2 */}
            <Card
              img="multiplayer.svg"
              alt="multiplayer"
              title="Multiple Users Editing"
            >
              Multiple users can edit the same canvas simultaneously. See who’s
              drawing what in real-time.
            </Card>

            {/* Card 3 */}
            <Card img="smart.svg" alt="drawing" title="Smart Drawings">
              Intelligent shape recognition and drawing assistance helps you
              create perfect diagrams.
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

export const Loader = ({ theme }: { theme: string }) => {
  return (
    <div
      className={`${theme === "w" ? "bg-white" : "bg-[#121212]"} min-h-screen flex items-center justify-center`}
    >
      <div className="text-center space-y-4">
        <div
          className={`w-12 h-12 border-4 ${theme === "w" ? "border-gray-400" : "border-gray-600"} border-t-purple-500 rounded-full animate-spin mx-auto`}
        ></div>
        <p
          className={`${theme === "w" ? "text-gray-500" : "text-gray-400"} text-lg`}
        >
          Loading...
        </p>
      </div>
    </div>
  );
};

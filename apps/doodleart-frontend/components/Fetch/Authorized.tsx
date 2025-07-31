export const Authorized = ({ quitfunc }: { quitfunc: () => void }) => {
  return (
    <div className="bg-[#0a0a19] min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6 p-8">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-8 h-8 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        {/* Main message */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Authorization Required
          </h1>
          <p className="text-gray-400 text-lg">
            You do not have access to this Canvas, Author has not granted you
            permission.
          </p>
        </div>

        {/* Button */}
        <button
          onClick={quitfunc}
          className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0a0a19]"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
            />
          </svg>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

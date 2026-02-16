"use client";

export const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-white/40 border-t-purple-500 rounded-full animate-spin mx-auto" />
        <p className="text-white/70 text-sm tracking-wide">Loading…</p>
      </div>
    </div>
  );
};

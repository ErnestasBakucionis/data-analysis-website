import React from "react";

export default function Loading() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-white text-black">
      <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-gray-700"></div>
      <p className="text-xl font-semibold">Loading...</p>
    </div>
  );
}

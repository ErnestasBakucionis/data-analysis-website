"use client";

import React from "react";

export default function Error() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-white">
            <div className="text-6xl font-bold text-red-600">Error</div>
            <p className="text-xl font-semibold">Something Went Wrong</p>
            <p className="text-md">Please try again later or contact support.</p>
        </div>
    );
}

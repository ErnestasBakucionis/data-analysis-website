import React from "react";

export default function NotFound() {

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-white">
            <div className="text-9xl font-bold">404</div>
            <p className="text-xl font-semibold">Page Not Found</p>
            <p className="text-md">The page you are looking for does not exist.</p>
        </div>
    );
}

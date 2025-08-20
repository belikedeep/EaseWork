"use client";

import Link from "next/link";

export default function Sidebar() {
    return (
        <aside className="h-full min-h-[calc(100vh-56px)] w-56 bg-gray-800 text-white flex flex-col py-6 px-4 gap-4">
            <nav className="flex flex-col gap-2">
                <Link href="/dashboard" className="hover:bg-gray-700 rounded px-3 py-2">
                    Dashboard
                </Link>
                {/* Add more sidebar links here */}
            </nav>
            <div className="mt-auto text-xs text-gray-400">
                &copy; {new Date().getFullYear()} EaseWork
            </div>
        </aside>
    );
}
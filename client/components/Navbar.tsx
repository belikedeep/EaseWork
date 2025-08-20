"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "../store/auth";

export default function Navbar() {
    const logout = useAuth((s) => s.logout);
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    return (
        <nav className="w-full h-14 bg-gray-900 text-white flex items-center justify-between px-6 shadow">
            <span className="font-bold text-lg">EaseWork Dashboard</span>
            <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white font-semibold"
            >
                Logout
            </button>
        </nav>
    );
}
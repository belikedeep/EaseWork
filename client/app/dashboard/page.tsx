"use client";

import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

export default function DashboardPage() {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex flex-col flex-1">
                <Navbar />
                <main className="flex-1 p-8">
                    <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                    <p>Welcome to your dashboard!</p>
                </main>
            </div>
        </div>
    );
}
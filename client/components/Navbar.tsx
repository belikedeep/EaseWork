"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "../store/auth";
import { useState } from "react";
import axios from "../utils/axios";

export default function Navbar() {
    const logout = useAuth((s) => s.logout);
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const token = useAuth((s) => s.token);

    const handleCreate = async () => {
        setLoading(true);
        try {
            if (!token) {
                alert("You must be logged in to create a project.");
                setLoading(false);
                return;
            }
            await axios.post(
                "/projects",
                { name, description },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setShowModal(false);
            setName("");
            setDescription("");
            // Optionally, trigger a callback or state update here to refresh projects in the sidebar
        } finally {
            setLoading(false);
        }
    };

    return (
        <nav className="w-full h-14 bg-gray-900 text-white flex items-center justify-between px-6 shadow">
            <span className="font-bold text-lg">EaseWork Dashboard</span>
            <div className="flex gap-2">
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-semibold"
                >
                    Create new project
                </button>
                <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white font-semibold"
                >
                    Logout
                </button>
            </div>
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white text-black p-6 rounded shadow w-96">
                        <h2 className="text-lg font-bold mb-4">Create New Project</h2>
                        <input
                            className="w-full mb-2 p-2 border rounded"
                            placeholder="Project Name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                        <textarea
                            className="w-full mb-2 p-2 border rounded"
                            placeholder="Description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 rounded bg-gray-300"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreate}
                                className="px-4 py-2 rounded bg-blue-600 text-white"
                                disabled={loading || !name}
                            >
                                {loading ? "Creating..." : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
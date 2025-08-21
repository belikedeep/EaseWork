"use client";

import Link from "next/link";

import { useEffect, useState } from "react";
import axios from "../utils/axios";
import { useAuth } from "../store/auth";

export default function Sidebar() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const token = useAuth((s) => s.token);

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }
        axios
            .get("/projects", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => setProjects(res.data))
            .finally(() => setLoading(false));
    }, [token]);

    return (
        <aside className="h-full min-h-[calc(100vh-56px)] w-56 bg-gray-800 text-white flex flex-col py-6 px-4 gap-4">
            <nav className="flex flex-col gap-2">
                <Link href="/dashboard" className="hover:bg-gray-700 rounded px-3 py-2">
                    Dashboard
                </Link>
                <div className="mt-2">
                    <div className="text-xs text-gray-400 mb-1">Projects</div>
                    {loading ? (
                        <div className="text-xs text-gray-400">Loading...</div>
                    ) : (
                        projects.length === 0 ? (
                            <div className="text-xs text-gray-400">No projects</div>
                        ) : (
                            projects.map((project) => (
                                <Link
                                    key={project._id}
                                    href={`/dashboard/projects/${project._id}`}
                                    className="block hover:bg-gray-700 rounded px-3 py-2"
                                >
                                    {project.name}
                                </Link>
                            ))
                        )
                    )}
                </div>
            </nav>
            <div className="mt-auto text-xs text-gray-400">
                &copy; {new Date().getFullYear()} EaseWork
            </div>
        </aside>
    );
}

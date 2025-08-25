"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "../utils/axios";
import { useAuth } from "../store/auth";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, LayoutDashboard, Folder, PlusCircle } from "lucide-react";

type Project = {
    _id: string;
    name: string;
    // Add other fields if needed
};

export default function Sidebar() {
    const [projects, setProjects] = useState<Project[]>([]);
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

    // Desktop sidebar
    const sidebarContent = (
        <div className="h-full w-56 border-r flex flex-col py-6 px-2 gap-4 shadow-lg bg-[var(--sidebar)] text-[var(--sidebar-foreground)]">
            <nav className="flex flex-col gap-2">
                <Button asChild variant="ghost" className="justify-start gap-2 px-3 py-2 text-base text-white hover:bg-gray-900">
                    <Link href="/dashboard">
                        <LayoutDashboard className="w-5 h-5 mr-2" />
                        Dashboard
                    </Link>
                </Button>
                <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400 font-semibold">Projects</span>
                        <Button variant="outline" size="icon" className="w-7 h-7 p-0 border-gray-700 text-gray-300 hover:bg-gray-900">
                            <PlusCircle className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="flex flex-col gap-1">
                        {loading ? (
                            <div className="text-xs text-gray-400">Loading...</div>
                        ) : projects.length === 0 ? (
                            <div className="text-xs text-gray-400">No projects</div>
                        ) : (
                            projects.map((project) => (
                                <Button
                                    asChild
                                    variant="ghost"
                                    className="justify-start gap-2 px-3 py-2 text-sm text-gray-200 hover:bg-gray-900"
                                    key={project._id}
                                >
                                    <Link href={`/dashboard/projects/${project._id}`}>
                                        <Folder className="w-4 h-4 mr-2" />
                                        {project.name}
                                    </Link>
                                </Button>
                            ))
                        )}
                    </div>
                </div>
            </nav>
            <div className="mt-auto text-xs text-gray-500 text-center">
                &copy; {new Date().getFullYear()} EaseWork
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile sidebar */}
            <div className="sm:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="m-2">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0">
                        {sidebarContent}
                    </SheetContent>
                </Sheet>
            </div>
            {/* Desktop sidebar */}
            <div className="hidden sm:block h-screen">{sidebarContent}</div>
        </>
    );
}

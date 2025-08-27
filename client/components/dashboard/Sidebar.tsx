"use client";
import { Project } from "@/types/types";
import ProjectCreateDialog from "./ProjectCreateDialog";

interface SidebarProps {
    projects: Project[];
    loadingProjects: boolean;
    selectedProject: Project | null;
    showSettings: boolean;
    setShowSettings: (v: boolean) => void;
    setSelectedProject: (p: Project | null) => void;
    fetchProjects: () => void;
    handleSelectProject: (p: Project) => void;
}

export default function Sidebar({
    projects,
    loadingProjects,
    selectedProject,
    showSettings,
    setShowSettings,
    setSelectedProject,
    fetchProjects,
    handleSelectProject,
}: SidebarProps) {
    return (
        <div className="w-64 flex flex-col py-6 px-4 gap-4 bg-white text-gray-800 border-r border-gray-200">
            <div className="text-2xl font-bold mb-6 text-blue-700">EaseWork</div>
            <button
                className={`text-left w-full px-3 py-2 rounded font-semibold mb-2 bg-transparent text-blue-700 hover:bg-blue-50 hover:text-blue-800 ${!selectedProject ? "bg-blue-100 text-blue-800" : ""}`}
                onClick={() => {
                    setShowSettings(false);
                    setSelectedProject(null);
                }}
            >
                Dashboard
            </button>
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold">Projects</h2>
                <ProjectCreateDialog onCreated={fetchProjects} />
            </div>
            {loadingProjects ? (
                <div className="text-xs text-gray-400">Loading...</div>
            ) : projects.length === 0 ? (
                <div className="text-xs text-gray-400">No projects</div>
            ) : (
                projects.map((project) => (
                    <a
                        key={project._id}
                        href={`/dashboard/projects/${project._id}`}
                        className={`block text-left w-full px-3 py-2 rounded bg-transparent text-blue-700 hover:bg-blue-50 hover:text-blue-800 ${selectedProject && selectedProject._id === project._id
                            ? "bg-blue-100 text-blue-800"
                            : ""
                            }`}
                        onClick={e => {
                            e.preventDefault();
                            handleSelectProject(project);
                            window.history.pushState({}, "", `/dashboard/projects/${project._id}`);
                        }}
                    >
                        {project.name}
                    </a>
                ))
            )}
            <button
                className={`text-left w-full px-3 py-2 rounded font-semibold mt-4 bg-transparent text-blue-700 hover:bg-blue-50 hover:text-blue-800 ${showSettings ? "bg-blue-100 text-blue-800" : ""}`}
                onClick={() => {
                    setShowSettings(true);
                    setSelectedProject(null);
                }}
            >
                Settings
            </button>
            <div className="mt-auto text-xs text-gray-400">
                &copy; {new Date().getFullYear()} EaseWork
            </div>
            {/* Dummy navigation items */}
            {/* <div className="mt-8 flex flex-col gap-2">
                <a className="px-3 py-2 rounded hover:bg-blue-50 hover:text-blue-800 text-blue-700 cursor-pointer" href="#">Overview</a>
                <a className="px-3 py-2 rounded hover:bg-blue-50 hover:text-blue-800 text-blue-700 cursor-pointer" href="#">Calendar</a>
                <a className="px-3 py-2 rounded hover:bg-blue-50 hover:text-blue-800 text-blue-700 cursor-pointer" href="#">Files</a>
                <a className="px-3 py-2 rounded hover:bg-blue-50 hover:text-blue-800 text-blue-700 cursor-pointer" href="#">Team Chat</a>
            </div> */}
        </div>
    );
}
"use client";

import { useEffect, useState, useCallback } from "react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../store/auth";
import axios from "../../utils/axios";

interface Project {
    _id: string;
    name: string;
    description?: string;
    members?: string[];
    createdAt?: string;
}

export default function DashboardPage() {
    const token = useAuth((s) => s.token);
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [loadingProject, setLoadingProject] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [taskName, setTaskName] = useState("");
    const [taskDesc, setTaskDesc] = useState("");
    const [taskStatus, setTaskStatus] = useState("todo");
    const [creatingTask, setCreatingTask] = useState(false);

    const fetchProjects = useCallback(() => {
        if (!token) return;
        setLoadingProjects(true);
        axios
            .get("/projects", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setProjects(res.data))
            .finally(() => setLoadingProjects(false));
    }, [token]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleSelectProject = (project: Project) => {
        setSelectedProject(null);
        setLoadingProject(true);
        axios
            .get(`/projects/${project._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setSelectedProject(res.data))
            .finally(() => setLoadingProject(false));
    };

    const handleCreateTask = async () => {
        if (!selectedProject) return;
        setCreatingTask(true);
        try {
            await axios.post(
                `/projects/${selectedProject._id}/tasks`,
                { title: taskName, description: taskDesc, status: taskStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setShowTaskModal(false);
            setTaskName("");
            setTaskDesc("");
            setTaskStatus("todo");
            // Optionally refresh tasks here
        } finally {
            setCreatingTask(false);
        }
    };

    return (
        <div className="flex min-h-screen">
            <div className="w-64 bg-gray-800 text-white flex flex-col py-6 px-4 gap-4">
                <button
                    className={`text-left w-full px-3 py-2 rounded hover:bg-gray-700 font-semibold mb-2 ${!selectedProject ? "bg-gray-700" : ""
                        }`}
                    onClick={() => setSelectedProject(null)}
                >
                    Dashboard
                </button>
                <h2 className="text-lg font-bold mb-2">Projects</h2>
                {loadingProjects ? (
                    <div className="text-xs text-gray-400">Loading...</div>
                ) : projects.length === 0 ? (
                    <div className="text-xs text-gray-400">No projects</div>
                ) : (
                    projects.map((project) => (
                        <button
                            key={project._id}
                            className={`text-left w-full px-3 py-2 rounded hover:bg-gray-700 ${selectedProject && selectedProject._id === project._id
                                ? "bg-gray-700"
                                : ""
                                }`}
                            onClick={() => handleSelectProject(project)}
                        >
                            {project.name}
                        </button>
                    ))
                )}
                <div className="mt-auto text-xs text-gray-400">
                    &copy; {new Date().getFullYear()} EaseWork
                </div>
            </div>
            <div className="flex flex-col flex-1">
                <Navbar onProjectCreated={fetchProjects} />
                <main className="flex-1 p-8">
                    {!selectedProject ? (
                        <div>
                            <button className="bg-gray-900 text-white px-4 py-2 rounded mb-4 font-semibold">
                                Dashboard
                            </button>
                            <h1 className="text-2xl font-bold mb-2">Welcome to EaseWork Dashboard</h1>
                            <p className="mb-2">Select a project from the sidebar to view its details and manage tasks, or create a new project using the button above.</p>
                        </div>
                    ) : loadingProject ? (
                        <div>Loading project...</div>
                    ) : (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h1 className="text-2xl font-bold">{selectedProject.name}</h1>
                                <button
                                    className="bg-blue-600 text-white px-4 py-2 rounded"
                                    onClick={() => setShowTaskModal(true)}
                                >
                                    Create new task
                                </button>
                            </div>
                            <p className="mb-2">{selectedProject.description}</p>
                            <div>
                                <strong>Members:</strong>{" "}
                                {selectedProject.members?.join(", ")}
                            </div>
                            <div>
                                <strong>Created At:</strong>{" "}
                                {selectedProject.createdAt
                                    ? new Date(selectedProject.createdAt).toLocaleString()
                                    : ""}
                            </div>
                            {/* Tasks list can be added here */}
                        </div>
                    )}
                </main>
            </div>
            {showTaskModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white text-black p-6 rounded shadow w-96">
                        <h2 className="text-lg font-bold mb-4">Create New Task</h2>
                        <input
                            className="w-full mb-2 p-2 border rounded"
                            placeholder="Task Name"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                        />
                        <textarea
                            className="w-full mb-2 p-2 border rounded"
                            placeholder="Description"
                            value={taskDesc}
                            onChange={(e) => setTaskDesc(e.target.value)}
                        />
                        <select
                            className="w-full mb-2 p-2 border rounded"
                            value={taskStatus}
                            onChange={e => setTaskStatus(e.target.value)}
                        >
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="review">Review</option>
                            <option value="done">Done</option>
                        </select>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowTaskModal(false)}
                                className="px-4 py-2 rounded bg-gray-300"
                                disabled={creatingTask}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateTask}
                                className="px-4 py-2 rounded bg-blue-600 text-white"
                                disabled={creatingTask || !taskName}
                            >
                                {creatingTask ? "Creating..." : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
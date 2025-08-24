"use client";

import { useEffect, useState, useCallback } from "react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../store/auth";
import axios from "../../utils/axios";

import type { Project, Task } from "../../types/types";
import SettingsPage from "./settings";

export default function DashboardPage() {
    const token = useAuth((s) => s.token);
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [loadingProject, setLoadingProject] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [taskName, setTaskName] = useState("");
    const [taskDesc, setTaskDesc] = useState("");
    const [taskStatus, setTaskStatus] = useState("todo");
    const [creatingTask, setCreatingTask] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loadingTasks, setLoadingTasks] = useState(false);

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
        if (token) {
            fetchProjects();
        }
    }, [token]);

    // (removed duplicate handleSelectProject)

    const fetchTasks = useCallback((projectId: string) => {
        if (!token) return;
        setLoadingTasks(true);
        axios
            .get(`/projects/${projectId}/tasks`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setTasks(res.data))
            .finally(() => setLoadingTasks(false));
    }, [token]);

    const handleSelectProject = (project: Project) => {
        setLoadingProject(true);
        axios
            .get(`/projects/${project._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setSelectedProject(res.data);
                fetchTasks(project._id);
            })
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
            fetchTasks(selectedProject._id);
        } finally {
            setCreatingTask(false);
        }
    };

    return (
        <div className="flex min-h-screen dark">
            <div className="w-64 flex flex-col py-6 px-4 gap-4 bg-[var(--sidebar)] text-[var(--sidebar-foreground)]">
                <div className="text-2xl font-bold mb-6 text-[var(--sidebar-primary-foreground)]">EaseWork</div>
                <button
                    className={`text-left w-full px-3 py-2 rounded font-semibold mb-2 bg-transparent text-[var(--sidebar-primary-foreground)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)] ${!selectedProject ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)]" : ""}`}
                    onClick={() => {
                        setShowSettings(false);
                        setSelectedProject(null);
                    }}
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
                        <a
                            key={project._id}
                            href={`/dashboard/projects/${project._id}`}
                            className={`block text-left w-full px-3 py-2 rounded bg-transparent text-[var(--sidebar-primary-foreground)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)] ${selectedProject && selectedProject._id === project._id
                                ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)]"
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
                    className={`text-left w-full px-3 py-2 rounded font-semibold mt-4 bg-transparent text-[var(--sidebar-primary-foreground)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)] ${showSettings ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)]" : ""}`}
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
            </div>
            <div className="flex flex-col flex-1">
                <Navbar />
                <main className="flex-1 p-8">
                    {showSettings ? (
                        <SettingsPage />
                    ) : !selectedProject ? (
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
                            <div className="mt-8">
                                <h2 className="text-xl font-semibold mb-2">Tasks</h2>
                                {loadingTasks ? (
                                    <div className="text-gray-500">Loading tasks...</div>
                                ) : (
                                    <div className="flex gap-4 w-full">
                                        {[
                                            { label: "TODO", value: "todo" },
                                            { label: "IN PROGRESS", value: "in_progress" },
                                            { label: "REVIEW", value: "review" },
                                            { label: "DONE", value: "done" },
                                        ].map((col) => (
                                            <div
                                                key={col.value}
                                                className="flex-1 bg-gray-100 rounded p-2 min-h-[200px] flex flex-col"
                                                onDragOver={e => e.preventDefault()}
                                                onDrop={e => {
                                                    const taskId = e.dataTransfer.getData("text/plain");
                                                    const task = tasks.find(t => t.id === taskId);
                                                    if (task && task.status !== col.value) {
                                                        // Optimistically update UI
                                                        setTasks(ts =>
                                                            ts.map(t =>
                                                                t.id === taskId ? { ...t, status: col.value } : t
                                                            )
                                                        );
                                                        // Update backend
                                                        axios.put(
                                                            `/tasks/${taskId}`,
                                                            { status: col.value },
                                                            { headers: { Authorization: `Bearer ${token}` } }
                                                        ).then(() => fetchTasks(selectedProject._id));
                                                    }
                                                }}
                                            >
                                                <div className="font-bold text-center mb-2">{col.label}</div>
                                                <div className="flex-1 flex flex-col gap-2">
                                                    {tasks.filter(t => t.status === col.value).length === 0 ? (
                                                        <div className="text-gray-400 text-xs text-center">No tasks</div>
                                                    ) : (
                                                        tasks
                                                            .filter(t => t.status === col.value)
                                                            .map(task => (
                                                                <div
                                                                    key={task.id}
                                                                    className="border rounded p-3 bg-white shadow cursor-move"
                                                                    draggable
                                                                    onDragStart={e => {
                                                                        e.dataTransfer.setData("text/plain", task.id);
                                                                    }}
                                                                >
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="font-semibold">{task.title}</span>
                                                                        <span className="text-xs px-2 py-1 rounded bg-gray-200">{task.status.replace("_", " ").toUpperCase()}</span>
                                                                    </div>
                                                                    {task.description && (
                                                                        <div className="text-sm text-gray-700 mt-1">{task.description}</div>
                                                                    )}
                                                                </div>
                                                            ))
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
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
"use client";

import { useEffect, useState, useCallback } from "react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../store/auth";
import axios from "../../utils/axios";
import type { Project, Task } from "../../types/types";
import SettingsPage from "./settings";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import TaskModal from "@/components/dashboard/TaskModal";
import ProjectBoard from "@/components/dashboard/ProjectBoard";

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

    const pathname = usePathname();

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

    // On mount, fetch projects
    useEffect(() => {
        if (!token) return;
        fetchProjects();
    }, [token, fetchProjects]);

    // If URL is /dashboard/projects/[projectId], fetch and select that project
    useEffect(() => {
        if (!token || !pathname.startsWith("/dashboard/projects/") || loadingProjects) return;
        const projectId = pathname.split("/dashboard/projects/")[1];
        if (projectId) {
            setLoadingProject(true);
            axios
                .get(`/projects/${projectId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => {
                    setSelectedProject(res.data);
                    fetchTasks(projectId);
                })
                .catch(() => setSelectedProject(null))
                .finally(() => setLoadingProject(false));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, pathname, loadingProjects, fetchTasks]);

    return (
        <div className="flex min-h-screen max-h-screen h-screen overflow-hidden dark">
            <Sidebar
                projects={projects}
                loadingProjects={loadingProjects}
                selectedProject={selectedProject}
                showSettings={showSettings}
                setShowSettings={setShowSettings}
                setSelectedProject={setSelectedProject}
                fetchProjects={fetchProjects}
                handleSelectProject={handleSelectProject}
            />
            <div className="flex flex-col flex-1 max-h-screen h-screen overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-auto">
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
                    ) : (
                        <ProjectBoard
                            selectedProject={selectedProject}
                            loadingProject={loadingProject}
                            tasks={tasks}
                            loadingTasks={loadingTasks}
                            setShowTaskModal={setShowTaskModal}
                            setTasks={setTasks}
                            fetchTasks={fetchTasks}
                            token={token}
                            onProjectDeleted={() => {
                                setSelectedProject(null);
                                setShowSettings(false);
                            }}
                        />
                    )}
                </main>
            </div>
            <TaskModal
                open={showTaskModal}
                onClose={() => setShowTaskModal(false)}
                onCreate={handleCreateTask}
                creating={creatingTask}
                taskName={taskName}
                setTaskName={setTaskName}
                taskDesc={taskDesc}
                setTaskDesc={setTaskDesc}
                taskStatus={taskStatus}
                setTaskStatus={setTaskStatus}
            />
        </div>
    );
}
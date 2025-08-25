"use client";
import React from "react";
import axios from "@/utils/axios";
import { Project, Task } from "@/types/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/store/auth";

// Helper to decode user id from JWT
function getUserIdFromToken(token: string | null): string | null {
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.user_id || payload._id || payload.id || null;
    } catch {
        return null;
    }
}

interface ProjectWithOwner extends Project {
    ownerId?: string;
}

interface ProjectBoardProps {
    selectedProject: ProjectWithOwner;
    loadingProject: boolean;
    tasks: Task[];
    loadingTasks: boolean;
    setShowTaskModal: (v: boolean) => void;
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    fetchTasks: (projectId: string) => void;
    token: string | null;
}

export default function ProjectBoard({
    selectedProject,
    loadingProject,
    tasks,
    loadingTasks,
    setShowTaskModal,
    setTasks,
    fetchTasks,
    token,
}: ProjectBoardProps) {
    const router = useRouter();
    const [deleting, setDeleting] = useState(false);

    // Always get token from store to ensure up-to-date value
    const authToken = useAuth((s) => s.token);
    const userId = getUserIdFromToken(authToken);

    const isOwner = selectedProject.ownerId && userId && selectedProject.ownerId === userId;

    const handleDelete = async () => {
        if (!token || !selectedProject._id) return;
        if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;
        setDeleting(true);
        try {
            await axios.delete(`/projects/${selectedProject._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            router.push("/dashboard");
            // Optionally, trigger a refresh of the project list if needed
        } catch (err) {
            alert("Failed to delete project.");
        } finally {
            setDeleting(false);
        }
    };

    console.log("selectedProject", selectedProject);


    if (loadingProject) {
        return (
            <div className="flex items-center justify-center h-64 bg-background">
                <div className="text-muted-foreground text-sm">Loading project...</div>
            </div>
        );
    }

    return (
        <div className="bg-background text-foreground min-h-screen p-6">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-light text-foreground mb-2">{selectedProject.name}</h1>
                    {selectedProject.description && (
                        <p className="text-muted-foreground text-sm">{selectedProject.description}</p>
                    )}
                </div>
                <div className="flex gap-2">
                    <button
                        className="bg-accent hover:bg-accent/80 text-accent-foreground px-5 py-2.5 rounded-lg border border-border transition-colors duration-200 text-sm font-medium"
                        onClick={() => setShowTaskModal(true)}
                    >
                        + New Task
                    </button>
                    {/* {isOwner && ( */}
                    <button
                        className="bg-destructive hover:bg-destructive/80 text-white px-5 py-2.5 rounded-lg border border-border transition-colors duration-200 text-sm font-medium"
                        onClick={handleDelete}
                        disabled={deleting}
                    >
                        {deleting ? "Deleting..." : "Delete Project"}
                    </button>
                    {/* )} */}
                </div>
            </div>

            {/* Project Meta Information */}
            <div className="flex gap-6 mb-8 text-xs text-muted-foreground">
                {selectedProject.members && selectedProject.members.length > 0 && (
                    <div>
                        <span className="text-muted-foreground">Members: </span>
                        <span>{selectedProject.members.join(", ")}</span>
                    </div>
                )}
                {selectedProject.createdAt && (
                    <div>
                        <span className="text-muted-foreground">Created: </span>
                        <span>{new Date(selectedProject.createdAt).toLocaleDateString()}</span>
                    </div>
                )}
            </div>

            {/* Tasks Board */}
            <div className="mt-6">
                {loadingTasks ? (
                    <div className="flex items-center justify-center h-32">
                        <div className="text-muted-foreground text-sm">Loading tasks...</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-4 gap-4">
                        {[
                            { label: "Todo", value: "todo", color: "border-border" },
                            { label: "In Progress", value: "in_progress", color: "border-chart-1" },
                            { label: "Review", value: "review", color: "border-chart-3" },
                            { label: "Done", value: "done", color: "border-chart-2" },
                        ].map((col) => (
                            <div
                                key={col.value}
                                className={`bg-card rounded-lg border-t-2 ${col.color} border border-border min-h-[400px] flex flex-col`}
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
                                {/* Column Header */}
                                <div className="p-4 border-b border-border">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-medium text-card-foreground">{col.label}</h3>
                                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                                            {tasks.filter(t => t.status === col.value).length}
                                        </span>
                                    </div>
                                </div>

                                {/* Column Content */}
                                <div className="flex-1 p-3 space-y-3">
                                    {tasks.filter(t => t.status === col.value).length === 0 ? (
                                        <div className="text-muted-foreground text-xs text-center mt-8 italic">
                                            No tasks yet
                                        </div>
                                    ) : (
                                        tasks
                                            .filter(t => t.status === col.value)
                                            .map(task => (
                                                <div
                                                    key={task.id}
                                                    className="bg-background border border-border rounded-lg p-3 cursor-move hover:bg-accent/50 transition-colors duration-150"
                                                    draggable
                                                    onDragStart={e => {
                                                        e.dataTransfer.setData("text/plain", task.id);
                                                    }}
                                                >
                                                    <div className="text-sm font-medium text-foreground mb-1">
                                                        {task.title}
                                                    </div>
                                                    {task.description && (
                                                        <div className="text-xs text-muted-foreground line-clamp-2">
                                                            {task.description}
                                                        </div>
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
    );
}
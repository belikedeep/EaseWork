"use client";
import React from "react";
import axios from "@/utils/axios";
import { Project, Task } from "@/types/types";

interface ProjectBoardProps {
    selectedProject: Project;
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
    if (loadingProject) return <div>Loading project...</div>;
    return (
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
    );
}
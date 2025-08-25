"use client";
import React from "react";

interface TaskModalProps {
    open: boolean;
    onClose: () => void;
    onCreate: () => void;
    creating: boolean;
    taskName: string;
    setTaskName: (v: string) => void;
    taskDesc: string;
    setTaskDesc: (v: string) => void;
    taskStatus: string;
    setTaskStatus: (v: string) => void;
}

export default function TaskModal({
    open,
    onClose,
    onCreate,
    creating,
    taskName,
    setTaskName,
    taskDesc,
    setTaskDesc,
    taskStatus,
    setTaskStatus,
}: TaskModalProps) {
    if (!open) return null;
    return (
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
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-gray-300"
                        disabled={creating}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onCreate}
                        className="px-4 py-2 rounded bg-blue-600 text-white"
                        disabled={creating || !taskName}
                    >
                        {creating ? "Creating..." : "Create"}
                    </button>
                </div>
            </div>
        </div>
    );
}
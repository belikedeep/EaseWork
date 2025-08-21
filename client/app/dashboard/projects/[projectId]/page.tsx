"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "@/utils/axios";

export default function ProjectPage() {
    const { projectId } = useParams();
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!projectId) return;
        axios.get(`/projects/${projectId}`)
            .then(res => setProject(res.data))
            .finally(() => setLoading(false));
    }, [projectId]);

    if (loading) return <div>Loading...</div>;
    if (!project) return <div>Project not found</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">{project.name}</h1>
            <p className="mb-4">{project.description}</p>
            <div>
                <strong>Members:</strong> {project.members?.join(", ")}
            </div>
            <div>
                <strong>Created At:</strong> {new Date(project.createdAt).toLocaleString()}
            </div>
        </div>
    );
}
"use client";
import { useState } from "react";
import { useAuth } from "@/store/auth";
import axios from "@/utils/axios";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ProjectCreateDialogProps {
    onCreated: () => void;
}

export default function ProjectCreateDialog({ onCreated }: ProjectCreateDialogProps) {
    const token = useAuth((s) => s.token);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!name) return;
        setLoading(true);
        try {
            await axios.post(
                "/projects",
                { name, description },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setOpen(false);
            setName("");
            setDescription("");
            onCreated();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="ml-2">
                    <Plus className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                </DialogHeader>
                <input
                    className="w-full mb-2 p-2 border rounded"
                    placeholder="Project Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <textarea
                    className="w-full mb-2 p-2 border rounded"
                    placeholder="Description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleCreate} disabled={loading || !name}>
                        {loading ? "Creating..." : "Create"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
export interface Project {
    _id: string;
    name: string;
    description?: string;
    members?: string[];
    createdAt?: string;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: string;
    deadline?: string;
    assignedTo?: string;
    priority?: string;
}
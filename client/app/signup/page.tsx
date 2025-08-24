"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            await api.post("/signup", { name, email, password });
            setSuccess("Signup successful! Please login.");
            setTimeout(() => router.push("/"), 1200);
        } catch (err: any) {
            setError(err?.response?.data?.detail || "Signup failed");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
            <form className="flex flex-col gap-4 w-full max-w-xs" onSubmit={handleSubmit}>
                <Input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button type="submit">
                    Sign Up
                </Button>
                {error && <div className="text-red-600 text-sm">{error}</div>}
                {success && <div className="text-green-600 text-sm">{success}</div>}
            </form>
            <p className="mt-4 text-sm">
                Already have an account?{" "}
                <Link href="/" className="text-blue-600 underline">
                    Login
                </Link>
            </p>
        </div>
    );
}
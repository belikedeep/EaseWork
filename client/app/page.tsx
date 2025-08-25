"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../utils/axios";
import { useAuth } from "../store/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function isAxiosError(error: unknown): error is { response?: { data?: { detail?: string } } } {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: unknown }).response === "object" &&
    (error as { response?: unknown }).response !== null &&
    "data" in (error as { response?: { data?: unknown } }).response! &&
    typeof ((error as { response?: { data?: unknown } }).response as { data?: unknown }).data === "object"
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const setToken = useAuth((s) => s.setToken);
  const token = useAuth((s) => s.token);
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (token && router) {
      router.replace("/dashboard");
    }
  }, [token, router]);
  // Prevent rendering if token exists and url is /dashboard
  if (token && typeof window !== "undefined" && window.location.pathname === "/dashboard") return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/login", { email, password });
      setToken(res.data.access_token);
      router.push("/dashboard");
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Login failed");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form className="flex flex-col gap-4 w-full max-w-xs" onSubmit={handleSubmit}>
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
          Login
        </Button>
        {error && <div className="text-red-600 text-sm">{error}</div>}
      </form>
      <p className="mt-4 text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-blue-600 underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
}

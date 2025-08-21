import { create } from "zustand";

interface AuthState {
    token: string | null;
    setToken: (token: string | null) => void;
    logout: () => void;
}

export const useAuth = create<AuthState>((set) => {
    // Try to load token from localStorage on initialization
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return {
        token: storedToken,
        setToken: (token) => {
            if (typeof window !== "undefined") {
                if (token) {
                    localStorage.setItem("token", token);
                } else {
                    localStorage.removeItem("token");
                }
            }
            set({ token });
        },
        logout: () => {
            if (typeof window !== "undefined") {
                localStorage.removeItem("token");
            }
            set({ token: null });
        },
    };
});
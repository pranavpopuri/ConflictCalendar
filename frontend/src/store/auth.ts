import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
    id: string;
    username: string;
    email: string;
}

export interface AuthStore {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
    register: (username: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
    logout: () => void;
    checkAuth: () => Promise<void>;
    requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
    resetPassword: (token: string, password: string) => Promise<{ success: boolean; message: string }>;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            login: async (email: string, password: string) => {
                try {
                    const res = await fetch("/api/auth/login", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ email, password }),
                    });

                    const data = await res.json();

                    if (data.success) {
                        set({
                            user: data.data.user,
                            token: data.data.token,
                            isAuthenticated: true,
                        });
                        return { success: true, message: "Login successful" };
                    } else {
                        return { success: false, message: data.message };
                    }
                } catch (error) {
                    return { success: false, message: "Failed to connect to server" };
                }
            },

            register: async (username: string, email: string, password: string) => {
                try {
                    const res = await fetch("/api/auth/register", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ username, email, password }),
                    });

                    const data = await res.json();

                    if (data.success) {
                        set({
                            user: data.data.user,
                            token: data.data.token,
                            isAuthenticated: true,
                        });
                        return { success: true, message: "Registration successful" };
                    } else {
                        return { success: false, message: data.message };
                    }
                } catch (error) {
                    return { success: false, message: "Failed to connect to server" };
                }
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                });
            },

            checkAuth: async () => {
                const { token } = get();
                if (!token) {
                    set({ isAuthenticated: false, user: null });
                    return;
                }

                try {
                    const res = await fetch("/api/auth/me", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    const data = await res.json();

                    if (data.success) {
                        set({
                            user: data.data.user,
                            isAuthenticated: true,
                        });
                    } else {
                        set({
                            user: null,
                            token: null,
                            isAuthenticated: false,
                        });
                    }
                } catch (error) {
                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                    });
                }
            },

            requestPasswordReset: async (email: string) => {
                try {
                    const res = await fetch("/api/auth/request-password-reset", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ email }),
                    });

                    const data = await res.json();
                    return {
                        success: data.success,
                        message: data.message || (data.success ? "Password reset email sent" : "Failed to send reset email")
                    };
                } catch (error) {
                    return { success: false, message: "Failed to connect to server" };
                }
            },

            resetPassword: async (token: string, password: string) => {
                try {
                    const res = await fetch("/api/auth/reset-password", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ token, password }),
                    });

                    const data = await res.json();

                    if (data.success) {
                        set({
                            user: data.data.user,
                            token: data.data.token,
                            isAuthenticated: true,
                        });
                        return { success: true, message: "Password reset successful" };
                    } else {
                        return { success: false, message: data.message };
                    }
                } catch (error) {
                    return { success: false, message: "Failed to connect to server" };
                }
            },
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({
                token: state.token,
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

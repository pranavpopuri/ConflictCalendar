// store/authWithSpinUp.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiService } from "../services/apiService";

export interface User {
    id: string;
    username: string;
    email: string;
}

export interface AuthStoreWithSpinUp {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isSpinningUp: boolean;
    retryAttempt: number;

    // Spin-up state management
    setSpinUpState: (isSpinningUp: boolean, attempt?: number) => void;

    // Auth methods
    login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
    register: (username: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
    logout: () => void;
    checkAuth: () => Promise<void>;
    requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
    resetPassword: (token: string, password: string) => Promise<{ success: boolean; message: string }>;
}

export const useAuthStoreWithSpinUp = create<AuthStoreWithSpinUp>()(
    persist(
        (set, get) => {
            // Configure API service callbacks
            apiService.setCallbacks({
                onSpinUp: () => {
                    set({ isSpinningUp: true, retryAttempt: 0 });
                },
                onRetry: (attempt: number) => {
                    set({ retryAttempt: attempt });
                },
                onSuccess: () => {
                    set({ isSpinningUp: false, retryAttempt: 0 });
                }
            });

            return {
                user: null,
                token: null,
                isAuthenticated: false,
                isSpinningUp: false,
                retryAttempt: 0,

                setSpinUpState: (isSpinningUp: boolean, attempt: number = 0) => {
                    set({ isSpinningUp, retryAttempt: attempt });
                },

                login: async (email: string, password: string) => {
                    try {
                        const response = await apiService.post("/api/auth/login", {
                            email,
                            password,
                        });

                        if (response.success) {
                            set({
                                user: response.data.user,
                                token: response.data.token,
                                isAuthenticated: true,
                            });
                        }

                        return {
                            success: response.success,
                            message: response.message,
                        };
                    } catch (error: any) {
                        return {
                            success: false,
                            message: error.message || "Login failed",
                        };
                    }
                },

                register: async (username: string, email: string, password: string) => {
                    try {
                        const response = await apiService.post("/api/auth/register", {
                            username,
                            email,
                            password,
                        });

                        if (response.success) {
                            set({
                                user: response.data.user,
                                token: response.data.token,
                                isAuthenticated: true,
                            });
                        }

                        return {
                            success: response.success,
                            message: response.message,
                        };
                    } catch (error: any) {
                        return {
                            success: false,
                            message: error.message || "Registration failed",
                        };
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
                    if (!token) return;

                    try {
                        const response = await apiService.get("/api/auth/me");
                        if (response.success) {
                            set({
                                user: response.data.user,
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
                        const response = await apiService.post("/api/auth/request-password-reset", {
                            email,
                        });

                        return {
                            success: response.success,
                            message: response.message,
                        };
                    } catch (error: any) {
                        return {
                            success: false,
                            message: error.message || "Failed to send reset email",
                        };
                    }
                },

                resetPassword: async (token: string, password: string) => {
                    try {
                        const response = await apiService.post("/api/auth/reset-password", {
                            token,
                            password,
                        });

                        if (response.success) {
                            set({
                                user: response.data.user,
                                token: response.data.token,
                                isAuthenticated: true,
                            });
                        }

                        return {
                            success: response.success,
                            message: response.message,
                        };
                    } catch (error: any) {
                        return {
                            success: false,
                            message: error.message || "Password reset failed",
                        };
                    }
                },
            };
        },
        {
            name: "auth-storage",
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

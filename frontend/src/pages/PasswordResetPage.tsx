import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react";
import { useAuthStore } from "../store/auth";

export function PasswordResetPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const { resetPassword } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        // Get token from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const resetToken = urlParams.get("token");

        if (!resetToken) {
            setMessage({ type: "error", text: "Invalid reset link. Please request a new password reset." });
            return;
        }

        setToken(resetToken);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            setMessage({ type: "error", text: "Invalid reset token." });
            return;
        }

        if (password.length < 6) {
            setMessage({ type: "error", text: "Password must be at least 6 characters long." });
            return;
        }

        if (password !== confirmPassword) {
            setMessage({ type: "error", text: "Passwords do not match." });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const result = await resetPassword(token, password);

            if (result.success) {
                setSuccess(true);
                setMessage({ type: "success", text: result.message });

                // Redirect to home page after successful reset
                setTimeout(() => {
                    navigate("/");
                }, 2000);
            } else {
                setMessage({ type: "error", text: result.message });
            }
        } catch (error) {
            setMessage({ type: "error", text: "An unexpected error occurred. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-zinc-900 mb-2">Password Reset Successful!</h1>
                                <p className="text-zinc-600">
                                    Your password has been updated successfully. You are now logged in.
                                </p>
                                <p className="text-sm text-zinc-500 mt-2">
                                    Redirecting to your dashboard...
                                </p>
                            </div>

                            {message && (
                                <div className="p-3 rounded-lg text-sm bg-green-50 text-green-700 border border-green-200">
                                    {message.text}
                                </div>
                            )}

                            <Button
                                onClick={() => navigate("/")}
                                className="w-full"
                            >
                                Go to Dashboard
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="text-center space-y-2 mb-8">
                        <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                            <Lock className="w-6 h-6 text-blue-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-zinc-900">Set New Password</h1>
                        <p className="text-zinc-600">
                            Enter your new password below.
                        </p>
                    </div>

                    {!token ? (
                        <div className="text-center space-y-4">
                            <div className="p-4 rounded-lg bg-red-50 text-red-700 border border-red-200">
                                <p className="font-medium">Invalid Reset Link</p>
                                <p className="text-sm mt-1">
                                    This reset link is invalid or has expired. Please request a new password reset.
                                </p>
                            </div>
                            <Button
                                onClick={() => navigate("/")}
                                variant="outline"
                                className="w-full"
                            >
                                Go to Login
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-zinc-700 mb-1">
                                    New Password
                                </label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        required
                                        className="w-full pr-10"
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-zinc-400" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-zinc-400" />
                                        )}
                                    </button>
                                </div>
                                <p className="text-xs text-zinc-500 mt-1">
                                    Must be at least 6 characters long
                                </p>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-700 mb-1">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                        required
                                        className="w-full pr-10"
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4 text-zinc-400" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-zinc-400" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {message && (
                                <div className={`p-3 rounded-lg text-sm ${
                                    message.type === "success"
                                        ? "bg-green-50 text-green-700 border border-green-200"
                                        : "bg-red-50 text-red-700 border border-red-200"
                                }`}>
                                    {message.text}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading || !password || !confirmPassword || !token}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Updating password...
                                    </div>
                                ) : (
                                    "Update Password"
                                )}
                            </Button>
                        </form>
                    )}

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => navigate("/")}
                            className="text-sm text-zinc-600 hover:text-zinc-800"
                        >
                            Back to login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

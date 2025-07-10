import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ArrowLeft, Mail, Send } from "lucide-react";
import { useAuthStore } from "../store/auth";

interface PasswordResetFormProps {
    onBack: () => void;
}

export function PasswordResetForm({ onBack }: PasswordResetFormProps) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [emailSent, setEmailSent] = useState(false);

    const { requestPasswordReset } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        setLoading(true);
        setMessage(null);

        try {
            const result = await requestPasswordReset(email);

            if (result.success) {
                setEmailSent(true);
                setMessage({ type: "success", text: result.message });
            } else {
                setMessage({ type: "error", text: result.message });
            }
        } catch (error) {
            setMessage({ type: "error", text: "An unexpected error occurred. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    if (emailSent) {
        return (
            <div className="space-y-6">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-800 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to login
                </button>

                <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                        <Mail className="w-8 h-8 text-green-600" />
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-zinc-900 mb-2">Check your email</h2>
                        <p className="text-zinc-600">
                            We've sent a password reset link to <strong>{email}</strong>
                        </p>
                        <p className="text-sm text-zinc-500 mt-2">
                            The link will expire in 10 minutes for security reasons.
                        </p>
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

                    <div className="space-y-3">
                        <Button
                            onClick={() => {
                                setEmailSent(false);
                                setEmail("");
                                setMessage(null);
                            }}
                            variant="outline"
                            className="w-full"
                        >
                            Send another email
                        </Button>

                        <Button
                            onClick={onBack}
                            variant="outline"
                            className="w-full"
                        >
                            Back to login
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-800 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to login
            </button>

            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-zinc-900">Reset your password</h2>
                <p className="text-zinc-600">
                    Enter your email address and we'll send you a link to reset your password.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1">
                        Email address
                    </label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="w-full"
                        disabled={loading}
                    />
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
                    disabled={loading || !email.trim()}
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Sending email...
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Send className="w-4 h-4" />
                            Send reset link
                        </div>
                    )}
                </Button>
            </form>

            <div className="text-center">
                <p className="text-sm text-zinc-600">
                    Remember your password?{" "}
                    <button
                        onClick={onBack}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Sign in
                    </button>
                </p>
            </div>
        </div>
    );
}

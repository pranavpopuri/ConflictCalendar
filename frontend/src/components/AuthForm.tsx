import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn, UserPlus, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../store/auth";
import { PasswordResetForm } from "./PasswordResetForm";

interface AuthFormProps {
  onAuthSuccess: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, register } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(formData.username, formData.email, formData.password);
      }

      if (result.success) {
        onAuthSuccess();
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setFormData({ username: "", email: "", password: "" });
  };

  // Show password reset form
  if (showPasswordReset) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "oklch(0.99 0.005 220)" }}>
        <div className="w-full max-w-md">
          <div
            className="bg-white rounded-lg shadow-lg p-6 md:p-8"
            style={{
              backgroundColor: "oklch(0.98 0.01 250)",
              borderColor: "oklch(0.9 0.02 220)",
              border: "1px solid"
            }}
          >
            <PasswordResetForm onBack={() => setShowPasswordReset(false)} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "oklch(0.99 0.005 220)" }}>
      <div className="w-full max-w-md">
        <div
          className="bg-white rounded-lg shadow-lg p-6 md:p-8"
          style={{
            backgroundColor: "oklch(0.98 0.01 250)",
            borderColor: "oklch(0.9 0.02 220)",
            border: "1px solid"
          }}
        >
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "oklch(0.7 0.1 220)" }}>
                {isLogin ? <LogIn className="text-white" size={24} /> : <UserPlus className="text-white" size={24} />}
              </div>
            </div>
            <h1 className="text-2xl font-bold" style={{ color: "oklch(0.3 0.15 220)" }}>
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-sm mt-2" style={{ color: "oklch(0.5 0.08 220)" }}>
              {isLogin ? "Sign in to your Conflict Calendar" : "Join Conflict Calendar today"}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-md" style={{ backgroundColor: "oklch(0.95 0.08 0)", border: "1px solid oklch(0.6 0.15 0)" }}>
              <p className="text-sm" style={{ color: "oklch(0.4 0.2 0)" }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-1" style={{ color: "oklch(0.4 0.1 220)" }}>
                  Username
                </label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required={!isLogin}
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="bg-white"
                  style={{ borderColor: "oklch(0.85 0.03 220)" }}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: "oklch(0.4 0.1 220)" }}>
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-white"
                style={{ borderColor: "oklch(0.85 0.03 220)" }}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1" style={{ color: "oklch(0.4 0.1 220)" }}>
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="bg-white pr-10"
                  style={{ borderColor: "oklch(0.85 0.03 220)" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: "oklch(0.5 0.08 220)" }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {!isLogin && (
                <p className="text-xs mt-1" style={{ color: "oklch(0.5 0.08 220)" }}>
                  Password must be at least 6 characters long
                </p>
              )}
            </div>

            {isLogin && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowPasswordReset(true)}
                  className="text-sm font-medium hover:underline"
                  style={{ color: "oklch(0.6 0.15 250)" }}
                >
                  Forgot password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 text-white font-medium rounded-md transition-colors"
              style={{
                backgroundColor: "oklch(0.6 0.15 250)",
                borderColor: "oklch(0.6 0.15 250)",
              }}
            >
              {isLoading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: "oklch(0.5 0.08 220)" }}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={toggleMode}
                className="ml-1 font-medium hover:underline"
                style={{ color: "oklch(0.6 0.15 250)" }}
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;

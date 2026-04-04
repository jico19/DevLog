import { useForm } from "react-hook-form";
import GithubLoginButton from "src/components/ui/GithubLoginButton";
import api from "src/utils/api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "src/context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { LogIn, Loader2, AlertCircle } from "lucide-react";

const LoginPage = () => {
    // Note: I brought in 'setError' to handle invalid credentials gracefully
    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm();
    const navigate = useNavigate();
    const login = useAuth((s) => s.login);

    const loginHandler = async (data) => {
        try {
            const res = await api.post('/login/', data);
            localStorage.setItem('access', res.data.access);
            localStorage.setItem('refresh', res.data.refresh);
            login({
                user_id: Number(jwtDecode(res.data.access).user_id),
                username: jwtDecode(res.data.access).username,
            });
            navigate('/feed');
        } catch (error) {
            console.log(error.response);
            // Set a global error to show the user instead of just resetting the form
            setError("root", {
                type: "manual",
                message: error.response?.data?.detail || "Invalid credentials. Please try again."
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
            
            {/* Login Card */}
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-8">
                
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500 mb-4">
                        <LogIn size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                        Welcome back
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Enter your credentials to access your DevLog.
                    </p>
                </div>

                {/* API Error Alert */}
                {errors.root && (
                    <div className="mb-6 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg flex items-center gap-3 text-red-600 dark:text-red-400 text-sm">
                        <AlertCircle size={18} />
                        <p>{errors.root.message}</p>
                    </div>
                )}

                {/* Standard Form Element for "Enter" key support */}
                <form onSubmit={handleSubmit(loginHandler)} className="space-y-4">
                    
                    {/* Username Input */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Username
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. dev_ninja"
                            {...register('username', { required: "Username is required" })}
                            className={`w-full bg-white dark:bg-zinc-950 border ${
                                errors.username ? "border-red-500 focus:ring-red-500" : "border-zinc-300 dark:border-zinc-800 focus:border-blue-500 focus:ring-blue-500"
                            } rounded-lg px-4 py-2.5 text-sm text-zinc-900 dark:text-white outline-none focus:ring-2 transition-all placeholder:text-zinc-400`}
                        />
                        {/* Validation Error Message */}
                        {errors.username && (
                            <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>
                        )}
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            {...register('password', { required: "Password is required" })}
                            className={`w-full bg-white dark:bg-zinc-950 border ${
                                errors.password ? "border-red-500 focus:ring-red-500" : "border-zinc-300 dark:border-zinc-800 focus:border-blue-500 focus:ring-blue-500"
                            } rounded-lg px-4 py-2.5 text-sm text-zinc-900 dark:text-white outline-none focus:ring-2 transition-all placeholder:text-zinc-400`}
                        />
                        {/* Validation Error Message */}
                        {errors.password && (
                            <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full mt-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-medium py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-6">
                    <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800"></div>
                    <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Or continue with</span>
                    <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800"></div>
                </div>

                {/* Github Auth */}
                <div className="mb-6">
                    <GithubLoginButton />
                </div>

                {/* Register Link */}
                <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                    Don't have an account yet?{" "}
                    {/* Replaced button with Link for better SEO and routing practice */}
                    <Link 
                        to="/register" 
                        className="font-semibold text-blue-600 dark:text-blue-500 hover:underline transition-all"
                    >
                        Sign up here.
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default LoginPage;
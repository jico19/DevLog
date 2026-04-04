import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import api from "src/utils/api";
import { UserPlus, Loader2, AlertCircle, ArrowLeft } from "lucide-react";

const RegisterPage = () => {
    const { 
        register, 
        handleSubmit, 
        watch, 
        setError,
        formState: { errors, isSubmitting } 
    } = useForm();
    const navigate = useNavigate();

    // We watch the password field to compare it with the "confirm password" field
    const password = watch("password");

    const registerHandler = async (data) => {
        try {
            await api.post('/user/', data);
            // Instead of a browser alert, we could use a toast library, 
            // but for now, navigating to login is fine.
            navigate('/', { state: { message: "Account created! Please log in." } });
        } catch (error) {
            console.log(error.response);
            setError("root", {
                type: "manual",
                message: error.response?.data?.username?.[0] || "Registration failed. Try a different username."
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-8">
                
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-500 mb-4">
                        <UserPlus size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                        Create an account
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Join the community and start logging your progress.
                    </p>
                </div>

                {/* API Error Alert */}
                {errors.root && (
                    <div className="mb-6 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg flex items-center gap-3 text-red-600 dark:text-red-400 text-sm">
                        <AlertCircle size={18} />
                        <p>{errors.root.message}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(registerHandler)} className="space-y-4">
                    {/* Username */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Username
                        </label>
                        <input
                            type="text"
                            placeholder="dev_ninja"
                            {...register('username', { required: "Username is required" })}
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500/50 transition-all text-zinc-300"
                        />
                        {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            {...register('password', { 
                                required: "Password is required",
                                minLength: { value: 6, message: "Minimum 6 characters" }
                            })}
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500/50 transition-all text-zinc-300"
                        />
                        {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            {...register('confirm_password', { 
                                required: "Please confirm your password",
                                validate: (value) => value === password || "Passwords do not match"
                            })}
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500/50 transition-all text-zinc-300"
                        />
                        {errors.confirm_password && <p className="text-xs text-red-500">{errors.confirm_password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Creating account...
                            </>
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center">
                    <Link 
                        to="/" 
                        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
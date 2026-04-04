import { FaGithub } from "react-icons/fa";

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
const CALLBACK_URL = 'http://localhost:5173/auth/callback';

export default function GithubLoginButton() {
    const handleLogin = () => {
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${CALLBACK_URL}&scope=read:user,user:email`;
        window.location.href = githubAuthUrl;
    };

    return (
        <button
            onClick={handleLogin}
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-medium py-2.5 rounded-lg transition-all shadow-sm border border-transparent dark:border-zinc-200"
        >
            <FaGithub />
            <span>Continue with GitHub</span>
        </button>
    );
}
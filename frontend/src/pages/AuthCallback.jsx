// pages/AuthCallback.jsx
import { jwtDecode } from 'jwt-decode';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'src/context/AuthContext';
import api from 'src/utils/api';
import { Loader2 } from 'lucide-react';
import { FaGithub } from "react-icons/fa";



export default function AuthCallback() {
    const navigate = useNavigate();
    const called = useRef(false); 
    const login = useAuth((s) => s.login);

    useEffect(() => {
        if (called.current) return; 
        called.current = true;

        const handleGithubLogin = async () => {
            const params = new URLSearchParams(window.location.search);
            const code = params.get('code');

            if (!code) {
                navigate('/');
                return;
            }

            try {
                const res = await api.post('/user/github_login/', { code });
                const { access, refresh, user } = res.data;

                // Set Tokens
                localStorage.setItem('access', access);
                localStorage.setItem('refresh', refresh);
                localStorage.setItem('user', JSON.stringify(user));

                const decoded = jwtDecode(access);
                
                // Update Global Auth State
                login({
                    user_id: Number(decoded.user_id),
                    username: decoded.username
                });

                // Success! Redirect to Feed
                navigate('/feed');
            } catch (error) {
                console.error("GitHub Login Error:", error);
                // Redirect back to login if something fails
                navigate('/');
            }
        };

        handleGithubLogin();
    }, [navigate, login]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
            <div className="flex flex-col items-center space-y-6">
                
                {/* Visual indicator of the "Handshake" */}
                <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-900 shadow-xl">
                        <FaGithub size={32} />
                    </div>
                    {/* Pulsing ring effect */}
                    <div className="absolute inset-0 w-16 h-16 rounded-full bg-zinc-900 dark:bg-white animate-ping opacity-20"></div>
                </div>

                <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 text-zinc-900 dark:text-white font-semibold text-lg">
                        <Loader2 className="animate-spin" size={20} />
                        <span>Authenticating with GitHub</span>
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-[200px]">
                        Setting up your secure session. Just a moment...
                    </p>
                </div>

                {/* Subtle progress track */}
                <div className="w-48 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-zinc-900 dark:bg-zinc-100 animate-[loading_1.5s_ease-in-out_infinite] w-1/3 rounded-full"></div>
                </div>
            </div>

            {/* Custom Tailwind animation for the progress bar if you don't have it in your config */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes loading {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(300%); }
                }
            `}} />
        </div>
    );
}
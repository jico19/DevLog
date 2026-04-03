import { useState } from "react";
import {
    Home,
    Folder,
    FileText,
    User,
    Flame,
    Users,
    Compass,
    Menu,
} from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "src/context/AuthContext";

const UserLayout = () => {
    const [activeSidebar, setActiveSidebar] = useState("feed");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate()
    const user = useAuth((s) => s.user)
    const logout = useAuth((s) => s.logout)

    const icon15 = { size: 15, strokeWidth: 1.8 };

    return (
        <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900 font-mono">
            {/* TOPBAR */}
            <div className="sticky top-0 z-50 h-14 flex items-center px-4 gap-2 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="md:hidden p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                    <Menu size={20} className="text-zinc-300"/>
                </button>

                <h1 className="text-zinc-300 text-lg md:text-2xl">// devlog</h1>
            </div>

            {/* LAYOUT */}
            <div className="flex h-[calc(100vh-56px)] overflow-hidden">
                {/* BACKDROP */}
                {sidebarOpen && (
                    <div
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-black/40 z-40 md:hidden"
                    />
                )}

                {/* SIDEBAR */}
                <aside
                    className={`
                    fixed md:static
                    z-50 md:z-auto
                    top-14 md:top-0
                    left-0
                    h-[calc(100vh-56px)] md:h-auto
                    w-[260px]
                    border-r border-zinc-200 dark:border-zinc-800
                    bg-white dark:bg-zinc-900
                    p-2 flex flex-col
                    transition-transform duration-200
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    md:translate-x-0
                `}
                >
                    <span className="text-[10px] text-zinc-400 px-3 py-2">// main</span>

                    {[
                        { name: "feed", icon: Home,  onClick: () => navigate('/feed')},
                        { name: "entries", icon: FileText,  onClick: () => navigate(`/profile/${user.user_id}`)},
                        { name: "profile", icon: User,  onClick: () =>  navigate(`/profile/${user.user_id}`)},
                    ].map(({ name, icon: Icon, onClick}) => (
                        <button
                            key={name}
                            onClick={() => {
                                setActiveSidebar(name);
                                setSidebarOpen(false);
                                onClick()
                            }}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition
                            ${activeSidebar === name
                                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium"
                                    : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                }`}
                        >
                            <Icon {...icon15} />
                            {name}
                        </button>
                    ))}

                    <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-3" />

                    <span className="text-[10px] text-zinc-400 px-3 py-2">// discover</span>

                    {[
                        { name: "trending", icon: Flame, onClick: () => console.log('tite')},
                        { name: "devs", icon: Users, onClick: () => console.log('tite')},
                    ].map(({ name, icon: Icon, onClick, }) => (
                        <button
                            key={name}
                            onClick={() => {
                                setActiveSidebar(name);
                                setSidebarOpen(false);
                                onClick()
                            }}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition
                            ${activeSidebar === name
                                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium"
                                    : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                }`}
                        >
                            <Icon {...icon15} />
                            {name}
                        </button>
                    ))}

                    <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-3" />

                    <div className="mt-auto border-t border-zinc-200 dark:border-zinc-800 pt-2">
                        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800" onClick={() => logout()}>
                            <div className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center text-[10px]">
                                {user.username.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="text-left">
                                <div className="text-xs font-medium text-zinc-900 dark:text-white">
                                    {user.username}
                                </div>
                                <div className="text-[10px] text-zinc-400">
                                    @{user.username}
                                </div>
                            </div>
                        </button>
                    </div>
                </aside>

                {/* MAIN */}
                <main className="flex-1 min-w-0 p-4 md:p-6 bg-zinc-100 dark:bg-zinc-950 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default UserLayout
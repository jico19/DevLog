import { User, FolderCode, PenTool, ExternalLink, ShieldCheck, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetDevs } from "src/queries/useGetEntrys";


const DevsPage = () => {
    const { data: devs, isPending } = useGetDevs();

    if (isPending) return (
        < div className="flex flex-col items-center justify-center w-full min-h-[200px] gap-3">
            <div className="p-3 bg-blue-50 rounded-full dark:bg-blue-900/20">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">
                Loading content...
            </p>
        </div>
    )
    return (
        <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">

            <header className="space-y-4">
                <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
                    The <span className="text-blue-500">Community</span>
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-lg text-sm">
                    Connect with other developers, track their progress, and see what the world is building today.
                </p>
            </header>

            {/* DEVS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {devs?.map((dev) => (
                    <div
                        key={dev.id}
                        className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden"
                    >
                        {/* Decorative Background Pattern */}
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] dark:opacity-[0.05] group-hover:scale-110 transition-transform">
                            <User size={80} />
                        </div>

                        <div className="relative z-10 space-y-6">
                            {/* Avatar & Username */}
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center text-sm font-bold shadow-lg">
                                    {dev.username.slice(0, 2).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white truncate flex items-center gap-1">
                                        {dev.username}
                                        <ShieldCheck size={14} className="text-blue-500" />
                                    </h3>
                                    <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-tighter">
                                        @{dev.username.toLowerCase()}
                                    </p>
                                </div>
                            </div>

                            {/* STATS ROW */}
                            <div className="grid grid-cols-2 gap-4 py-4 border-y border-zinc-100 dark:border-zinc-800">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">Projects</p>
                                    <div className="flex items-center gap-2 text-zinc-900 dark:text-white">
                                        <FolderCode size={14} className="text-blue-500" />
                                        <span className="text-sm font-bold">{dev.project_count || 0}</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">Logs</p>
                                    <div className="flex items-center gap-2 text-zinc-900 dark:text-white">
                                        <PenTool size={14} className="text-blue-500" />
                                        <span className="text-sm font-bold">{dev.entry_count || 0}</span>
                                    </div>
                                </div>
                            </div>

                            {/* ACTION */}
                            <Link
                                to={`/profile/${dev.id}`}
                                className="w-full py-2.5 flex items-center justify-center gap-2 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors"
                            >
                                View Profile
                                <ExternalLink size={12} />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DevsPage;
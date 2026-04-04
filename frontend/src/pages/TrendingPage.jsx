import { Flame, TrendingUp, Heart, MessageSquare, ChevronRight, Trophy, Clock, Sparkles, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetTrendingEntries } from "src/queries/useGetEntrys";



const TrendingPage = () => {
    const { data: trending_entries, isPending, isError } = useGetTrendingEntries();

    if (isPending) return (
        <div className="flex flex-col items-center justify-center w-full min-h-[200px] gap-3">
            <div className="p-3 bg-blue-50 rounded-full dark:bg-blue-900/20">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">
                Loading content...
            </p>
        </div>
    )
    if (isError) return (
        <div className="flex flex-col items-center justify-center py-20 text-red-500 font-mono text-xs">
            <p>// error_loading_trending_stream</p>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto px-6 py-10 space-y-12">

            {/* HERO HEADER */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 dark:border-zinc-800 pb-10">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-500 rounded-full text-[10px] font-bold uppercase tracking-widest">
                        <Flame size={14} className="animate-pulse" />
                        Live Trending
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tighter">
                        Discover what's <span className="text-blue-500">building.</span>
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 max-w-md text-sm leading-relaxed">
                        The most engaged developer logs, milestones, and project updates from the community in the last 7 days.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-zinc-400 font-mono text-[10px] uppercase">
                    <TrendingUp size={14} />
                    <span>Updated just now</span>
                </div>
            </header>

            {/* MAIN LIST */}
            <div className="grid grid-cols-1 gap-6">
                {trending_entries?.map((entry, index) => (
                    <div
                        key={entry.id}
                        className="group relative flex flex-col md:flex-row items-center gap-6 p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300"
                    >
                        {/* Rank Badge */}
                        <div className="absolute -left-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm z-10">
                            <span className={`text-sm font-black ${index < 3 ? 'text-blue-500' : 'text-zinc-400'}`}>
                                {index + 1}
                            </span>
                        </div>

                        {/* Image Preview */}
                        <div className="w-full md:w-48 aspect-video md:aspect-square rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
                            {entry.screenshot ? (
                                <img
                                    src={entry.screenshot}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    alt={entry.title}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-300">
                                    <TrendingUp size={32} />
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-4 min-w-0">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono font-bold uppercase text-blue-500 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded">
                                        {entry.project_name}
                                    </span>
                                    {entry.is_milestone && (
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500 uppercase tracking-tighter">
                                            <Sparkles size={12} /> Milestone
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors truncate">
                                    {entry.title}
                                </h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                                    {entry.body}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 group-hover:text-red-500 transition-colors">
                                        <Heart size={14} className={entry.likes.length > 0 ? "fill-red-500 text-red-500" : ""} />
                                        {entry.likes.length}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400">
                                        <MessageSquare size={14} />
                                        {entry.comments?.length || 0}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold">
                                        {entry.owner_name?.slice(0, 2).toUpperCase()}
                                    </div>
                                    <span className="text-xs text-zinc-400 font-medium italic">by {entry.owner_name}</span>
                                </div>
                            </div>
                        </div>

                        <div className="hidden md:block pr-4">
                            <ChevronRight size={20} className="text-zinc-200 dark:text-zinc-800 group-hover:text-blue-500 group-hover:translate-x-2 transition-all" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrendingPage;
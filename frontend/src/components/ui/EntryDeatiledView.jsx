import { useParams, useNavigate } from "react-router-dom";
import {
    Heart, MessageSquare, ChevronRight,
    Share2, Calendar, User, Hash, Send
} from "lucide-react";
import { useGetEntryDetail } from "src/queries/useGetEntrys";
import timeAgo from "./FormatDate";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const EntryDeatiledView = () => {
    const [commentsOpen, setCommentsOpen] = useState(false);
    const { id } = useParams()
    const [showLikes, setShowLikes] = useState(false);
    const navigate = useNavigate();
    const { data: entries, isPending, isError } = useGetEntryDetail(id)



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
    if (isError) return <div className="p-20 text-center font-mono text-xs text-red-500">// error: failed_to_fetch_entry</div>;

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-20">
            <nav className="flex items-center gap-2 px-1 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                <button onClick={() => navigate('/feed')} className="hover:text-blue-500 transition-colors">Feed</button>
                <ChevronRight size={10} />
                <span className="text-blue-500">{entries.project_name}</span>
                <ChevronRight size={10} />
                <span className="text-zinc-400">Entry #{id}</span>
            </nav>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden max-w-2xl mx-auto">

                {/* HEADER */}
                <div className="p-8 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="flex justify-between items-start mb-8">
                        <div className="space-y-3">
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                                <Hash size={12} /> {entries.project_name}
                            </span>
                            <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight">
                                {entries.title}
                            </h1>
                        </div>

                    </div>

                    {/* AUTHOR & TIME */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-zinc-50 dark:border-zinc-800/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center text-xs font-bold ring-4 ring-zinc-50 dark:ring-zinc-800">
                                {entries.owner_name?.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1">
                                    {entries.owner_name}
                                </p>
                                <p className="text-[10px] text-zinc-400 font-mono italic">DevLog Contributor</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-400">
                            <div className="flex items-center gap-1.5">
                                <Calendar size={12} />
                                {timeAgo(entries.created_at)}
                            </div>
                            <button className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                                <Share2 size={14} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="p-8">
                    <div className="prose prose-zinc dark:prose-invert max-w-none">
                        <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
                            {entries.body}
                        </p>
                    </div>

                    {entries.screenshot && (
                        <div className="mt-8 relative group">
                            <div className="relative rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-2xl bg-zinc-100 dark:bg-zinc-950">
                                <img
                                    src={entries.screenshot}
                                    alt={entries.title}
                                    className="w-full h-auto block"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 px-3 py-2 border-b border-zinc-100 dark:border-zinc-800">

                    {/* Like button with tooltip */}
                    <div className="relative">
                        <button
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-mono text-xs text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                            onMouseEnter={() => setShowLikes(true)}
                            onMouseLeave={() => setShowLikes(false)}
                        >
                            <Heart />
                            {entries?.likes?.length ?? 0}
                        </button>

                        {showLikes && entries?.likes?.length > 0 && (
                            <div className="absolute bottom-full left-0 mb-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 min-w-[140px] shadow-md z-10">
                                <p className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider mb-1.5">
                                    liked by
                                </p>
                                {entries.likes.map((user, i) => (
                                    <div key={i} className="flex items-center gap-2 py-0.5">
                                        <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-[9px] font-semibold text-blue-700 dark:text-blue-300">
                                            {user.username?.slice(0, 2).toUpperCase()}
                                        </div>
                                        <span className="text-xs text-zinc-700 dark:text-zinc-300">
                                            {user.username}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Comment toggle button */}
                    <button
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-mono text-xs text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                        onClick={() => setCommentsOpen((o) => !o)}
                    >
                        <MessageSquare />
                        comments
                    </button>
                </div>

                {/* Comments section */}
                <div>
                    <div
                        className="flex items-center justify-between px-4 py-2.5 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                        onClick={() => setCommentsOpen((o) => !o)}
                    >
                        <span className={`font-mono text-xs text-zinc-500 flex items-center gap-1.5 before:content-['▸'] before:text-[10px] before:transition-transform ${commentsOpen ? "before:rotate-90" : ""}`}>
                            {entries?.comments?.length ?? 0} comments
                        </span>
                        <span className="text-[11px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-400 rounded-full px-2 py-0.5">
                            {entries?.comments?.length ?? 0}
                        </span>
                    </div>

                    {commentsOpen && (
                        <div className="border-t border-zinc-100 dark:border-zinc-800">
                            {entries?.comments?.length ? (
                                entries.comments.map((comment, i) => (
                                    <div
                                        key={i}
                                        className="flex justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-b-0"
                                    >
                                        <div className="flex gap-2.5 items-center">
                                            <div className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-[11px] font-medium text-zinc-500 shrink-0 mt-0.5">
                                                {comment.username?.slice(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="flex items-baseline gap-2 mb-1">
                                                    <span className="font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                                                        {comment.username}
                                                    </span>
                                                    <span className="text-[11px] text-zinc-400">
                                                        {timeAgo(comment.commented_at)}
                                                    </span>

                                                </div>
                                                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                                    {comment.body}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center font-mono text-xs text-zinc-400 py-4">
                                // no comments yet
                                </p>
                            )}


                        </div>
                    )}
                </div>

            </div>


        </div>
    )
}

export default EntryDeatiledView
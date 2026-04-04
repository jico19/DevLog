
import { icons, Loader2 } from 'lucide-react';
import { useEffect, useState } from "react";
import { Folder, FileText, Trophy, Heart, MessageSquare, Clock, Star, Flame, FolderKanban, ArrowUpRight } from "lucide-react";
import { useGetAchievements, useGetSelfEntries, useGetSelfProject, useGetUser } from "src/queries/useGetEntrys";
import timeAgo from "src/components/ui/FormatDate";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';


const EmptyState = ({ label }) => {
    return (
        <div className="text-center py-10 text-xs text-zinc-500 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
            {label}
        </div>
    );
}

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState("entries");
    const { id } = useParams()
    const { data: entries, isPending: isEntriesPending } = useGetSelfEntries(id);
    const { data: projects, isPending: isProjectsPending } = useGetSelfProject(id);
    const { data: achievement_data, isPending: isAchievementsPending } = useGetAchievements(id);
    const { data: user, isPending: isUserPending } = useGetUser(id)
    const query = useQueryClient()
    const navigate = useNavigate()


    const initials = user?.username?.slice(0, 2).toUpperCase();

    const isGlobalLoading = isEntriesPending || isProjectsPending || isAchievementsPending || isUserPending;

    useEffect(() => {
        query.invalidateQueries({ queryKey: ['user'] })
        query.invalidateQueries({ queryKey: ['entries'] })
        query.invalidateQueries({ queryKey: ['projects'] })
        query.invalidateQueries({ queryKey: ['achievement_data'] })
    }, [id])

    if (isGlobalLoading) {
        return (
            <div className="flex flex-col items-center justify-center w-full min-h-[200px] gap-3">
                <div className="p-3 bg-blue-50 rounded-full dark:bg-blue-900/20">
                    <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">
                    Loading content...
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-5xl mx-auto">
                {/* HEADER */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden mb-4">
                    {/* COVER */}
                    <div className="h-32 bg-zinc-200 dark:bg-zinc-800" />

                    {/* PROFILE INFO */}
                    <div className="px-6 pb-6 relative">
                        {/* AVATAR */}
                        <div className="absolute -top-8 left-6 w-16 h-16 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center text-sm font-medium border-4 border-white dark:border-zinc-900">
                            {initials}
                        </div>

                        <div className="ml-24 pt-4">
                            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                                {user?.username}
                            </h2>
                            <p className="text-xs text-zinc-500">
                                @{user?.username}
                            </p>
                        </div>
                    </div>
                </div>

                {/* TABS */}
                <div className="flex gap-2 mb-4 border-b border-zinc-200 dark:border-zinc-800">
                    {[
                        { name: "entries", icon: FileText },
                        { name: "projects", icon: Folder },
                        { name: "achievements", icon: Trophy },
                    ].map(({ name, icon: Icon }) => (
                        <button
                            key={name}
                            onClick={() => {
                                setActiveTab(name)
                            }}
                            className={`flex items-center gap-2 px-4 py-2 text-xs rounded-t-lg transition
                        ${activeTab === name
                                    ? "text-zinc-900 dark:text-white border-b-2 border-zinc-900 dark:border-white"
                                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                                }`}
                        >
                            <Icon size={14} />
                            {name}
                        </button>
                    ))}
                </div>

                {/* ENTRIES */}
                {activeTab === "entries" && (
                    <div className="space-y-4">
                        {entries.length ? (
                            entries.map((entry, i) => (
                                <div
                                    key={entry.id || i}
                                    className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-sm"
                                >
                                    {/* IMAGE SECTION */}
                                    {entry.screenshot && (
                                        <div className="relative w-full aspect-video bg-zinc-100 dark:bg-zinc-800 overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
                                            <img
                                                src={entry.screenshot}
                                                alt={entry.title}
                                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                                                onClick={() => {
                                                    navigate(`/entry/detailed/${entry.id}/`)
                                                }}
                                            />
                                            {/* Milestone Overlay Badge */}
                                            {entry.is_milestone && (
                                                <div className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg uppercase tracking-widest">
                                                    Milestone
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* CONTENT SECTION */}
                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                {/* PROJECT TAG */}
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded">
                                                    {entry.project_name}
                                                </span>

                                                {/* TITLE */}
                                                <h3 className="text-base font-bold text-zinc-900 dark:text-white mt-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    {entry.title}
                                                </h3>
                                            </div>

                                            {/* Action Icon */}
                                            <ArrowUpRight size={18} className="text-zinc-300 group-hover:text-zinc-500 transition-colors" />
                                        </div>

                                        {/* BODY */}
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3 mb-4">
                                            {entry.body}
                                        </p>

                                        <div className="h-px w-full bg-zinc-100 dark:bg-zinc-800 mb-4" />

                                        {/* META FOOTER */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                {/* LIKES */}
                                                <button className="flex items-center gap-1.5 text-zinc-500 hover:text-red-500 transition-colors group/btn">
                                                    <div className="p-1.5 rounded-full group-hover/btn:bg-red-50 dark:group-hover/btn:bg-red-500/10">
                                                        <Heart size={16} className={entry.is_liked ? "fill-red-500 text-red-500" : ""} />
                                                    </div>
                                                    <span className="text-xs font-medium">{entry.likes?.length || 0}</span>
                                                </button>

                                                {/* COMMENTS */}
                                                <button className="flex items-center gap-1.5 text-zinc-500 hover:text-blue-500 transition-colors group/btn">
                                                    <div className="p-1.5 rounded-full group-hover/btn:bg-blue-50 dark:group-hover/btn:bg-blue-500/10">
                                                        <MessageSquare size={16} />
                                                    </div>
                                                    <span className="text-xs font-medium">{entry.comments?.length || 0}</span>
                                                </button>
                                            </div>

                                            {/* TIME AGO */}
                                            <div className="flex items-center gap-1.5 text-zinc-400">
                                                <Clock size={12} />
                                                <span className="text-[11px] font-medium italic">
                                                    {timeAgo(entry.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <EmptyState label="No entries yet." />
                        )}
                    </div>
                )}

                {/* PROJECTS */}
                {activeTab === "projects" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {projects?.length > 0 ? (
                            projects.map((project) => (
                                <div
                                    // Try to use a unique ID like project.id if your database provides it!
                                    key={project.id}
                                    className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors cursor-pointer flex flex-col h-full"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-500">
                                            <FolderKanban size={20} />
                                        </div>
                                        {/* Example Status Badge - replace with your actual project data if you have it */}
                                        <span className="text-[10px] font-medium px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full">
                                            Active
                                        </span>
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                                            {project.name}
                                            {/* Little arrow that shows up when you hover over the card */}
                                            <ArrowUpRight size={14} className="opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all" />
                                        </h3>
                                        {/* line-clamp-2 ensures long descriptions don't break your grid layout */}
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
                                            {project.description}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-1 md:col-span-2">
                                <EmptyState label="No projects yet." />
                            </div>
                        )}
                    </div>
                )}

                {/* ACHIEVEMENTS */}
                {activeTab === "achievements" && (
                    <div className="space-y-6">
                        {/* Stats Header */}
                        {achievement_data && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {/* Total Points Card */}
                                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex items-center gap-4 shadow-sm">
                                    <div className="p-2.5 bg-yellow-100 dark:bg-yellow-500/10 rounded-lg">
                                        <Star className="text-yellow-600 dark:text-yellow-500" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Total Points</p>
                                        <p className="text-xl font-bold text-zinc-900 dark:text-white">
                                            {achievement_data.total_points}
                                        </p>
                                    </div>
                                </div>

                                {/* Current Streak Card */}
                                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex items-center gap-4 shadow-sm">
                                    <div className="p-2.5 bg-orange-100 dark:bg-orange-500/10 rounded-lg">
                                        <Flame className="text-orange-600 dark:text-orange-500" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Current Streak</p>
                                        <p className="text-xl font-bold text-zinc-900 dark:text-white">
                                            {achievement_data.current_streak} <span className="text-sm font-medium text-zinc-500">days</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Longest Streak Card */}
                                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 hidden md:flex items-center gap-4 shadow-sm">
                                    <div className="p-2.5 bg-blue-100 dark:bg-blue-500/10 rounded-lg">
                                        <Trophy className="text-blue-600 dark:text-blue-500" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Best Streak</p>
                                        <p className="text-xl font-bold text-zinc-900 dark:text-white">
                                            {achievement_data.longest_streak} <span className="text-sm font-medium text-zinc-500">days</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Achievements List */}
                        <div className="space-y-3">
                            {achievement_data?.achievements?.length > 0 ? (
                                achievement_data.achievements.map((ach) => {
                                    // Resolve the Dynamic Icon (make sure 'icons' is imported from lucide-react)
                                    const LucideIcon = icons[ach.icon] || icons.Trophy;

                                    return (
                                        <div
                                            key={ach.key}
                                            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex items-center gap-3"
                                        >
                                            <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                                                <LucideIcon size={20} className="text-yellow-500" />
                                            </div>

                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                                                    {ach.name}
                                                </p>
                                                <p className="text-xs text-zinc-500">
                                                    {ach.description}
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <span className="text-xs font-bold text-yellow-600 dark:text-yellow-500">
                                                    +{ach.points}
                                                </span>
                                                <p className="text-[10px] text-zinc-400">
                                                    {new Date(ach.unlocked_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <EmptyState label="No achievements yet." />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>

    );
}
export default ProfilePage
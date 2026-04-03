
import { useState } from "react";
import { Folder, FileText, Trophy, HeartIcon, MessageSquareIcon } from "lucide-react";
import { useAuth } from "src/context/AuthContext";
import { useGetSelfEntries, useGetSelfProject } from "src/queries/useGetEntrys";
import timeAgo from "src/components/ui/FormatDate";


function EmptyState({ label }) {
    return (
        <div className="text-center py-10 text-xs text-zinc-500 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
            {label}
        </div>
    );
}

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState("entries");
    const [achievements, setAchievements] = useState([])
    const user = useAuth((s) => s.user)
    const { data: projects, isPending } = useGetSelfProject()
    const { data: entries } = useGetSelfEntries()

    const initials = user?.username?.slice(0, 2).toUpperCase();

    if (isPending) return <p>loading....</p>


    return (
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

            {/* CONTENT */}
            <div className="space-y-3">
                {/* ENTRIES */}
                {activeTab === "entries" &&
                    (entries.length ? (
                        entries.map((entry, i) => (
                            <div
                                key={i}
                                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden"
                            >
                                {/* IMAGE */}
                                {entry.screenshot && (
                                    <div className="w-full aspect-video bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                                        <img
                                            src={entry.screenshot}
                                            alt={entry.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                {/* CONTENT */}
                                <div className="p-4">
                                    {/* PROJECT NAME */}
                                    <p className="text-[10px] uppercase tracking-wide text-zinc-400 mb-1">
                                        {entry.project_name}
                                    </p>

                                    {/* TITLE */}
                                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">
                                        {entry.title}
                                    </h3>

                                    {/* BODY */}
                                    <p className="text-xs text-zinc-500 leading-relaxed line-clamp-3 mb-3">
                                        {entry.body}
                                    </p>

                                    {/* META */}
                                    <div className="flex items-center justify-between text-[11px] text-zinc-400">
                                        <div className="flex items-center gap-3">
                                            <span className="inline-flex gap-x-2.5">
                                                <HeartIcon size={18} className="text-red-500"/>
                                                {entry.likes?.length || 0}
                                            </span>
                                            <span className="inline-flex gap-x-2.5">
                                                <MessageSquareIcon size={18} className="text-blue-500" />
                                                {entry.comments?.length || 0}
                                            </span>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-[10px] opacity-70">
                                                {timeAgo(entry.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <EmptyState label="No entries yet." />
                    ))}

                {/* PROJECTS */}
                {activeTab === "projects" &&
                    (projects.length ? (
                        projects.map((project, i) => (
                            <div
                                key={i}
                                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4"
                            >
                                <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-1">
                                    {project.name}
                                </h3>
                                <p className="text-xs text-zinc-500">
                                    {project.description}
                                </p>
                            </div>
                        ))
                    ) : (
                        <EmptyState label="No projects yet." />
                    ))}

                {/* ACHIEVEMENTS */}
                {activeTab === "achievements" &&
                    (achievements.length ? (
                        achievements.map((ach, i) => (
                            <div
                                key={i}
                                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex items-center gap-3"
                            >
                                <Trophy size={16} className="text-yellow-500" />
                                <div>
                                    <p className="text-sm text-zinc-900 dark:text-white">
                                        {ach.title}
                                    </p>
                                    <p className="text-xs text-zinc-500">
                                        {ach.description}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <EmptyState label="No achievements yet." />
                    ))}
            </div>
        </div>
    );
}
export default ProfilePage
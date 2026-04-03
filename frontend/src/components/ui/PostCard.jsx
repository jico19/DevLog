import { HeartIcon, MessageSquare, Ellipsis } from "lucide-react";
import { useState } from "react";
import EllipsisMenu from "./DropdownButton";
import ResponsiveImage from "./ResponsiveImage";
import { useAuth } from "src/context/AuthContext";
import api from "src/utils/api";
import { useQueryClient } from "@tanstack/react-query"
import timeAgo from "./FormatDate";

const PostCard = ({ data, register, handleSubmit, commentHandler, editHandler, deleteHandler, likeHandler, commentDeleteHandler }) => {
    const [commentsOpen, setCommentsOpen] = useState(false);
    const [showLikes, setShowLikes] = useState(false);
    const user = useAuth((s) => s.user)
    const [editModal, setEditModal] = useState({ open: false, id: null, body: '' })
    const query = useQueryClient()

    const commentEditSubmit = async () => {
        await api.patch(`/comment/${editModal.id}/`, { body: editModal.body })
        query.invalidateQueries({ queryKey: ['entries'] })
        setEditModal({ open: false, id: null, body: '' })
    }



    return (
        <>
            {/* edit modal */}
            
            {
                editModal.open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl w-full max-w-sm mx-4 p-5">
                            <h2 className="text-sm font-mono font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
                // edit comment
                            </h2>
                            <textarea
                                className="w-full text-[11px] font-mono px-2.5 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 resize-none outline-none focus:border-blue-400"
                                rows={4}
                                value={editModal.body}
                                onChange={(e) => setEditModal(prev => ({ ...prev, body: e.target.value }))}
                            />
                            <div className="flex justify-end gap-2 mt-3">
                                <button
                                    onClick={() => setEditModal({ open: false, id: null, body: '' })}
                                    className="text-[10px] font-mono px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                >
                                    cancel
                                </button>
                                <button
                                    onClick={commentEditSubmit}
                                    className="text-[10px] font-mono px-3 py-1.5 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                                >
                                    save
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }


            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden max-w-2xl mx-auto">
                {/* Header */}
                <div className="p-4 pb-0 space-y-3">
                    {/* Top Row */}
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded px-2 py-0.5">
                            {data?.project_name || "N/A"}
                        </span>
                        {data?.project_user_id == user.user_id ? (
                            <EllipsisMenu
                                items={[
                                    { label: "Edit", onClick: () => editHandler(data?.id) },
                                    { label: "Delete", onClick: () => deleteHandler(data?.id) },
                                ]}
                            />
                        ) : (
                            null
                        )}
                    </div>

                    {/* Owner Section */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                            {data?.owner_name?.slice(0, 2).toUpperCase()}
                        </div>

                        <h1 className="text-xs font-medium text-zinc-800 dark:text-zinc-100">
                            {data?.owner_name}
                        </h1>
                    </div>

                    {/* Title */}
                    <h2 className="font-mono font-semibold text-sm text-zinc-900 dark:text-zinc-100 before:content-['//'] before:text-blue-500 before:mr-2">
                        {data?.title || "N/A"}
                    </h2>

                </div>

                {/* Body */}
                <p className="text-sm text-zinc-500 dark:text-zinc-400 px-4 pt-2 pb-0 leading-relaxed">
                    {data?.body}
                </p>

                {/* Screenshot */}
                {data?.screenshot && (
                    <ResponsiveImage
                        src={data.screenshot}
                        alt={data.project_name}
                        className="flex justify-center-safe mt-3 border-y border-zinc-100 dark:border-zinc-800"
                    />
                )}

                {/* Actions */}
                <div className="flex items-center gap-1 px-3 py-2 border-b border-zinc-100 dark:border-zinc-800">

                    {/* Like button with tooltip */}
                    <div className="relative">
                        <button
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-mono text-xs text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                            onMouseEnter={() => setShowLikes(true)}
                            onMouseLeave={() => setShowLikes(false)}
                            onClick={() => likeHandler(data?.id)}
                        >
                            <HeartIcon />
                            {data?.likes?.length ?? 0}
                        </button>

                        {showLikes && data?.likes?.length > 0 && (
                            <div className="absolute bottom-full left-0 mb-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 min-w-[140px] shadow-md z-10">
                                <p className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider mb-1.5">
                                    liked by
                                </p>
                                {data.likes.map((user, i) => (
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
                            {data?.comments?.length ?? 0} comments
                        </span>
                        <span className="text-[11px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-400 rounded-full px-2 py-0.5">
                            {data?.comments?.length ?? 0}
                        </span>
                    </div>

                    {commentsOpen && (
                        <div className="border-t border-zinc-100 dark:border-zinc-800">
                            {data?.comments?.length ? (
                                data.comments.map((comment, i) => (
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
                                        {comment.user_id == user.user_id ? (
                                            <EllipsisMenu
                                                items={[
                                                    { label: "Edit", onClick: () => setEditModal({ open: true, id: comment.id, body: comment.body }) },
                                                    { label: "Delete", onClick: () => commentDeleteHandler(comment?.id) },
                                                ]}
                                            />
                                        ) : (
                                            null
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-center font-mono text-xs text-zinc-400 py-4">
                                // no comments yet
                                </p>
                            )}

                            {/* Add comment input */}
                            <div className="flex gap-2.5 px-4 py-3 border-t border-zinc-100 dark:border-zinc-800">
                                <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center text-[10px] font-semibold shrink-0 mt-0.5">
                                    {user?.username?.slice(0, 2).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <textarea
                                        className="w-full text-[11px] font-mono px-2.5 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 resize-none outline-none focus:border-blue-400"
                                        rows={2}
                                        placeholder="// write a comment..."
                                        {...register('comment', { required: "Comment cannot be empty." })}
                                    />
                                    <div className="flex justify-end mt-1.5">
                                        <button
                                            onClick={() => handleSubmit(commentHandler(data?.id))()}
                                            className="text-[10px] font-mono px-3 py-1.5 rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-40 disabled:cursor-default"
                                        >
                                            post
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </>
    );
};

export default PostCard



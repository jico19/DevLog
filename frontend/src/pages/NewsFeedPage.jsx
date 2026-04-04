import { useGetEntries } from "src/queries/useGetEntrys"
import PostCard from "src/components/ui/PostCard"
import { useForm } from "react-hook-form"
import api from "src/utils/api"
import { useQueryClient } from "@tanstack/react-query"
import Swal from "sweetalert2"
import { useNavigate, Link } from "react-router-dom"
import { Plus, FolderPlus, PenLine, Terminal, Hash } from "lucide-react";
import { Loader2 } from 'lucide-react';

const NewsFeedPage = () => {
    const { data: entries, isPending } = useGetEntries()
    const { register, handleSubmit, reset } = useForm()
    const query = useQueryClient()
    const navigate = useNavigate()


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

    const commentHandler = (id) => async (data) => {
        try {
            await api.post('/comment/', {
                entry: id,
                body: data.comment
            })
            console.log("success!")
            query.invalidateQueries({ queryKey: ['entries'] })
            reset({ comment: '' })
        } catch (err) {
            console.log(err.response)
        }
    }

    const editHandler = (id) => {
        navigate(`/entry/${id}`)
    }

    const deleteHandler = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (response) => {
            if (response.isConfirmed) {
                await api.delete(`/entry/${id}/`)
                query.invalidateQueries({ queryKey: ['entries'] })

                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success"
                })
            }
        }).catch((err) => {
            Swal.fire({
                title: err.response.statusText || "Error",
                text: err?.response?.data?.msg || "Generic Error",
                icon: "warning"
            })
        })
    }

    const likeHandler = async (id) => {
        try {
            const res = await api.post('/like/', { id })
            console.log(res.data.liked) // true or false
            query.invalidateQueries({ queryKey: ['entries'] })
        } catch (error) {
            console.log(error.response)
        }
    }

    const commentDeleteHandler = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (response) => {
            if (response.isConfirmed) {
                await api.delete(`/comment/${id}/`)
                query.invalidateQueries({ queryKey: ['entries'] })

                Swal.fire({
                    title: "Deleted!",
                    text: "Your Comment has been deleted.",
                    icon: "success"
                })
            }
        }).catch((err) => {
            Swal.fire({
                title: err.response.statusText || "Error",
                text: err?.response?.data?.msg || "Generic Error",
                icon: "warning"
            })
        })
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-20">

            {/* ACTION BAR / TOOLS */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                        <Terminal size={18} className="text-zinc-500" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-zinc-900 dark:text-white leading-none">Global Feed</h2>
                        <p className="text-[10px] font-mono text-zinc-400 mt-1 uppercase tracking-tighter">// stream_active: true</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Link
                        to="/project/create"
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-[11px] font-mono font-bold uppercase border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all active:scale-95"
                    >
                        <FolderPlus size={14} />
                        New Project
                    </Link>

                    <Link
                        to="/entry/create"
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-[11px] font-mono font-bold uppercase bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-zinc-200 dark:shadow-none"
                    >
                        <Plus size={14} />
                        Log Progress
                    </Link>
                </div>
            </div>

            {/* FEED CONTENT */}
            <div className="space-y-12">
                {entries.length ? (
                    entries.map((data, i) => (
                        <div key={data.id} className="relative">
                            {/* Connecting Line (Decorative Git Branch Style) */}
                            {i !== entries.length - 1 && (
                                <div className="absolute left-[-20px] top-10 bottom-[-40px] w-px bg-zinc-200 dark:bg-zinc-800 hidden lg:block" />
                            )}

                            <PostCard
                                data={data}
                                register={register}
                                handleSubmit={handleSubmit}
                                commentHandler={commentHandler}
                                editHandler={editHandler}
                                deleteHandler={deleteHandler}
                                likeHandler={likeHandler}
                                commentDeleteHandler={commentDeleteHandler}
                            />
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-3xl">
                        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-full mb-4">
                            <PenLine size={32} className="text-zinc-300" />
                        </div>
                        <p className="font-mono text-xs text-zinc-400 uppercase tracking-widest">
                        // void main(): no_entries_found
                        </p>
                        <Link to="/create-entry" className="mt-4 text-blue-500 text-xs font-bold hover:underline">
                            Write your first log &rarr;
                        </Link>
                    </div>
                )}
            </div>

            {/* LOADING INDICATOR / END OF FEED */}
            {entries.length > 0 && (
                <div className="flex items-center justify-center gap-4 py-10 text-zinc-300 dark:text-zinc-700">
                    <div className="h-px w-12 bg-current" />
                    <Hash size={14} />
                    <div className="h-px w-12 bg-current" />
                </div>
            )}
        </div>
    );
}

export default NewsFeedPage


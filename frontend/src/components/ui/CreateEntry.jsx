import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import api from "src/utils/api";
import { useGetOwnProjects } from "src/queries/useGetEntrys";
import { ImagePlus, Save, X, Loader2, Sparkles, FolderOpen, AlertCircle } from "lucide-react";
import Swal from 'sweetalert2';

const CreateEntry = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [screenshotPreview, setScreenshotPreview] = useState(null);
    const { data: own_projects, isPending } = useGetOwnProjects();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            title: "",
            body: "",
            project: "", // Added project field
            screenshot: null,
            is_milestone: false
        }
    });

    const isMilestone = watch("is_milestone");

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('body', data.body);
        formData.append('project', data.project);
        formData.append('is_milestone', data.is_milestone);

        if (data.screenshot?.[0]) {
            formData.append('screenshot', data.screenshot[0]);
        }

        console.log(data)

        try {
            await api.post('/entry/', formData);

            Swal.fire({
                icon: 'success',
                title: 'Entry Deployed',
                text: 'Your progress has been logged successfully.',
                timer: 2000,
                showConfirmButton: false,
                background: document.documentElement.classList.contains('dark') ? '#18181b' : '#fff',
                color: document.documentElement.classList.contains('dark') ? '#fff' : '#18181b',
            });

            queryClient.invalidateQueries({ queryKey: ['entries'] });
            navigate('/feed');
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Deployment Failed',
                text: error.response?.data?.detail || 'Check your console for logs.',
            });
        }
    };


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
        <div className="max-w-xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden transition-all mb-10">
            {/* Header Area */}
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/30">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <h2 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-tight">New Entry</h2>
                    <span className="text-[10px] font-mono text-zinc-400 font-normal italic">// status: draft</span>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-6 space-y-6">

                    {/* Project Selection */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-mono text-blue-500 tracking-widest uppercase font-bold flex items-center gap-2">
                            <FolderOpen size={12} />
                            <span>// branch_to_project</span>
                        </label>
                        <select
                            {...register("project", { required: "Please select a project" })}
                            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-medium text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none appearance-none cursor-pointer"
                        >
                            <option value="">-- SELECT TARGET PROJECT --</option>
                            {own_projects?.map((proj) => (
                                <option key={proj.id} value={proj.id}>{proj.name}</option>
                            ))}
                        </select>
                        {errors.project && (
                            <div className="flex items-center gap-1 text-red-500 pl-1">
                                <AlertCircle size={10} />
                                <p className="text-[10px] font-mono">{errors.project.message}</p>
                            </div>
                        )}
                    </div>

                    {/* Title Input */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-mono text-blue-500 tracking-widest uppercase font-bold">
                            <span>// title</span>
                        </label>
                        <input
                            {...register("title", { required: "Title is required" })}
                            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                            placeholder="What's the headline of this update?"
                        />
                        {errors.title && <p className="text-[10px] font-mono text-red-500 pl-1">{errors.title.message}</p>}
                    </div>

                    {/* Body Textarea */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-mono text-blue-500 tracking-widest uppercase font-bold">
                            <span>// body_content</span>
                        </label>
                        <textarea
                            {...register("body", { required: "Body is required" })}
                            rows={6}
                            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none"
                            placeholder="Document your technical hurdles, solutions, or thoughts..."
                        />
                        {errors.body && <p className="text-[10px] font-mono text-red-500 pl-1">{errors.body.message}</p>}
                    </div>

                    {/* Screenshot Upload UI */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-mono text-blue-500 tracking-widest uppercase font-bold">// attach_visuals</label>
                        <div
                            onClick={() => document.getElementById('screenshot-input').click()}
                            className={`relative group rounded-xl border-2 border-dashed transition-all overflow-hidden flex items-center justify-center cursor-pointer ${screenshotPreview
                                ? "border-zinc-200 dark:border-zinc-800"
                                : "border-zinc-300 dark:border-zinc-800 hover:border-blue-400 py-12"
                                }`}
                        >
                            {screenshotPreview ? (
                                <div className="relative w-full aspect-video">
                                    <img src={screenshotPreview} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-zinc-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                        <ImagePlus className="text-white" size={24} />
                                        <span className="text-[10px] font-mono text-white uppercase font-bold">Change Image</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-zinc-400">
                                    <ImagePlus size={24} />
                                    <span className="text-[10px] font-mono uppercase tracking-tighter">Upload Screenshot (Optional)</span>
                                </div>
                            )}
                        </div>
                        <input
                            {...register('screenshot')}
                            id="screenshot-input"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                register('screenshot').onChange(e)  // let RHF do its thing first
                                const file = e.target.files[0]
                                if (file) setScreenshotPreview(URL.createObjectURL(file))
                            }}
                        />
                    </div>

                    {/* Milestone Toggle */}
                    <div className={`p-4 rounded-xl border transition-all flex items-center justify-between ${isMilestone
                        ? "bg-blue-50/50 dark:bg-blue-500/5 border-blue-200 dark:border-blue-500/30"
                        : "bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800"
                        }`}>
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg transition-colors ${isMilestone ? "bg-blue-500 text-white" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400"}`}>
                                <Sparkles size={16} />
                            </div>
                            <div>
                                <p className={`text-xs font-bold uppercase tracking-tight ${isMilestone ? "text-blue-600 dark:text-blue-400" : "text-zinc-500"}`}>
                                    Mark as Milestone
                                </p>
                                <p className="text-[10px] text-zinc-400 italic font-mono">Flag this as significant progress</p>
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            {...register("is_milestone")}
                            className="w-5 h-5 accent-blue-500 cursor-pointer"
                        />
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/feed')}
                        className="px-4 py-2 text-[10px] font-mono font-bold uppercase text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors flex items-center gap-2"
                    >
                        <X size={14} />
                        Discard
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg text-[10px] font-mono font-bold uppercase shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-95"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                        Commit Entry
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateEntry;
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import api from "src/utils/api";
import { 
    FolderPlus, 
    Terminal, 
    Info, 
    Loader2, 
    Save, 
    X, 
    ChevronRight 
} from "lucide-react";
import Swal from 'sweetalert2';

const CreateProject = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            name: "",
            description: ""
        }
    });

    const onSubmit = async (data) => {
        try {
            await api.post('/project/', data);
            
            Swal.fire({
                icon: 'success',
                title: 'Project Initialized',
                text: 'New workspace created successfully.',
                timer: 2000,
                showConfirmButton: false,
                background: document.documentElement.classList.contains('dark') ? '#18181b' : '#fff',
                color: document.documentElement.classList.contains('dark') ? '#fff' : '#18181b',
            });

            // Refresh the projects list and the sidebar stats
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            navigate('/feed');
        } catch (error) {
            console.log(error.response)
            Swal.fire({
                icon: 'error',
                title: 'Initialization Failed',
                text: error.response?.data?.detail || 'Something went wrong.',
            });
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden transition-all">
            
            {/* Header / Breadcrumbs Style */}
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 flex items-center gap-2">
                <Terminal size={14} className="text-zinc-400" />
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">root</span>
                <ChevronRight size={12} className="text-zinc-300" />
                <span className="text-[10px] font-mono text-blue-500 uppercase tracking-widest font-bold">new_project</span>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-8 space-y-8">
                    
                    {/* Visual Intro */}
                    <div className="flex flex-col items-center text-center space-y-3 pb-4">
                        <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-2xl text-blue-600 dark:text-blue-500 shadow-inner">
                            <FolderPlus size={32} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-zinc-900 dark:text-white">Initialize Project</h1>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Create a workspace to track your progress and milestones.</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Project Name */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-blue-500 tracking-widest uppercase font-bold flex items-center gap-2">
                                <span>// project_name</span>
                            </label>
                            <input
                                {...register('name', { 
                                    required: "Project name is required",
                                    minLength: { value: 3, message: "Name too short" }
                                })}
                                type="text"
                                placeholder="e.g. E-commerce API"
                                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                            />
                            {errors.name && (
                                <p className="text-[10px] font-mono text-red-500 flex items-center gap-1">
                                    <X size={10} /> {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-blue-500 tracking-widest uppercase font-bold flex items-center gap-2">
                                <Info size={12} />
                                <span>// description</span>
                            </label>
                            <textarea
                                {...register('description', { required: "A brief description helps!" })}
                                rows={4}
                                placeholder="What is this project about?"
                                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                            />
                            {errors.description && (
                                <p className="text-[10px] font-mono text-red-500 flex items-center gap-1">
                                    <X size={10} /> {errors.description.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-8 py-6 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => navigate('/feed')}
                        className="text-[10px] font-mono font-bold uppercase text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                    >
                        [ cancel_init ]
                    </button>
                    
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 px-8 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-3 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg dark:shadow-white/10"
                    >
                        {isSubmitting ? (
                            <Loader2 className="animate-spin" size={16} />
                        ) : (
                            <Save size={16} />
                        )}
                        Create Workspace
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateProject;
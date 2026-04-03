import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import api from "src/utils/api"

const PostCardEdit = () => {
    const query = useQueryClient()
    const navigate = useNavigate()
    const [data, setData] = useState(null)
    const [screenshotPreview, setScreenshotPreview] = useState(null)
    const { id } = useParams()
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, dirtyFields }
    } = useForm()

    useEffect(() => {
        const req = async () => {
            const res = await api.get(`/entry/${id}/`)
            setData(res.data)
            setScreenshotPreview(res.data.screenshot || null)
            reset({ title: res.data.title, body: res.data.body, is_milestone: res.data.is_milestone })
        }
        req()
    }, [])

    const onSubmit = async (formdata) => {
        const formData = new FormData()

        if (dirtyFields.title) formData.append('title', formdata.title)
        if (dirtyFields.body) formData.append('body', formdata.body)
        if (dirtyFields.screenshot) formData.append('screenshot', formdata.screenshot[0])
        if (dirtyFields.is_milestone) formData.append('is_milestone', formdata.is_milestone)

        // don't send if nothing changed
        if (!Object.keys(dirtyFields).length) return

        try {
            const res = await api.patch(`/entry/${id}/`, formData)
            console.log(res.data)
            query.invalidateQueries({ queryKey: ['entries'] })
            navigate('/feed')
            
        } catch (error) {
            console.log(error.response)
        }
    }

    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden max-w-md mx-auto">
            <div className="p-4 space-y-4">

                {/* Title */}
                <div className="space-y-1">
                    <label className="text-[9px] font-mono text-blue-500 tracking-widest uppercase">// title</label>
                    <input
                        className="w-full font-mono font-semibold text-sm px-2 py-1.5 rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:border-blue-500 transition-colors"
                        placeholder="entry title"
                        {...register("title", { required: "Title is required" })}
                    />
                    {errors.title && (
                        <p className="text-[10px] font-mono text-red-500">{errors.title.message}</p>
                    )}
                </div>

                {/* Body */}
                <div className="space-y-1">
                    <label className="text-[9px] font-mono text-blue-500 tracking-widest uppercase">// body</label>
                    <textarea
                        className="w-full text-sm px-2 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:border-blue-500 transition-colors resize-none"
                        rows={4}
                        placeholder="what did you build today?"
                        {...register("body", { required: "Body is required" })}
                    />
                    {errors.body && (
                        <p className="text-[10px] font-mono text-red-500">{errors.body.message}</p>
                    )}
                </div>

                {/* Screenshot */}
                <div className="space-y-1">
                    <label className="text-[9px] font-mono text-blue-500 tracking-widest uppercase">// screenshot</label>
                    <div
                        className="relative group cursor-pointer"
                        onClick={() => document.getElementById('screenshot-input').click()}
                    >
                        {screenshotPreview ? (
                            <>
                                <img
                                    src={screenshotPreview}
                                    alt="screenshot preview"
                                    className="w-full rounded-md border border-zinc-200 dark:border-zinc-700 object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                                    <span className="text-[11px] font-mono text-white">click to replace</span>
                                </div>
                            </>
                        ) : (
                            <div className="w-full h-32 rounded-md border border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center">
                                <span className="text-[11px] font-mono text-zinc-500">click to upload screenshot</span>
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
                <div className="flex items-center justify-between">
                    <label className="text-[9px] font-mono text-blue-500 tracking-widest uppercase">// is_milestone</label>
                    <input
                        type="checkbox"
                        className="w-4 h-4 accent-blue-500"
                        {...register("is_milestone")}
                    />
                </div>

            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 px-4 py-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                    onClick={() => navigate('/feed')}
                    type="button"
                    className="text-xs font-mono px-3 py-1.5 rounded-md border border-zinc-300 dark:border-zinc-700 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                >
                    cancel
                </button>
                <button
                    type="submit"
                    className="text-xs font-mono px-3 py-1.5 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                    onClick={handleSubmit(onSubmit)}
                >
                    save
                </button>
            </div>


        </div>
    )
}

export default PostCardEdit
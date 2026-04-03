import { useGetEntries } from "src/queries/useGetEntrys"
import PostCard from "src/components/ui/PostCard"
import { useForm } from "react-hook-form"
import api from "src/utils/api"
import { useQueryClient } from "@tanstack/react-query"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"

const NewsFeedPage = () => {
    const { data: entries, isPending } = useGetEntries()
    const { register, handleSubmit, reset } = useForm()
    const query = useQueryClient()
    const navigate = useNavigate()


    if (isPending) return <p>Loading.....</p>

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
        <>
            <div className="space-y-10">
                {entries.length ? (
                    entries.map((data) => (
                        <PostCard
                            key={data.id}
                            data={data}
                            register={register}
                            handleSubmit={handleSubmit}
                            commentHandler={commentHandler}
                            editHandler={editHandler}
                            deleteHandler={deleteHandler}
                            likeHandler={likeHandler}
                            commentDeleteHandler={commentDeleteHandler}
                        />
                    ))
                ) : (
                    <p className="text-center font-mono text-xs text-zinc-400 py-4">
                        // no comments yet
                    </p>
                )}
            </div>

        </>
    )
}

export default NewsFeedPage


import { useQuery } from "@tanstack/react-query";
import api from "src/utils/api";



export const useGetEntries = () => {
    return useQuery({
        queryKey: ['entries'],
        queryFn: async () => {
            const res = await api.get("/entry/")
            return res.data
        },
    })
}


export const useGetSelfEntries = () => {
    return useQuery({
        queryKey: ['entries'],
        queryFn: async () => {
            const res = await api.get(`/entry/?self=True`)
            return res.data
        }
    })
}

export const useGetSelfProject = () => {
    return useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            const res = await api.get(`/project/?self=True`)
            console.log(res.data)
            return res.data
        }
    })
}
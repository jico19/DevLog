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

export const useGetEntryDetail = (id) => {
    return useQuery({
        queryKey: ['entries', id],
        queryFn: async () => {
            const res = await api.get(`/entry/${id}`)
            return res.data
        }
    })
}


export const useGetSelfEntries = (id) => {
    return useQuery({
        queryKey: ['entries'],
        queryFn: async () => {
            const res = await api.get(`/entry/?id=${id}`)
            return res.data
        }
    })
}

export const useGetSelfProject = (id) => {
    return useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            const res = await api.get(`/project/?id=${id}`)
            return res.data
        }
    })
}

export const useGetAchievements = (id) => {
    return useQuery({
        queryKey: ['achievement_data'],
        queryFn: async () => {
            const res = await api.get(`/achievements/${id}/my_achivements/`)
            return res.data
        }
    })
}

export const useGetOwnProjects = () => {
    return useQuery({
        queryKey: ['own_projects'],
        queryFn: async () => {
            const res = await api.get('/project/own_projects/')
            return res.data
        }
    })
}

export const useGetTrendingEntries = () => {
    return useQuery({
        queryKey: ['treding_entries'],
        queryFn: async () => {
            const res = await api.get('/entry/get_trending_entries/')
            return res.data
        }
    })
}

export const useGetDevs = () => {
    return useQuery({
        queryKey: ['devs'],
        queryFn: async () => {
            const res = await api.get('/user/get_devs/')
            return res.data
        }
    })
}

export const useGetUser = (id) => {
    return useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const res = await api.get(`/user/${id}/`)
            return res.data
        }
    })
}
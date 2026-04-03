import { create } from "zustand";
import { persist } from "zustand/middleware";


export const useAuth = create(
    persist(
        (set) => ({
            user: {
                user_id: null,
                username: null,
                isAuthenticated: false,
            },

            login: ({ username, user_id }) => set({
                user: {
                    user_id,
                    username,
                    isAuthenticated: true,
                }
            }),

            logout: () => {
                set({
                    username: null,
                    isAuthenticated: false
                })
                localStorage.clear()
            }
        }),
        {
            name: "user-info"
        }
    )
)
// pages/AuthCallback.jsx
import { jwtDecode } from 'jwt-decode'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from 'src/context/AuthContext'
import api from 'src/utils/api'

export default function AuthCallback() {
    const navigate = useNavigate()
    const called = useRef(false)  // guard against double call
    const login = useAuth((s) => s.login)


    useEffect(() => {
        if (called.current) return  // stop the second Strict Mode call
        called.current = true

        const params = new URLSearchParams(window.location.search)
        const code = params.get('code')

        if (!code) {
            navigate('/')
            return
        }

        api.post('/user/github_login/', { code })
            .then(res => {
                const { access, refresh, user } = res.data
                localStorage.setItem('access', access)
                localStorage.setItem('refresh', refresh)
                localStorage.setItem('user', JSON.stringify(user))
                
                login({
                    user_id: Number(jwtDecode(access).user_id),
                    username: jwtDecode(access).username
                })
                navigate('/feed')
            })
            .catch(() => {
                navigate('/')
            })
    }, [])

    return <p>Logging you in...</p>
}
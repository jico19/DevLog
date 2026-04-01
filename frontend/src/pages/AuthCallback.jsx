// pages/AuthCallback.jsx
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function AuthCallback() {
    const navigate = useNavigate()
    const called = useRef(false)  // guard against double call

    useEffect(() => {
        if (called.current) return  // stop the second Strict Mode call
        called.current = true

        const params = new URLSearchParams(window.location.search)
        const code = params.get('code')

        if (!code) {
            navigate('/')
            return
        }

        axios.post('http://127.0.0.1:8000/user/github_login/', { code })
            .then(res => {
                const { access, refresh, user } = res.data
                localStorage.setItem('access_token', access)
                localStorage.setItem('refresh_token', refresh)
                localStorage.setItem('user', JSON.stringify(user))
                navigate('/dashboard')
            })
            .catch(() => {
                navigate('/')
            })
    }, [])

    return <p>Logging you in...</p>
}
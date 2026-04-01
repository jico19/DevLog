const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID
const CALLBACK_URL = 'http://localhost:5173/auth/callback'

export default function GithubLoginButton() {
    const handleLogin = () => {
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${CALLBACK_URL}&scope=read:user,user:email`
        window.location.href = githubAuthUrl
    }

    return (
        <button onClick={handleLogin}>
            Login with GitHub
        </button>
    )
}
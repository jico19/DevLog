import { useForm } from "react-hook-form"
import GithubLoginButton from "src/components/ui/GithubLoginButton"
import api from "src/utils/api"
import { useNavigate } from "react-router-dom"
import { useAuth } from "src/context/AuthContext"
import { jwtDecode } from "jwt-decode"

const LoginPage = () => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()
    const navigate = useNavigate()
    const login = useAuth((s) => s.login)


    const loginHandler = async (data) => {
        try {
            const res = await api.post('/login/', data)
            localStorage.setItem('access', res.data.access)
            localStorage.setItem('refresh', res.data.refresh)
            login({
                user_id: Number(jwtDecode(res.data.access).user_id),
                username: jwtDecode(res.data.access).username,
            })
            navigate('/feed')
            reset()
        } catch (error) {
            console.log(error.response)
            reset()
        }
    }

    return (
        <>
            <h1>Login Here.</h1>

            {/* login form */}
            <div className="flex flex-col space-y-3 p-5">

                <div className="flex flex-col">
                    <input
                        type="text"
                        placeholder="user_"
                        {...register('username', { required: "Username is required" })}
                        className="outline"
                    />
                </div>

                <div className="flex flex-col">
                    <input
                        type="password"
                        placeholder="*******"
                        {...register('password', { required: "Password is required" })}
                        className="outline"
                    />
                </div>

                <div className="flex flex-col space-y-2">
                    <button
                        onClick={handleSubmit(loginHandler)}
                        className="text-white bg-green-500"
                    >
                        {isSubmitting ? "Logging in" : "Log in"}
                    </button>

                    <GithubLoginButton />
                </div>

                <button
                    onClick={() => navigate('/register')}
                    className="text-white bg-green-500"
                >
                    Click here to register.
                </button>

            </div>

        </>
    )
}


export default LoginPage
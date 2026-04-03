import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import api from "src/utils/api"



const RegisterPage = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
    const navigate = useNavigate()

    const registerHandler = async (data) => {
        await api.post('/user/', data)
            .then((res) => {
                alert("Successfully registered!")
                navigate('/')
            })
            .catch((error) => {
                console.log(error.response)
            })
    }

    return (
        <>
            <h1>Register Here.</h1>


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


                <button
                    onClick={handleSubmit(registerHandler)}
                    className="text-white bg-green-500"
                >
                    {isSubmitting ? "Registering" : "Register"}
                </button>

                <button
                    onClick={() => navigate('/')}
                    className="text-white bg-green-500"
                >
                    Already register? click here.
                </button>

            </div>
        </>
    )
}

export default RegisterPage
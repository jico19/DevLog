import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const access_token = localStorage.getItem('access_token')

    if (!access_token) return <Navigate to='/' replace/>

    return <Outlet />
}

export default ProtectedRoute
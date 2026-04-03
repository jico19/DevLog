import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "src/context/AuthContext";
import { useEffect } from "react";

const ProtectedRoute = () => {
    const navigate = useNavigate();

    const access_token = localStorage.getItem("access");
    const user = useAuth((s) => s.user);

    const isAuthenticated = user?.isAuthenticated && access_token;

    useEffect(() => {
        // Auto-detect logout (token removed OR user cleared)
        if (!access_token || !user?.isAuthenticated) {
            navigate("/", { replace: true });
        }
    }, [access_token, user, navigate]);

    // Prevent flicker / unsafe render
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export function useAuth() {
    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname;
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loadingSession, setLoadingSession] = useState(true);

    useEffect(() => {
        // This effect will only run client-side
        async function checkAuth() {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    if (pathname === "/") setLoadingSession(false);
                    navigate("/");
                } else {
                    setIsAuthenticated(true);
                    setLoadingSession(false);

                    // If there's an active session and user is on login page, move user to dashboard
                    if (pathname === "/") navigate("/dashboard");
                }
            } catch (error) {
                console.error("Auth check error:", error);
                setLoading(false);
            }
        }
        
        checkAuth();
    }, [navigate, pathname]);

    return { isAuthenticated, loadingSession };
}
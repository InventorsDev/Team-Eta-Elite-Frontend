import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export function useAuth() {
    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname;
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loadingSession, setLoadingSession] = useState(true);
    const [sessionUserData, setSessionUserData] = useState({
        display_name: "",
        email: "",
        email_verified: false,
        phone_verified: false,
        role: "vendor",
        sub: ""
    });
    const [logoutState, setLogoutState] = useState({
        loading: false,
        failed: false,
        message: ""
    });

    useEffect(() => {
        // This effect will only run client-side
        async function checkAuth() {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                console.log(session);
                
                if (!session) {
                    if (pathname === "/login") setLoadingSession(false);
                    if (pathname.includes("dashboard")) navigate("/login");
                } else {
                    setIsAuthenticated(true);
                    setSessionUserData(session.user.user_metadata);

                    // If there's an active session and user is on login page, move user to dashboard
                    if (pathname === "/" || pathname === "/login" || pathname === "/signup") navigate(`/dashboard/${session.user.user_metadata.role}`);
                }
            } catch (error) {
                console.error("Auth check error:", error);
                setIsAuthenticated(false);
            } finally {
                setLoadingSession(false);
            }
        }
        
        checkAuth();
    }, [navigate, pathname]);

    const logout = async () => {
        setLogoutState(prev => ({...prev, loading: true}));
        const { error } = await supabase.auth.signOut();

        if (!error) {
            setLogoutState({
                loading: false,
                failed: false,
                message: "You have logged out successfully."
            });
        } else {
            setLogoutState({
                loading: false,
                failed: true,
                message: "Failed to log user out."
            });
        }

        navigate("/login");
    }

    return { 
        isAuthenticated, 
        loadingSession, 
        sessionUserData, 
        logout,
        logoutState
    };
}
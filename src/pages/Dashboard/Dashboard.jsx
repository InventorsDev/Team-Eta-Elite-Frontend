import { useAuth } from '../../utils/hooks/useAuth';
import LoadingUI from '../../components/LoadingUI/LoadingUI';
import { Navigate, Outlet } from 'react-router-dom';

const Dashboard = () => {
    const { loadingSession, isAuthenticated } = useAuth();

    if (loadingSession) {
        return <LoadingUI />
    }

    // if (!isAuthenticated) return <Navigate to="/login" />;

    return <Outlet />
}

export default Dashboard;

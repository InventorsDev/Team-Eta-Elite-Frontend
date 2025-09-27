import { useAuth } from '../../utils/hooks/useAuth';
import LoadingUI from '../../components/LoadingUI/LoadingUI';
import { Outlet } from 'react-router-dom';

const Dashboard = () => {
    const { loadingSession } = useAuth();

    if (loadingSession) {
        return <LoadingUI />
    }

    return <Outlet />
}

export default Dashboard;

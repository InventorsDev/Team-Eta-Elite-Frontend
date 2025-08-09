import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/hooks/useAuth';
import LoadingUI from '../../components/LoadingUI/LoadingUI';

const Dashboard = () => {
    const { loadingSession, isAuthenticated, sessionUserData } = useAuth();
    const navigate = useNavigate();

    if (loadingSession) {
        return <LoadingUI />
    }

    if (!isAuthenticated) navigate("/login");

    navigate(`/dashboard/${sessionUserData.role}`);

    return <></>
}

export default Dashboard;

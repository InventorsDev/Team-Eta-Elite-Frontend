import { useState } from 'react';
import Button from '../../../components/Button/Button';
import { useAuth } from '../../../utils/hooks/useAuth';
import InlineSpinner from '../../../components/InlineSpinner/InlineSpinner';
import Toast from '../../../components/Toast/Toast';
import Sidebar from '../../../components/Sidebar/Sidebar';

const VendorDashboard = () => {
    const [toast, setToast] = useState(null);
    const { sessionUserData, logout, logoutState } = useAuth();
    
    return (
        <div className='ml-[285px] p-6 md:p-12 md:ml-[325px]'>
            {toast && (
                <Toast 
                    type='success'
                    message={logoutState.message}
                    onClose={() => setTimeout(() => setToast(null), 3000)}
                />
            )}
            <Sidebar forVendor />
            
            <h1>Hiii {sessionUserData.display_name.split(" ")[0]}, this is your Vendor Dashboard.</h1>
            <Button disabled={logoutState.loading} onClick={logout}>
                {logoutState.loading 
                    ? <span><InlineSpinner /> Logging out...</span> 
                    : "Logout Now"
                }
            </Button>
        </div>
    );
}

export default VendorDashboard;

import { useState, useEffect } from "react";
import Toast from "../../../components/Toast/Toast";
import { useAuth } from "../../../utils/hooks/useAuth";
import AddBank from "../../../components/AddBank/AddBank";

const Settings = () => {
    const [currentPassword, setcurrentPassword] = useState("");
    const [newPassword, setnewPassword] = useState("");
    const [confirmPassword, setconfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [toast, setToast] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const { sessionUserData } = useAuth();
    const userRole = sessionUserData.role;
 
    useEffect(() => {
        if (confirmPassword.length > 0) {
            if (confirmPassword !== newPassword) {
                setPasswordError("Passwords do not match!");
            } else {
                setPasswordError("");
            }
        } else {
            setPasswordError(""); 
        }
    }, [newPassword, confirmPassword]); 

    const onDelete = () => {
        setToast({
            message: "Acount deleted succesfully",
            type: "error",
        }); 
        // NAVIGATE &
        // Delete logics
    }

    const handleDeleteClick = () => {
        setShowConfirm(true);
    };

    const confirmDelete = () => {
        onDelete();
        setShowConfirm(false);
    };

    const cancelDelete = () => {
        setShowConfirm(false);
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
         if (passwordError) {
            setToast({
                message: "Please fix the password error before updating",
                type: "error",
            });   
            return;
        }

        setToast({
            message: "password updated successfully",
            type: "success",
        });
        console.log("Password changed:", { newPassword, confirmPassword });
        setnewPassword("");
        setconfirmPassword("");
        setcurrentPassword("");

        //  Add logic to update password (API call)
    };

    return (
        <div id="settingsPage">
             {toast && (
                <Toast 
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            <h1 className="text-2xl font-bold">Settings</h1>
            <div className="mt-10   border-1 border-[#0000001A] p-7 rounded-lg shadow-md">
                <form onSubmit={handlePasswordSubmit}>
                    <h2 className="text-[22px] font-semibold">Change password</h2>
                    <div className="mt-7">
                        <label htmlFor="current-password"
                            className="text-[#000000CC] font-semibold block mb-2">
                            Current Password
                        </label>
                        <input type="password" id="current-password" 
                            className="border-1  border-[#00000080] p-2 w-full rounded-[10px]" 
                            placeholder="Enter current password" 
                            value={currentPassword}
                            onChange={(e) =>setcurrentPassword(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="mt-7">
                        <label htmlFor="new-password" 
                            className="text-[#000000CC] font-semibold block mb-2">
                            New Password
                        </label>
                        <input type="password" 
                            id="new-password" 
                            className="border-1  border-[#00000080] p-2 w-full rounded-[10px]" 
                            placeholder="Enter new password" 
                            value={newPassword}
                            onChange={(e) =>setnewPassword(e.target.value)}
                            required 
                        />
                    </div>
                    {/* password error message */}
                    {passwordError && (
                        <span className="transition text-sm font-medium text-red-500">{passwordError}</span>
                    )}

                    <div className="mt-7">
                        <label htmlFor="confirm-new-password" 
                            className="text-[#000000CC] font-semibold block mb-2">
                            Confirm Password
                        </label>
                        <input type="password" 
                            id="confirm-new-password" 
                            className="border-1  border-[#00000080] p-2 w-full rounded-[10px]" 
                            placeholder="Confirm password" 
                            value={confirmPassword}
                            onChange={(e) =>setconfirmPassword(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="flex w-full mt-5 p-2">
                        <button
                            className="bg-[var(--primary-color)] active:scale-95 cursor-pointer rounded-[10px] text-white ml-auto px-12 py-4  hover:bg-[var(--primary-color)] transition-all duration-300"
                            type="submit"
                        >
                            Update Password
                        </button>
                    </div>
                </form>

                {/* Bank details */}
                {userRole !== "vendor" && <AddBank />}

                <div className="mt-10 flex flex-col gap-2">
                    <h2 className="text-[22px] font-semibold">Enable 2FA (Two Factor Authentication)</h2>
                    {/* Authentication card */}
                    <div className="border-1 p-8  justify-center md:flex-row flex gap-3 flex-col md:text-start text-center rounded-[10px] mt-7 items-center  border-[#00000080] ">
                        <div className="md:flex-row flex flex-col items-center justify-center gap-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                            </svg>

                            <div className="text-[#000000B2] font-medium text-lg">
                                <p >Authentication (OTP)</p>
                                <p className="text-sm">Use an app like Google Authentication</p>
                            </div>
                        </div>

                        <div className="md:ml-auto justify-center items-center flex">
                            <button className="text-[var(--primary-color)] hover:bg-[var(--primary-color)] cursor-pointer hover:text-gray-200 font-medium active:scale-95 border-1  px-12 py-2.5 rounded-[10px] transition-all duration-300">
                                Enable
                            </button>
                        </div>
                    </div>
                    {/* email verification card */}
                    <div className="border-1 p-8  justify-center md:flex-row flex gap-3 flex-col md:text-start text-center rounded-[10px] mt-7 items-center  border-[#00000080] ">
                        <div className=" md:flex-row flex flex-col items-center  justify-center gap-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 md:size-10 text-[var(--primary-color)]">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                            </svg>
                            <div className="text-[#000000B2] font-medium text-lg">
                                <p>Email Verification</p>
                                <p className="text-sm">Receive a code via mail</p>
                            </div>
                        </div>
                        <div className="md:ml-auto justify-center items-center flex">
                            <button className="text-[var(--primary-color)] hover:bg-[var(--primary-color)] cursor-pointer hover:text-gray-200 font-medium active:scale-95 border-1  px-12 py-2.5 rounded-[10px] transition-all duration-300">
                                Enable
                            </button>
                        </div>
                    </div>
                    
                </div>
                <hr className="mt-10 border-gray-300"/>
                <div className="mt-10">
                    <h2 className="text-[22px] text-red-500 font-semibold">Delete Account</h2>
                    <p className="text-[#000000B2] font-medium text-sm md:text-lg mt-3">
                        Permanently delete your account and all your data. This action cannot be undone</p>
                    <div className="flex w-full mt-5">
                        <button
                            onClick={handleDeleteClick}
                            className="bg-[var(--primary-color)] active:scale-95 cursor-pointer rounded-[10px] text-white  px-10 py-3  hover:bg-red-500 transition-all duration-300"
                            type="button"
                        >
                            Delete Account
                        </button>
                    </div>
                    {showConfirm && (
                        <div className="fixed z-1000 w-full overflow-hidden inset-0 flex items-center justify-center backdrop-blur-sm  bg-opacity-20">
                            <div className="bg-white border-1 border-gray-200 py-10 px-8 rounded-[10px]  shadow-lg w-[90%] md:w-[500px]">
                                <div className="font-semibold flex flex-col justify-center items-center text-center  mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="Red" className="size-14">
                                       <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                    </svg>

                                    <p className="text-md md:text-lg text-gray-700 ">Are you sure you want to delete your account?</p>
                                    <p className="text-sm text-red-500 mt-1">NOTE: This action is irreversible.</p>
                                </div>
                                <div className="mt-4 flex text-sm justify-center items-center  gap-4">
                                    <button onClick={confirmDelete} className=" cursor-pointer bg-red-400 hover:bg-red-500 transition-all  font-semibold text-white px-6 py-3 rounded-[10px]">
                                        Yes, Delete
                                    </button>
                                    <button onClick={cancelDelete} className= "cursor-pointer font-semibold bg-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-400 transition-all px-6 py-3 rounded-[10px]">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>   
            </div>
        </div>
    );
}

export default Settings;

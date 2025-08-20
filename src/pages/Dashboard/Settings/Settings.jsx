import { useState, useEffect } from "react";
import Toast from "../../../components/Toast/Toast";



const Settings = () => {
    const [currentPassword, setcurrentPassword] = useState("");
    const [newPassword, setnewPassword] = useState("");
    const [confirmPassword, setconfirmPassword] = useState("");
    const [accountName, setaccountName] = useState("");
    const [accountNumber, setaccountNumber] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [accountError, setAccountError] = useState("");
    const [bankName, setbankName] = useState("First Bank");
    const [toast, setToast] = useState(null);



    useEffect(() => {

        if (confirmPassword.length > 0) {
            if (confirmPassword !== newPassword) {
                setPasswordError("Passwords do not match");
            } else {
                setPasswordError("");
            }
        } else {
            setPasswordError(""); 
        }
    }, [newPassword, confirmPassword]); 

    useEffect(() => {
        
        if (accountNumber.length === 0) {
            setAccountError("");
        } else if (!/^\d+$/.test(accountNumber)) {
            setAccountError("Account number must be only numbers");
        } else if (accountNumber.length !== 10) {
            setAccountError("Account number must be 10 digits");
        } else {
            setAccountError("");
        }
    }, [accountNumber]);

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

    const handleAccountSubmit = (e) => {
        e.preventDefault();
        if (accountError) {
            setToast({
                message: "Please fix the account number error before submitting",
                type: "error",
            });   
            return;
        }
        // Proceed with API call to add account
        setToast({
            message: "Bank account added successfully",
            type: "success",
        });
        console.log("Account added:", { accountName, accountNumber });
        setaccountName("");
        setaccountNumber("");
    }

    return (
        <div id="settingsPage">
             {toast && (
                <Toast 
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            <h1 className="text-4xl font-bold">Settings</h1>
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
                        <span className="transition font-medium text-red-500">{passwordError}</span>
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
                <form onSubmit={handleAccountSubmit}  className="mt-10">
                    <h2 className="text-[22px] font-semibold">Add Bank Account</h2>
                    <div className="mt-7">
                        <label htmlFor="account-name" 
                            className="text-[#000000CC] font-semibold block mb-2">
                            Account Holder Name
                        </label>
                        <input type="name" 
                            id="account-name" 
                            className="border-1  border-[#00000080] p-2 w-full rounded-[10px]" 
                            placeholder="Account full name" 
                            value={accountName}
                            onChange={(e) =>setaccountName(e.target.value)}
                            required 
                        />
                    </div>

                    <div className="mt-7">
                        <label htmlFor="account-name" 
                            className="text-[#000000CC] font-semibold block mb-2">
                           Bank Name
                        </label>
                        <select type="name" 
                            id="bank-name" 
                            className="border-1  border-[#00000080] p-2 w-full rounded-[10px]" 
                            placeholder="Account full name" 
                            value={bankName}
                            onChange={(e) =>setbankName(e.target.value)}
                            required >
                            {/* <option value="" disabled>Select Bank</option> */}
                            <option className="border-1 rounded-2xl" value="First Bank">First Bank</option>
                        </select>
                    </div>

                    {accountError && (
                        <span className="transition font-medium text-red-500">{accountError}</span>
                    )}
                    <div className="mt-7">
                        <label htmlFor="account-number" 
                            className="text-[#000000CC] font-semibold block mb-2">
                            Account Number
                        </label>
                        <input type="numb" 
                            id="account-number" 
                            className="border-1  border-[#00000080] p-2 w-full rounded-[10px]" 
                            placeholder="0123456789"
                            value={accountNumber}
                            onChange={(e) =>setaccountNumber(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="flex w-full mt-5 p-2">
                        <button
                            className="bg-[var(--primary-color)] active:scale-95 cursor-pointer rounded-[10px] text-white ml-auto px-12 py-4  hover:bg-[var(--primary-color)] transition-all duration-300"
                            type="submit"
                        >
                            Add Account
                        </button>
                    </div>
                </form>

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
                            className="bg-red-500 active:scale-95 cursor-pointer rounded-[10px] text-white  px-10 py-3  hover:bg-red-600 transition-all duration-300"
                            type="button"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
                
            </div>
            
        </div>
    );
}

export default Settings;

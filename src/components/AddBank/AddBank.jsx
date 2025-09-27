import { useState, useEffect } from 'react';
import Toast from '../Toast/Toast';

const AddBank = () => {
    const [toast, setToast] = useState(null);
    const [accountName, setaccountName] = useState("");
    const [accountNumber, setaccountNumber] = useState("");
    const [bankName, setbankName] = useState("First Bank");
    const [accountError, setAccountError] = useState("");

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
    }

    return (
      <form onSubmit={handleAccountSubmit}  className="mt-10 mb-10 bg-white shadow rounded-xl p-6 space-y-6">
        {toast && (
            <Toast 
                type={toast.type}
                message={toast.message}
                onClose={() => setToast(null)}
            />
        )}

        <h2 className="text-lg md:text-xl font-semibold">Add Bank Account</h2>
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
                defaultValue={""}
                required 
            >
                <option value="">Select Bank</option>
                <option className="border-1 rounded-2xl" value="First Bank">First Bank</option>
            </select>
        </div>

        <div className="mt-7">
            <label htmlFor="account-number" 
                className="text-[#000000CC] font-semibold block mb-2">
                Account Number
            </label>
            <input type="text" 
                id="account-number" 
                maxLength={10}
                className="border-1  border-[#00000080] p-2 w-full rounded-[10px]" 
                placeholder="0123456789"
                value={accountNumber}
                onChange={(e) =>setaccountNumber(e.target.value)} 
                required 
            />
        </div>
        <div className="flex w-full mt-5 p-2">
            <button
                className="bg-[var(--primary-color)] active:scale-95 cursor-pointer rounded-[10px] text-white ml-auto px-12 py-3  hover:bg-[var(--primary-color)] transition-all duration-300"
                type="submit"
            >
                Add Account
            </button>
        </div>
        
        {accountError && (
            <span className="transition font-medium text-red-500 ">{accountError}</span>
        )}
      </form>
    );
}

export default AddBank;

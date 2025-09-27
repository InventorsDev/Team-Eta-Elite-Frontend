import { useState, useEffect, useLayoutEffect } from 'react';
import Toast from '../Toast/Toast';

const AddBank = () => {
    const [toast, setToast] = useState(null);
    const [resolvedName, setResolvedName] = useState("");
    const [accountNumber, setaccountNumber] = useState("");
    const [bankName, setbankName] = useState("");
    const [banks, setBanks] = useState([]);
    const [selectedBankCode, setSelectedBankCode] = useState("");
    const [sortCode, setSortCode] = useState("");
    const [loadingBanks, setLoadingBanks] = useState(false);
    const [resolving, setResolving] = useState(false);
    const [accountError, setAccountError] = useState("");
    const [loadingUpdates, setLoadingUpdates] = useState(false);

    // fetch list of banks from Paystack on mount
    useEffect(() => {
      const fetchBanks = async () => {
        setLoadingBanks(true);
        try {
          const pubKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';
          const res = await fetch('https://api.paystack.co/bank?country=nigeria', {
            headers: {
              Authorization: `Bearer ${pubKey}`,
              "Content-Type": "application/json",
            },
          });
          const json = await res.json();
          if (!res.ok) {
            throw new Error(json.message || 'Failed to fetch banks');
          }

          console.log("Fetched banks:", json.data);
          setBanks(json.data || []);
        } catch (err) {
          setToast({ message: `Could not load banks: ${err.message}`, type: 'error' });
        } finally {
          setLoadingBanks(false);
        }
      };

      fetchBanks();
    }, []);

    // validate account number
    useLayoutEffect(() => {
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

    async function updateUserMetadata(payload) {
        setLoadingUpdates(true);

        try {
            const { data, error } = await supabase.auth.updateUser({
                data: {...payload}
            })
    
            if (error) {
                console.error('Error updating user metadata:', error.message);
                setToast({ message: `Failed to add bank: ${error.message}`, type: 'error' });
            } else {
                console.log('User metadata updated successfully:', data.user.user_metadata);
                setToast({ message: 'Bank account added successfully', type: 'success' });
            }
        } catch (error) {
            console.error('Unexpected error updating user metadata:', error);
            setToast({ message: `Unexpected error: ${error.message}`, type: 'error' });
        } finally {
            setLoadingUpdates(false);
        }
    }

    // Update the resolve account handler to use our API route
    const handleResolveAccount = async () => {
        console.log(accountNumber)
      if (accountError !== "" || accountNumber.length !== 10) {
        setToast({ message: 'Enter a valid 10-digit account number before resolving', type: 'error' });
        return;
      }
      if (!selectedBankCode) {
        setToast({ message: 'Please select a bank before resolving', type: 'error' });
        return;
      }

      setResolving(true);
      try {
        const res = await fetch('/api/resolve-bank-name', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            accountNumber,
            bankCode: selectedBankCode
          })
        });

        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.message || 'Could not resolve account');
        }

        setResolvedName(data.accountName);
        setSortCode(data.bankCode);
        setToast({ message: 'Account resolved successfully', type: 'success' });
      } catch (err) {
        setResolvedName('');
        setSortCode('');
        setToast({ message: `Resolve failed: ${err.message}`, type: 'error' });
      } finally {
        setResolving(false);
      }
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

        if (!resolvedName) {
          setToast({ message: 'Please resolve the account name before submitting', type: 'error' });
          return;
        }

        const payload = {
          account_number: accountNumber,
          account_name: resolvedName,
          bank_code: selectedBankCode,
          bank_name: bankName,
          sort_code: sortCode,
        };

        // update supabase backend user metadata with new bank details
        updateUserMetadata(payload);
    }

     return (
       <form onSubmit={handleAccountSubmit} id='AddBank' className="mt-10 mb-10 bg-white shadow rounded-xl p-6 space-y-6">
         {toast && (
             <Toast
                 type={toast.type}
                 message={toast.message}
                 onClose={() => setToast(null)}
             />
         )}

        <h2 className="text-lg md:text-xl font-semibold">Add Bank Account</h2>
         <div className="mt-7">
            <label htmlFor="account-name" className="text-[#000000CC] font-semibold block mb-2">
                Bank Name
            </label>
            <div className="flex items-center gap-3">
               <select
                    id="bank-name"
                    className="border-1 border-[#00000080] cursor-pointer p-2 w-full rounded-[10px]"
                    value={selectedBankCode}
                    onChange={(e) => {
                        const selected = banks.find(b => String(b.code) === String(e.target.value));
                        setSelectedBankCode(e.target.value);
                        setbankName(selected ? selected.name : "");
                    }}
                    required
                >
                    <option value="">Select Bank</option>
                    {loadingBanks ? (
                        <option value="">Loading banks...</option>
                    ) : (
                        banks.map((b, index) => (
                            <option key={index} value={b.code}>{b.name}</option>
                        ))
                    )}
               </select>
            </div>
         </div>

         <div className="mt-7">
            <label htmlFor="account-number"
                className="text-[#000000CC] font-semibold block mb-2"
            >
                Account Number
             </label>
             <input type="text"
                id="account-number"
                maxLength={10}
                className="border-1  border-[#00000080] p-2 w-full rounded-[10px]"
                placeholder="0123456789"
                value={accountNumber}
                onChange={(e) => setaccountNumber(e.target.value)}
                required
             />
         </div>

        <button
            type="button"
            onClick={handleResolveAccount}
            disabled={resolving}
            className="bg-[var(--primary-color)] text-white px-4 cursor-pointer py-2 rounded-[10px] disabled:opacity-50"
        >
            {resolving ? 'Resolving...' : 'Resolve'}
        </button>

        {/* Account holder name will be resolved from Paystack - user should not enter it */}
        <div className="mt-7">
            <label className="text-[#000000CC] font-semibold block mb-2">Account Holder (resolved)</label>
            <div className="p-2 w-full rounded-[10px] border-1 border-[#00000080] bg-[#f8fafc]">
              {resolvedName ? (
                <span className="font-medium">{resolvedName}</span>
              ) : (
                <span className="text-sm text-[#6b7280]">Enter account number and resolve to populate account holder</span>
              )}
            </div>
        </div>

        <button
            className="bg-[var(--primary-color)] my-4 active:scale-95 cursor-pointer rounded-[10px] text-white ml-auto px-12 py-3  hover:bg-[var(--primary-color)] transition-all duration-300"
            type="submit"
        >
            {loadingUpdates ? "Updating..." :"Add Account"}
        </button>

        {accountError && (
            <span className="transition font-medium text-red-500 ">{accountError}</span>
        )}
        
        {sortCode && (
          <div className="text-sm text-[#374151]">Bank sort/code: <span className="font-medium">{sortCode}</span></div>
        )}
       </form>
     );
 }

 export default AddBank;

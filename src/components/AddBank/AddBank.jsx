import { useState, useEffect, useLayoutEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../utils/hooks/useAuth';
import { Link } from 'react-router-dom';
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
    const { sessionUserData } = useAuth();
    const userRole = sessionUserData.role;

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

          // console.log("Fetched banks:", json.data);
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
              // console.log('User metadata updated successfully:', data.user.user_metadata);
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
          bank_sort_code: sortCode,
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

        {userRole === "vendor" && (
          <>{sessionUserData.account_number === "" || sessionUserData.bank_name === "" ? (
            <div className="text-sm sm:text-base flex items-center gap-5 ">
              <div className="p-3 bg-red-100 text-red-600 rounded-[50%]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              </div>
              <div>
                  <p className="text-red-500 font-semibold">Unverified</p>
                  <p className="font-medium text-sm sm:text-base">Your bank details have not been verified</p>
                  <Link
                    to="kyc#AddBank"
                    className="text-[var(--primary-color)] underline text-xs ease-transition hover:font-semibold"
                  >
                    Click here to update bank details.
                  </Link>
              </div>
            </div>
          ) : (
            <div className="text-sm sm:text-base flex items-center gap-5 ">
                <div className="p-3 bg-[#2FA21133] text-[#2FA211] rounded-[50%]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[#2FA211] font-semibold">Verified</p>
                  <p className="font-medium">Your bank details have been successfully verified</p>
                </div>
            </div>
          )}
        </>)}

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
            {resolving ? 'Resolving...' : 'Verify'}
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
          className="
            bg-[var(--primary-color)] my-4 active:scale-95 cursor-pointer rounded-[10px] text-white ml-auto px-12 py-3  hover:bg-[var(--primary-color)] transition-all duration-300
            disabled:cursor-not-allowed disabled:opacity-50
          "
          type="submit"
          disabled={!resolvedName || resolvedName === "" || loadingUpdates}
          onClick={handleAccountSubmit}
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

import { useState, useEffect } from "react";
import ImageUpload from "../../../../components/ImageUpload/ImageUpload";
import Toast from "../../../../components/Toast/Toast";
import bellIcon from "../../../../assets/imagenotification.svg";
import Button from "../../../../components/Button/Button";

const KYCVerification = () => {
  const [files, setFiles] = useState({ idFront: null, idBack: null });
  const [status, setStatus] = useState("Pending"); // Pending | Approved | Rejected
  const [toast, setToast] = useState(null);
  const [accountName, setaccountName] = useState("");
  const [accountNumber, setaccountNumber] = useState("");
  const [bankName, setbankName] = useState("First Bank");
  const [accountError, setAccountError] = useState("");


  const handleSelect = (name, file) => {
    setFiles((prev) => ({ ...prev, [name]: file }));
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!files.idFront || !files.idBack) {
      setToast({
        type: "error",
        message: "Please upload both sides of your NIN before submitting."
      });
      return;
    }

    // Simulate API
    console.log("Submitting:", files);

    // Fake API response
    setTimeout(() => {
      setStatus("Approved"); // change to "Rejected" to test
    }, 2000);
  };

  // 🎨 Status styles
  const statusStyles = {
    Pending: {
      bg: "bg-yellow-100 border-yellow-300 text-yellow-800",
      bellFilter:
        "invert(23%) sepia(99%) saturate(2900%) hue-rotate(350deg) brightness(90%) contrast(95%)", // red-ish
    },
    Approved: {
      bg: "bg-green-100 border-green-300 text-green-800",
      bellFilter:
        "invert(39%) sepia(93%) saturate(750%) hue-rotate(90deg) brightness(92%) contrast(90%)", // green
    },
    Rejected: {
      bg: "bg-red-100 border-red-300 text-red-800",
      bellFilter:
        "invert(23%) sepia(99%) saturate(2900%) hue-rotate(350deg) brightness(90%) contrast(95%)", // red
    },
  };

  return (
    <div className="p-2">
      {toast && (
        <Toast 
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Heading */}
      <h1 className="text-2xl font-bold mb-2">KYC Verification</h1>
      <p className="text-gray-600 mb-4">
        Please provide the required documents for verification
      </p>

      {/* Status Banner */}
      <div
        className={`border px-4 py-3 rounded-md mb-6 flex items-center gap-2 ${statusStyles[status].bg}`}
      >
        <img
          src={bellIcon}
          alt="Notification Bell"
          className="w-5 h-5"
          style={{ filter: statusStyles[status].bellFilter }}
        />
        <span>
          Your KYC verification is currently{" "}
          <span className="font-semibold">{status}</span>
        </span>
      </div>

      {/* Bank Account Form */}
      <form onSubmit={handleAccountSubmit}  className="mt-10 mb-10 bg-white shadow rounded-xl p-6 space-y-6">
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
            <span className="transition font-medium text-red-500 ">{accountError}</span>
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
                className="bg-[var(--primary-color)] active:scale-95 cursor-pointer rounded-[10px] text-white ml-auto px-12 py-3  hover:bg-[var(--primary-color)] transition-all duration-300"
                type="submit"
            >
                Add Account
            </button>
        </div>
      </form>

      {/* Upload Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-xl p-6 space-y-6"
      >
        <div>
          <label className="block text-sm font-medium mb-2">
            Government ID / NIN (Front)
          </label>
          <ImageUpload onSelect={(file) => handleSelect("idFront", file)} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Government ID / NIN (Back)
          </label>
          <ImageUpload onSelect={(file2) => handleSelect("idBack", file2)} />
        </div>

        <div className="w-full flex justify-center">
          <Button
            type="bg-black"
            className="w-full"
          >
            Submit for Verification
          </Button>
        </div>
      </form>
    </div>
  );
};

export default KYCVerification;

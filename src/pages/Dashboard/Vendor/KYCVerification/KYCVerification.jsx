import { useState } from "react";
import ImageUpload from "../../../../components/ImageUpload/ImageUpload";
import Toast from "../../../../components/Toast/Toast";
import bellIcon from "../../../../assets/imagenotification.svg";
import Button from "../../../../components/Button/Button";
import AddBank from "../../../../components/AddBank/AddBank";

const KYCVerification = () => {
  const [files, setFiles] = useState({ idFront: null, idBack: null });
  const [status, setStatus] = useState("Pending"); // Pending | Approved | Rejected
  const [toast, setToast] = useState(null);

  const handleSelect = (name, file) => {
    setFiles((prev) => ({ ...prev, [name]: file }));
  };

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
    <div className="p-2 mt-10 md:mt-0">
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

      {/* Add Bank Form */}
      <AddBank />

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

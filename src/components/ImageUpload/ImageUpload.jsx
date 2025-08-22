import { useState, forwardRef, useImperativeHandle, useId } from "react";

const ImageUpload = forwardRef(({ onSelect, maxFileSize = 5 * 1024 * 1024, onError }, ref) => {
  const [fileName, setFileName] = useState("No file chosen");
  const [preview, setPreview] = useState(null);

  // generate unique id for each instance
  const inputId = useId();

  const clearPreview = () => {
    setFileName("No file chosen");
    setPreview(null);
  };

  useImperativeHandle(ref, () => ({
    clearPreview
  }));

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxFileSize) {
      const errorMessage = `File size should not exceed ${Math.round(
        maxFileSize / (1024 * 1024)
      )}MB`;
      onError?.(errorMessage);
      e.target.value = "";
      return;
    }

    setFileName(file.name);
    setPreview(URL.createObjectURL(file));
    onSelect?.(file);
  };

  return (
    <div className="w-full h-[210px] border-2 border-dashed border-gray-400 rounded-[10px] flex flex-col items-center justify-center gap-4 bg-white">
      {preview ? (
        <img
          src={preview}
          alt="Preview"
          className="w-auto h-[150px] object-contain"
        />
      ) : (
        <img
          src="/icons/imageupload/upload.svg"
          alt="Upload"
          className="w-[80px] h-[62px]"
        />
      )}

      <div className="flex items-center gap-3">
        <label
          htmlFor={inputId}
          className="border border-[#2F531833] rounded-[10px] py-1 px-4 text-sm cursor-pointer hover:bg-gray-100 transition"
        >
          Choose File
        </label>
        <span className="text-sm font-normal text-black/80">{fileName}</span>
      </div>

      <input
        id={inputId} 
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
});

export default ImageUpload;

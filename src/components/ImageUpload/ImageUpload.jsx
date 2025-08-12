import { useState } from "react";

export default function ImageUpload({ onSelect }) {
  const [fileName, setFileName] = useState("No file chosen");
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setPreview(URL.createObjectURL(file));
    onSelect?.(file);
  };

  return (
    <div
      className="w-[974px] h-[210px] border-2 border-dashed border-gray-400 rounded-[10px] md:  flex flex-col items-center justify-center gap-4 bg-white"
    >
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
          htmlFor="file-input"
          className="border border-[#2F531833] rounded-[10px] py-1 px-4 text-sm cursor-pointer hover:bg-gray-100 transition"
        >
          Choose File
        </label>
        <span className="text-sm font-normal text-black/80">{fileName}</span>
      </div>

      <input
        id="file-input"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

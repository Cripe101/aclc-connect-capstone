import React, { useRef, useState } from "react";
import { LuFileImage, LuTrash } from "react-icons/lu";
import Modal from "../Modal";

const PhotosSelector = ({
  images,
  setImages,
  previews,
  setPreviews,
  onError,
  isClick,
}) => {
  const inputRef = useRef(null);
  const [previewUrls, setPreviewUrls] = useState([]);

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const validFiles = [];
    const newPreviews = [];

    files.forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        if (onError) onError("Only allowed image formats: JPG, PNG, JPEG");
        return;
      }

      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    if (validFiles.length === 0) return;

    if (onError) onError("");

    const updatedImages = [...(images || []), ...validFiles];
    const updatedPreviews = [...(previews || []), ...newPreviews];

    setImages(updatedImages);

    if (setPreviews) {
      setPreviews(updatedPreviews);
    }

    setPreviewUrls(updatedPreviews);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviews = (previews || previewUrls).filter(
      (_, i) => i !== index,
    );

    setImages(updatedImages);

    if (setPreviews) {
      setPreviews(updatedPreviews);
    }

    setPreviewUrls(updatedPreviews);
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  const displayPreviews = previews || previewUrls;

  return (
    <div className="mb-6">
      <input
        type="file"
        accept=".jpg,.jpeg,.png"
        multiple
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {displayPreviews.length === 0 ? (
        <div
          className="w-full h-56 flex flex-col items-center justify-center gap-2 bg-gray-50/50 rounded-md border border-dashed border-gray-300 cursor-pointer"
          onClick={onChooseFile}
        >
          <div className="w-14 h-14 flex items-center justify-center bg-sky-50 rounded-full">
            <LuFileImage className="text-xl text-sky-600" />
          </div>
          <p className="text-sm text-gray-700">Click to upload images</p>
        </div>
      ) : (
        <section className="relative">
          <div className="grid grid-cols-2 gap-3 h-56">
            {displayPreviews.slice(0, 1).map((src, index) => (
              <div key={index} className="relative h-56">
                <img
                  src={src}
                  alt="Preview"
                  className="w-full max-h-56 object-cover rounded-lg"
                />
                {/* <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-md"
                >
                  <LuTrash />
                </button> */}
              </div>
            ))}
            <button
              onClick={isClick}
              className="bg-slate-200 text-xl font-medium rounded-lg cursor-pointer"
            >
              + {displayPreviews.length - 1}
            </button>
          </div>
          <div
            onClick={onChooseFile}
            className="mt-3 flex items-center justify-center border border-dashed rounded-md cursor-pointer"
          >
            <LuFileImage className="text-2xl text-gray-500" />
          </div>
        </section>
      )}
    </div>
  );
};

export default PhotosSelector;

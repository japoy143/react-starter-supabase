import React from "react";
import UploadIcon from "../../assets/icons/UploadIcon";
import CloseIcon from "../../assets/icons/CloseIcon";

interface ImagePreviewType {
  handleDragOver: (e: React.DragEvent<HTMLLabelElement>) => void;
  setImage: React.Dispatch<React.SetStateAction<File | null>>;
  setPreviewImage: React.Dispatch<any>;
  previewImage: any;
  fileRef: React.RefObject<HTMLInputElement | null>;

  handleDropOver: (
    e: React.DragEvent<HTMLLabelElement>,
    setImage: (value: React.SetStateAction<File | null>) => void,
    setPreviewImage: (value: any) => void
  ) => void;

  removeImagePreview: (
    setImage: (value: React.SetStateAction<File | null>) => void,
    setPreviewImage: (value: any) => void,
    fileRef: React.RefObject<HTMLInputElement | null>
  ) => void;
}

export default function ImagePreview({
  handleDragOver,
  handleDropOver,
  setImage,
  setPreviewImage,
  previewImage,
  fileRef,
  removeImagePreview,
}: ImagePreviewType) {
  return (
    <div className=" relative w-full h-[200px]">
      <label
        onDragOver={handleDragOver}
        onDrop={(e) => handleDropOver(e, setImage, setPreviewImage)}
        htmlFor="fileInput"
        className="group p-1 w-full h-full  flex flex-col items-center justify-center rounded border border-gray-400 hover:border-blue-400 border-dashed cursor-pointer"
      >
        {previewImage ? (
          <div className="w-full h-full">
            <img
              src={previewImage}
              alt="previewImage"
              className=" w-full h-full object-cover"
            />
          </div>
        ) : (
          <>
            <p className=" group-hover:text-blue-400">Upload Image</p>
            <UploadIcon classname=" group-hover:text-blue-400 size-6" />
          </>
        )}
      </label>

      {previewImage && (
        <div
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => removeImagePreview(setImage, setPreviewImage, fileRef)}
          className=" p-1  absolute top-2 right-2 shadow-2xl cursor-pointer"
        >
          <CloseIcon className=" size-4" />
        </div>
      )}
    </div>
  );
}

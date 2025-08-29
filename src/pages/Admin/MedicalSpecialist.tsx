import React, { useRef, useState } from "react";
import FormButton from "../../components/FormButton";
import FormError from "../../components/FormError";

import ImagePreview from "../../components/Admin/ImagePreview";
import {
  handleDragOver,
  handleDropOver,
  removeImagePreview,
} from "../../utils/DragAndDrop";
import {
  handleFileOnchange,
  handleImageUpload,
} from "../../utils/Admin/UploadFileImage";

export default function AdminMedicalSpecialist() {
  const [specialization, setSpecialization] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [specialistImage, setSpecialistImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<any>();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const ImagePath = "specialization";
  const DataPath = "Medical Specialization";

  const resetForm = () => {
    if (fileRef.current) {
      fileRef.current.value = "";
    }
    setSpecialization("");
    setPreviewImage("");
  };

  const formData = {
    specialization: specialization,
  };

  return (
    <div>
      <h1>Medical Specialist</h1>

      <form
        className="p-4 space-y-2 w-full md:w-1/2 lg:w-1/3"
        onSubmit={(e) =>
          handleImageUpload(
            e,
            setLoading,
            specialistImage,
            ImagePath,
            DataPath,
            resetForm,
            setError,
            formData
          )
        }
      >
        {/* TODO: must have a image drag and drop input */}
        <ImagePreview
          handleDragOver={handleDragOver}
          setImage={setSpecialistImage}
          setPreviewImage={setPreviewImage}
          previewImage={previewImage}
          fileRef={fileRef}
          handleDropOver={(e) =>
            handleDropOver(e, setSpecialistImage, setPreviewImage)
          }
          removeImagePreview={() =>
            removeImagePreview(setSpecialistImage, setPreviewImage, fileRef)
          }
        />
        <input
          hidden
          id="fileInput"
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={(e) =>
            handleFileOnchange(e, setSpecialistImage, setPreviewImage)
          }
        />
        <div className=" flex flex-col space-y-2">
          <label>Name</label>
          <input
            required
            type="text"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            placeholder="equipment name"
            className=" border border-gray-500  rounded px-2 border-solid "
          />
        </div>

        <div className=" flex justify-end">
          <FormButton
            loading={loading}
            buttonName="save"
            buttonLoading="saving..."
          />
        </div>
      </form>
      <FormError error={error} />
    </div>
  );
}

import React, { useRef, useState } from "react";
import FormButton from "../../components/FormButton";
import FormError from "../../components/FormError";

import {
  handleDragOver,
  handleDropOver,
  removeImagePreview,
} from "../../utils/DragAndDrop";
import ImagePreview from "../../components/Admin/ImagePreview";
import {
  handleFileOnchange,
  handleImageUpload,
} from "../../utils/Admin/UploadFileImage";

export default function AdminMedicalEquipments() {
  const [equipment, setEquipment] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>();
  const [equipmentImage, setEquipmentImage] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [previewImage, setPreviewImage] = useState<any>();
  const ImagePath = "equipment";
  const DataPath = "Medical Equipment";

  const resetForm = () => {
    if (fileRef.current) {
      fileRef.current.value = "";
    }
    setEquipment("");
    setDescription("");
    setPreviewImage("");
  };

  const formData = {
    equipment: equipment,
    description: description,
  };

  return (
    <div>
      <h1>Medical Equipment</h1>

      <form
        className="p-4 space-y-2 w-full md:w-1/2 lg:w-1/3"
        onSubmit={(e) =>
          handleImageUpload(
            e,
            setLoading,
            equipmentImage,
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
          setImage={setEquipmentImage}
          setPreviewImage={setPreviewImage}
          previewImage={previewImage}
          fileRef={fileRef}
          handleDropOver={(e) =>
            handleDropOver(e, setEquipmentImage, setPreviewImage)
          }
          removeImagePreview={() =>
            removeImagePreview(setEquipmentImage, setPreviewImage, fileRef)
          }
        />

        <input
          hidden
          id="fileInput"
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={(e) =>
            handleFileOnchange(e, setEquipmentImage, setPreviewImage)
          }
        />
        <div className=" flex flex-col space-y-2">
          <label>Name</label>
          <input
            required
            type="text"
            value={equipment}
            onChange={(e) => setEquipment(e.target.value)}
            placeholder="equipment name"
            className=" border border-gray-500  rounded px-2 border-solid "
          />
        </div>

        <div className=" flex flex-col space-y-2">
          <label>Description</label>
          <input
            required
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="equipment description"
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

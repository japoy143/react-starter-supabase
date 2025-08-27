import React, {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import FormButton from "../../components/FormButton";
import FormError from "../../components/FormError";
import supabase from "../../supabase-client";
import UploadIcon from "../../assets/icons/UploadIcon";
import CloseIcon from "../../assets/icons/CloseIcon";

export default function AdminMedicalEquipments() {
  const [equipment, setEquipment] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>();
  const [equipmentImage, setEquipmentImage] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [previewImage, setPreviewImage] = useState<any>();

  //file on change
  const handleFileOnchange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 0) {
        setEquipmentImage(file);

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          setPreviewImage(reader.result);
        };
      } else {
        setEquipmentImage(null);
      }
    }
  };

  //upload image to supabase
  const uploadImage = async (file: File): Promise<string | null> => {
    if (!file || file.size === 0) return null;
    const filePath = `${file.name}-${Date.now()}`;

    const { error } = await supabase.storage
      .from("equipment")
      .upload(filePath, file);

    if (error) {
      console.error("Error occurred uploading equipment: ", error);
      return null;
    }

    const { data } = await supabase.storage
      .from("equipment")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleAddEquipment = async (e: FormEvent<HTMLElement>) => {
    e.preventDefault();

    setLoading(true);
    try {
      let imageUrl: string | null = null;

      if (equipmentImage) {
        imageUrl = await uploadImage(equipmentImage);
      }

      const { data, error } = await supabase.from("Medical Equipment").insert({
        name: equipment,
        description: description,
        image_url: imageUrl,
      });

      if (error) {
        console.error("error saving equipment: ", error);
        setError(error.message);
      }
    } catch (error) {
      console.error("error saving equipment: ", error);
    } finally {
      if (fileRef.current) {
        fileRef.current.value = "";
      }
      setEquipmentImage(null);
      setEquipment("");
      setDescription("");
      setLoading(false);
    }
  };

  //handle drag and drop
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("drag event");
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    handleImage(e.dataTransfer.files);
  };

  const handleImage = (files: FileList) => {
    if (!files) return;
    const file = files[0];
    setEquipmentImage(file);
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
  };

  const removeImagePreview = () => {
    if (fileRef.current) {
      fileRef.current.value = "";
    }
    setEquipmentImage(null);
    setPreviewImage("");
  };

  return (
    <div>
      <h1>Medical Equipment</h1>

      <form
        className="p-4 space-y-2 w-full md:w-1/2 lg:w-1/4"
        onSubmit={handleAddEquipment}
      >
        {/* TODO: must have a image drag and drop input */}
        <div className=" relative w-full h-[200px]">
          <label
            onDragOver={handleDragOver}
            onDrop={handleDrop}
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
              onClick={removeImagePreview}
              className=" p-1  absolute top-2 right-2 shadow-2xl cursor-pointer"
            >
              <CloseIcon className=" size-4" />
            </div>
          )}
        </div>

        <input
          hidden
          id="fileInput"
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFileOnchange}
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

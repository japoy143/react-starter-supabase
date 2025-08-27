import React, { useState, type ChangeEvent, type FormEvent } from "react";
import FormButton from "../../components/FormButton";
import FormError from "../../components/FormError";
import supabase from "../../supabase-client";

export default function AdminMedicalSpecialist() {
  const [specialization, setSpecialization] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [articleImage, setArticleImage] = useState<File | null>(null);

  const handleFileOnchange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files?.length > 0) {
      setArticleImage(e.target.files[0]);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    //unique naming
    const filePath = `${file.name}-${Date.now()}`;

    const { error } = await supabase.storage
      .from("specialization")
      .upload(filePath, file);

    if (error) {
      console.error("Error uploading image: ", error.message);
      return null;
    }

    const { data } = await supabase.storage
      .from("specialization")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleAddSpecialization = async (e: FormEvent<HTMLElement>) => {
    e.preventDefault();

    setLoading(true);
    try {
      let imageUrl: string | null = null;

      if (articleImage) {
        imageUrl = await uploadImage(articleImage);
      }

      const { data, error } = await supabase
        .from("Medical Specialization")
        .insert({
          specialization: specialization,
          image_url: imageUrl,
        });

      if (error) {
        console.error("error adding specialization: ", error);
        setError(error.message);
      }
    } catch (error) {
      console.error("error adding specialization: ", error);
    } finally {
      setSpecialization("");
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Medical Specialist</h1>

      <form
        className="p-4 space-y-2 w-full md:w-1/2 lg:w-1/4"
        onSubmit={handleAddSpecialization}
      >
        {/* TODO: must have a image drag and drop input */}
        <input type="file" accept="image/*" onChange={handleFileOnchange} />
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

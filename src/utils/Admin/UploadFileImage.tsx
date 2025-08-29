import type { ChangeEvent, FormEvent } from "react";
import supabase from "../../supabase-client";

//on file change
export const handleFileOnchange = (
  e: ChangeEvent<HTMLInputElement>,
  setImage: (value: React.SetStateAction<File | null>) => void,
  setPreviewImage: (value: any) => void
) => {
  if (e.target.files && e.target.files.length > 0) {
    const file = e.target.files[0];
    if (file.size > 0) {
      setImage(file);

      //read file
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
    } else {
      setImage(null);
    }
  }
};

//upload image to supabase
export const uploadImage = async (
  file: File,
  name: string
): Promise<string | null> => {
  if (!file || file.size === 0) return null;
  const filePath = `${file.name}-${Date.now()}`;

  const { error } = await supabase.storage.from(name).upload(filePath, file);

  if (error) {
    console.error(`Error occurred uploading ${name}: `, error);
    return null;
  }

  const { data } = await supabase.storage.from(name).getPublicUrl(filePath);

  return data.publicUrl;
};

// Save data to Supabase with flexible payload
const saveToSupabase = async (table: string, payload: Record<string, any>) => {
  const { error } = await supabase.from(table).insert(payload);
  if (error) throw error;
};

// Handle form submit
export const handleImageUpload = async (
  e: FormEvent,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  image: File | null,
  imagePath: string,
  dataPath: string,
  resetForm: () => void,
  setError: (value: any) => void,
  formData: {
    equipment?: string;
    specialization?: string;
    title?: string;
    description?: string;
    date?: string;
  }
) => {
  e.preventDefault();
  setLoading(true);

  try {
    const imageUrl = image ? await uploadImage(image, imagePath) : null;

    // Define per-table payloads
    const tablePayloads: Record<
      string,
      { table: string; payload: Record<string, any> }
    > = {
      "Medical Equipment": {
        table: "Medical Equipment",
        payload: {
          name: formData.equipment,
          description: formData.description,
          image_url: imageUrl,
        },
      },
      "Medical Specialization": {
        table: "Medical Specialization",
        payload: {
          specialization: formData.specialization,
          image_url: imageUrl,
        },
      },
      Articles: {
        table: "Articles",
        payload: {
          title: formData.title,
          description: formData.description,
          date: formData.date,
          image_url: imageUrl,
        },
      },
    };

    // Lookup payload by DataPath
    const entry = tablePayloads[dataPath];
    if (entry) {
      await saveToSupabase(entry.table, entry.payload);
    }
  } catch (err: any) {
    console.error("Error saving:", err);
    setError(err.message);
  } finally {
    resetForm();
    setLoading(false);
  }
};

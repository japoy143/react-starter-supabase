import React, {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import FormError from "../../components/FormError";
import FormButton from "../../components/FormButton";
import supabase from "../../supabase-client";
import UploadIcon from "../../assets/icons/UploadIcon";
import CloseIcon from "../../assets/icons/CloseIcon";

export default function AdminArticles() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>("");
  const [articleImage, setArticleImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<any>();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleFileOnchange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 0) {
        setArticleImage(file);

        //read file
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          setPreviewImage(reader.result);
        };
      } else {
        setArticleImage(null);
      }
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const filePath = `${file.name}-${Date.now()}`;

    const { error } = await supabase.storage
      .from("articles")
      .upload(filePath, file);

    if (error) {
      console.error("Error uploading article error: ", error);
      return null;
    }

    const { data } = await supabase.storage
      .from("articles")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  //add article
  const handleAddArticle = async (e: FormEvent<HTMLElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      let imageUrl: string | null = null;
      if (articleImage) {
        imageUrl = await uploadImage(articleImage);
      }

      const { data, error } = await supabase.from("Articles").insert({
        title: title,
        description: description,
        date: date,
        image_url: imageUrl,
      });

      if (error) {
        console.error("error occurred saving article: ", error);
        setError(error.message);
      }
    } catch (error) {
      console.error("error occurred saving article: ", error);
    } finally {
      if (fileRef.current) {
        fileRef.current.value = "";
      }
      setArticleImage(null);
      setTitle("");
      setDescription("");
      setDate("");
      setLoading(false);
      setPreviewImage("");
    }
  };

  //drag and drop
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("drag event");
  };

  const handleDropOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    handleImage(e.dataTransfer.files);
    console.log(e.dataTransfer.files);
  };

  const handleImage = (files: FileList) => {
    if (!files) return;
    const file = files[0];
    setArticleImage(file);
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
  };

  const removeImagePreview = () => {
    setPreviewImage("");
    setArticleImage(null);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  return (
    <div>
      <h1>Articles</h1>

      <form
        className="p-4 space-y-2 w-full md:w-1/2 lg:w-1/3"
        onSubmit={handleAddArticle}
      >
        {/* TODO: must have a image drag and drop input */}
        <label>Article Image</label>
        <div className=" relative h-[200px] w-full">
          <label
            onDragOver={handleDragOver}
            onDrop={handleDropOver}
            htmlFor="fileUpload"
            className="group p-1 w-full h-full  flex flex-col items-center justify-center rounded border border-gray-400 hover:border-blue-400 border-dashed cursor-pointer"
          >
            {previewImage ? (
              <img
                src={previewImage}
                alt="preview"
                className=" w-full h-full object-cover"
              />
            ) : (
              <>
                <p className="group-hover:text-blue-400">Upload Image</p>
                <UploadIcon classname="size-6 group-hover:text-blue-400" />
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
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFileOnchange}
          className="hidden"
          id="fileUpload"
        />

        <div className=" flex flex-col space-y-2">
          <label>Title</label>
          <input
            required
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="article title"
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
            placeholder="article description"
            className=" border border-gray-500  rounded px-2 border-solid "
          />
        </div>

        <div className=" flex flex-col space-y-2">
          <label>Date</label>
          <input
            required
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
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

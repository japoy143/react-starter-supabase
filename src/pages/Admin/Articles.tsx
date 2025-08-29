import React, { useRef, useState } from "react";
import FormError from "../../components/FormError";
import FormButton from "../../components/FormButton";

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

export default function AdminArticles() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>("");
  const [articleImage, setArticleImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<any>();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const ImagePath = "articles";
  const DataPath = "Articles";

  const resetForm = () => {
    if (fileRef.current) {
      fileRef.current.value = "";
    }
    setArticleImage(null);
    setTitle("");
    setDescription("");
    setDate("");
    setLoading(false);
    setPreviewImage("");
  };

  const formData = {
    title: title,
    description: description,
    date: date,
  };

  return (
    <div>
      <h1>Articles</h1>

      <form
        className="p-4 space-y-2 w-full md:w-1/2 lg:w-1/3"
        onSubmit={(e) =>
          handleImageUpload(
            e,
            setLoading,
            articleImage,
            ImagePath,
            DataPath,
            resetForm,
            setError,
            formData
          )
        }
      >
        {/* TODO: must have a image drag and drop input */}
        <label>Article Image</label>
        <ImagePreview
          handleDragOver={handleDragOver}
          setImage={setArticleImage}
          setPreviewImage={setPreviewImage}
          previewImage={previewImage}
          fileRef={fileRef}
          handleDropOver={(e) =>
            handleDropOver(e, setArticleImage, setPreviewImage)
          }
          removeImagePreview={() =>
            removeImagePreview(setArticleImage, setPreviewImage, fileRef)
          }
        />

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={(e) =>
            handleFileOnchange(e, setArticleImage, setPreviewImage)
          }
          className="hidden"
          id="fileInput"
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

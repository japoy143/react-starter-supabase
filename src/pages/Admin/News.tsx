import React, { useState, type FormEvent } from "react";
import supabase from "../../supabase-client";
import FormError from "../../components/FormError";
import FormButton from "../../components/FormButton";

export default function AdminNews() {
  const [title, setTitle] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [error, setError] = useState<any>("");
  const [loading, setLoading] = useState<boolean>(false);

  //add news
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { data, error } = await supabase.from("News").insert({
        news_title: title,
        news_date: date,
      });

      if (error) {
        console.log("error occurred on saving news: ", error);
        setError(error.message);
      }
    } catch (error) {
      console.error("error occurred on saving news: ", error);
    } finally {
      setTitle("");
      setDate("");
      setLoading(false);
    }
  };

  return (
    <div>
      <h1> News</h1>

      <form
        className=" p-4 space-y-2 w-full md:w-1/2 lg:w-1/4"
        onSubmit={handleSubmit}
      >
        {/* news title */}
        <div className=" flex flex-col space-y-2">
          <label>Title</label>
          <input
            required
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="news title"
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
            placeholder="news title"
            className="   border border-gray-500  rounded px-2 border-solid "
          />
        </div>

        <div className=" flex  justify-end">
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

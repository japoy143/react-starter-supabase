import React, { useEffect, useState } from "react";
import supabase from "../../supabase-client";

type NewsType = {
  id: string;
  news_title: string;
  news_date: string;
};

export default function News() {
  //TODO:Change this to react query
  useEffect(() => {
    fetchNews();
  }, []);

  const [newsData, setNewsData] = useState<NewsType[]>([]);

  const fetchNews = async () => {
    const { data, error } = await supabase.from("News").select();

    if (error) {
      console.log("error fetching news: ", error);
    } else {
      console.log("successfully fetch news");
      setNewsData(data as NewsType[]);
    }
  };

  return (
    <div className=" grid grid-cols-2 gap-6 ">
      {newsData.map((data) => (
        <div key={data.id} className=" border-b  space-y-1 py-2">
          <h2>{data.news_title}</h2>
          <p className=" font-light text-sm">{data.news_date}</p>
        </div>
      ))}
    </div>
  );
}

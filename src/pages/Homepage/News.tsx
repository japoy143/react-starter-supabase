import React, { useEffect, useState } from "react";
import supabase from "../../supabase-client";
import { useQuery } from "@tanstack/react-query";

type NewsType = {
  id: string;
  news_title: string;
  news_date: string;
};

export default function News() {
  
  const fetchNews = async () => {
    const { data, error } = await supabase
      .from("News")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(4);

    if (error) {
      console.log("error fetching news: ", error);
    } else {
      console.log("successfully fetch news");
      return data as NewsType[];
    }
  };

  const {
    data: news = [],
    error,
    isPending,
  } = useQuery({
    queryKey: ["news"],
    queryFn: fetchNews,
  });

  if (isPending) {
    return (
      <div className=" grid grid-cols-2 gap-6  animate-pulse">
        {Array.from({ length: 4 }).map((__, index) => (
          <div
            key={index}
            className=" border-b  space-y-1 py-2 border-gray-200"
          >
            <h2>
              <span className=" text-transparent bg-gray-200">
                Lorem ipsum dolor sit amet
              </span>
            </h2>
            <p className=" font-light text-sm">
              <span className=" text-transparent bg-gray-200">Lorem ipsum</span>
            </p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className=" grid grid-cols-2 gap-6 ">
      {news.map((data) => (
        <div key={data.id} className=" border-b  space-y-1 py-2">
          <h2>{data.news_title}</h2>
          <p className=" font-light text-sm">{data.news_date}</p>
        </div>
      ))}
    </div>
  );
}

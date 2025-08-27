import React, { useEffect, useState } from "react";
import supabase from "../../supabase-client";

import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

type ArticleType = {
  id: string;
  title: string;
  description: string;
  date: string;
  created_at: string;
  image_url: string;
};
export default function Articles() {
  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from("Articles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(4);

    if (error) {
      console.log("error fetching articles: ", error);
    } else {
      console.log("successfully fetch articles");
      return data as ArticleType[];
    }
  };

  const {
    data: articles = [],
    error,
    isPending,
  } = useQuery({
    queryKey: ["articles"],
    queryFn: fetchArticles,
  });

  if (isPending) {
    return (
      <div className=" grid grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((__, index) => (
          <div key={index} className=" w-full animate-pulse">
            <div className=" h-[240px] w-full  bg-gray-200"></div>

            <div className=" p-2">
              <h2 className=" text-xl ">
                <span className="bg-gray-200 text-transparent">
                  Lorem, ipsum dolor sit amet consectetur
                </span>
              </h2>
              <h4 className=" font-light">
                <span className="bg-gray-200 text-transparent">
                  Lorem, ipsum dolor
                </span>
              </h4>
              <p className="  text-justify font-light text-gray-600">
                <span className="bg-gray-200 text-transparent">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Nostrum voluptatum nesciunt exercitationem vero nisi.
                </span>
              </p>
            </div>

            <div className=" flex justify-end">
              <span className="bg-gray-200 text-transparent">read more</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className=" grid grid-cols-2 gap-6">
      {articles.map((data) => (
        <div key={data.id} className=" w-full">
          <img
            src={data.image_url}
            alt="image"
            className=" h-[240px] w-full object-cover"
          />

          <div className=" p-2">
            <h2 className=" text-xl">{data.title}</h2>
            <h4 className=" font-light">{data.date}</h4>
            <p className="  text-justify font-light text-gray-600">
              {data.description}
            </p>
          </div>

          <div className=" flex justify-end">
            <Link to={`/article/${data.id}`} className="">
              Learn more
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

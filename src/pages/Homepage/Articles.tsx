import React, { useEffect, useState } from "react";
import supabase from "../../supabase-client";

//image
import image1 from "../../assets/imgs/img1.jpg";
import { Link } from "react-router-dom";

type ArticleType = {
  id: string;
  title: string;
  description: string;
  date: string;
  created_at: string;
};
export default function Articles() {
  const [articles, setArticles] = useState<ArticleType[]>([]);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    const { data, error } = await supabase.from("Articles").select("*");

    if (error) {
      console.log("error fetching articles: ", error);
    } else {
      setArticles(data as ArticleType[]);
      console.log("successfully fetch articles");
    }
  };

  return (
    <div className=" grid grid-cols-2 gap-6">
      {articles.map((data) => (
        <div key={data.id} className=" w-full">
          <img
            src={image1}
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

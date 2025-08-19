import React from "react";

//article data in json
import article_data from "../../data/articles.json";
//image
import image1 from "../../assets/imgs/img1.jpg";
import { Link } from "react-router-dom";
export default function Articles() {
  return (
    <div className=" grid grid-cols-2 gap-6">
      {article_data.map((data) => (
        <div className=" w-full">
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

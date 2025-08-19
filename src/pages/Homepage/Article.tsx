import React from "react";
import { useParams } from "react-router-dom";
import articles from "../../data/articles.json";
export default function Article() {
  const params = useParams();
  const article = articles.find((data) => data.id === params.id);

  return (
    <div>
      <h1>{article?.title}</h1>
      <h2>{article?.date}</h2>
      <p>{article?.description}</p>
    </div>
  );
}

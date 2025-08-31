import { useParams } from "react-router-dom";
import supabase from "../../supabase-client";
import type { ArticleType } from "../../utils/types";
import { useQuery } from "@tanstack/react-query";

export default function Article() {
  const params = useParams();
  const getArticle = async () => {
    try {
      const { data, error } = await supabase
        .from("Articles")
        .select()
        .eq("id", params.id)
        .single();

      if (error) {
        console.error("error occurred in article: ", error);
      }

      return data as ArticleType;
    } catch (error) {}
  };

  //react query
  const {
    data: article,
    isLoading,
    isPending,
  } = useQuery({
    queryKey: ["article"],
    queryFn: getArticle,
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{article?.title}</h1>
      <h2>{article?.date}</h2>
      <p>{article?.description}</p>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import supabase from "../../supabase-client";

//images
import specialist1 from "../../assets/imgs/specialist1.webp";
import specialist2 from "../../assets/imgs/specialist2.jpeg";
import specialist3 from "../../assets/imgs/specialist3.webp";
import { useQuery } from "@tanstack/react-query";

type SpecialistType = {
  id: number;
  specialization: string;
};
export default function MedicalSpecialist() {
  const fetchSpecialization = async () => {
    const { data, error } = await supabase
      .from("Medical Specialization")
      .select("*");

    if (error) {
      console.log("error fetching specialization: ", error);
    } else {
      console.log("successfully fetch specialization");
      return data as SpecialistType[];
    }
  };

  const specialist_images = [specialist1, specialist2, specialist3];

  const {
    data: specialization = [],
    error,
    isPending,
  } = useQuery({
    queryKey: ["specialist"],
    queryFn: fetchSpecialization,
  });

  if (isPending) {
    return (
      <div className=" grid grid-cols-3 gap-4 animate-pulse">
        {Array.from({ length: 3 }).map((__, index) => (
          <div className="w-full " key={index}>
            <div className="h-[200px] w-full  bg-gray-200"></div>

            <h2>
              <span className=" bg-gray-200 text-transparent">
                Lorem ipsum dolor sit, amet
              </span>
            </h2>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className=" grid grid-cols-3 gap-4">
      {specialization.map((data, index) => (
        <div className="w-full " key={data.id}>
          <img
            src={specialist_images[index]}
            alt="medical equipment"
            className=" h-[200px] w-full bg-cover"
          />

          <h2>{data.specialization}</h2>
        </div>
      ))}
    </div>
  );
}

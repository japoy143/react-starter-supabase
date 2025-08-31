import React, { useEffect, useState } from "react";
import supabase from "../../supabase-client";

import { useQuery } from "@tanstack/react-query";
import type { SpecialistType } from "../../utils/types";

export default function MedicalSpecialist() {
  const fetchSpecialization = async () => {
    const { data, error } = await supabase
      .from("Medical Specialization")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(3);

    if (error) {
      console.log("error fetching specialization: ", error);
    } else {
      console.log("successfully fetch specialization");
      return data as SpecialistType[];
    }
  };

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
            src={data.image_url}
            alt="medical equipment"
            className=" h-[200px] w-full bg-cover"
          />

          <h2>{data.specialization}</h2>
        </div>
      ))}
    </div>
  );
}

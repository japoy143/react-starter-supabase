import React, { useEffect, useState } from "react";
import supabase from "../../supabase-client";

//images
import equipment1 from "../../assets/imgs/equipment1.jpeg";
import equipment2 from "../../assets/imgs/equipment2.jpeg";
import equipment3 from "../../assets/imgs/equipment3.jpg";
import { useQuery } from "@tanstack/react-query";

type MedicalEquipmentType = {
  id: number;
  name: string;
  description: string;
};

export default function MedicalEquipments() {
  const fetchMedicalEquipments = async () => {
    const { data, error } = await supabase
      .from("Medical Equipment")
      .select("*");

    if (error) {
      console.log("error fetching medical equipments: ", error);
    } else {
      console.log("successfully added medical equipments");
      return data as MedicalEquipmentType[];
    }
  };

  const equipments_images = [equipment1, equipment2, equipment3];

  const {
    data: equipments = [],
    error,
    isPending,
  } = useQuery({
    queryKey: ["equipments"],
    queryFn: fetchMedicalEquipments,
  });

  if (isPending) {
    return (
      <div className=" grid grid-cols-3 gap-4 animate-pulse">
        {Array.from({ length: 3 }).map((__, index) => (
          <div className="w-full " key={index}>
            <div className=" h-[200px] w-full bg-gray-200"></div>

            <h2>
              <span className=" bg-gray-200 text-transparent">
                Lorem, ipsum dolor sit
              </span>
            </h2>
            <p className=" text-sm font-light text-justify indent-1">
              <span className=" bg-gray-200 text-transparent">
                Lorem, ipsum dolor sit amet lorem
              </span>
            </p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className=" grid grid-cols-3 gap-4">
      {equipments.map((data, index) => (
        <div className="w-full " key={data.id}>
          <img
            src={equipments_images[index]}
            alt="medical equipment"
            className=" h-[200px] w-full bg-cover"
          />

          <h2>{data.name}</h2>
          <p className=" text-sm font-light text-justify indent-1">
            {data.description}
          </p>
        </div>
      ))}
    </div>
  );
}

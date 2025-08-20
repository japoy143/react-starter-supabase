import React, { useEffect, useState } from "react";
import supabase from "../../supabase-client";

//images
import specialist1 from "../../assets/imgs/specialist1.webp";
import specialist2 from "../../assets/imgs/specialist2.jpeg";
import specialist3 from "../../assets/imgs/specialist3.webp";

type SpecialistType = {
  id: number;
  specialization: string;
};
export default function MedicalSpecialist() {
  useEffect(() => {
    fetchSpecialization();
  }, []);

  const [specialists, setSpcialist] = useState<SpecialistType[]>([]);

  const fetchSpecialization = async () => {
    const { data, error } = await supabase
      .from("Medical Specialization")
      .select("*");

    if (error) {
      console.log("error fetching specialization: ", error);
    } else {
      console.log("successfully fetch specialization");
      setSpcialist(data as SpecialistType[]);
    }
  };

  const specialist_images = [specialist1, specialist2, specialist3];

  return (
    <div className=" grid grid-cols-3 gap-4">
      {specialists.map((data, index) => (
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

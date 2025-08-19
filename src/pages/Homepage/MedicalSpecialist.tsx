import React from "react";

//medical equipment data in json
import specialist from "../../data/medical_specialist.json";
//images
import specialist1 from "../../assets/imgs/specialist1.webp";
import specialist2 from "../../assets/imgs/specialist2.jpeg";
import specialist3 from "../../assets/imgs/specialist3.webp";

export default function MedicalSpecialist() {
  const specialist_images = [specialist1, specialist2, specialist3];

  return (
    <div className=" grid grid-cols-3 gap-4">
      {specialist.map((data, index) => (
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

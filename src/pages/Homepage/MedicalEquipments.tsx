import React from "react";

//medical equipment data in json
import medical_equipment from "../../data/medical_equipments.json";
//images
import equipment1 from "../../assets/imgs/equipment1.jpeg";
import equipment2 from "../../assets/imgs/equipment2.jpeg";
import equipment3 from "../../assets/imgs/equipment3.jpg";

export default function MedicalEquipments() {
  const equipments_images = [equipment1, equipment2, equipment3];

  return (
    <div className=" grid grid-cols-3 gap-4">
      {medical_equipment.map((data, index) => (
        <div className="w-full " key={data.id}>
          <img
            src={equipments_images[index]}
            alt="medical equipment"
            className=" h-[200px] w-full bg-cover"
          />

          <h2>{data.equipment_name}</h2>
          <p className=" text-sm font-light text-justify indent-1">
            {data.description}
          </p>
        </div>
      ))}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import supabase from "../../supabase-client";

//medical equipment data in json
import medical_equipment from "../../data/medical_equipments.json";
//images
import equipment1 from "../../assets/imgs/equipment1.jpeg";
import equipment2 from "../../assets/imgs/equipment2.jpeg";
import equipment3 from "../../assets/imgs/equipment3.jpg";

type MedicalEquipmentType = {
  id: number;
  name: string;
  description: string;
};

export default function MedicalEquipments() {
  useEffect(() => {
    fetchMedicalEquipments();
  }, []);

  const [equipmentsData, setEquipmentsData] = useState<MedicalEquipmentType[]>(
    []
  );
  const equipments_images = [equipment1, equipment2, equipment3];

  const fetchMedicalEquipments = async () => {
    const { data, error } = await supabase
      .from("Medical Equipment")
      .select("*");

    if (error) {
      console.log("error fetching medical equipments: ", error);
    } else {
      console.log("successfully added medical equipments");
      setEquipmentsData(data as MedicalEquipmentType[]);
    }
  };

  return (
    <div className=" grid grid-cols-3 gap-4">
      {equipmentsData.map((data, index) => (
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

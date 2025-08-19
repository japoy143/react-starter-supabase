import React, { useState, useEffect } from "react";
import image1 from "../../assets/imgs/img1.jpg";
import image2 from "../../assets/imgs/img2.jpg";
import image3 from "../../assets/imgs/img3.jpg";
import SectionTitle from "../../components/SectionTitle";

//news collection in json
import news_data from "../../data/news.json";
import SectionButton from "../../components/SectionButton";
import Articles from "./Articles";
import MedicalEquipments from "./MedicalEquipments";
import MedicalSpecialist from "./MedicalSpecialist";
import Spacer from "../../components/Spacer";

export default function Homepage() {
  const images = [image1, image2, image3];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // change every 3s

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="w-full overflow-hidden relative">
      {/* Image wrapper */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`slide-${index}`}
            className="h-[400px] w-full object-cover flex-shrink-0"
          />
        ))}
      </div>

      <Spacer />
      <SectionTitle title="Latest News" />
      {/* latest news */}
      <Spacer />

      <div className=" grid grid-cols-2 gap-6 ">
        {news_data.map((data) => (
          <div key={data.id} className=" border-b  space-y-1 py-2">
            <h2>{data.news_title}</h2>
            <p className=" font-light text-sm">{data.news_date}</p>
          </div>
        ))}
      </div>

      <Spacer />
      <div className=" flex  justify-center">
        <SectionButton button_name="Read More" />
      </div>
      <Spacer />

      <Articles />

      <Spacer />
      <SectionTitle title="Medical Equipments" />
      <Spacer />

      <MedicalEquipments />

      <Spacer />
      <SectionTitle title="Medical Specialist" />
      <Spacer />

      <MedicalSpecialist />
    </div>
  );
}

import React from "react";

interface SectionTitleProps {
  title: string;
}

export default function SectionTitle({ title }: SectionTitleProps) {
  return <h1 className=" text-center text-2xl  font-medium ">{title}</h1>;
}

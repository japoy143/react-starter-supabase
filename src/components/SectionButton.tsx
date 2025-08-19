import React from "react";

interface SectionButtonProps {
  button_name: string;
}
export default function SectionButton({ button_name }: SectionButtonProps) {
  return <button className=" border p-2 font-light ">{button_name}</button>;
}

import React from "react";

export default function FormError({ error }: { error: string }) {
  return <small className=" text-red-400">{error}</small>;
}

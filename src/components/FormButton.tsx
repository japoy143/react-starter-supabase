import React from "react";

export default function FormButton({
  loading,
  buttonName,
  buttonLoading,
}: {
  loading: boolean;
  buttonName: string;
  buttonLoading: string;
}) {
  return (
    <button disabled={loading} className=" bg-gray-400 p-1 px-3 rounded">
      {loading ? buttonLoading : buttonName}
    </button>
  );
}

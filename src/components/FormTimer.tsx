import { useEffect, useState } from "react";

export default function FormTimer({ time }: { time: number }) {
  //get the time set from the form
  const getSessionTime = sessionStorage.getItem("appointment_submitted");
  if (!getSessionTime) return;

  const { timestamp } = JSON.parse(getSessionTime);
  const remaining = time - (Date.now() - timestamp);

  const [seconds, setSeconds] = useState(Math.floor(remaining / 1000));

  useEffect(() => {
    if (seconds <= 0) return; // stop when it reaches 0

    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval); // cleanup when component unmounts
  }, [seconds]);
  // Optional: format to minutes:seconds
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className="cursor-pointer flex items-center px-2 py-1 text-indigo-600 duration-150 bg-indigo-50 rounded hover:bg-indigo-100 active:bg-indigo-200">
      {minutes > 0
        ? `${minutes}m ${secs}s left for the next appointment submission`
        : `${secs}s left for the next appointment submission`}
    </div>
  );
}

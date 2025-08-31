import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState, type FormEvent } from "react";
import { getAppointments, insertAppointments } from "../../utils/Appointments";
import supabase from "../../supabase-client";
import ArrowToLeft from "../../assets/icons/ArrowToLeft";
import ArrowToRight from "../../assets/icons/ArrowToRight";
import FormTimer from "../../components/FormTimer";
import type { AppointmentType } from "../../utils/types";

const hour = 60 * 1000;
//timer for the next appointment
const timedSessionForSubmittingForm = () => {
  const saved = sessionStorage.getItem("appointment_submitted");
  if (!saved) return false;

  const { timestamp } = JSON.parse(saved);
  const now = Date.now();

  // if more than 1 min passed, reset
  if (now - timestamp > hour) {
    sessionStorage.removeItem("appointment_submitted");
    return false;
  }

  return true;
};
export default function Appointments() {
  const [nickname, setNickname] = useState<string>("");
  const [phone_number, setPhoneNumber] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [hideForm, setHideForm] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(
    timedSessionForSubmittingForm
  );

  // setup auto-reset effect
  useEffect(() => {
    if (submitted) {
      const saved = sessionStorage.getItem("appointment_submitted");
      if (!saved) return;

      const { timestamp } = JSON.parse(saved);
      const remaining = hour - (Date.now() - timestamp);

      if (remaining > 0) {
        const timer = setTimeout(() => {
          setSubmitted(false);
          sessionStorage.removeItem("appointment_submitted");
        }, remaining);

        return () => clearTimeout(timer);
      } else {
        // already expired
        setSubmitted(false);
        sessionStorage.removeItem("appointment_submitted");
      }
    }
  }, [submitted]);

  //listener for query changes
  const queryClient = useQueryClient();
  const {
    data: appointments = [],
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["appointments"],
    queryFn: () => getAppointments("client"),
  });

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
    waiting_number: string
  ) => {
    e.preventDefault();

    //block multiple submission
    if (submitted) {
      alert("You already submitted an appointment in this session.");
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await insertAppointments(
        nickname,
        phone_number,
        waiting_number
      );

      if (error) {
        console.log("error adding appointment", error.message);
        return;
      }

      // Save with timestamp
      sessionStorage.setItem(
        "appointment_submitted",
        JSON.stringify({ timestamp: Date.now() })
      );
      setSubmitted(true);

      refetch();
    } catch (error) {
      console.error("error adding appointment", error);
    } finally {
      setNickname("");
      setPhoneNumber("");
      setLoading(false);
    }
  };

  //realtime changes
  useEffect(() => {
    const channel = supabase
      .channel("appointments-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Appointments" },
        (payload) => {
          // force refetch whenever appointments change
          switch (payload.eventType) {
            case "DELETE":
              queryClient.setQueryData(["appointments"], (old: any[] = []) =>
                old.filter(
                  (item) => item.id !== (payload.old as AppointmentType).id
                )
              );
              break;

            default:
              queryClient.invalidateQueries({ queryKey: ["appointments"] });
              break;
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const partialClosed = () => {
    sessionStorage.removeItem("appointment_submitted");
  };

  if (isPending) {
    return <div>Loading ...</div>;
  }

  //next number for client
  const nextWaitingNumber =
    appointments && appointments.length > 0
      ? parseInt(appointments[appointments.length - 1].waiting_number) + 1
      : 1;

  // filter only those without status
  const pendingAppointments = appointments.filter((item) => !item.status);

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8">
      <div className="max-w-lg">
        <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">
          Appointments
        </h3>
        <p className="text-gray-600 mt-2">
          Easily schedule, track, and update your appointments with your
          healthcare provider.
        </p>
      </div>

      {/* form for adding appointment */}
      <div
        className={`grid ${
          submitted || hideForm ? "grid-cols-1 " : "grid-cols-2 "
        }mt-12`}
      >
        <form
          onSubmit={(e) => handleSubmit(e, nextWaitingNumber.toString())}
          className={`p-4 space-y-2 w-full overflow-hidden ${
            submitted || hideForm ? "hidden" : ""
          }`}
        >
          <div className=" flex justify-end">
            <div
              onClick={() => setHideForm((prev) => !prev)}
              className=" cursor-pointer flex  items-center px-2 py-1 text-indigo-600 duration-150 bg-indigo-50 rounded hover:bg-indigo-100 active:bg-indigo-200"
            >
              <p className=" text-sm">{hideForm ? "Show" : "Hide"}</p>
              {hideForm ? (
                <ArrowToRight className="size-4" />
              ) : (
                <ArrowToLeft className=" size-4" />
              )}
            </div>
          </div>

          <label className="text-gray-600">NickName</label>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Enter your password"
            className="w-full pr-12 pl-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
          />

          <div className=" ">
            <label className="text-gray-600">Phone number</label>
            <div className=" relative mt-2  text-gray-500">
              <div className="absolute inset-y-0 left-3 my-auto h-6 flex items-center border-r pr-2">
                <option>PH</option>
              </div>
              <input
                value={phone_number}
                onChange={(e) => setPhoneNumber(e.target.value)}
                type="number"
                placeholder="+63 904 000-000"
                className="w-full pl-[4.5rem] pr-3 py-2 appearance-none bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-600">Waiting Number</label>
            <div className="relative mt-2  text-gray-500">
              <div className="absolute inset-y-0 left-3 my-auto h-6 flex items-center border-r pr-2">
                <option>Num</option>
              </div>
              <div className="w-full pl-[4.5rem] pr-3 py-2 appearance-none bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg">
                <p>{nextWaitingNumber}</p>
              </div>
            </div>
          </div>

          <div className=" flex   justify-end py-4">
            <button
              disabled={loading}
              type="submit"
              className="px-5 py-3 text-indigo-600 duration-150 bg-indigo-50 rounded-lg hover:bg-indigo-100 active:bg-indigo-200"
            >
              {loading ? "Saving..." : "Set Appointment"}
            </button>
          </div>
        </form>

        {/* table */}
        <div>
          <div
            className={`${submitted || hideForm ? " flex  mb-2" : "hidden"} `}
          >
            {submitted ? (
              <FormTimer time={hour} />
            ) : (
              <div
                onClick={() => setHideForm((prev) => !prev)}
                className=" cursor-pointer flex  items-center px-2 py-1 text-indigo-600 duration-150 bg-indigo-50 rounded hover:bg-indigo-100 active:bg-indigo-200"
              >
                <p className=" text-sm">{hideForm ? "Show" : "Hide"}</p>
                {hideForm ? (
                  <ArrowToRight className="size-4" />
                ) : (
                  <ArrowToLeft className=" size-4" />
                )}
              </div>
            )}
          </div>
          <div className="w-full shadow-sm border rounded-lg overflow-x-auto h-[400px] transition-all duration-500 ease-in-out">
            <table className="w-full table-auto text-sm text-left overflow-auto ">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                <tr>
                  <th className="py-3 px-6">Nickname</th>
                  <th className="py-3 px-6">Number</th>
                  <th className="py-3 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 divide-y ">
                {pendingAppointments.map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.nickname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.waiting_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {idx === 0 ? "Catering" : "Waiting..."}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className=" flex  items-center justify-center">
        <div className="mt-10 p-10 text-center border-2 rounded-md border-solid">
          <h2 className=" text-8xl ">
            {pendingAppointments.length > 0
              ? pendingAppointments[0].waiting_number
              : "None"}
          </h2>
          <p className=" text-xl">Currently Serving</p>
        </div>
      </div>
    </div>
  );
}

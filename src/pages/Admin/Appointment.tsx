import React, { useEffect, useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteAppointment,
  getAppointments,
  insertAppointments,
  updateAppointment,
} from "../../utils/Appointments";
import supabase from "../../supabase-client";

export default function AdminAppointments() {
  const [nickname, setNickname] = useState<string>("");
  const [phone_number, setPhoneNumber] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [cateredLoading, setCateredLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  //listener for query changes
  const queryClient = useQueryClient();

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
    waiting_number: string
  ) => {
    e.preventDefault();

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

      refetch();
    } catch (error) {
      console.error("error adding appointment", error);
    } finally {
      setNickname("");
      setPhoneNumber("");
      setLoading(false);
    }
  };

  const {
    data: appointments = [],
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["appointments"],
    queryFn: () => getAppointments("client"),
  });

  //update status handler
  const changeStatus = async (id: string) => {
    try {
      setCateredLoading(true);
      const { data, error } = await updateAppointment(id);

      if (error) {
        console.error("error updating catered client: ", error.message);
        return;
      }

      refetch();
    } catch (error) {
      console.error("error updating catered client: ", error);
    } finally {
      setCateredLoading(false);
    }
  };

  //delete appointment client
  const deleteAppointmentClient = async (id: string) => {
    try {
      setDeleteLoading(true);
      setDeleteId(id);
      const { data, error } = await deleteAppointment(id);
      queryClient.setQueryData(["appointments"], (old: any[] = []) =>
        old.filter((item) => item.id !== id)
      );

      if (error) {
        console.error("error deleting appointment: ", error.message);
      }
    } catch (error) {
      console.error("error deleting client: ", error);
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
    }
  };

  //realtime changes
  useEffect(() => {
    const channel = supabase
      .channel("appointments-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Appointments" },
        () => {
          // force refetch whenever appointments change
          queryClient.invalidateQueries({ queryKey: ["appointments"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  if (isPending) {
    return <div>Loading ...</div>;
  }

  const nextWaitingNumber =
    appointments && appointments.length > 0
      ? parseInt(appointments[appointments.length - 1].waiting_number) + 1
      : 1;

  // filter only those without status
  const pendingAppointments = appointments.filter((item) => !item.status);

  return (
    <div>
      <h1> Appointment</h1>
      <p>
        Create and schedule new appointments by entering patient details,
        selecting the date and time, and specifying the reason for the visit
      </p>

      <form
        onSubmit={(e) => handleSubmit(e, nextWaitingNumber.toString())}
        className="p-4 space-y-2 w-full md:w-1/2 lg:w-1/3"
      >
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
            {loading ? "Loading ..." : "Save"}
          </button>
        </div>
      </form>

      <h2 className="mt-12 my-2">Current On Queue Clients</h2>
      <div className=" shadow-sm border rounded-lg overflow-x-auto h-[400px]">
        <table className="w-full table-auto text-sm text-center">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b">
            <tr>
              <th className="py-3 px-6">Nickname</th>
              <th className="py-3 px-6">Number</th>
              <th className="py-3 px-6">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 divide-y">
            {pendingAppointments.map((item, idx) => (
              <tr key={idx}>
                <td className="px-6 py-4 whitespace-nowrap">{item.nickname}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.waiting_number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {idx === 0 ? (
                    <button
                      disabled={cateredLoading}
                      onClick={() => changeStatus(item.id)}
                      className="px-5 py-3 text-indigo-600 duration-150 bg-indigo-50 rounded-lg hover:bg-indigo-100 active:bg-indigo-200"
                    >
                      {cateredLoading ? "Changing status..." : "Catered"}
                    </button>
                  ) : (
                    "Waiting..."
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 my-2">All Clients</h2>
      <div className=" shadow-sm border rounded-lg overflow-x-auto h-[400px]">
        <table className="w-full table-auto text-sm text-center">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b">
            <tr>
              <th className="py-3 px-6">Nickname</th>
              <th className="py-3 px-6">Number</th>
              <th className="py-3 px-6">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 divide-y">
            {appointments.map((item, idx) => (
              <tr key={idx}>
                <td className="px-6 py-4 whitespace-nowrap">{item.nickname}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.waiting_number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => deleteAppointmentClient(item.id)}
                    className="px-5 py-3 text-red-400 duration-150 bg-red-50 rounded-lg hover:bg-red-100 active:bg-red-200"
                  >
                    {deleteId === item.id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

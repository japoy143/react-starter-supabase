import supabase from "../supabase-client";
import type { AppointmentType } from "./types";

//create
export const insertAppointments = async (
  nickname: string,
  phone_number: string,
  waiting_number: string
) => {
  const { data, error } = await supabase.from("Appointments").insert({
    nickname: nickname,
    phone_number: phone_number,
    waiting_number: waiting_number,
    status: false,
  });

  return { data, error };
};

//read
export const getAppointments = async (ascending: "client" | "admin") => {
  try {
    const { data, error } = await supabase
      .from("Appointments")
      .select()
      .order("created_at", {
        ascending: ascending === "client" ? true : false,
      });

    if (error) {
      console.error("Database error:", error.message);
    } else if (!data || data.length === 0) {
      console.log("No appointments found");
      // handle empty state, e.g. set data to null or show "No records yet"
      return;
    } else {
      console.log("Latest appointment:", data[0]);
      // use data[0] safely
      return (data as AppointmentType[]) ?? [];
    }
  } catch (error) {
    console.error("error in appointment", error);
  }
};

//update
export const updateAppointment = async (id: string) => {
  const { data, error } = await supabase
    .from("Appointments")
    .update({
      status: true,
    })
    .eq("id", id);

  return { data, error };
};

//delete
export const deleteAppointment = async (id: string) => {
  const { data, error } = await supabase
    .from("Appointments")
    .delete()
    .eq("id", id);

  return { data, error };
};

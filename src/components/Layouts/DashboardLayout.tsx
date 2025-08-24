import React from "react";
import { Link, Outlet } from "react-router-dom";
import { AuthContextProvider } from "../../context/AuthContext";
import PrivateRoute from "../../routes/PrivateRoute";

export default function DashboardLayout() {
  return (
    <AuthContextProvider>
      <PrivateRoute>
        <div className=" grid grid-cols-8 bg-gray-200 h-screen w-full ">
          {/* sidebar */}
          <div className=" space-y-2 p-4 col-span-3 md:col-span-2 xl:col-span-1 flex flex-col">
            <Link to={"/admin/dashboard"}>Home</Link>

            <Link to={"/admin/dashboard/news"}>News</Link>
            <Link to={"/admin/dashboard/equipments"}>Medical Equipment</Link>
            <Link to={"/admin/dashboard/specialist"}>Medical Specialist</Link>
          </div>
          {/* dashboard */}
          <div className="p-4 bg-white  col-span-5 md:col-span-6 xl:col-span-7">
            <Outlet />
          </div>
        </div>
      </PrivateRoute>
    </AuthContextProvider>
  );
}

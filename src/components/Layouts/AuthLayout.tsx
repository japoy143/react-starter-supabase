import React from "react";
import { Outlet } from "react-router-dom";
import { AuthContextProvider } from "../../context/AuthContext";
export default function AuthLayout() {
  return (
    <div>
      <AuthContextProvider>
        <Outlet />
      </AuthContextProvider>
    </div>
  );
}

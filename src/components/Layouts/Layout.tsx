import React from "react";
import { Outlet } from "react-router-dom";
import Nav from "../Nav";
import Contact from "../Contact";
import Spacer from "../Spacer";

export default function Layout() {
  return (
    <main>
      <div className=" md:px-20 lg:px-40 xl:px-80">
        <Nav />
        <Outlet />
        <Spacer />
      </div>

      <Contact />
    </main>
  );
}

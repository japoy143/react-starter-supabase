import React from "react";
import MenuIcon from "../assets/icons/MenuIcon";

export default function Nav() {
  return (
    <nav className="p-8">
      <ul className=" flex justify-between">
        <li>
          <h1>Logo</h1>
        </li>
        <li className=" flex items-center space-x-2 ">
          <p>Menu</p>
          <MenuIcon classname="size-6" />
        </li>
      </ul>
    </nav>
  );
}

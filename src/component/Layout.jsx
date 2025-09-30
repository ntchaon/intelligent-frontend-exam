import React from "react";
import { Outlet } from "react-router-dom";
import Nav from "./Nav";

// Layout that includes Nav + Outlet. Because /login is outside this layout,
// Nav will not appear on the login page.
export default function Layout() {
  return (
    <div className=" h-[100vh] ">
      <div className="grid grid-cols-12 h-full">
        <div className="col-span-2 text-white grid align-items-center">
          <Nav />
        </div>
        <div className="col-span-10  bg-[#fafafa] rounded-tl-[40px] rounded-tr-[0px] rounded-br-[0px] rounded-bl-[40px]">
          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

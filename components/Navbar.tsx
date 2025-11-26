"use client";
import { apiSlice } from "@/services/apiSlice";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useDispatch } from "react-redux";

function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/" ? true : false;
  const isEntry = pathname === "/entry" || "/edit" ? true : false;
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/sign-in");
    setTimeout(() => {
      dispatch(apiSlice.util.resetApiState());
    }, 100);
  };
  return (
    <div className="w-full h-20 shadow-xs shadow-[#3B82F6] flex items-center justify-between px-4 md:px-10">
      <div
        onClick={() => router.push("/")}
        className="flex items-center cursor-pointer space-x-4"
      >
        <Image
          className="w-8 md:w-10"
          src="/logo.png"
          alt="logo rocket"
          width={40}
          height={40}
        />
        <h2 className="text-2xl md:text-3xl font-extrabold text-white whitespace-nowrap">
          <span className="text-blue-500">Task</span>
          <span className="text-purple-500">Flow</span>
        </h2>
      </div>

      <div className="flex items-center space-x-4 md:space-x-8">
        {isHome && (
          <button
            onClick={() => router.push("/entry")}
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium py-1.5 md:py-2 px-4 md:px-6 rounded-md text-sm md:text-base transition cursor-pointer"
          >
            Add Task
          </button>
        )}
        {isEntry && (
          <button
            onClick={() => router.push("/")}
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium py-1.5 md:py-2 px-4 md:px-6 rounded-md text-sm md:text-base transition cursor-pointer"
          >
            View Tasks
          </button>
        )}

        {(isHome || isEntry) && (
          <svg
            onClick={handleLogout}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="white"
            className="w-6 h-6 md:w-7 md:h-7 cursor-pointer"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
            />
          </svg>
        )}
      </div>
    </div>
  );
}

export default Navbar;

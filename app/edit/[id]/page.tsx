import Edit from "@/components/Edit";
import Navbar from "@/components/Navbar";
import RequireUser from "@/components/RequireUser";
import React from "react";

export default function page() {
  return (
    <div>
      <RequireUser>
        <div className="min-h-screen bg-linear-to-br from-[#0F172A] from-30% to-[#334F90] to-100%">
          <Navbar />
          <Edit></Edit>
        </div>
      </RequireUser>
    </div>
  );
}

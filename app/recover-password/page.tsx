import Navbar from "@/components/Navbar";
import RecoverPassword from "@/components/RecoverPassword";
import React from "react";

export default function page() {
  return (
    <div className="min-h-screen bg-[#0F172A]">
      <Navbar />
      <RecoverPassword></RecoverPassword>
    </div>
  );
}

import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import RecoverPassword from "@/components/RecoverPassword";
import React, { Suspense } from "react";

export default function page() {
  return (
    <div className="min-h-screen bg-[#0F172A]">
      <Suspense fallback={<Loading></Loading>}>
        <Navbar />
        <RecoverPassword></RecoverPassword>
      </Suspense>
    </div>
  );
}

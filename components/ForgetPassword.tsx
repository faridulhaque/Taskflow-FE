"use client";
import { useForgotPasswordMutation } from "@/services/queries/authApi";
import { ForgotPasswordType } from "@/services/types";
import { Noto_Serif } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";
const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

function ForgetPassword() {
  const router = useRouter();
  const [sendCode, { isLoading: sendingCode }] = useForgotPasswordMutation();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const email = e.target.email.value;
    if (!email) return toast.error("Email is required");

    const data: ForgotPasswordType = {
      email,
    };

    try {
      const result: any = await sendCode(data);

      if (result?.data?.data?.email) {
        toast.success(`An email has been sent with recovery code`);
        router.push(`/recover-password?email=${result?.data?.data?.email}`);
      }
    } catch (error) {
      toast.error("Failed to send verification code");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 w-11/12 mx-auto pt-20 pb-10">
      <div className="flex flex-col justify-start h-full space-y-6  md:pt-0 pt-10">
        <button className="flex items-center text-[#F8FAFC] hover:text-[#93C5FD] w-fit transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
            />
          </svg>
          <Link href="/sign-in" className="text-sm font-medium">
            Back to login
          </Link>
        </button>

        <div className="flex flex-col justify-start space-y-4 mt-4 lg:mt-20">
          <h2
            className={`text-4xl md:text-5xl text-[#F8FAFC] text-left font-light leading-tight tracking-wide ${notoSerif.className}`}
          >
            Forgot your password?
          </h2>

          <p className="text-left text-base md:text-lg text-[#F8FAFC] max-w-md">
            Enter your email below to recover your password.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-5 mt-4"
        >
          <div>
            <label className="block text-white text-sm mb-2">Email</label>
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              className="w-full h-12 rounded-lg bg-[#F5F7FA] border border-[#6B6B6B] px-4 outline-0"
            />
          </div>

          <button
            disabled={sendingCode}
            type="submit"
            className="cursor-pointer w-full h-12 bg-[#3B82F6] text-white rounded-md text-lg font-medium hover:bg-[#2563EB] transition"
          >
            Recover Password
          </button>
        </form>
      </div>

      <div className="flex justify-center items-start h-[400px] md:h-[500px]">
        <Image
          className="w-4/5 h-full object-contain rounded-2xl"
          src="/forgot-pass.png"
          alt="forgot password"
          width={300}
          height={450}
        />
      </div>
    </div>
  );
}

export default ForgetPassword;

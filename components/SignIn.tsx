"use client";
import { signInWithGoogle } from "@/services/firebase.config";
import {
  useGoogleOnboardingMutation,
  useLoginMutation,
} from "@/services/queries/authApi";
import { signInPayload } from "@/services/types";
import { Noto_Serif } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

function SignIn() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading: loggingIn }] = useLoginMutation<any>();
  const [onboardGoogleUser] = useGoogleOnboardingMutation<any>();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const email = e.currentTarget.email.value as string;
    const password = e.currentTarget.password.value as string;

    if (password.length < 8)
      return toast.warn("Password should be at least 8 characters");

    const payload: signInPayload = {
      email,
      password,
    };

    for (const key in payload) {
      const value = payload[key as keyof typeof payload];
      if (!value) return toast.warn(`${key} is required`);
    }

    try {
      const result: any = await login({ email, password: password, name });

      if (result?.data?.token) {
        localStorage.setItem("token", result.data.token);

        toast.success(`Sign In Successful`);
        router.push("/");
      }
    } catch (error) {
      toast.error(`Failed to Sign Up`);
    }
  };

  const handleGoogleSignIn = async () => {
    const result = await signInWithGoogle();
    const email = result?.user?.email;
    const name = result?.user?.displayName;
    const res: any = await onboardGoogleUser({
      name,
      email,
    });
    if (res?.data?.token) {
      localStorage.setItem("token", res.data.token);

      toast.success(res?.data?.data?.message);

      router.push("/");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-16 w-11/12 mx-auto pt-20 pb-10">
      <div className="h-[500px] md:h-[600px]">
        <Image
          className="w-full h-full object-contain"
          src="/sign-in.png"
          alt="note"
          width={300}
          height={450}
        />
      </div>
      <div className="flex flex-col justify-center h-full">
        <h2
          className={`text-5xl md:text-6xl text-[#F8FAFC] text-center font-light tracking-wide ${notoSerif.className}`}
        >
          Welcome Back
        </h2>
        <p className="pt-4 pb-8 text-center text-lg text-[#F8FAFC]">
          Enter your email and password to access your account
        </p>
        <form
          onSubmit={handleSubmit}
          className="mx-auto w-full max-w-md space-y-5"
        >
          <div>
            <label className="block text-white text-sm mb-2">Email</label>
            <input
              type="text"
              name="email"
              placeholder="Enter your email"
              className="w-full h-12 rounded-lg bg-[#F5F7FA] border border-[#6B6B6B] px-4 outline-0"
            />
          </div>
          <div className="relative">
            <label className="block text-white text-sm mb-2">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              className="w-full h-12 rounded-lg bg-[#F5F7FA] border border-[#6B6B6B] px-4 pr-10 outline-0"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer absolute right-3 top-10 text-[#6B6B6B] hover:text-[#3B82F6]"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              )}
            </button>
          </div>

          <div className="text-right text-[#F5F7FA] cursor-pointer">
            <Link href="/forgot-password" className="text-sm hover:underline">
              Forgot Password?
            </Link>
          </div>
          <button
            disabled={loggingIn}
            type="submit"
            className="cursor-pointer w-full h-12 bg-[#3B82F6] text-white rounded-md text-lg font-medium hover:bg-[#2563EB] transition"
          >
            Login
          </button>
          <button
            onClick={handleGoogleSignIn}
            type="button"
            className="cursor-pointer w-full flex items-center justify-center h-12 rounded-md bg-white mt-4 space-x-3 hover:bg-gray-100 transition"
          >
            <Image
              width={40}
              height={40}
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span className="text-[#121212] font-medium">
              Sign in with Google
            </span>
          </button>
        </form>
        <h2 className="text-center text-[#F5F7FA] text-base mt-6">
          Don’t have an account?{" "}
          <Link className="text-[#94A3B8] hover:underline" href="/sign-up">
            Click here
          </Link>
        </h2>
      </div>
    </div>
  );
}

export default SignIn;

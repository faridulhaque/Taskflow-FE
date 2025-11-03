"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loading from "./Loading";

const RequireUser = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      router.push("/sign-in");
    } else {
      setToken(savedToken);
    }
  }, [router]);

  if (token === null) return <Loading></Loading>;

  return <>{children}</>;
};

export default RequireUser;

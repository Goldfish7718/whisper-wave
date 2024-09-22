"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Loading from "./Loading";
import PrtoectedRouteProps from "@/types/types";

const ProtectedRoute = ({ children }: PrtoectedRouteProps) => {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  if (!isLoaded) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loading size={48} />
      </div>
    );
  } else if (isLoaded && !isSignedIn) {
    router.push("/");
  } else if (isLoaded && isSignedIn) {
    return <>{children}</>;
  }
};

export default ProtectedRoute;

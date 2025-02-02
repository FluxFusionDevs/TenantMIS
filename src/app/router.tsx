"use client";

import React, { Suspense, useEffect } from "react";
import Loading from "@/components/loading";
import { useSession } from "./context/SupabaseSessionContext";
import { useRouter } from "next/navigation";
import { RoleRoutes } from "@/models/role";

const Router: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!session) {
        router.push("/auth/login");
      } else if (
        window.location.pathname.startsWith("/auth") ||
        window.location.pathname === "/"
      ) {
        window.location.href = "/tenant/dashboard";
        const role = session.user?.role;
        if (role === RoleRoutes.TENANT) {
          router.push(RoleRoutes.TENANT);
        } else if (role === RoleRoutes.PROPERTYMANAGER) {
          router.push(RoleRoutes.PROPERTYMANAGER);
        } else if (role === RoleRoutes.FINANCESTAFF) {
          router.push(RoleRoutes.FINANCESTAFF);
        } else if (role === RoleRoutes.STAFF) {
          router.push(RoleRoutes.STAFF);
        } else {
          router.push("/auth/login");
        }
      }
    }
  }, [session, loading, router]);

  if (loading) {
    return <Loading />;
  }

  return <Suspense>{children}</Suspense>;
};

export default Router;

"use client";

import React, { Suspense, useEffect } from "react";
import Loading from "@/components/loading";
import { useSession } from "./context/SupabaseSessionContext";
import { redirect, useRouter } from "next/navigation";
import { RoleRoutes } from "@/models/role";
import { jwtDecode } from 'jwt-decode'
import { CustomJwtPayload } from "@/models/jwt";

const Router: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!session && !window.location.pathname.startsWith("/auth")) {
        redirect("/auth/login");
      } else if (
        session &&
        (window.location.pathname.startsWith("/auth") ||
          window.location.pathname === "/")
      ) {
        // window.location.href = "/tenant/dashboard";
        const token = jwtDecode(session.access_token) as CustomJwtPayload;
        const role = token.user_role;
        if (role === "TENANT") {
          redirect(RoleRoutes.TENANT);
        } else if (role === "PROCURMENTMANAGER") {
          redirect(RoleRoutes.PROCUREMENTMANAGER);
        } else if (role === "FINANCEMANAGER") {
          redirect(RoleRoutes.FINANCEMANAGER);
        } else if (role === "STAFFMANAGER") {
          redirect(RoleRoutes.STAFFMANAGER);
        } else if (role === "TENANTMANAGER") {
          redirect(RoleRoutes.TENANTMANAGER);
        } else {
          redirect("/auth/login");
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

"use client";

import { AppSidebar } from "@/components/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { supabase } from "@/lib/supabaseClient";
import {
  Home,
  Inbox,
  Paperclip,
  Receipt,
  MessageCircle,
  LogOut,
} from "lucide-react";
import { constants } from "node:buffer";
import React, { Usable } from "react";
import { MenuItem } from "@/models/sidebar-menu";

type Params = {
  userId: string;
};
export default function HomeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Usable<Params>;
}) {
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const tenantItems: MenuItem[] = [
    {
      title: "Home",
      url: `/tenant/dashboard`,
      icon: Home,
    },
    {
      title: "My Requests",
      url: `/tenant/request/`,
      icon: Inbox,
    },
    {
      title: "My Contracts",
      url: `/tenant/contracts`,
      icon: Paperclip,
    },
    {
      title: "Billing Statements",
      url: `/tenant/billing`,
      icon: Receipt,
    },
    {
      title: "FAQ",
      url: "#",
      icon: MessageCircle,
    },
    {
      title: "Logout",
      action: signOut,
      icon: LogOut,
    },
  ];

  return (
    <div>
      <SidebarProvider>
        <AppSidebar menuItems={tenantItems} />
        <main className="mx-2 md:mx-2 lg:mx-6 xl:mx-10 w-full">
          <SidebarTrigger />
          <div>{children}</div>
        </main>
      </SidebarProvider>
    </div>
  );
}

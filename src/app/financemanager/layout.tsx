"use client";

import { AppSidebar } from "@/components/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {
  Home,
  Inbox,
  Paperclip,
  Receipt,
  MessageCircle,
  LogOut,
  LayoutDashboard,
  Newspaper,
  ScrollText,
} from "lucide-react";
import React, { Usable } from "react";
import { MenuItem } from "@/models/sidebar-menu";
import { createClient } from "@/lib/supabaseClient";

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
    const supabase = createClient();
    await supabase.auth.signOut();
  };

  const tenantItems: MenuItem[] = [
    {
      title: "Dashboard",
      url: `/financemanager/dashboard`,
      icon: LayoutDashboard,
    },
    {
      title: "Reports",
      url: `/financemanager/reports`,
      icon: Newspaper,
    },
    {
      title: "Transactions",
      url: `/financemanager/transactions`,
      icon: ScrollText,
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

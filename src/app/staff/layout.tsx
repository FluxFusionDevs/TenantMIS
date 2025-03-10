"use client";

import { AppSidebar } from "@/components/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {
  LogOut,
  LayoutDashboard,
  Newspaper,
  ScrollText,
  UsersRound,
  Clock9,
  ListChecks,
} from "lucide-react";
import React from "react";
import { MenuItem } from "@/models/sidebar-menu";
import { createClient } from "@/lib/supabaseClient";
import { staffManagerFaqs } from "@/app/staffmanager/constants/faqs";
import ChatBotComponent from "@/components/chatbotfaq";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  };

  const tenantItems: MenuItem[] = [
    {
      title: "Dashboard",
      url: "/staff/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Coworkers",
      url: `/staff/coworkers`,
      icon: UsersRound,
    },
    {
      title: "Shifts",
      url: `/staff/shifts`,
      icon: Clock9,
    },
    {
      title: "Tasks",
      url: `/staff/tasks`,
      icon: ListChecks,
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
          <ChatBotComponent flow={staffManagerFaqs} />
        </main>
      </SidebarProvider>
    </div>
  );
}

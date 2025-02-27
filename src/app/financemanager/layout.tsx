"use client";

import { AppSidebar } from "@/components/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {
  LogOut,
  LayoutDashboard,
  Newspaper,
  ScrollText,
} from "lucide-react";
import React from "react";
import { MenuItem } from "@/models/sidebar-menu";
import { createClient } from "@/lib/supabaseClient";
import { financeManagerFaqs } from "./constants/faqs";
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
          <ChatBotComponent flow={financeManagerFaqs} />
        </main>
      </SidebarProvider>
    </div>
  );
}

"use client";

import { AppSidebar } from "@/components/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabaseClient";
import {
  Home,
  Inbox,
  Paperclip,
  Receipt,
  MessageCircle,
  LogOut,
  House,
  TimerIcon,
  Shield,
  Wrench,
} from "lucide-react";
import { constants } from "node:buffer";
import React, { Usable } from "react";
import { MenuItem } from "@/models/sidebar-menu";
import ChatBot from "react-chatbotify";
import { staffManagerFaqs } from "./constants/faqs";
import ChatBotComponent from "@/components/chatbotfaq";

type Params = {
  userId: string;
};
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const tenantItems: MenuItem[] = [
    {
      title: "Home",
      url: `/staffmanager/dashboard`,
      icon: Home,
    },
    {
      title: "Housekeeping",
      url: `/staffmanager/housekeeping`,
      icon: House,
    },
    {
      title: "Security Team",
      url: `/staffmanager/security`,
      icon: Shield,
    },
    {
      title: "Maintenance",
      url: `/staffmanager/maintenance`,
      icon: Wrench,
    },
    {
      title: "Schedules",
      url: `/staffmanager/schedules`,
      icon: TimerIcon,
    },
    {
      title: "Logout",
      action: signOut,
      icon: LogOut,
    },
  ];

  const otherItems: MenuItem[] = [
    {
      title: "Complaints",
      url: `/staffmanager/complaints`,
      icon: Inbox,
    }
  ];

  return (
    <div>
      <SidebarProvider>
        <AppSidebar menuItems={tenantItems} otherItems={otherItems} />
        <main className="mx-2 md:mx-2 lg:mx-6 xl:mx-10 w-full">
          <SidebarTrigger />
          <div>{children}</div>
          <ChatBotComponent flow={staffManagerFaqs} />
        </main>
      </SidebarProvider>
    </div>
  );
}

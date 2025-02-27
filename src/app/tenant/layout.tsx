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
} from "lucide-react";
import { constants } from "node:buffer";
import React, { Suspense, Usable } from "react";
import { MenuItem } from "@/models/sidebar-menu";
import Loading from "@/components/loading";
import ChatBot from "react-chatbotify";
import { tenantFaqs } from "./constants/faq";
import ChatBotComponent from "@/components/chatbotfaq";

type Params = {
  userId: string;
};
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
    // {
    //   title: "FAQ",
    //   url: `/tenant/faqs`,
    //   icon: MessageCircle,
    // },
    
  ];

  const otherItems: MenuItem[] = [
    {
      title: "Logout",
      action: signOut,
      icon: LogOut,
    },
  ];

  return (
    <div>
      <SidebarProvider>
        <AppSidebar menuItems={tenantItems} otherItems={otherItems} />
        <main className="mx-2 md:mx-2 lg:mx-6 xl:mx-10 w-full">
          <SidebarTrigger />
          <div>{children}</div>
          <ChatBotComponent flow={tenantFaqs} />
        </main>
      </SidebarProvider>
    </div>
  );
}

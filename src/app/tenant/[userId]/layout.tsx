"use client";

import { AppSidebar } from "@/components/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Home, Inbox, Paperclip, Receipt, MessageCircle, LogOut } from "lucide-react";
import React, { Usable } from "react";

interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType;
}

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
  const { userId } = React.use<Params>(params);
  const tenantItems: MenuItem[] = [
    {
      title: "Home",
      url: `/tenant/${userId}/dashboard`,
      icon: Home,
    },
    {
      title: "My Requests",
      url: `/tenant/${userId}/request`,
      icon: Inbox,
    },
    {
      title: "My Contracts",
      url: `/tenant/${userId}/contracts`,
      icon: Paperclip,
    },
    {
      title: "Billing Statements",
      url: `/tenant/${userId}/billing`,
      icon: Receipt,
    },
    {
      title: "FAQ",
      url: "#",
      icon: MessageCircle,
    },
    {
      title: "Logout",
      url: "/logout",
      icon: LogOut
    }
  ];

  return (
    <div>
      <SidebarProvider>
        <AppSidebar menuItems={tenantItems} />
        <main className="mx-10 w-full">
          <SidebarTrigger />
          <div>{children}</div>
        </main>
      </SidebarProvider>
    </div>
  );
}

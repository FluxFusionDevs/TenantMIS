"use client";

import ChatBotComponent from "@/components/chatbotfaq";
import { AppSidebar } from "@/components/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabaseClient";
import {
  Home,
  Users,
  ClipboardList,
  Settings,
  FileText,
  ShoppingCart,
  LogOut,
} from "lucide-react";
import { tenantManagerFaqs } from "./constants/faqs";

interface MenuItem {
  title: string;
  url?: string;
  icon: React.ComponentType;
  action?: () => void;
}

export default function ManagerLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { managerId: string };
}) {
  const supabase = createClient();
  
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const managerItems: MenuItem[] = [
    {
      title: "Dashboard",
      url: `/tenantmanager/dashboard`,
      icon: Home,
    },
    {
      title: "Tenants",
      url: `/tenantmanager/tenants`,
      icon: Users,
    },
    {
      title: "Contracts",
      url: `/tenantmanager/contracts`,
      icon: ClipboardList,
    },
    {
      title: "Complaints",
      url: `/tenantmanager/complaints`,
      icon: FileText,
    },
    {
      title: "Purchase",
      url: `/tenantmanager/purchase`,
      icon: ShoppingCart,
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
        <AppSidebar menuItems={managerItems} />
        <main className="mx-10 w-full">
          <SidebarTrigger />
          <div>{children}</div>
          <ChatBotComponent flow={tenantManagerFaqs} />
        </main>
      </SidebarProvider>
    </div>
  );
}

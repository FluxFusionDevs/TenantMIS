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
import { procurementManagerFaqs } from "./constants/faqs";

interface MenuItem {
  title: string;
  url?: string;
  icon: React.ComponentType;
  action?: () => void;
}

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const procurementManagerItems: MenuItem[] = [
    {
      title: "Home",
      url: `/procurementmanager/dashboard`,
      icon: Home,
    },
    {
      title: "Procurement Requests",
      url: `/procurementmanager/procrequests`,
      icon: Users,
    },
    {
      title: "Workflow Status",
      url: `/procurementmanager/workstatus`,
      icon: ClipboardList,
    },
    {
      title: "Approval",
      url: `/procurementmanager/approval`,
      icon: FileText,
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
        <AppSidebar menuItems={procurementManagerItems} />
        <main className="mx-10 w-full">
          <SidebarTrigger />
          <div>{children}</div>
          <ChatBotComponent flow={procurementManagerFaqs} />
        </main>
      </SidebarProvider>
    </div>
  );
}

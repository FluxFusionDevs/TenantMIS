import { AppSidebar } from "@/components/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Home, Users, ClipboardList, Settings, FileText, ShoppingCart } from "lucide-react";
import ChatBot from "react-chatbotify";
import { procurementManagerFaqs } from "../constants/faqs";
import ChatBotComponent from "@/components/chatbotfaq";

interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType;
}

export default async function ManagerLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { procurementmanagerId: string };
}) {
  const { procurementmanagerId } = await params; // Correctly destructure params without `await`

  const procurementManagerItems: MenuItem[] = [
    {
      title: "Home",
      url: `/procurementmanager/${procurementmanagerId}/dashboard`,
      icon: Home,
    },
    {
      title: "Procurement Requests",
      url: `/procurementmanager/${procurementmanagerId}/tenants`,
      icon: Users,
    },
    {
      title: "Workflow Status",
      url: `/procurementmanager/${procurementmanagerId}/contracts`,
      icon: ClipboardList,
    },
    {
      title: "Approval",
      url: `/procurementmanager/${procurementmanagerId}/complaints`,
      icon: FileText,
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

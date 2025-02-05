import { AppSidebar } from "@/components/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Home, Users, ClipboardList, Settings, FileText, ShoppingCart } from "lucide-react";

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
  params: { managerId: string };
}) {
  const { managerId } = await params; // Correctly destructure params without `await`

  const managerItems: MenuItem[] = [
    {
      title: "Dashboard",
      url: `/tenantmanager/${managerId}/dashboard`,
      icon: Home,
    },
    {
      title: "Tenants",
      url: `/tenantmanager/${managerId}/tenants`,
      icon: Users,
    },
    {
      title: "Contracts",
      url: `/tenantmanager/${managerId}/contracts`,
      icon: ClipboardList,
    },
    {
      title: "Complaints",
      url: `/tenantmanager/${managerId}/complaints`,
      icon: FileText,
    },
    {
      title: "Purchase",
      url: `/tenantmanager/${managerId}/purchase`,
      icon: ShoppingCart,
    },
  ];

  return (
    <div>
      <SidebarProvider>
        <AppSidebar menuItems={managerItems} />
        <main className="mx-10 w-full">
          <SidebarTrigger />
          <div>{children}</div>
        </main>
      </SidebarProvider>
    </div>
  );
}

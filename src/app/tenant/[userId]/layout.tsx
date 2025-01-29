import { AppSidebar } from "@/components/sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Home, Inbox, Paperclip, Receipt, MessageCircle } from "lucide-react"

interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType;
}

export default async function HomeLayout(
  props: {
    children: React.ReactNode;
    params: Promise<{ userId: string }>;
  }
) {
  const params = await props.params;

  const {
    children
  } = props;

  const tenantItems: MenuItem[] = [
    {
      title: "Home",
      url: `/tenant/${params.userId}/dashboard`,
      icon: Home,
    },
    {
      title: "My Requests",
      url: `/tenant/${params.userId}/request`,
      icon: Inbox,
    },
    {
      title: "My Contracts",
      url: `/tenant/${params.userId}/contracts`,
      icon: Paperclip,
    },
    {
      title: "Billing Statements",
      url: `/tenant/${params.userId}/billing`,
      icon: Receipt,
    },
    {
      title: "FAQ",
      url: "#",
      icon: MessageCircle,
    },
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
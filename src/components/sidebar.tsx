import { Home, Inbox, PaperclipIcon, ReceiptIcon, MessageCircleIcon } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"

// Menu items.
const tenantItems = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "My Requests",
    url: "#",
    icon: Inbox,
  },
  {
    title: "My Contracts",
    url: "#",
    icon: PaperclipIcon
  },
  {
    title: "Billing Statements",
    url: "#",
    icon: ReceiptIcon
  },
  {
    title: "FAQ",
    url: "#",
    icon: MessageCircleIcon
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tenantItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size={"lg"}>
                    <a href={item.url} className="flex items-center space-x-2">
                      <item.icon></item.icon>
                      <span className="text-lg">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Other</SidebarGroupLabel>
          <SidebarGroupContent>
            {/* Add other sidebar groups or items here if needed */}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
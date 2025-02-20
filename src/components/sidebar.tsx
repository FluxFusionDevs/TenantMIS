"use client";

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
} from "@/components/ui/sidebar";
import { MenuItem } from "@/models/sidebar-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function AppSidebar({
  menuItems,
  otherItems,
}: {
  menuItems: MenuItem[];
  otherItems?: MenuItem[];
}) {
  const router = useRouter();
  const handleClick = (itemUrl: string) => {
    router.push(itemUrl);
  };
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size={"lg"}>
                  {item.url ? (
                      <Link prefetch={true}
                        href={item.url}
                        className="flex items-center space-x-2"
                      >
                        <item.icon />
                        <span className="text-lg">{item.title}</span>
                      </Link>
                    ) : (
                      <button
                        onClick={item.action}
                        className="flex items-center space-x-2"
                      >
                        <item.icon />
                        <span className="text-lg">{item.title}</span>
                      </button>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Other</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {otherItems?.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size={"lg"}>
                    <button
                      onClick={() => item.url ? handleClick(item.url): item.action && item.action() }
                      className="flex items-center space-x-2"
                    >
                      <item.icon />
                      <span className="text-lg">{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

import { AppSidebar } from "@/components/sidebar"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function HomeLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { userId: string }
}) {
  return (
    <div>
    <SidebarProvider>
    <AppSidebar />
      <main>
        <SidebarTrigger />
        <div className="mx-10">
        {children}
        </div>
      </main>
    </SidebarProvider>
    </div>
  )
}
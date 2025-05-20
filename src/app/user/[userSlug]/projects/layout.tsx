import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app_components/app_sidebar/app_sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="min-h-screen bg-global-gradient-1">
      <AppSidebar />
      <main className="w-full">
        <SidebarTrigger className="text-white mt-2 border-none"/>
        <div className="h-screen flex justify-center items-center">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}

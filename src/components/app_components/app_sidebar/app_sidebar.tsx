"use client";

import { Code, Group, Home } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useFirebaseStore } from "@/store/firebase_firestore";

// Menu items.

export function AppSidebar() {
  const { user, user_loading } = useFirebaseStore();

  const items = [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Projects",
      url: `/user/${user?.slug}/projects`,
      icon: Code,
    },
    {
      title: "Collaborations",
      url: `/user/${user?.slug}/collaborations`,
      icon: Group,
    },
  ];

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarContent className="bg-gray-700 relative border-none outline-none rounded-lg">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="text-white">
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarFooter className="absolute bottom-0 left-2">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.avatar || user?.photoURL} />
          </Avatar>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}

import { useState } from "react"
import { 
  Home, 
  Library, 
  Package, 
  PlusCircle, 
  HelpCircle,
  BookOpen,
  Phone,
  Settings,
  User,
  Heart,
  CreditCard,
  Shield,
  Bell,
  Zap,
  Wand2,
  Bot,
  Palette
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

const mainItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Prompt Library", url: "/library", icon: Library },
  { title: "Prompt Packs", url: "/packs", icon: Package },
  { title: "Submit Prompt", url: "/submit-prompt", icon: PlusCircle },
  { title: "Blog & Tips", url: "/tips", icon: BookOpen },
]

const aiItems = [
  { title: "AI Prompt Generator", url: "/ai/generator", icon: Wand2 },
  { title: "AI Assistant", url: "/ai/assistant", icon: Bot },
  { title: "Prompt Studio", url: "/ai/studio", icon: Palette },
  { title: "Scout Toolkit", url: "/scout", icon: Zap },
]

const accountItems = [
  { title: "Account Overview", url: "/account", icon: User },
  { title: "AI Preferences", url: "/account/ai-preferences", icon: Settings },
  { title: "Favorites", url: "/account/favorites", icon: Heart },
  { title: "Purchases", url: "/account/purchases", icon: CreditCard },
  { title: "Profile Settings", url: "/account/profile", icon: User },
  { title: "Notifications", url: "/account/notifications", icon: Bell },
  { title: "Security", url: "/account/security", icon: Shield },
]

const supportItems = [
  { title: "How It Works", url: "/how-it-works", icon: HelpCircle },
  { title: "FAQs", url: "/faqs", icon: HelpCircle },
  { title: "Contact", url: "/contact", icon: Phone },
]

export function AppSidebar() {
  const { state, isMobile } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const isCollapsed = state === "collapsed"

  // Don't render sidebar content until mobile detection is stable
  if (isMobile === null) {
    return null;
  }

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/"
    }
    return currentPath.startsWith(path)
  }

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" : "hover:bg-muted/50"

  return (
    <Sidebar
      collapsible="icon"
    >
      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"} 
                      className={({ isActive: linkActive }) => getNavCls({ isActive: linkActive })}
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* AI Tools */}
        <SidebarGroup>
          <SidebarGroupLabel>AI Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {aiItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive: linkActive }) => getNavCls({ isActive: linkActive })}
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account */}
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive: linkActive }) => getNavCls({ isActive: linkActive })}
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Support */}
        <SidebarGroup>
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {supportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive: linkActive }) => getNavCls({ isActive: linkActive })}
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
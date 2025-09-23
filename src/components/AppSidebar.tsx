import { 
  Home, 
  Library, 
  Package, 
  HelpCircle,
  BookOpen,
  Settings,
  User,
  Heart,
  CreditCard,
  Bell,
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
  { title: "Articles & Tips", url: "/tips", icon: BookOpen },
]

const aiItems = [
  { title: "Prompt Studio", url: "/ai/studio", icon: Palette },
  { title: "AI Prompt Generator", url: "/ai/generator", icon: Wand2 },
  { title: "AI Assistant", url: "/ai/assistant", icon: Bot },
]

const accountItems = [
  { title: "Account Overview", url: "/account", icon: User },
  { title: "AI Preferences", url: "/account/ai-preferences", icon: Settings },
  { title: "Favorites", url: "/account/favorites", icon: Heart },
  { title: "Purchases", url: "/account/purchases", icon: CreditCard },
  { title: "Profile Settings", url: "/account/profile", icon: User },
  { title: "Notifications", url: "/account/notifications", icon: Bell },
]

const supportItems = [
  { title: "How It Works", url: "/how-it-works", icon: HelpCircle },
  { title: "FAQs", url: "/faqs", icon: HelpCircle },
]

export function AppSidebar() {
  const { state, isMobile } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  // On mobile offcanvas mode, always show text. Only hide on desktop when collapsed
  const showText = isMobile || state !== "collapsed"

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
      collapsible="offcanvas"
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
                      {showText && <span className="text-sm">{item.title}</span>}
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
                      {showText && <span className="text-sm">{item.title}</span>}
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
                      {showText && <span className="text-sm">{item.title}</span>}
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
                      {showText && <span className="text-sm">{item.title}</span>}
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
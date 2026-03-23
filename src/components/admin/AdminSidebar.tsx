import { LayoutDashboard, FileText, Film, BookOpen, Users, LogOut, Home, Settings } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Tableau de bord", url: "/admin", icon: LayoutDashboard },
  { title: "Articles", url: "/admin/articles", icon: FileText },
  { title: "Médias", url: "/admin/medias", icon: Film },
  { title: "Livres", url: "/admin/livres", icon: BookOpen },
  { title: "Utilisateurs", url: "/admin/utilisateurs", icon: Users },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/connexion");
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-sidebar-foreground/50">
            {!collapsed && "Administration"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/admin"}
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2 space-y-1">
        <SidebarMenuButton asChild>
          <a href="/" className="flex items-center gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-md px-2 py-2 text-sm">
            <Home className="h-4 w-4" />
            {!collapsed && <span>Retour au site</span>}
          </a>
        </SidebarMenuButton>
        <SidebarMenuButton
          onClick={handleLogout}
          className="flex items-center gap-2 text-destructive hover:bg-destructive/10 rounded-md px-2 py-2 text-sm cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Déconnexion</span>}
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}

import { Link, useRouterState } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { NAV_ITEMS } from "@/constants/nav";
import { LogOut, Building2 } from "lucide-react";
import { logout } from "@/services/auth";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { enquiryService } from "@/services";
import { toast } from "sonner";
import logo from "@/assets/logoyr.png";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const navigate = useNavigate();

  // Live count of unactioned enquiries — shares the cache with the Enquiries page
  const { data: enquiries } = useQuery({
    queryKey: ["enquiries"],
    queryFn: enquiryService.list,
    refetchInterval: 60_000,
  });
  const newEnquiries = (enquiries ?? []).filter((e) => e.status === "New").length;

  const handleLogout = () => {
    logout();
    toast.success("Signed out");
    navigate({ to: "/login" });
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="border-b border-sidebar-border/50 py-4">
        <Link to="/dashboard" className="flex items-center gap-3 px-2">
  <img
    src={logo}
    alt="YR Reality Logo"
    className="h-12 w-auto object-contain shrink-0"
  />

  {!collapsed && (
    <div className="flex flex-col leading-tight">
      <h1 className="text-lg font-bold text-[#ffffff]">
        YR Reality
      </h1>

      <p className="text-[10px] uppercase tracking-widest text-sidebar-foreground/60">
        Admin Panel
      </p>
    </div>
  )}
</Link>
      </SidebarHeader>

      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => {
                const active =
                  pathname === item.to || pathname.startsWith(item.to + "/");
                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                      className="data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:before:absolute data-[active=true]:before:left-0 data-[active=true]:before:top-1/2 data-[active=true]:before:-translate-y-1/2 data-[active=true]:before:h-6 data-[active=true]:before:w-0.5 data-[active=true]:before:rounded-r data-[active=true]:before:bg-gold relative"
                    >
                      <Link to={item.to} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && (
                          <>
                            <span className="flex-1 truncate">{item.title}</span>
                            {item.to === "/enquiries" && newEnquiries > 0 && (
                              <Badge className="bg-gold text-gold-foreground hover:bg-gold h-5 px-1.5 text-[10px]">
                                {newEnquiries}
                              </Badge>
                            )}
                          </>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Logout"
              className="text-sidebar-foreground/80 hover:text-sidebar-foreground"
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && <span>Logout</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Search, Plus, MessageSquare, CalendarCheck, ExternalLink, CheckCheck, Sparkles } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUser, logout } from "@/services/auth";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { NAV_ITEMS } from "@/constants/nav";
import { useMemo, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { enquiryService, visitService } from "@/services";
import { Badge } from "@/components/ui/badge";

export function TopBar() {
  const user = getUser();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const current = useMemo(
    () => NAV_ITEMS.find((n) => pathname === n.to || pathname.startsWith(n.to + "/")),
    [pathname],
  );

  // Real-time polling for user property enquiries & site visits
  const { data: enquiries = [] } = useQuery({
    queryKey: ["enquiries"],
    queryFn: enquiryService.list,
    refetchInterval: 10000, // Poll every 10s for new user submissions
  });

  const { data: visits = [] } = useQuery({
    queryKey: ["site-visits"],
    queryFn: visitService.list,
    refetchInterval: 10000,
  });

  // Play pleasant 2-tone notification sound via Web Audio API
  const playNotificationSound = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Tone 1: A5 (880Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(880, ctx.currentTime);
      gain1.gain.setValueAtTime(0.12, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.25);

      // Tone 2: D6 (1174.66Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.1);
      gain2.gain.setValueAtTime(0.18, ctx.currentTime + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.1);
      osc2.stop(ctx.currentTime + 0.45);
    } catch {
      // Audio playback fails silently if browser policy blocks autoplay before interaction
    }
  };

  // Track notified items to trigger real-time toast popups
  const seenIdsRef = useRef<Set<string>>(new Set());
  const isFirstRender = useRef(true);

  useEffect(() => {
    const allItems = [
      ...enquiries.map((e) => ({ id: `enq-${e.id}`, name: e.name, title: e.propertyTitle || "Property Request", type: "enquiry" })),
      ...visits.map((v) => ({ id: `vis-${v.id}`, name: v.name, title: v.propertyTitle || "Site Visit Request", type: "visit" })),
    ];

    if (isFirstRender.current) {
      allItems.forEach((item) => seenIdsRef.current.add(item.id));
      isFirstRender.current = false;
      return;
    }

    let shouldPlaySound = false;
    allItems.forEach((item) => {
      if (!seenIdsRef.current.has(item.id)) {
        seenIdsRef.current.add(item.id);
        shouldPlaySound = true;
        toast.info(
          `🔔 New ${item.type === "enquiry" ? "Property Enquiry" : "Site Visit Request"}`,
          {
            description: `${item.name} requested: "${item.title}"`,
            action: {
              label: "View",
              onClick: () => navigate({ to: item.type === "enquiry" ? "/enquiries" : "/site-visits" }),
            },
            duration: 7000,
          }
        );
      }
    });

    if (shouldPlaySound) {
      playNotificationSound();
    }
  }, [enquiries, visits, navigate]);

  const newEnquiries = useMemo(() => enquiries.filter((e) => e.status === "New"), [enquiries]);
  const newVisits = useMemo(() => visits.filter((v) => v.status === "Pending" || v.status === "Approved"), [visits]);

  const notificationsList = useMemo(() => {
    const enqItems = newEnquiries.map((e) => ({
      id: e.id,
      name: e.name,
      phone: e.phone,
      propertyTitle: e.propertyTitle || "Requested Property Details",
      time: e.createdAt,
      type: "enquiry" as const,
      to: "/enquiries",
    }));

    const visItems = newVisits.map((v) => ({
      id: v.id,
      name: v.name,
      phone: v.phone,
      propertyTitle: v.propertyTitle || "Site Visit Request",
      time: v.date || v.createdAt || "",
      type: "visit" as const,
      to: "/site-visits",
    }));

    return [...enqItems, ...visItems].slice(0, 8);
  }, [newEnquiries, newVisits]);

  const unreadCount = newEnquiries.length + newVisits.length;

  const handleLogout = () => {
    logout();
    toast.success("Signed out");
    navigate({ to: "/login" });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-md md:px-6">
      <SidebarTrigger className="text-foreground" />
      <div className="hidden md:flex flex-col min-w-0">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          YR realty Admin
        </span>
        <span className="font-display text-base leading-none text-foreground truncate">
          {current?.title ?? "Overview"}
        </span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search properties, enquiries…"
            className="h-9 w-64 bg-secondary border-transparent pl-9 focus-visible:bg-card"
          />
        </div>

        <Button asChild size="sm" className="hidden sm:inline-flex bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link to="/properties/new">
            <Plus className="h-4 w-4" /> Add Property
          </Link>
        </Button>

        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white animate-pulse">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-80 sm:w-96 p-0 overflow-hidden shadow-xl">
            <div className="flex items-center justify-between p-3.5 bg-secondary/40 border-b border-border">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                <span className="font-display font-semibold text-sm">User Notifications</span>
              </div>
              {unreadCount > 0 ? (
                <Badge className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-0.5">
                  {unreadCount} New
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs text-muted-foreground font-normal">
                  All Read
                </Badge>
              )}
            </div>

            <div className="max-h-[340px] overflow-y-auto divide-y divide-border/60">
              {notificationsList.length > 0 ? (
                notificationsList.map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    asChild
                    className="p-3.5 flex items-start gap-3 cursor-pointer hover:bg-secondary/60 focus:bg-secondary/60 transition-colors"
                  >
                    <Link to={item.to}>
                      <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                        {item.type === "enquiry" ? (
                          <MessageSquare className="h-4.5 w-4.5" />
                        ) : (
                          <CalendarCheck className="h-4.5 w-4.5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="text-xs font-bold text-foreground truncate">{item.name}</span>
                          <span className="text-[10px] text-muted-foreground shrink-0">
                            {item.type === "enquiry" ? "Enquiry" : "Site Visit"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          Requested: <strong className="text-foreground">{item.propertyTitle}</strong>
                        </p>
                        {item.phone && (
                          <p className="text-[11px] text-primary/90 mt-0.5">📞 {item.phone}</p>
                        )}
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground text-xs space-y-2">
                  <CheckCheck className="h-8 w-8 mx-auto text-muted-foreground/40" />
                  <p>No new user property requests right now.</p>
                </div>
              )}
            </div>

            <div className="p-2 border-t border-border bg-secondary/20 flex gap-2">
              <Button asChild variant="ghost" size="sm" className="w-full text-xs">
                <Link to="/enquiries">
                  <MessageSquare className="h-3.5 w-3.5 mr-1.5" /> View All Enquiries
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm" className="w-full text-xs">
                <Link to="/site-visits">
                  <CalendarCheck className="h-3.5 w-3.5 mr-1.5" /> View Site Visits
                </Link>
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-secondary transition-colors">
              <Avatar className="h-8 w-8 ring-2 ring-primary/10">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                  {user?.name?.slice(0, 2).toUpperCase() ?? "AD"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline text-sm font-medium capitalize">
                {user?.name ?? "Admin"}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col">
                <span className="text-sm font-medium capitalize">{user?.name ?? "Admin"}</span>
                <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link to="/profile">Profile</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link to="/settings">Settings</Link></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

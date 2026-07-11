import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  Building2, CheckCircle2, TrendingUp, MessageSquare, Calendar,
  Tag, Layers, ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell,
  Pie, PieChart, ResponsiveContainer, Tooltip as ReTooltip, XAxis, YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { formatINR } from "@/constants/nav";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Route = createFileRoute("/_admin/dashboard")({
  component: DashboardPage,
});

const statusBadge: Record<string, string> = {
  New: "bg-info/15 text-info",
  "In Progress": "bg-gold/20 text-gold-foreground",
  Resolved: "bg-success/15 text-success",
  Closed: "bg-muted text-muted-foreground",
  Available: "bg-success/15 text-success",
  Sold: "bg-muted text-muted-foreground",
  Upcoming: "bg-info/15 text-info",
  Pending: "bg-warning/20 text-warning-foreground",
  Approved: "bg-info/15 text-info",
  Completed: "bg-success/15 text-success",
  Cancelled: "bg-destructive/15 text-destructive",
};

function DashboardPage() {
  const { data: stats } = useQuery({ queryKey: ["dash", "stats"], queryFn: dashboardService.stats });
  const { data: monthly } = useQuery({ queryKey: ["dash", "monthly"], queryFn: dashboardService.monthly });
  const { data: revenue } = useQuery({ queryKey: ["dash", "revenue"], queryFn: dashboardService.revenue });
  const { data: latestE } = useQuery({ queryKey: ["dash", "enq"], queryFn: dashboardService.latestEnquiries });
  const { data: latestP } = useQuery({ queryKey: ["dash", "prop"], queryFn: dashboardService.latestProperties });
  const { data: visitors } = useQuery({ queryKey: ["dash", "vis"], queryFn: dashboardService.recentVisitors });
  const { data: dist } = useQuery({ queryKey: ["dash", "dist"], queryFn: dashboardService.categoryDistribution });

  const chartColors = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Snapshot of your portfolio, enquiries and visits."
        actions={
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link to="/properties/new">Add Property</Link>
          </Button>
        }
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats ? (
          <>
            <StatCard index={0} label="Total Properties" value={stats.totalProperties} icon={Building2} delta={12} hint="vs last month" tone="default" />
            <StatCard index={1} label="Available" value={stats.available} icon={CheckCircle2} delta={5} hint="live" tone="green" />
            <StatCard index={2} label="Sold" value={stats.sold} icon={TrendingUp} delta={8} hint="this quarter" tone="gold" />
            <StatCard index={3} label="Pending Enquiries" value={stats.pendingEnquiries} icon={MessageSquare} delta={-3} hint="to action" tone="info" />
            <StatCard index={4} label="Today's Enquiries" value={stats.todaysEnquiries} icon={MessageSquare} delta={22} tone="info" />
            <StatCard index={5} label="Total Site Visits" value={stats.totalVisits} icon={Calendar} delta={4} tone="default" />
            <StatCard index={6} label="Offers Running" value={stats.offersRunning} icon={Tag} tone="gold" />
            <StatCard index={7} label="Total Categories" value={stats.totalCategories} icon={Layers} tone="default" />
          </>
        ) : (
          Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)
        )}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="card-elevated lg:col-span-2">
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="font-display">Monthly Site Visits & Enquiries</CardTitle>
              <CardDescription>Lead trend across the last 12 months</CardDescription>
            </div>
            <Badge variant="outline" className="border-gold/50 text-gold-foreground bg-gold/10">Last 12M</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <AreaChart data={monthly ?? []} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
                  <defs>
                    <linearGradient id="views" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="enq" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="var(--color-border)" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                  <ReTooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="views" stroke="var(--color-chart-1)" strokeWidth={2} fill="url(#views)" />
                  <Area type="monotone" dataKey="enquiries" stroke="var(--color-chart-2)" strokeWidth={2} fill="url(#enq)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="font-display">Category Distribution</CardTitle>
            <CardDescription>Portfolio composition</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-56 w-full">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={dist ?? []} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                    {(dist ?? []).map((_, i) => (
                      <Cell key={i} fill={chartColors[i % chartColors.length]} />
                    ))}
                  </Pie>
                  <ReTooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-1.5">
              {(dist ?? []).slice(0, 6).map((d, i) => (
                <div key={d.name} className="flex items-center gap-1.5 text-xs">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ background: chartColors[i % chartColors.length] }} />
                  <span className="text-muted-foreground truncate">{d.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="card-elevated lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-display">Revenue Trend</CardTitle>
            <CardDescription>Sold property value (₹ Cr) by month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-56 w-full">
              <ResponsiveContainer>
                <BarChart data={revenue ?? []} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="var(--color-border)" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                  <ReTooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="revenue" fill="var(--color-gold)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="font-display">Recent Visitors</CardTitle>
            <Button asChild size="sm" variant="ghost" className="text-xs h-7 -mr-2">
              <Link to="/site-visits">View <ArrowRight className="h-3 w-3" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {(visitors ?? []).map((v) => (
              <div key={v.id} className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                    {v.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{v.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{v.propertyTitle}</div>
                </div>
                <Badge className={statusBadge[v.status] + " border-transparent text-[10px]"}>{v.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Activity tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="card-elevated">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="font-display">Latest Enquiries</CardTitle>
              <CardDescription>Fresh from your website forms</CardDescription>
            </div>
            <Button asChild size="sm" variant="ghost"><Link to="/enquiries">All</Link></Button>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            {(latestE ?? []).map((e) => (
              <div key={e.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-gold/15 text-gold-foreground text-xs">
                    {e.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">{e.name}</span>
                    <Badge className={statusBadge[e.status] + " border-transparent text-[10px]"}>{e.status}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{e.propertyTitle} · {e.budget}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="font-display">Latest Properties</CardTitle>
              <CardDescription>Recently added listings</CardDescription>
            </div>
            <Button asChild size="sm" variant="ghost"><Link to="/properties">All</Link></Button>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            {(latestP ?? []).map((p) => (
              <div key={p.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <img src={p.thumbnail} alt={p.title} loading="lazy" className="h-12 w-16 rounded-md object-cover shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{p.title}</div>
                  <div className="text-xs text-muted-foreground truncate">{p.category} · {p.location}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-semibold text-foreground">{formatINR(p.price)}</div>
                  <Badge className={statusBadge[p.status] + " border-transparent text-[10px]"}>{p.status}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="card-elevated lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-display">Recent Activities</CardTitle>
            <CardDescription>Latest actions across the workspace</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="relative space-y-4 pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-border">
              {[
                ...(latestE ?? []).slice(0, 3).map((e) => ({
                  icon: MessageSquare,
                  text: `New enquiry from ${e.name}${e.propertyTitle !== "—" ? ` for ${e.propertyTitle}` : ""}`,
                  time: e.createdAt ? new Date(e.createdAt).toLocaleString() : "",
                  tone: "text-info",
                })),
                ...(visitors ?? []).slice(0, 2).map((v) => ({
                  icon: Calendar,
                  text: `Site visit requested by ${v.name} (${v.date} · ${v.time})`,
                  time: v.status,
                  tone: "text-primary",
                })),
              ].map((a, i) => (
                <li key={i} className="relative">
                  <span className={`absolute -left-6 top-0.5 grid h-4 w-4 place-items-center rounded-full bg-background ring-2 ring-border ${a.tone}`}>
                    <a.icon className="h-2.5 w-2.5" />
                  </span>
                  <div className="text-sm text-foreground">{a.text}</div>
                  <div className="text-xs text-muted-foreground">{a.time}</div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

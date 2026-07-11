import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { customerService } from "@/services";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";

export const Route = createFileRoute("/_admin/customers")({ component: CustomersPage });

const badge: Record<string, string> = {
  Lead: "bg-info/15 text-info border-transparent",
  Active: "bg-primary/15 text-primary border-transparent",
  Converted: "bg-success/15 text-success border-transparent",
  Inactive: "bg-muted text-muted-foreground border-transparent",
};

function CustomersPage() {
  const { data = [] } = useQuery({ queryKey: ["customers"], queryFn: customerService.list });
  return (
    <div className="space-y-6">
      <PageHeader title="Customers" description="Every person who has ever engaged with your listings." breadcrumbs={[{ label: "Customers" }]} />
      <Card className="card-elevated">
        <CardContent className="p-4 md:p-5">
          <div className="rounded-lg border border-border overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary/60">
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Interested In</TableHead>
                  <TableHead className="hidden sm:table-cell">Visits</TableHead>
                  <TableHead className="hidden lg:table-cell">Last Contact</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map(c => (
                  <TableRow key={c.id} className="hover:bg-secondary/40">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9"><AvatarFallback className="bg-primary/10 text-primary text-xs">{c.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</AvatarFallback></Avatar>
                        <div>
                          <div className="font-medium text-sm">{c.name}</div>
                          <div className="text-xs text-muted-foreground">{c.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground max-w-xs truncate">{c.interestedProperties.join(", ")}</TableCell>
                    <TableCell className="hidden sm:table-cell text-sm">{c.siteVisits}</TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{format(new Date(c.lastContactAt), "dd MMM yyyy")}</TableCell>
                    <TableCell><Badge className={badge[c.status]}>{c.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

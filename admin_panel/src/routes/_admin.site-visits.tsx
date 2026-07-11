import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { visitService, VISIT_STATUSES } from "@/services";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CalendarCheck, Phone, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_admin/site-visits")({ component: SiteVisitsPage });

const badge: Record<string, string> = {
  Pending: "bg-warning/20 text-warning-foreground border-transparent",
  Approved: "bg-info/15 text-info border-transparent",
  Completed: "bg-success/15 text-success border-transparent",
  Cancelled: "bg-destructive/15 text-destructive border-transparent",
};

function SiteVisitsPage() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: ["visits"], queryFn: visitService.list });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["visits"] });
    qc.invalidateQueries({ queryKey: ["dash"] });
  };

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => visitService.updateStatus(id, status),
    onSuccess: () => { toast.success("Visit status updated"); invalidate(); },
    onError: (e) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => visitService.remove(id),
    onSuccess: () => { toast.success("Visit request deleted"); invalidate(); },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Site Visit Requests"
        description="Approve, track and complete site visit bookings from the website."
        breadcrumbs={[{ label: "Site Visits" }]}
      />
      <Card className="card-elevated">
        <CardContent className="p-4 md:p-5">
          <div className="rounded-lg border border-border overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary/60">
                <TableRow>
                  <TableHead>Visitor</TableHead>
                  <TableHead className="hidden md:table-cell">Property / Location</TableHead>
                  <TableHead>When</TableHead>
                  <TableHead className="hidden lg:table-cell">Notes</TableHead>
                  <TableHead className="w-44">Status</TableHead>
                  <TableHead className="w-24"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow><TableCell colSpan={6} className="text-center py-12 text-sm text-muted-foreground">Loading site visits…</TableCell></TableRow>
                )}
                {!isLoading && data.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center py-12 text-sm text-muted-foreground">No site visit requests yet — bookings from the website will appear here.</TableCell></TableRow>
                )}
                {data.map(v => (
                  <TableRow key={v.id} className="hover:bg-secondary/40">
                    <TableCell>
                      <div className="font-medium text-sm">{v.name}</div>
                      <div className="text-xs text-muted-foreground">{v.phone}{v.email ? ` · ${v.email}` : ""}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm">
                      <div>{v.propertyTitle}</div>
                      {v.location && <div className="text-xs text-muted-foreground">{v.location}</div>}
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-1.5"><CalendarCheck className="h-3.5 w-3.5 text-primary" />{v.date} · {v.time}</div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground max-w-48 truncate" title={v.notes}>{v.notes || "—"}</TableCell>
                    <TableCell>
                      <Select
                        value={v.status}
                        onValueChange={(label) => {
                          const status = VISIT_STATUSES.find(s => s.label === label)?.value;
                          if (status) statusMutation.mutate({ id: v.id, status });
                        }}
                      >
                        <SelectTrigger className="h-8 w-36 border-transparent bg-transparent px-1.5">
                          <Badge className={badge[v.status]}>{v.status}</Badge>
                        </SelectTrigger>
                        <SelectContent>
                          {VISIT_STATUSES.map(s => <SelectItem key={s.value} value={s.label}>{s.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button asChild size="icon" variant="ghost" className="h-8 w-8">
                          <a href={`tel:${v.phone}`} aria-label="Call"><Phone className="h-3.5 w-3.5" /></a>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete visit request?</AlertDialogTitle>
                              <AlertDialogDescription>This will permanently remove the site visit request from {v.name}.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteMutation.mutate(v.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
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

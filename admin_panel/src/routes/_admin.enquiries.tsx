import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enquiryService, ENQUIRY_STATUSES } from "@/services";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Download, Search, Phone, Mail, Trash2, Eye } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import type { Enquiry } from "@/types";

export const Route = createFileRoute("/_admin/enquiries")({ component: EnquiriesPage });

const badge: Record<string, string> = {
  New: "bg-info/15 text-info border-transparent",
  "In Progress": "bg-gold/20 text-gold-foreground border-transparent",
  Resolved: "bg-success/15 text-success border-transparent",
  Closed: "bg-muted text-muted-foreground border-transparent",
};

function exportCsv(rows: Enquiry[]) {
  const header = ["Name", "Phone", "Email", "Budget", "Location", "Property", "Message", "Source", "Status", "Date"];
  const esc = (v: string) => `"${(v ?? "").replace(/"/g, '""')}"`;
  const lines = rows.map((e) =>
    [e.name, e.phone, e.email, e.budget, e.location, e.propertyTitle, e.message, e.source, e.status, e.createdAt]
      .map((v) => esc(String(v ?? "")))
      .join(","),
  );
  const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function sourceLabel(source?: string) {
  if (!source) return "Website form";
  if (source === "whatsapp-click") return "WhatsApp click";
  if (source === "call-click") return "Call click";
  return source;
}

function EnquiriesPage() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: ["enquiries"], queryFn: enquiryService.list });
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedEnquiryId, setSelectedEnquiryId] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { data: selectedEnquiry, isFetching: isLoadingDetails } = useQuery({
    queryKey: ["enquiry", selectedEnquiryId],
    queryFn: () => (selectedEnquiryId ? enquiryService.getById(selectedEnquiryId) : Promise.resolve(null)),
    enabled: Boolean(selectedEnquiryId),
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["enquiries"] });
    qc.invalidateQueries({ queryKey: ["dash"] });
  };

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => enquiryService.updateStatus(id, status),
    onSuccess: () => { toast.success("Status updated"); invalidate(); },
    onError: (e) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => enquiryService.remove(id),
    onSuccess: () => { toast.success("Enquiry deleted"); invalidate(); },
    onError: (e) => toast.error(e.message),
  });

  const rows = useMemo(() => {
    let r = data;
    if (q) r = r.filter(e =>
      e.name.toLowerCase().includes(q.toLowerCase()) ||
      e.email.toLowerCase().includes(q.toLowerCase()) ||
      e.phone.includes(q));
    if (statusFilter !== "all") r = r.filter(e => e.status === statusFilter);
    return r;
  }, [data, q, statusFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        description="Every website enquiry and direct contact activity is tracked here."
        breadcrumbs={[{ label: "Enquiries" }]}
        actions={
          <Button variant="outline" onClick={() => { exportCsv(rows); toast.success("CSV exported"); }}>
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        }
      />
      <Card className="card-elevated">
        <CardContent className="p-4 md:p-5 space-y-4">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, email or phone" className="pl-9 bg-secondary border-transparent" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-44"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {ENQUIRY_STATUSES.map(s => <SelectItem key={s.value} value={s.label}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-lg border border-border overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary/60">
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Property</TableHead>
                  <TableHead className="hidden lg:table-cell">Budget</TableHead>
                  <TableHead className="hidden lg:table-cell">Message</TableHead>
                  <TableHead className="hidden xl:table-cell">Received</TableHead>
                  <TableHead className="w-44">Status</TableHead>
                  <TableHead className="w-28"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow><TableCell colSpan={7} className="text-center py-12 text-sm text-muted-foreground">Loading enquiries…</TableCell></TableRow>
                )}
                {!isLoading && rows.length === 0 && (
                  <TableRow><TableCell colSpan={7} className="text-center py-12 text-sm text-muted-foreground">No enquiries yet — leads submitted on the website will appear here.</TableCell></TableRow>
                )}
                {rows.map(e => (
                  <TableRow key={e.id} className="hover:bg-secondary/40">
                    <TableCell>
                      <div className="font-medium text-sm flex items-center gap-1.5">
                        {e.name}
                        {e.source === "whatsapp-click" && (
                          <Badge className="bg-success/15 text-success border-transparent">WhatsApp</Badge>
                        )}
                        {e.source === "call-click" && (
                          <Badge className="bg-info/15 text-info border-transparent">Call</Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{e.email || "—"} · {e.phone}</div>
                      {e.location && <div className="text-xs text-muted-foreground">Prefers: {e.location}</div>}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{e.propertyTitle}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm">{e.budget}</TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground max-w-56 truncate" title={e.message}>{e.message || "—"}</TableCell>
                    <TableCell className="hidden xl:table-cell text-xs text-muted-foreground">
                      {e.createdAt ? format(new Date(e.createdAt), "dd MMM yyyy, HH:mm") : "—"}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={e.status}
                        onValueChange={(label) => {
                          const status = ENQUIRY_STATUSES.find(s => s.label === label)?.value;
                          if (status) statusMutation.mutate({ id: e.id, status });
                        }}
                      >
                        <SelectTrigger className="h-8 w-40 border-transparent bg-transparent px-1.5">
                          <Badge className={badge[e.status]}>{e.status}</Badge>
                        </SelectTrigger>
                        <SelectContent>
                          {ENQUIRY_STATUSES.map(s => <SelectItem key={s.value} value={s.label}>{s.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Dialog open={detailsOpen && selectedEnquiryId === e.id} onOpenChange={(open) => {
                          setDetailsOpen(open);
                          if (!open) setSelectedEnquiryId(null);
                        }}>
                          <DialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              aria-label={`View details for ${e.name}`}
                              onClick={() => {
                                setSelectedEnquiryId(e.id);
                                setDetailsOpen(true);
                              }}
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Lead details</DialogTitle>
                              <DialogDescription>Full information captured for this lead.</DialogDescription>
                            </DialogHeader>
                            {isLoadingDetails && selectedEnquiryId === e.id ? (
                              <div className="text-sm text-muted-foreground">Loading lead details…</div>
                            ) : (
                              <div className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                  <div className="rounded-lg border p-3">
                                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Name</div>
                                    <div className="mt-1 font-medium">{selectedEnquiry?.name ?? e.name}</div>
                                  </div>
                                  <div className="rounded-lg border p-3">
                                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Contact</div>
                                    <div className="mt-1 font-medium">{selectedEnquiry?.phone ?? e.phone}</div>
                                    <div className="text-sm text-muted-foreground">{selectedEnquiry?.email || e.email || "No email provided"}</div>
                                  </div>
                                  <div className="rounded-lg border p-3">
                                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Property</div>
                                    <div className="mt-1 font-medium">{selectedEnquiry?.propertyTitle || e.propertyTitle || "—"}</div>
                                  </div>
                                  <div className="rounded-lg border p-3">
                                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Preferences</div>
                                    <div className="mt-1 font-medium">{selectedEnquiry?.location || e.location || "—"}</div>
                                    <div className="text-sm text-muted-foreground">Budget: {selectedEnquiry?.budget || e.budget || "—"}</div>
                                  </div>
                                </div>
                                <div className="rounded-lg border p-3">
                                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Message</div>
                                  <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{selectedEnquiry?.message || e.message || "No message provided."}</p>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-3 text-sm">
                                  <div>
                                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Source</div>
                                    <div className="mt-1 font-medium">{sourceLabel(selectedEnquiry?.source || e.source)}</div>
                                  </div>
                                  <div>
                                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Status</div>
                                    <div className="mt-1 font-medium">{selectedEnquiry?.status || e.status}</div>
                                  </div>
                                  <div>
                                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Received</div>
                                    <div className="mt-1 font-medium">{(selectedEnquiry?.createdAt || e.createdAt) ? format(new Date(selectedEnquiry?.createdAt || e.createdAt), "dd MMM yyyy, HH:mm") : "—"}</div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button asChild size="icon" variant="ghost" className="h-8 w-8">
                          <a href={`tel:${e.phone}`} aria-label="Call"><Phone className="h-3.5 w-3.5" /></a>
                        </Button>
                        <Button asChild size="icon" variant="ghost" className="h-8 w-8" disabled={!e.email}>
                          <a href={e.email ? `mailto:${e.email}` : undefined} aria-label="Email"><Mail className="h-3.5 w-3.5" /></a>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete enquiry?</AlertDialogTitle>
                              <AlertDialogDescription>This will permanently remove the enquiry from {e.name}.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteMutation.mutate(e.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
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

import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { propertyService } from "@/services";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";
import { Eye, MoreHorizontal, Pencil, Plus, Search, Trash2, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { formatINR } from "@/constants/nav";
import { toast } from "sonner";

export const Route = createFileRoute("/_admin/properties/")({
  component: PropertiesList,
});

const statusBadge: Record<string, string> = {
  Available: "bg-success/15 text-success border-transparent",
  Sold: "bg-muted text-muted-foreground border-transparent",
  Upcoming: "bg-info/15 text-info border-transparent",
  Published: "bg-success/15 text-success border-transparent",
  Unpublished: "bg-muted text-muted-foreground border-transparent",
  Archived: "bg-destructive/10 text-destructive border-transparent",
};

const PAGE_SIZE = 8;

function PropertiesList() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["properties"], queryFn: propertyService.list });

  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(() => {
    let rows = data ?? [];
    if (q) rows = rows.filter(p => p.title.toLowerCase().includes(q.toLowerCase()) || p.location.toLowerCase().includes(q.toLowerCase()));
    if (category !== "all") rows = rows.filter(p => p.category === category);
    if (status !== "all") rows = rows.filter(p => p.status === status);
    return rows;
  }, [data, q, category, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const allChecked = pageRows.length > 0 && pageRows.every(r => selected.includes(r.id));

  const toggleAll = () => setSelected(allChecked ? selected.filter(id => !pageRows.some(r => r.id === id)) : Array.from(new Set([...selected, ...pageRows.map(r => r.id)])));
  const toggleOne = (id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => propertyService.remove(id),
    onSuccess: () => {
      toast.success("Property deleted");
      qc.invalidateQueries({ queryKey: ["properties"] });
      qc.invalidateQueries({ queryKey: ["categories"] });
      qc.invalidateQueries({ queryKey: ["dash"] });
    },
    onError: (e) => toast.error(e.message),
  });

  const bulkDelete = async () => {
    try {
      await Promise.all(selected.map((id) => propertyService.remove(id)));
      toast.success(`${selected.length} property(ies) deleted`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Some deletions failed");
    }
    setSelected([]);
    qc.invalidateQueries({ queryKey: ["properties"] });
    qc.invalidateQueries({ queryKey: ["categories"] });
    qc.invalidateQueries({ queryKey: ["dash"] });
  };

  const categories = useMemo(() => Array.from(new Set((data ?? []).map(p => p.category))), [data]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Properties"
        description="Manage your entire portfolio — plots, villas, farm houses and flats."
        breadcrumbs={[{ label: "Properties" }]}
        actions={
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link to="/properties/new"><Plus className="h-4 w-4" /> Add Property</Link>
          </Button>
        }
      />

      <Card className="card-elevated">
        <CardContent className="p-4 md:p-5 space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search title or location" className="pl-9 bg-secondary border-transparent focus-visible:bg-card" />
            </div>
            <Select value={category} onValueChange={(v) => { setCategory(v); setPage(1); }}>
              <SelectTrigger className="w-full md:w-52"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
              <SelectTrigger className="w-full md:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Sold">Sold</SelectItem>
                <SelectItem value="Upcoming">Upcoming</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk actions */}
          {selected.length > 0 && (
            <div className="flex items-center gap-2 rounded-lg border border-dashed border-primary/30 bg-primary/5 px-3 py-2 text-sm">
              <span className="font-medium text-primary">{selected.length} selected</span>
              <div className="ml-auto flex gap-2">
                <Button size="sm" variant="destructive" onClick={bulkDelete}>Delete</Button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-secondary/60">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-10"><Checkbox checked={allChecked} onCheckedChange={toggleAll} /></TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="hidden lg:table-cell">Location</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Publish</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}><TableCell colSpan={8}><Skeleton className="h-10 w-full" /></TableCell></TableRow>
                ))}
                {!isLoading && pageRows.length === 0 && (
                  <TableRow><TableCell colSpan={8} className="text-center py-12 text-sm text-muted-foreground">No properties match your filters</TableCell></TableRow>
                )}
                {pageRows.map((p) => (
                  <TableRow key={p.id} className="hover:bg-secondary/40">
                    <TableCell><Checkbox checked={selected.includes(p.id)} onCheckedChange={() => toggleOne(p.id)} /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={p.thumbnail} alt="" loading="lazy" className="h-11 w-14 rounded-md object-cover shrink-0" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <Link to="/properties/$id" params={{ id: p.id }} className="text-sm font-medium truncate hover:text-primary">{p.title}</Link>
                            {p.featured && <Star className="h-3 w-3 text-gold fill-gold" />}
                          </div>
                          <div className="text-xs text-muted-foreground truncate md:hidden">{p.category} · {p.location}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{p.category}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{p.location}</TableCell>
                    <TableCell className="text-sm font-semibold">{formatINR(p.price)}</TableCell>
                    <TableCell className="hidden sm:table-cell"><Badge className={statusBadge[p.status]}>{p.status}</Badge></TableCell>
                    <TableCell className="hidden lg:table-cell"><Badge variant="outline" className={statusBadge[p.publish]}>{p.publish}</Badge></TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild><Link to="/properties/$id" params={{ id: p.id }}><Eye className="h-4 w-4" /> View</Link></DropdownMenuItem>
                          <DropdownMenuItem asChild><Link to="/properties/$id/edit" params={{ id: p.id }}><Pencil className="h-4 w-4" /> Edit</Link></DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive"><Trash2 className="h-4 w-4" /> Delete</DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete property?</AlertDialogTitle>
                                <AlertDialogDescription>This will permanently remove "{p.title}" from your portfolio.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteMutation.mutate(p.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div>Showing {(pageRows.length && (page - 1) * PAGE_SIZE + 1) || 0}–{(page - 1) * PAGE_SIZE + pageRows.length} of {filtered.length}</div>
            <Pagination>
              <PaginationContent>
                <PaginationItem><PaginationPrevious onClick={(e) => { e.preventDefault(); setPage(Math.max(1, page - 1)); }} /></PaginationItem>
                {Array.from({ length: pageCount }).slice(0, 5).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink isActive={page === i + 1} onClick={(e) => { e.preventDefault(); setPage(i + 1); }}>{i + 1}</PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem><PaginationNext onClick={(e) => { e.preventDefault(); setPage(Math.min(pageCount, page + 1)); }} /></PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

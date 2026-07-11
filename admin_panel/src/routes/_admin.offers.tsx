import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { offerService, type OfferInput } from "@/services";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Calendar, Percent, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import type { Offer } from "@/types";

export const Route = createFileRoute("/_admin/offers")({ component: OffersPage });

function OfferDialog({
  trigger, initial, onSubmit, pending,
}: {
  trigger: React.ReactNode;
  initial?: Offer;
  onSubmit: (data: OfferInput, close: () => void) => void;
  pending: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState<number | "">("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [published, setPublished] = useState(true);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) {
          setTitle(initial?.title ?? "");
          setDescription(initial?.description ?? "");
          setDiscount(initial?.discountPct ?? "");
          setStartDate(initial?.startDate ?? "");
          setEndDate(initial?.endDate ?? "");
          setPublished(initial ? initial.status === "Published" : true);
          setBannerFile(null);
        }
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{initial ? "Edit Offer" : "Create Offer"}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Diwali Bonanza" />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What does this offer include?" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Discount %</Label>
              <Input type="number" min={0} max={100} value={discount} onChange={(e) => setDiscount(e.target.value === "" ? "" : Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Banner Image (optional)</Label>
            <Input type="file" accept="image/*" onChange={(e) => setBannerFile(e.target.files?.[0] ?? null)} />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 px-4 py-3">
            <div>
              <Label className="text-sm">Published</Label>
              <p className="text-xs text-muted-foreground">Visible on the website when active</p>
            </div>
            <Switch checked={published} onCheckedChange={setPublished} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            disabled={pending || !title.trim() || !startDate || !endDate}
            onClick={() =>
              onSubmit(
                {
                  title: title.trim(),
                  description: description.trim() || undefined,
                  discount: discount === "" ? undefined : discount,
                  startDate,
                  endDate,
                  status: published,
                  bannerFile,
                },
                () => setOpen(false),
              )
            }
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {pending ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving</> : (initial ? "Save Changes" : "Create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function OffersPage() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: ["offers"], queryFn: offerService.list });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["offers"] });

  const createMutation = useMutation({
    mutationFn: offerService.create,
    onSuccess: () => { toast.success("Offer created"); invalidate(); },
    onError: (e) => toast.error(e.message),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: OfferInput }) => offerService.update(id, data),
    onSuccess: () => { toast.success("Offer updated"); invalidate(); },
    onError: (e) => toast.error(e.message),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => offerService.remove(id),
    onSuccess: () => { toast.success("Offer deleted"); invalidate(); },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Offers & Campaigns"
        description="Publish promotions and time-bound discounts."
        breadcrumbs={[{ label: "Offers" }]}
        actions={
          <OfferDialog
            trigger={<Button className="bg-primary hover:bg-primary/90 text-primary-foreground"><Plus className="h-4 w-4" /> Create Offer</Button>}
            pending={createMutation.isPending}
            onSubmit={(d, close) => createMutation.mutate(d, { onSuccess: close })}
          />
        }
      />
      {isLoading && <div className="text-sm text-muted-foreground py-8 text-center">Loading offers…</div>}
      {!isLoading && data.length === 0 && (
        <Card className="card-elevated"><CardContent className="py-12 text-center text-sm text-muted-foreground">No offers yet — create a campaign to promote on the website.</CardContent></Card>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((o) => (
          <Card key={o.id} className="card-elevated overflow-hidden group">
            <div className="relative h-40 overflow-hidden">
              <img src={o.image} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent" />
              <Badge className="absolute top-3 left-3 bg-gold text-gold-foreground border-transparent">
                <Percent className="h-3 w-3" /> {o.discountPct}% OFF
              </Badge>
              <Badge className="absolute top-3 right-3 bg-background/90 text-foreground border-transparent">{o.status}</Badge>
            </div>
            <CardContent className="p-5">
              <h3 className="font-display text-lg font-semibold">{o.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{o.description}</p>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" /> {o.startDate} → {o.endDate}
              </div>
              <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <OfferDialog
                  trigger={<Button size="sm" variant="outline" className="flex-1"><Pencil className="h-3 w-3" /> Edit</Button>}
                  initial={o}
                  pending={updateMutation.isPending}
                  onSubmit={(d, close) => updateMutation.mutate({ id: o.id, data: d }, { onSuccess: close })}
                />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="ghost" className="text-destructive"><Trash2 className="h-3 w-3" /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete offer?</AlertDialogTitle>
                      <AlertDialogDescription>"{o.title}" will be removed permanently.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteMutation.mutate(o.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

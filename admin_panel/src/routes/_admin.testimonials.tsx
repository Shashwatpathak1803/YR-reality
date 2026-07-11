import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { testimonialService, type TestimonialInput } from "@/services";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Star, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import type { Testimonial } from "@/types";

export const Route = createFileRoute("/_admin/testimonials")({ component: TestimonialsPage });

function TestimonialDialog({
  trigger, initial, onSubmit, pending,
}: {
  trigger: React.ReactNode;
  initial?: Testimonial;
  onSubmit: (data: TestimonialInput, close: () => void) => void;
  pending: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) {
          setName(initial?.name ?? "");
          setLocation(initial?.location ?? "");
          setRating(initial?.rating ?? 5);
          setReview(initial?.review ?? "");
          setPhotoFile(null);
        }
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{initial ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Customer Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rohit Sharma" />
            </div>
            <div className="space-y-2">
              <Label>Location / Role</Label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Villa Buyer, Gurugram" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((r) => (
                <button key={r} type="button" onClick={() => setRating(r)} aria-label={`${r} stars`}>
                  <Star className={`h-6 w-6 ${r <= rating ? "text-gold fill-gold" : "text-muted"}`} />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Review</Label>
            <Textarea rows={4} value={review} onChange={(e) => setReview(e.target.value)} placeholder="What did the customer say?" />
          </div>
          <div className="space-y-2">
            <Label>Photo (optional)</Label>
            <Input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            disabled={pending || !name.trim() || !review.trim()}
            onClick={() =>
              onSubmit(
                { customerName: name.trim(), location: location.trim() || undefined, rating, review: review.trim(), photoFile },
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

function TestimonialsPage() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: ["testimonials"], queryFn: testimonialService.list });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["testimonials"] });

  const createMutation = useMutation({
    mutationFn: testimonialService.create,
    onSuccess: () => { toast.success("Testimonial added"); invalidate(); },
    onError: (e) => toast.error(e.message),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TestimonialInput }) => testimonialService.update(id, data),
    onSuccess: () => { toast.success("Testimonial updated"); invalidate(); },
    onError: (e) => toast.error(e.message),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => testimonialService.remove(id),
    onSuccess: () => { toast.success("Testimonial deleted"); invalidate(); },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Testimonials"
        description="Customer reviews shown on the website."
        breadcrumbs={[{ label: "Testimonials" }]}
        actions={
          <TestimonialDialog
            trigger={<Button className="bg-primary hover:bg-primary/90 text-primary-foreground"><Plus className="h-4 w-4" /> Add Review</Button>}
            pending={createMutation.isPending}
            onSubmit={(d, close) => createMutation.mutate(d, { onSuccess: close })}
          />
        }
      />
      {isLoading && <div className="text-sm text-muted-foreground py-8 text-center">Loading testimonials…</div>}
      {!isLoading && data.length === 0 && (
        <Card className="card-elevated"><CardContent className="py-12 text-center text-sm text-muted-foreground">No testimonials yet — add reviews to showcase them on the website.</CardContent></Card>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map(t => (
          <Card key={t.id} className="card-elevated group">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12"><AvatarImage src={t.photo} /><AvatarFallback>{t.name[0]}</AvatarFallback></Avatar>
                <div>
                  <div className="font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.location}</div>
                </div>
              </div>
              <div className="flex gap-0.5 mt-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i < t.rating ? "text-gold fill-gold" : "text-muted"}`} />
                ))}
              </div>
              <p className="mt-3 text-sm text-muted-foreground italic leading-relaxed">"{t.review}"</p>
              <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <TestimonialDialog
                  trigger={<Button size="sm" variant="outline" className="flex-1"><Pencil className="h-3 w-3" /> Edit</Button>}
                  initial={t}
                  pending={updateMutation.isPending}
                  onSubmit={(d, close) => updateMutation.mutate({ id: t.id, data: d }, { onSuccess: close })}
                />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="ghost" className="text-destructive"><Trash2 className="h-3 w-3" /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete testimonial?</AlertDialogTitle>
                      <AlertDialogDescription>This removes {t.name}'s review from the website.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteMutation.mutate(t.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
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

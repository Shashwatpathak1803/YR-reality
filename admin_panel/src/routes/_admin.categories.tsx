import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/services";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Layers, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import type { Category } from "@/types";

export const Route = createFileRoute("/_admin/categories")({
  component: CategoriesPage,
});

function CategoryDialog({
  trigger, initial, onSubmit, pending,
}: {
  trigger: React.ReactNode;
  initial?: Category;
  onSubmit: (data: { name: string; description?: string }, close: () => void) => void;
  pending: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (o) { setName(initial?.name ?? ""); setDescription(initial?.description ?? ""); } }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{initial ? "Edit Category" : "Add Category"}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Luxury Villas" />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            disabled={pending || !name.trim()}
            onClick={() => onSubmit({ name: name.trim(), description: description.trim() || undefined }, () => setOpen(false))}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {pending ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving</> : (initial ? "Save Changes" : "Create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CategoriesPage() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: ["categories"], queryFn: categoryService.list });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["categories"] });

  const createMutation = useMutation({
    mutationFn: categoryService.create,
    onSuccess: () => { toast.success("Category created"); invalidate(); },
    onError: (e) => toast.error(e.message),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string; description?: string } }) =>
      categoryService.update(id, data),
    onSuccess: () => { toast.success("Category updated"); invalidate(); },
    onError: (e) => toast.error(e.message),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoryService.remove(id),
    onSuccess: () => { toast.success("Category deleted"); invalidate(); },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Property Categories"
        description="Organize your listings by property type — shown on the website too."
        breadcrumbs={[{ label: "Categories" }]}
        actions={
          <CategoryDialog
            trigger={
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="h-4 w-4" /> Add Category
              </Button>
            }
            pending={createMutation.isPending}
            onSubmit={(data, close) => createMutation.mutate(data, { onSuccess: close })}
          />
        }
      />
      {isLoading && <div className="text-sm text-muted-foreground py-8 text-center">Loading categories…</div>}
      {!isLoading && data.length === 0 && (
        <Card className="card-elevated"><CardContent className="py-12 text-center text-sm text-muted-foreground">No categories yet — add your first category to start listing properties.</CardContent></Card>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((c) => (
          <Card key={c.id} className="card-elevated group hover:shadow-lg transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary-soft text-primary">
                  <Layers className="h-5 w-5" />
                </div>
                <Badge variant="outline">{c.count} listings</Badge>
              </div>
              <h3 className="font-display text-lg font-semibold mt-4">{c.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">/{c.slug}</p>
              <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <CategoryDialog
                  trigger={<Button size="sm" variant="outline" className="flex-1"><Pencil className="h-3 w-3" /> Edit</Button>}
                  initial={c}
                  pending={updateMutation.isPending}
                  onSubmit={(d, close) => updateMutation.mutate({ id: c.id, data: d }, { onSuccess: close })}
                />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive"><Trash2 className="h-3 w-3" /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete "{c.name}"?</AlertDialogTitle>
                      <AlertDialogDescription>Properties in this category will keep a dangling reference — reassign them first if needed.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteMutation.mutate(c.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
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

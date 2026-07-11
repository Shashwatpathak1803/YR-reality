import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Eye, Loader2, Trash2, Upload } from "lucide-react";
import { mediaService, propertyService, PLACEHOLDER_IMG } from "@/services";
import { toast } from "sonner";

export const Route = createFileRoute("/_admin/media")({ component: MediaPage });

function MediaPage() {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const { data: gallery = [], isLoading: loadingGallery } = useQuery({
    queryKey: ["media"],
    queryFn: mediaService.list,
  });
  const { data: properties = [], isLoading: loadingProps } = useQuery({
    queryKey: ["properties"],
    queryFn: propertyService.list,
  });

  const uploadMutation = useMutation({
    mutationFn: (files: File[]) => mediaService.upload(files),
    onSuccess: () => {
      toast.success("Images uploaded — they now appear in the website gallery");
      qc.invalidateQueries({ queryKey: ["media"] });
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: ({ publicId, resourceType }: { publicId: string; resourceType: string }) =>
      mediaService.remove(publicId, resourceType),
    onSuccess: () => {
      toast.success("Image deleted");
      qc.invalidateQueries({ queryKey: ["media"] });
    },
    onError: (e) => toast.error(e.message),
  });

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const images = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!images.length) return toast.error("Only image files are supported here");
    uploadMutation.mutate(images);
  };

  const propertyImages = properties
    .flatMap((p) => p.images.map((src) => ({ src, title: p.title })))
    .filter((i) => i.src !== PLACEHOLDER_IMG);

  const uploading = uploadMutation.isPending;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Media Gallery"
        description="Upload images for the website gallery. Images uploaded with property listings also appear below."
        breadcrumbs={[{ label: "Media" }]}
      />

      {/* Upload zone */}
      <div
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onClick={() => !uploading && fileRef.current?.click()}
        className={`rounded-xl border-2 border-dashed transition-colors cursor-pointer p-10 text-center ${dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-secondary/40"}`}
      >
        <div className="grid h-12 w-12 mx-auto place-items-center rounded-full bg-primary/10 text-primary mb-3">
          {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
        </div>
        <p className="text-sm font-medium">{uploading ? "Uploading…" : "Drop images here or click to browse"}</p>
        <p className="text-xs text-muted-foreground mt-1">These images show in the website's gallery section</p>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
        />
      </div>

      {/* Gallery uploads */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Gallery uploads</h2>
        {loadingGallery && <div className="text-sm text-muted-foreground py-4 text-center">Loading…</div>}
        {!loadingGallery && gallery.length === 0 && (
          <Card className="card-elevated"><CardContent className="py-8 text-center text-sm text-muted-foreground">No gallery images yet — upload some above.</CardContent></Card>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {gallery.map((m) => (
            <Card key={m.id} className="card-elevated overflow-hidden group">
              <div className="relative aspect-square">
                <img src={m.url} alt={m.originalName ?? "Gallery image"} loading="lazy" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-primary/70 opacity-0 group-hover:opacity-100 transition-opacity grid place-items-center gap-2 grid-flow-col">
                  <Button asChild size="icon" variant="secondary" className="h-8 w-8">
                    <a href={m.url} target="_blank" rel="noreferrer" aria-label="View"><Eye className="h-4 w-4" /></a>
                  </Button>
                  <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => { navigator.clipboard.writeText(m.url); toast.success("URL copied"); }}><Copy className="h-4 w-4" /></Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8"
                    disabled={deleteMutation.isPending}
                    onClick={() => deleteMutation.mutate({ publicId: m.publicId, resourceType: m.resourceType })}
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Property images (managed on each property) */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Property images</h2>
        {loadingProps && <div className="text-sm text-muted-foreground py-4 text-center">Loading…</div>}
        {!loadingProps && propertyImages.length === 0 && (
          <Card className="card-elevated"><CardContent className="py-8 text-center text-sm text-muted-foreground">No property images yet — images you upload on properties will appear here.</CardContent></Card>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {propertyImages.map((img, i) => (
            <Card key={i} className="card-elevated overflow-hidden group">
              <div className="relative aspect-square">
                <img src={img.src} alt={img.title} loading="lazy" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-primary/70 opacity-0 group-hover:opacity-100 transition-opacity grid place-items-center gap-2 grid-flow-col">
                  <Button asChild size="icon" variant="secondary" className="h-8 w-8">
                    <a href={img.src} target="_blank" rel="noreferrer" aria-label="View"><Eye className="h-4 w-4" /></a>
                  </Button>
                  <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => { navigator.clipboard.writeText(img.src); toast.success("URL copied"); }}><Copy className="h-4 w-4" /></Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

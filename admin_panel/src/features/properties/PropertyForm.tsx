import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useMemo, useState, useRef } from "react";
import {
  categoryService,
  propertyService,
  CONSTRUCTION_STATUSES,
  PROPERTY_STATUSES,
  constructionValue,
  type PropertyInput,
} from "@/services";
import { X, Upload, Loader2, Sparkles } from "lucide-react";
import type { Property } from "@/types";

const schema = z.object({
  title: z.string().min(3, "Title is required"),
  category: z.string().min(1, "Choose a category"),
  price: z.coerce.number().min(1, "Price is required"),
  discountPrice: z.coerce.number().optional(),
  status: z.enum(["Available", "Sold", "Upcoming"]),
  featured: z.boolean().optional(),
  location: z.string().min(2, "Location is required"),
  address: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  shortDescription: z.string().max(300).optional(),
  area: z.coerce.number().optional(),
  plotSize: z.string().optional(),
  bedrooms: z.coerce.number().optional(),
  bathrooms: z.coerce.number().optional(),
  parking: z.coerce.number().optional(),
  constructionStatus: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const AMENITIES = [
  "Swimming Pool", "Gymnasium", "Clubhouse", "24x7 Security", "Power Backup",
  "Landscaped Gardens", "Kids Play Area", "Parking", "Rain Water Harvesting",
  "Yoga Deck", "Jogging Track", "CCTV Surveillance", "Lift", "Intercom",
];

interface Props {
  mode: "create" | "edit";
  initial?: Property;
  onSaved: () => void;
}

export function PropertyForm({ mode, initial, onSaved }: Props) {
  const qc = useQueryClient();
  const [amenities, setAmenities] = useState<string[]>(initial?.amenities ?? []);
  const [existingImages] = useState<string[]>(initial?.images ?? []);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: categoryService.list });

  const defaults: FormData = useMemo(() => ({
    title: initial?.title ?? "",
    category: initial?.categoryId ?? "",
    price: initial?.price ?? 0,
    discountPrice: initial?.discountPrice,
    status: initial?.status ?? "Available",
    featured: initial?.featured ?? false,
    location: initial?.location ?? "",
    address: initial?.address ?? "",
    latitude: initial?.latitude,
    longitude: initial?.longitude,
    description: initial?.description ?? "",
    shortDescription: initial?.shortDescription ?? "",
    area: initial?.area ?? 0,
    plotSize: initial?.plotSize ?? "",
    bedrooms: initial?.bedrooms,
    bathrooms: initial?.bathrooms,
    parking: initial?.parking,
    constructionStatus: initial?.constructionStatus ?? "",
    metaTitle: initial?.seoTitle ?? "",
    metaDescription: initial?.seoDescription ?? "",
    keywords: initial?.keywords?.join(", ") ?? "",
  }), [initial]);

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  });

  const toggleAmenity = (a: string) => setAmenities(s => s.includes(a) ? s.filter(x => x !== a) : [...s, a]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    setNewFiles(prev => [...prev, ...Array.from(files)]);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const removeNewFile = (i: number) => setNewFiles(prev => prev.filter((_, idx) => idx !== i));

  const saveMutation = useMutation({
    mutationFn: (input: PropertyInput) =>
      mode === "create" ? propertyService.create(input) : propertyService.update(initial!.id, input),
    onSuccess: () => {
      toast.success(mode === "create" ? "Property created" : "Property updated");
      qc.invalidateQueries({ queryKey: ["properties"] });
      qc.invalidateQueries({ queryKey: ["property"] });
      qc.invalidateQueries({ queryKey: ["categories"] });
      qc.invalidateQueries({ queryKey: ["dash"] });
      onSaved();
    },
    onError: (e) => toast.error(e.message),
  });

  const onSubmit = (data: FormData) => {
    saveMutation.mutate({
      title: data.title,
      category: data.category,
      price: data.price,
      discountPrice: data.discountPrice || undefined,
      description: data.description,
      shortDescription: data.shortDescription || undefined,
      location: data.location,
      address: data.address || undefined,
      latitude: data.latitude,
      longitude: data.longitude,
      featured: !!data.featured,
      status: PROPERTY_STATUSES.find(s => s.label === data.status)?.value ?? "available",
      plotSize: data.plotSize || undefined,
      area: data.area || undefined,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      parking: data.parking,
      constructionStatus: constructionValue(data.constructionStatus),
      amenities,
      seoTitle: data.metaTitle || undefined,
      seoDescription: data.metaDescription || undefined,
      keywords: data.keywords || undefined,
      imageFiles: newFiles,
    });
  };

  const saving = saveMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Tabs defaultValue="basic">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 lg:w-fit">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        {/* BASIC */}
        <TabsContent value="basic" className="mt-6 space-y-6">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="font-display">Basic Information</CardTitle>
              <CardDescription>Core listing details visible on the website.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label>Property Title</Label>
                  <Input placeholder="e.g. Emerald Green Villa" {...register("title")} />
                  {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={watch("category")} onValueChange={(v) => setValue("category", v)}>
                    <SelectTrigger><SelectValue placeholder="Choose category" /></SelectTrigger>
                    <SelectContent>
                      {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
                  {categories.length === 0 && (
                    <p className="text-xs text-muted-foreground">No categories yet — create one under Categories first.</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={watch("status")} onValueChange={(v: FormData["status"]) => setValue("status", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PROPERTY_STATUSES.map(s => <SelectItem key={s.value} value={s.label}>{s.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Price (₹)</Label>
                  <Input type="number" {...register("price")} />
                  {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Discount Price (₹)</Label>
                  <Input type="number" {...register("discountPrice")} />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 px-4 py-3">
                <div>
                  <Label className="text-sm">Featured Property</Label>
                  <p className="text-xs text-muted-foreground">Highlight in the website's featured section</p>
                </div>
                <Switch checked={!!watch("featured")} onCheckedChange={(v) => setValue("featured", v)} />
              </div>

              <div className="space-y-2">
                <Label>Short Description</Label>
                <Textarea rows={2} maxLength={300} placeholder="One-liner shown on property cards (max 300 chars)" {...register("shortDescription")} />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea rows={6} placeholder="Rich description with lifestyle, layout, connectivity..." {...register("description")} />
                {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="font-display">Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input placeholder="Whitefield, Bengaluru" {...register("location")} />
                  {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
                </div>
                <div className="space-y-2 md:col-span-1">
                  <Label>Address</Label>
                  <Input placeholder="Full address" {...register("address")} />
                </div>
                <div className="space-y-2">
                  <Label>Latitude</Label>
                  <Input type="number" step="any" {...register("latitude")} />
                </div>
                <div className="space-y-2">
                  <Label>Longitude</Label>
                  <Input type="number" step="any" {...register("longitude")} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DETAILS */}
        <TabsContent value="details" className="mt-6 space-y-6">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="font-display">Property Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2"><Label>Area (sq ft)</Label><Input type="number" {...register("area")} /></div>
                <div className="space-y-2"><Label>Plot Size</Label><Input placeholder="30 x 40" {...register("plotSize")} /></div>
                <div className="space-y-2">
                  <Label>Construction</Label>
                  <Select value={watch("constructionStatus") || ""} onValueChange={(v) => setValue("constructionStatus", v)}>
                    <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      {CONSTRUCTION_STATUSES.map(f => <SelectItem key={f.value} value={f.label}>{f.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Bedrooms</Label><Input type="number" {...register("bedrooms")} /></div>
                <div className="space-y-2"><Label>Bathrooms</Label><Input type="number" {...register("bathrooms")} /></div>
                <div className="space-y-2"><Label>Parking</Label><Input type="number" {...register("parking")} /></div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="font-display">Amenities</CardTitle>
              <CardDescription>Select all that apply to this property.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {AMENITIES.map(a => {
                  const active = amenities.includes(a);
                  return (
                    <button
                      key={a}
                      type="button"
                      onClick={() => toggleAmenity(a)}
                      className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${active ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-secondary-foreground border-border hover:bg-accent"}`}
                    >
                      {a}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* MEDIA */}
        <TabsContent value="media" className="mt-6 space-y-6">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="font-display">Property Images</CardTitle>
              <CardDescription>
                Drag & drop or click to upload. New uploads are sent to the server on save.
                {mode === "edit" && " Uploading new images replaces the existing set."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                onDrop={onDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileRef.current?.click()}
                className="rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-secondary/40 transition-colors cursor-pointer p-10 text-center"
              >
                <div className="grid h-12 w-12 mx-auto place-items-center rounded-full bg-primary/10 text-primary mb-3">
                  <Upload className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium">Drop files here or click to browse</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP up to 50 MB</p>
                <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
              </div>

              {mode === "edit" && existingImages.length > 0 && newFiles.length === 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Current images</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {existingImages.map((src, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                        <img src={src} alt="" className="h-full w-full object-cover" />
                        {i === 0 && <Badge className="absolute bottom-1 left-1 bg-gold text-gold-foreground border-transparent text-[9px]">COVER</Badge>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {newFiles.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">New uploads (saved on submit)</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {newFiles.map((f, i) => (
                      <div key={i} className="group relative aspect-square rounded-lg overflow-hidden border border-border">
                        <img src={URL.createObjectURL(f)} alt="" className="h-full w-full object-cover" />
                        <button type="button" onClick={() => removeNewFile(i)} className="absolute top-1 right-1 grid h-6 w-6 place-items-center rounded-full bg-background/90 text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="h-3 w-3" />
                        </button>
                        {i === 0 && <Badge className="absolute bottom-1 left-1 bg-gold text-gold-foreground border-transparent text-[9px]">COVER</Badge>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO */}
        <TabsContent value="seo" className="mt-6 space-y-6">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2"><Sparkles className="h-4 w-4 text-gold" /> Search Engine Optimization</CardTitle>
              <CardDescription>How this listing appears on Google and social media.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Meta Title</Label><Input maxLength={60} placeholder="60 chars max" {...register("metaTitle")} /></div>
              <div className="space-y-2"><Label>Meta Description</Label><Textarea rows={3} maxLength={160} placeholder="160 chars max" {...register("metaDescription")} /></div>
              <div className="space-y-2"><Label>Keywords (comma separated)</Label><Input placeholder="villa, whitefield, luxury" {...register("keywords")} /></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="sticky bottom-0 -mx-4 md:-mx-8 px-4 md:px-8 py-3 bg-background/90 backdrop-blur border-t border-border flex items-center justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSaved}>Cancel</Button>
        <Button type="submit" disabled={saving} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving</> : (mode === "create" ? "Create Property" : "Save Changes")}
        </Button>
      </div>
    </form>
  );
}

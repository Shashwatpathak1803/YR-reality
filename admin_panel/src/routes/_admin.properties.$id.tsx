import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { propertyService, PLACEHOLDER_IMG } from "@/services";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/constants/nav";
import {
  Bed,
  Bath,
  Car,
  Ruler,
  Compass,
  MapPin,
  Layers,
  Pencil,
  Star,
  ArrowLeft,
  ExternalLink,
  Eye,
  MessageSquare,
  Calendar,
  Sparkles,
  CheckCircle2,
  Map,
  Tag,
  Building,
  Info,
  Globe,
  Locate,
  Navigation,
  Loader2,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_admin/properties/$id")({
  component: PropertyDetail,
});

const statusBadgeStyle: Record<string, string> = {
  Available: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  Sold: "bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30",
  Upcoming: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30",
  Published: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  Unpublished: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  Archived: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
};

export function PropertyDetail() {
  const { id } = useParams({ from: "/_admin/properties/$id" });
  const [selectedImgIndex, setSelectedImgIndex] = useState<number>(0);

  const { data: p, isLoading, isError } = useQuery({
    queryKey: ["property", id],
    queryFn: () => propertyService.get(id),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-72" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-[400px] w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !p) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border bg-card">
        <div className="h-12 w-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
          <Info className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold mb-1">Property Not Found</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
          The property you are trying to view does not exist or has been removed.
        </p>
        <Button asChild variant="outline">
          <Link to="/properties">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Properties
          </Link>
        </Button>
      </div>
    );
  }

  const validImages = (p.images && p.images.length > 0 ? p.images : [PLACEHOLDER_IMG]).filter(Boolean);
  const mainImageSrc = validImages[selectedImgIndex] || validImages[0] || PLACEHOLDER_IMG;

  const createdDateFormatted = p.createdAt
    ? new Date(p.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

  const pricePerSqFt =
    p.area > 0 && p.price > 0
      ? `₹${Math.round((p.discountPrice ?? p.price) / p.area).toLocaleString("en-IN")} / sq ft`
      : null;

  const discountPercentage =
    p.discountPrice && p.price > p.discountPrice
      ? Math.round(((p.price - p.discountPrice) / p.price) * 100)
      : null;

  const mapSearchUrl =
    p.mapLink ||
    (p.latitude && p.longitude
      ? `https://maps.google.com/?q=${p.latitude},${p.longitude}`
      : `https://maps.google.com/?q=${encodeURIComponent(`${p.title}, ${p.address || p.location}`)}`);

  const [isNavigatingLocation, setIsNavigatingLocation] = useState(false);

  const handleGetDirectionsFromCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsNavigatingLocation(true);
    toast.info("Fetching your current position for directions...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        let dest = encodeURIComponent(`${p.title}, ${p.address || p.location}`);
        if (p.latitude && p.longitude) {
          dest = `${p.latitude},${p.longitude}`;
        }

        const dirUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${dest}`;
        window.open(dirUrl, "_blank");
        setIsNavigatingLocation(false);
      },
      (err) => {
        setIsNavigatingLocation(false);
        toast.error(`Location permission denied: ${err.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Navigation */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-muted-foreground hover:text-foreground">
              <Link to="/properties">
                <ArrowLeft className="h-4 w-4 mr-1" /> Properties
              </Link>
            </Button>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm font-medium text-foreground truncate max-w-[200px]">{p.title}</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-foreground">{p.title}</h1>
            <Badge variant="outline" className={statusBadgeStyle[p.status] || "bg-secondary text-secondary-foreground"}>
              ● {p.status}
            </Badge>
            <Badge variant="outline" className={statusBadgeStyle[p.publish] || "bg-secondary"}>
              {p.publish}
            </Badge>
            {p.featured && (
              <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500 mr-1" />
                Featured
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <a href={mapSearchUrl} target="_blank" rel="noopener noreferrer">
              <Globe className="h-4 w-4 mr-2" /> Maps
            </a>
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link to="/properties/$id/edit" params={{ id: p.id }}>
              <Pencil className="h-4 w-4 mr-2" /> Edit Property
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Grid: Gallery + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Media Gallery + Overview + Specs + Amenities */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gallery Card */}
          <Card className="overflow-hidden border-border/60 shadow-sm">
            <CardContent className="p-3 space-y-3">
              {/* Main Cover Image Display */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-xl bg-secondary/30 group border border-border/40">
                <img
                  src={mainImageSrc}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMG;
                  }}
                  alt={p.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge className="bg-black/60 backdrop-blur-md text-white border-none text-xs px-2.5 py-1 font-medium">
                    {p.category}
                  </Badge>
                </div>
                {validImages.length > 1 && (
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5">
                    <span>📷 {selectedImgIndex + 1} of {validImages.length}</span>
                  </div>
                )}
              </div>

              {/* Thumbnails Row */}
              {validImages.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
                  {validImages.map((src, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedImgIndex(i)}
                      className={`relative aspect-square h-16 w-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImgIndex === i
                          ? "border-primary ring-2 ring-primary/20 scale-105"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={src}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMG;
                        }}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Specifications Ribbon */}
          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-4 sm:p-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 border border-border/40">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Ruler className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Area</p>
                    <p className="text-sm font-semibold truncate">{p.area > 0 ? `${p.area.toLocaleString()} sq ft` : "—"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 border border-border/40">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Bed className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Bedrooms</p>
                    <p className="text-sm font-semibold truncate">{p.bedrooms ? `${p.bedrooms} BHK` : "—"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 border border-border/40">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Bath className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Bathrooms</p>
                    <p className="text-sm font-semibold truncate">{p.bathrooms ? `${p.bathrooms} Baths` : "—"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 border border-border/40">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Car className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Parking</p>
                    <p className="text-sm font-semibold truncate">{p.parking ? `${p.parking} Space(s)` : "—"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Overview & Full Description */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" /> Property Description & Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {p.shortDescription && (
                <div className="p-4 rounded-xl border-l-4 border-primary bg-primary/5 text-sm font-medium text-foreground">
                  {p.shortDescription}
                </div>
              )}

              <div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                {p.description || "No description provided."}
              </div>

              {/* Extended Details Grid */}
              <div className="pt-4 border-t border-border grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground block mb-0.5">Plot Size</span>
                  <span className="font-semibold text-foreground">{p.plotSize || "—"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-0.5">Construction Status</span>
                  <span className="font-semibold text-foreground">{p.constructionStatus || "—"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-0.5">Facing</span>
                  <span className="font-semibold text-foreground">{p.facing || "—"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-0.5">Total Floors</span>
                  <span className="font-semibold text-foreground">{p.floors ? `${p.floors} Floor(s)` : "—"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-0.5">Created Date</span>
                  <span className="font-semibold text-foreground">{createdDateFormatted}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-0.5">Slug</span>
                  <span className="font-mono font-semibold text-foreground truncate block">{p.slug}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amenities Section */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" /> Amenities & Features
              </CardTitle>
              <CardDescription>Features available for this property listing.</CardDescription>
            </CardHeader>
            <CardContent>
              {p.amenities && p.amenities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {p.amenities.map((amenity: string) => (
                    <Badge
                      key={amenity}
                      variant="secondary"
                      className="px-3 py-1.5 rounded-lg border border-border/50 bg-secondary/60 text-secondary-foreground font-normal text-xs flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      {amenity}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">No amenities specified for this property.</p>
              )}
            </CardContent>
          </Card>

          {/* SEO Metadata Card */}
          {(p.seoTitle || p.seoDescription || (p.keywords && p.keywords.length > 0)) && (
            <Card className="border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" /> Search Engine Optimization (SEO)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Google Search Preview */}
                <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 space-y-1">
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 truncate">
                    https://yrrealty.com › properties › {p.slug}
                  </p>
                  <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 truncate">
                    {p.seoTitle || p.title}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {p.seoDescription || p.shortDescription || p.description}
                  </p>
                </div>

                {p.keywords && p.keywords.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1.5">Keywords</p>
                    <div className="flex flex-wrap gap-1.5">
                      {p.keywords.map((kw: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="text-[11px] bg-background">
                          #{kw}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Pricing, Location & Analytics Cards */}
        <div className="space-y-6">
          {/* Financials & Price Card */}
          <Card className="border-border/60 shadow-sm bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base text-muted-foreground uppercase tracking-wider text-xs">
                Pricing & Valuation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl font-bold text-foreground">
                    {formatINR(p.discountPrice ?? p.price)}
                  </span>
                  {discountPercentage && (
                    <Badge className="bg-emerald-500/15 text-emerald-600 border-none font-semibold">
                      {discountPercentage}% OFF
                    </Badge>
                  )}
                </div>

                {p.discountPrice && p.price > p.discountPrice && (
                  <div className="text-sm text-muted-foreground line-through mt-1">
                    Original Price: {formatINR(p.price)}
                  </div>
                )}

                {pricePerSqFt && (
                  <div className="text-xs text-muted-foreground mt-2 font-medium">
                    Rate: <span className="text-foreground">{pricePerSqFt}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-border space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Listing Category</span>
                  <span className="font-semibold text-foreground">{p.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Property Status</span>
                  <span className="font-semibold text-foreground">{p.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Visibility</span>
                  <span className="font-semibold text-foreground">{p.publish}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location & Map Card */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> Location Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div>
                <p className="font-semibold text-sm text-foreground">{p.location}</p>
                {p.address && <p className="text-muted-foreground mt-1 leading-relaxed">{p.address}</p>}
              </div>

              {(p.latitude || p.longitude) && (
                <div className="flex gap-4 pt-2 border-t border-border text-[11px] text-muted-foreground">
                  <span>Lat: <strong className="text-foreground">{p.latitude ?? "N/A"}</strong></span>
                  <span>Long: <strong className="text-foreground">{p.longitude ?? "N/A"}</strong></span>
                </div>
              )}

              <div className="grid grid-cols-1 gap-2 pt-2">
                <Button asChild variant="outline" size="sm" className="w-full">
                  <a href={mapSearchUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5 mr-2" /> Open in Google Maps
                  </a>
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleGetDirectionsFromCurrentLocation}
                  disabled={isNavigatingLocation}
                  className="w-full text-xs gap-1.5"
                >
                  {isNavigatingLocation ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                  ) : (
                    <Navigation className="h-3.5 w-3.5 text-primary" />
                  )}
                  {isNavigatingLocation ? "Locating..." : "Get Directions from My Location"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Analytics & Activity Card */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base flex items-center gap-2">
                <Eye className="h-4 w-4 text-sky-500" /> Listing Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-xl bg-secondary/40 border border-border/40">
                  <div className="font-display text-2xl font-bold text-foreground">
                    {p.views ? p.views.toLocaleString() : 0}
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mt-0.5">
                    Page Views
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-secondary/40 border border-border/40">
                  <div className="font-display text-2xl font-bold text-foreground">
                    {p.enquiries ? p.enquiries : 0}
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mt-0.5">
                    Enquiries
                  </div>
                </div>
              </div>

              <Button asChild variant="secondary" size="sm" className="w-full">
                <Link to="/enquiries">
                  <MessageSquare className="h-4 w-4 mr-2" /> View All Customer Enquiries
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
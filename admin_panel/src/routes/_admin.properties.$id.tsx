import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@/services";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_admin/properties/$id")({
  component: PropertyDetail,
});

function PropertyDetail() {
  const { id } = useParams({ from: "/_admin/properties/$id" });

  const { data: p, isLoading } = useQuery({
    queryKey: ["property", id],
    queryFn: () => propertyService.get(id),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!p) {
    return (
      <div className="text-sm text-muted-foreground">
        Property not found.
      </div>
    );
  }

  const specs = [
    p.bedrooms && { icon: Bed, label: `${p.bedrooms} Beds` },
    p.bathrooms && { icon: Bath, label: `${p.bathrooms} Baths` },
    p.parking && { icon: Car, label: `${p.parking} Parking` },
    { icon: Ruler, label: `${p.area} sq ft` },
    p.facing && { icon: Compass, label: p.facing },
    p.floors && { icon: Layers, label: `${p.floors} Floors` },
  ].filter(Boolean) as { icon: typeof Bed; label: string }[];

  return (
    <div className="space-y-6">
      <PageHeader
        title={p.title}
        description={`${p.category} · ${p.location}`}
        breadcrumbs={[
          { label: "Properties", to: "/properties" },
          { label: p.title },
        ]}
        actions={
          <Link
            to="/properties/$id/edit"
            params={{ id: p.id }}
          >
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[420px]">
            <img
              src={p.images[0]}
              alt=""
              className="col-span-4 sm:col-span-2 row-span-2 h-full w-full object-cover rounded-xl"
            />

            {p.images.slice(1, 4).map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className={`hidden sm:block h-full w-full object-cover rounded-xl ${
                  i === 2 ? "col-span-2" : "col-span-1"
                }`}
              />
            ))}
          </div>

          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="font-display">
                Description
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {p.description}
              </p>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {specs.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-3 py-2"
                  >
                    <s.icon className="h-4 w-4 text-primary" />
                    <span className="text-sm">{s.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="font-display">
                Amenities
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex flex-wrap gap-2">
                {p.amenities.map((a: string) => (
                  <Badge
                    key={a}
                    variant="outline"
                    className="bg-primary-soft border-transparent text-primary"
                  >
                    {a}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="card-elevated">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-success/15 text-success border-transparent">
                  {p.status}
                </Badge>

                <Badge variant="outline">{p.publish}</Badge>

                {p.featured && (
                  <Badge className="bg-gold/20 text-gold-foreground border-transparent">
                    <Star className="h-3 w-3 fill-gold mr-1" />
                    Featured
                  </Badge>
                )}
              </div>

              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  Price
                </div>

                <div className="font-display text-3xl font-semibold text-foreground">
                  {formatINR(p.discountPrice ?? p.price)}
                </div>

                {p.discountPrice && (
                  <div className="text-sm text-muted-foreground line-through">
                    {formatINR(p.price)}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-border space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span>{p.category}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sub-category</span>
                  <span>{p.subCategory ?? "—"}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plot Size</span>
                  <span>{p.plotSize ?? "—"}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Construction</span>
                  <span>{p.constructionStatus ?? "—"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="font-display text-base">
                Location
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>{p.address}</span>
              </div>

              {p.mapLink && (
                <a
                  href={p.mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  Open in Google Maps
                </a>
              )}
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="p-6 grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="font-display text-2xl">
                  {p.views.toLocaleString()}
                </div>

                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  Views
                </div>
              </div>

              <div>
                <div className="font-display text-2xl">
                  {p.enquiries}
                </div>

                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  Enquiries
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
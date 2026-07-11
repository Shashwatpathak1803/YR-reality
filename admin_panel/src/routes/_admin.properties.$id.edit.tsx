import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@/services";
import { PageHeader } from "@/components/layout/PageHeader";
import { PropertyForm } from "@/features/properties/PropertyForm";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_admin/properties/$id/edit")({
  component: EditProperty,
});

function EditProperty() {
  const { id } = useParams({ from: "/_admin/properties/$id/edit" });
  const navigate = useNavigate();
  const { data: p, isLoading } = useQuery({ queryKey: ["property", id], queryFn: () => propertyService.get(id) });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Property"
        description={p?.title}
        breadcrumbs={[{ label: "Properties", to: "/properties" }, { label: p?.title ?? "Edit" }]}
      />
      {isLoading || !p ? <Skeleton className="h-96 w-full" /> : (
        <PropertyForm mode="edit" initial={p} onSaved={() => navigate({ to: "/properties" })} />
      )}
    </div>
  );
}

import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { PropertyForm } from "@/features/properties/PropertyForm";

export const Route = createFileRoute("/_admin/properties/new")({
  component: NewProperty,
});

function NewProperty() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New Property"
        description="Create a new listing with rich details, media, amenities and SEO."
        breadcrumbs={[{ label: "Properties", to: "/properties" }, { label: "Add" }]}
      />
      <PropertyForm mode="create" onSaved={() => navigate({ to: "/properties" })} />
    </div>
  );
}

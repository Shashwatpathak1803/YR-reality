import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { blogService } from "@/services";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar } from "lucide-react";
import { format } from "date-fns";

export const Route = createFileRoute("/_admin/blogs")({ component: BlogsPage });

const badge: Record<string, string> = {
  Published: "bg-success/15 text-success border-transparent",
  Unpublished: "bg-muted text-muted-foreground border-transparent",
  Archived: "bg-destructive/10 text-destructive border-transparent",
};

function BlogsPage() {
  const { data = [] } = useQuery({ queryKey: ["blogs"], queryFn: blogService.list });
  return (
    <div className="space-y-6">
      <PageHeader
        title="Blog Management"
        description="Write, edit, and publish articles for your website."
        breadcrumbs={[{ label: "Blogs" }]}
        actions={<Button className="bg-primary hover:bg-primary/90 text-primary-foreground"><Plus className="h-4 w-4" /> New Blog</Button>}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data.map(b => (
          <Card key={b.id} className="card-elevated overflow-hidden group">
            <div className="relative aspect-video overflow-hidden">
              <img src={b.thumbnail} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
              <Badge className={"absolute top-3 left-3 " + badge[b.status]}>{b.status}</Badge>
            </div>
            <CardContent className="p-4">
              <div className="text-xs text-primary font-medium">{b.category}</div>
              <h3 className="font-display text-base font-semibold mt-1 line-clamp-2">{b.title}</h3>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" /> {format(new Date(b.publishedAt), "dd MMM yyyy")}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

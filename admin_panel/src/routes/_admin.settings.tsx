import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { settingsService, type SettingsInput } from "@/services";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Facebook, Instagram, Youtube, MessageCircle, Upload, Loader2, Twitter, Linkedin } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/_admin/settings")({ component: SettingsPage });

function SettingsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["settings"], queryFn: settingsService.get });

  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phones, setPhones] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [googleMap, setGoogleMap] = useState("");
  const [address, setAddress] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!data) return;
    setCompanyName(data.companyName);
    setEmail(data.email);
    setPhones(data.phoneNumbers.join(", "));
    setWhatsapp(data.whatsapp);
    setGoogleMap(data.googleMap);
    setAddress(data.address);
    setFacebook(data.socialLinks.facebook ?? "");
    setInstagram(data.socialLinks.instagram ?? "");
    setYoutube(data.socialLinks.youtube ?? "");
    setTwitter(data.socialLinks.twitter ?? "");
    setLinkedin(data.socialLinks.linkedin ?? "");
    setMetaTitle(data.seo.metaTitle ?? "");
    setMetaDescription(data.seo.metaDescription ?? "");
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: (input: SettingsInput) => settingsService.update(input),
    onSuccess: () => {
      toast.success("Settings saved — the website will reflect this immediately");
      setLogoFile(null);
      qc.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (e) => toast.error(e.message),
  });

  const onSave = () =>
    saveMutation.mutate({
      companyName,
      email,
      phoneNumbers: phones.split(",").map((p) => p.trim()).filter(Boolean),
      whatsapp,
      googleMap,
      address,
      socialLinks: { facebook, instagram, youtube, twitter, linkedin },
      seo: { metaTitle, metaDescription },
      logoFile,
    });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Settings" description="Configure global business details, branding and integrations." breadcrumbs={[{ label: "Settings" }]} />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Business details shown across the public website — fully backend driven." breadcrumbs={[{ label: "Settings" }]} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="card-elevated lg:col-span-2">
          <CardHeader><CardTitle className="font-display">Company Information</CardTitle><CardDescription>Displayed across the public website.</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Company Name</Label><Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} /></div>
              <div className="space-y-2"><Label>Contact Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
              <div className="space-y-2"><Label>Phone Numbers (comma separated)</Label><Input value={phones} onChange={(e) => setPhones(e.target.value)} placeholder="+91 98765 43210, +91 98765 43211" /></div>
              <div className="space-y-2"><Label>Google Map Link</Label><Input value={googleMap} onChange={(e) => setGoogleMap(e.target.value)} placeholder="https://maps.google.com/..." /></div>
              <div className="space-y-2 md:col-span-2"><Label>Address</Label><Textarea rows={2} value={address} onChange={(e) => setAddress(e.target.value)} /></div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader><CardTitle className="font-display">Branding</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-2 block">Logo</Label>
              <button
                type="button"
                onClick={() => logoRef.current?.click()}
                className="w-full rounded-lg border-2 border-dashed border-border p-6 grid place-items-center text-muted-foreground text-xs hover:border-primary/50 transition-colors"
              >
                {logoFile ? (
                  <img src={URL.createObjectURL(logoFile)} alt="Logo preview" className="max-h-20 object-contain" />
                ) : data?.logoUrl ? (
                  <img src={data.logoUrl} alt="Current logo" className="max-h-20 object-contain" />
                ) : (
                  <><Upload className="h-5 w-5 mb-2" /> Upload logo</>
                )}
              </button>
              <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)} />
              {logoFile && <p className="text-xs text-muted-foreground mt-2">New logo selected — click Save Changes to upload.</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated lg:col-span-2">
          <CardHeader><CardTitle className="font-display">Social Media & WhatsApp</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label className="flex items-center gap-2"><Facebook className="h-4 w-4" /> Facebook</Label><Input value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="https://facebook.com/..." /></div>
            <div className="space-y-2"><Label className="flex items-center gap-2"><Instagram className="h-4 w-4" /> Instagram</Label><Input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="https://instagram.com/..." /></div>
            <div className="space-y-2"><Label className="flex items-center gap-2"><Youtube className="h-4 w-4" /> YouTube</Label><Input value={youtube} onChange={(e) => setYoutube(e.target.value)} placeholder="https://youtube.com/@..." /></div>
            <div className="space-y-2"><Label className="flex items-center gap-2"><Twitter className="h-4 w-4" /> Twitter / X</Label><Input value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="https://x.com/..." /></div>
            <div className="space-y-2"><Label className="flex items-center gap-2"><Linkedin className="h-4 w-4" /> LinkedIn</Label><Input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/company/..." /></div>
            <div className="space-y-2"><Label className="flex items-center gap-2"><MessageCircle className="h-4 w-4" /> WhatsApp Number</Label><Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+91 98765 43210" /></div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader><CardTitle className="font-display">SEO Defaults</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Site Title</Label><Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} /></div>
            <div className="space-y-2"><Label>Meta Description</Label><Textarea rows={3} value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} /></div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={onSave} disabled={saveMutation.isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          {saveMutation.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving</> : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getUser, changePassword } from "@/services/auth";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/_admin/profile")({ ssr: false, component: ProfilePage });

function ProfilePage() {
  const user = getUser();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const onUpdate = async () => {
    if (!currentPassword || !newPassword) {
      toast.info("Fill both password fields to change your password");
      return;
    }
    setSaving(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to change password");
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Your account details and security preferences." breadcrumbs={[{ label: "Profile" }]} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="card-elevated">
          <CardContent className="p-8 text-center">
            <Avatar className="h-24 w-24 mx-auto ring-4 ring-primary/10">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-semibold">
                {user?.name?.slice(0, 2).toUpperCase() ?? "AD"}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-display text-xl font-semibold mt-4 capitalize">{user?.name ?? "Admin"}</h3>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-xs font-medium text-gold-foreground">
              Administrator
            </div>
            <Button variant="outline" size="sm" className="mt-6">Change Avatar</Button>
          </CardContent>
        </Card>

        <Card className="card-elevated lg:col-span-2">
          <CardHeader><CardTitle className="font-display">Account Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Full Name</Label><Input defaultValue={user?.name ?? ""} disabled /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" defaultValue={user?.email ?? ""} disabled /></div>
              <div className="space-y-2"><Label>Role</Label><Input defaultValue={user?.role ?? "Administrator"} disabled /></div>
            </div>
            <div className="border-t border-border pt-4 space-y-4">
              <h4 className="text-sm font-semibold">Change Password</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Current Password</Label><Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} /></div>
                <div className="space-y-2"><Label>New Password</Label><Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={onUpdate} disabled={saving} className="bg-primary hover:bg-primary/90 text-primary-foreground">{saving ? "Saving…" : "Change Password"}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

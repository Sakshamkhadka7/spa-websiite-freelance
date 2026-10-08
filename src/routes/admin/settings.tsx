import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AdminPage } from "@/components/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { getErrorMessage } from "@/lib/api";
export const Route = createFileRoute("/admin/settings")({ component: Settings });
function Settings() {
  const a = useAuth();
  const [name, setName] = useState(a.user?.name ?? ""),
    [phone, setPhone] = useState(a.user?.phone ?? ""),
    [currentPassword, setCurrent] = useState(""),
    [newPassword, setNew] = useState("");
  return (
    <AdminPage title="Settings" description="Manage your administrator profile and password.">
      <div className="grid gap-6 md:grid-cols-2">
        <form
          className="surface-card space-y-4 p-6 lg:p-8"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await a.updateProfile({ name, phone });
              toast.success("Profile updated");
            } catch (x) {
              toast.error(getErrorMessage(x));
            }
          }}
        >
          <h2 className="heading-card">Profile</h2>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
          <Input value={a.user?.email ?? ""} disabled />
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <Button>Save profile</Button>
        </form>
        <form
          className="surface-card space-y-4 p-6 lg:p-8"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await a.changePassword({ currentPassword, newPassword });
              setCurrent("");
              setNew("");
              toast.success("Password changed");
            } catch (x) {
              toast.error(getErrorMessage(x));
            }
          }}
        >
          <h2 className="heading-card">Password</h2>
          <Input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrent(e.target.value)}
            required
          />
          <Input
            type="password"
            minLength={8}
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNew(e.target.value)}
            required
          />
          <Button>Change password</Button>
        </form>
      </div>
    </AdminPage>
  );
}

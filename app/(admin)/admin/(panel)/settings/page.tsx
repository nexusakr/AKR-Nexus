import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { SettingsForm } from "@/components/admin/settings-form";
import type { SiteSettings } from "@/types/database";

export default async function SettingsPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-navy-900">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Contact details, social links, RERA and analytics.
        </p>
      </div>
      <SettingsForm settings={(data as SiteSettings | null) ?? null} />
    </div>
  );
}

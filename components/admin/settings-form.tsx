"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateSettings, type SettingsState } from "@/lib/actions/admin-settings";
import type { SiteSettings } from "@/types/database";

const initial: SettingsState = { ok: false, message: "" };
const input =
  "w-full rounded-md border border-border px-3 py-2 text-sm focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200";

function Field({
  label,
  name,
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-navy-800">{label}</label>
      <input
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={input}
      />
    </div>
  );
}

function Save() {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="rounded-md bg-gold-500 px-6 py-2.5 text-sm font-semibold text-navy-950 hover:bg-gold-600 disabled:opacity-60"
    >
      {pending ? "Saving…" : "Save Settings"}
    </button>
  );
}

export function SettingsForm({ settings }: { settings: SiteSettings | null }) {
  const [state, action] = useActionState(updateSettings, initial);
  const s = settings;

  return (
    <form action={action} className="space-y-8">
      <Section title="Contact">
        <Field label="WhatsApp number (no +)" name="whatsapp_number" defaultValue={s?.whatsapp_number} placeholder="918210480043" />
        <Field label="Phone" name="phone" defaultValue={s?.phone} placeholder="+918210480043" />
        <Field label="Email" name="email" defaultValue={s?.email} />
        <Field label="Address" name="address" defaultValue={s?.address} />
        <Field label="Google Maps embed URL" name="map_embed_url" defaultValue={s?.map_embed_url} placeholder="https://www.google.com/maps/embed?..." />
      </Section>

      <Section title="Compliance">
        <Field label="RERA number (shown in footer when set)" name="rera_number" defaultValue={s?.rera_number} placeholder="Leave blank until registered" />
      </Section>

      <Section title="Social Links">
        <Field label="Facebook" name="facebook_url" defaultValue={s?.facebook_url} />
        <Field label="Instagram" name="instagram_url" defaultValue={s?.instagram_url} />
        <Field label="LinkedIn" name="linkedin_url" defaultValue={s?.linkedin_url} />
        <Field label="YouTube" name="youtube_url" defaultValue={s?.youtube_url} />
        <Field label="X / Twitter" name="twitter_url" defaultValue={s?.twitter_url} />
      </Section>

      <Section title="Analytics (paste IDs to enable)">
        <Field label="Google Analytics 4 ID" name="ga4_id" defaultValue={s?.ga4_id} placeholder="G-XXXXXXX" />
        <Field label="Google Tag Manager ID" name="gtm_id" defaultValue={s?.gtm_id} placeholder="GTM-XXXXXX" />
        <Field label="Meta Pixel ID" name="meta_pixel_id" defaultValue={s?.meta_pixel_id} />
      </Section>

      <p className="text-xs text-muted-foreground">
        Note: Analytics IDs saved here are stored for reference. To activate
        scripts site-wide, also set the matching <code>NEXT_PUBLIC_*</code>{" "}
        environment variables and redeploy.
      </p>

      <div className="flex items-center gap-4">
        <Save />
        {state.message && (
          <span className={state.ok ? "text-sm text-green-700" : "text-sm text-red-600"}>
            {state.message}
          </span>
        )}
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-white p-6">
      <h2 className="font-serif text-lg text-navy-900">{title}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

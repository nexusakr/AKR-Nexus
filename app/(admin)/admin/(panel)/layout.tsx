import type { Metadata } from "next";
import { Sidebar } from "@/components/admin/sidebar";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { requireStaff } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireStaff();

  return (
    <div className="flex min-h-screen bg-muted">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-navy-950 lg:flex">
        <div className="border-b border-white/10 px-5 py-4">
          <span className="font-serif text-xl text-white">
            AKR <span className="text-gold-400">Nexus</span>
          </span>
          <p className="text-xs text-navy-300">Admin Dashboard</p>
        </div>
        <Sidebar />
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-white px-5 py-3">
          <div className="lg:hidden">
            <span className="font-serif text-lg text-navy-900">
              AKR <span className="text-gold-600">Nexus</span>
            </span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {profile.full_name || profile.email}{" "}
              <span className="rounded-full bg-navy-100 px-2 py-0.5 text-xs font-medium text-navy-700">
                {profile.role}
              </span>
            </span>
            <SignOutButton />
          </div>
        </header>

        {/* Mobile sidebar (simple horizontal) */}
        <div className="border-b border-border bg-navy-950 lg:hidden">
          <Sidebar />
        </div>

        <main className="flex-1 p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

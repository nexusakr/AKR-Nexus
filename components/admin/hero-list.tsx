"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, CheckCircle2, AlertCircle, X } from "lucide-react";
import { activateHero, deleteHero } from "@/lib/actions/admin-cms";
import type { HeroSection } from "@/types/database";

type Toast = { id: number; type: "success" | "error"; msg: string };

export function HeroList({ heroes }: { heroes: HeroSection[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingDelete, setPendingDelete] = useState<HeroSection | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  function toast(type: Toast["type"], msg: string) {
    const id = (toastId.current += 1);
    setToasts((t) => [...t, { id, type, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4500);
  }

  function handleActivate(hero: HeroSection) {
    setBusyId(hero.id);
    startTransition(async () => {
      const res = await activateHero(hero.id);
      setBusyId(null);
      if (res.ok) {
        toast("success", "Hero activated. Others on this page were deactivated.");
        router.refresh();
      } else {
        toast("error", res.error || "Could not activate hero.");
      }
    });
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    const hero = pendingDelete;
    setBusyId(hero.id);
    startTransition(async () => {
      const res = await deleteHero(hero.id);
      setBusyId(null);
      setPendingDelete(null);
      if (res.ok) {
        toast("success", "Hero section deleted.");
        router.refresh();
      } else {
        toast("error", res.error || "Could not delete hero.");
      }
    });
  }

  return (
    <>
      <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-white">
        {heroes.length ? (
          heroes.map((h) => (
            <div
              key={h.id}
              className="flex items-start justify-between gap-4 p-4 hover:bg-muted"
            >
              <div className="min-w-0">
                <Link
                  href={`/admin/hero?edit=${h.id}`}
                  className="font-medium text-navy-900 hover:text-gold-700"
                >
                  {h.heading || "(no heading)"}
                </Link>
                <span className="ml-2 rounded-full bg-navy-100 px-2 py-0.5 text-xs text-navy-700">
                  {h.page_key}
                </span>
                {h.is_active && (
                  <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
                    active
                  </span>
                )}
                <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                  {h.subtitle}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {!h.is_active && (
                  <button
                    type="button"
                    onClick={() => handleActivate(h)}
                    disabled={isPending && busyId === h.id}
                    className="rounded border border-border px-2 py-1 text-xs text-navy-700 hover:bg-navy-50 disabled:opacity-50"
                  >
                    {isPending && busyId === h.id ? "Activating…" : "Activate"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setPendingDelete(h)}
                  disabled={isPending && busyId === h.id}
                  aria-label="Delete hero"
                  className="rounded border border-red-200 p-1 text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="p-10 text-center text-muted-foreground">
            No hero sections yet.
          </p>
        )}
      </div>

      {/* Confirmation dialog */}
      {pendingDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/50 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-xl border border-border bg-white p-6 shadow-xl">
            <h3 className="font-serif text-lg text-navy-900">Delete hero section?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              This will permanently delete{" "}
              <span className="font-medium text-navy-800">
                “{pendingDelete.heading || "(no heading)"}”
              </span>{" "}
              ({pendingDelete.page_key}). This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                disabled={isPending}
                className="rounded-md border border-border px-4 py-2 text-sm text-navy-700 hover:bg-muted disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isPending}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isPending ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="fixed bottom-5 right-5 z-[60] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-start gap-2 rounded-lg border px-4 py-3 text-sm shadow-lg ${
              t.type === "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {t.type === "success" ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            <span className="max-w-xs">{t.msg}</span>
            <button
              type="button"
              onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))}
              className="ml-1 text-current opacity-60 hover:opacity-100"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

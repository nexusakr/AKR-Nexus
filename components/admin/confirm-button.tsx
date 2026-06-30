"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/admin/toast";

type ActionResult = { ok: boolean; error?: string };

/**
 * A button that asks for confirmation, runs a server action, then shows a
 * success/error toast and refreshes the route. Reusable across admin lists.
 * The trigger styling is fully controlled via `className` + `children` so the
 * existing UI is preserved.
 */
export function ConfirmButton({
  onConfirm,
  successMessage,
  title = "Are you sure?",
  message,
  confirmLabel = "Delete",
  className,
  children,
  ariaLabel,
}: {
  onConfirm: () => Promise<ActionResult>;
  successMessage: string;
  title?: string;
  message: string;
  confirmLabel?: string;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  const toast = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function run() {
    startTransition(async () => {
      const res = await onConfirm();
      setOpen(false);
      if (res.ok) {
        toast("success", successMessage);
        router.refresh();
      } else {
        toast("error", res.error || "Action failed.");
      }
    });
  }

  return (
    <>
      <button
        type="button"
        aria-label={ariaLabel}
        className={className}
        onClick={() => setOpen(true)}
      >
        {children}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/50 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-xl border border-border bg-white p-6 shadow-xl">
            <h3 className="font-serif text-lg text-navy-900">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{message}</p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="rounded-md border border-border px-4 py-2 text-sm text-navy-700 hover:bg-muted disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={run}
                disabled={isPending}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isPending ? "Working…" : confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

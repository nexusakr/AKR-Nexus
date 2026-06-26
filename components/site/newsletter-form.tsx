"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { subscribe, type SubscribeState } from "@/lib/actions/leads";

const initial: SubscribeState = { ok: false, message: "" };

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-[var(--radius)] bg-gold-500 px-4 py-2 text-sm font-semibold text-navy-950 hover:bg-gold-600 disabled:opacity-60"
    >
      {pending ? "…" : "Join"}
    </button>
  );
}

export function NewsletterForm() {
  const [state, action] = useActionState(subscribe, initial);

  if (state.ok) {
    return <p className="mt-2 text-sm text-gold-300">{state.message}</p>;
  }

  return (
    <form action={action} className="mt-2 flex gap-2">
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <input type="hidden" name="source" value="footer" />
      <input
        name="email"
        type="email"
        required
        placeholder="Your email"
        className="w-full rounded-[var(--radius)] border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-gold-400"
      />
      <Submit />
      {!state.ok && state.message && (
        <p className="text-xs text-red-300">{state.message}</p>
      )}
    </form>
  );
}

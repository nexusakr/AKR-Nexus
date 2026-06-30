"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Cloudflare Turnstile widget using EXPLICIT rendering.
 *
 * Implicit rendering (a `.cf-turnstile` div auto-scanned by api.js) does not
 * work with Next.js App Router client-side navigation — the script only scans
 * once on first load, so the widget never appears after an in-app navigation,
 * and no token is produced. Explicit rendering re-renders on every mount and
 * writes the token into a controlled hidden input named `cf-turnstile-response`
 * so it is always submitted with the form.
 */

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_ID = "cf-turnstile-script";
const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

export function Turnstile({
  siteKey,
  resetKey = 0,
}: {
  siteKey: string;
  resetKey?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    let cancelled = false;

    function renderWidget() {
      if (cancelled) return;
      const el = containerRef.current;
      if (!el || !window.turnstile || widgetIdRef.current) return;
      widgetIdRef.current = window.turnstile.render(el, {
        sitekey: siteKey,
        // We manage our own hidden input below.
        "response-field": false,
        callback: (t: string) => setToken(t),
        "error-callback": () => setToken(""),
        "expired-callback": () => setToken(""),
        "timeout-callback": () => setToken(""),
      });
    }

    // Load the explicit-mode script once, then render.
    if (window.turnstile) {
      renderWidget();
    } else {
      let script = document.getElementById(
        SCRIPT_ID
      ) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement("script");
        script.id = SCRIPT_ID;
        script.src = SCRIPT_SRC;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
      script.addEventListener("load", renderWidget);
    }

    // Safety net for the case where the script is already loading from a
    // previous mount (its `load` event won't fire again for this listener).
    const interval = setInterval(() => {
      if (widgetIdRef.current) {
        clearInterval(interval);
      } else if (window.turnstile) {
        renderWidget();
      }
    }, 250);

    return () => {
      cancelled = true;
      clearInterval(interval);
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          /* noop */
        }
        widgetIdRef.current = null;
      }
    };
  }, [siteKey]);

  // Tokens are single-use; reset the widget to mint a fresh one on retry.
  useEffect(() => {
    if (resetKey > 0 && widgetIdRef.current && window.turnstile) {
      try {
        window.turnstile.reset(widgetIdRef.current);
      } catch {
        /* noop */
      }
      setToken("");
    }
  }, [resetKey]);

  return (
    <div>
      <div ref={containerRef} />
      <input type="hidden" name="cf-turnstile-response" value={token} />
    </div>
  );
}

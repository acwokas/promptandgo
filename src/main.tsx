import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const DEV_SW_CLEAR_KEY = "pag_dev_sw_cleared_v1";

async function clearDevServiceWorkerAndCaches(): Promise<boolean> {
  if (!("serviceWorker" in navigator)) return false;

  const registrations = await navigator.serviceWorker.getRegistrations();
  if (registrations.length === 0) return false;

  await Promise.all(registrations.map((r) => r.unregister()));

  if ("caches" in window) {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));
  }

  // Prevent infinite reload loops
  if (localStorage.getItem(DEV_SW_CLEAR_KEY) !== "true") {
    localStorage.setItem(DEV_SW_CLEAR_KEY, "true");
    window.location.reload();
    return true;
  }

  return false;
}

function mountApp() {
  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

(async () => {
  // In dev, a previously-registered SW can cache Vite modules and trigger
  // "Invalid hook call" / "useRef is null" errors. Remove it automatically.
  if (import.meta.env.DEV) {
    const reloaded = await clearDevServiceWorkerAndCaches();
    if (reloaded) return;
  }

  mountApp();

  // Register the service worker only in production builds
  if (import.meta.env.PROD && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // no-op
      });
    });
  }
})();


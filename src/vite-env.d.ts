/// <reference types="vite/client" />

interface Window {
  umami?: {
    // track()/identify() return the beacon `fetch()` promise from Umami's
    // internal send(); it rejects ASYNCHRONOUSLY on a network blip. Typed as
    // the real return (not `void`) so callers can swallow that rejection —
    // otherwise it escapes to onunhandledrejection as a bare
    // `TypeError: Failed to fetch` (WORLDMONITOR-WW/WX/WY).
    track: (event: string, data?: Record<string, unknown>) => void | Promise<unknown>;
    identify: (data: Record<string, unknown>) => void | Promise<unknown>;
  };
}

declare const __APP_VERSION__: string;
declare const __BUILD_HASH__: string;
declare const __CLERK_JS_VERSION__: string;

interface ImportMetaEnv {
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_WS_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

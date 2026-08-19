import { describe, it, beforeEach, before, afterEach } from 'node:test';
import assert from 'node:assert/strict';

/**
 * WORLDMONITOR-WW/WX/WY — `TypeError: Failed to fetch`, onunhandledrejection,
 * 2026-07-20.
 *
 * Umami's `track()` / `identify()` return the beacon `fetch()` promise from
 * their internal send(); that promise rejects ASYNCHRONOUSLY on a transient
 * network failure (offline, an ad-blocker extension that wraps window.fetch —
 * the observed `frame_ant.js` case — or the self-hosted collector being
 * briefly unreachable). `sendUmamiCall`'s `try/catch` only guards a SYNCHRONOUS
 * throw, so the rejection escaped to `onunhandledrejection` and surfaced in
 * Sentry as a bare `TypeError: Failed to fetch` rooted in first-party frames
 * (e.g. applyMapLayerChange → track). A dropped analytics beacon is
 * unactionable; sendUmamiCall must attach a rejection handler to the returned
 * beacon promise so it never leaks.
 *
 * The tests below exercise the real failure mode: `umami.track()` /
 * `identify()` return a genuinely rejected promise, and the test fails if that
 * rejection reaches the process-level `unhandledRejection` hook — the exact
 * path that fed Sentry. Both call kinds are covered because `sendUmamiCall`
 * branches on `call.kind`.
 */

const _store = new Map<string, string>();
before(() => {
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      localStorage: {
        getItem: (k: string) => _store.get(k) ?? null,
        setItem: (k: string, v: string) => { _store.set(k, v); },
        removeItem: (k: string) => { _store.delete(k); },
      },
    },
  });
});

const { track, identifyUser, resetAnalyticsForTesting } = await import('../src/services/analytics.ts');

type WinWithUmami = {
  umami?: { track: (...a: unknown[]) => unknown; identify: (...a: unknown[]) => unknown };
};

/** Install umami stubs whose beacon rejects async, exactly like a failed fetch(). */
function stubFailingUmami(): void {
  (globalThis.window as WinWithUmami).umami = {
    track: () => Promise.reject(new TypeError('Failed to fetch')),
    identify: () => Promise.reject(new TypeError('Failed to fetch')),
  };
}

/** Run `fire`, then fail if the beacon rejection escaped to onunhandledrejection. */
async function assertNoLeak(fire: () => void, label: string): Promise<void> {
  const leaked: unknown[] = [];
  const onUnhandled = (reason: unknown) => { leaked.push(reason); };
  process.on('unhandledRejection', onUnhandled);
  try {
    fire();
    // Drain microtasks + give the host a macrotask to detect any
    // still-unhandled rejection.
    await new Promise((r) => setTimeout(r, 50));
    assert.deepEqual(
      leaked,
      [],
      `${label}: beacon rejection leaked to onunhandledrejection: ${leaked.map(String).join(', ')}`,
    );
  } finally {
    process.off('unhandledRejection', onUnhandled);
  }
}

describe('umami beacon rejection is swallowed (WORLDMONITOR-WW/WX/WY)', () => {
  beforeEach(() => {
    resetAnalyticsForTesting();
    stubFailingUmami();
  });

  afterEach(() => {
    delete (globalThis.window as WinWithUmami).umami;
  });

  it('track(): a failed beacon fetch never escapes to unhandledRejection', async () => {
    await assertNoLeak(() => track('theme-changed', { theme: 'dark' }), 'track');
  });

  it('identifyUser(): a failed beacon fetch never escapes to unhandledRejection', async () => {
    await assertNoLeak(() => identifyUser('user_1', 'free'), 'identify');
  });
});

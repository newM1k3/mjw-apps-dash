# SSO Token Handoff

The ImmersiveKit dashboard uses a URL-parameter token handoff to authenticate users across separate Netlify deployments. Because each tool is a distinct app on its own domain, browser storage (localStorage, cookies) is not shared between them.

## Launch URL format

When a user clicks **Launch Tool**, the dashboard builds the launch URL using `buildLaunchUrl` in `src/lib/sso.ts` and then calls `redirectWithToken` to navigate to it.

The resulting URL looks like:

```
https://your-tool.example.com/?token=<pb_auth_token>&uid=<user_id>&source=mjw-apps-dash
```

### Query parameters

| Parameter | Required | Description |
|---|---|---|
| `token` | When signed in | The current PocketBase auth JWT. Absent if the user has no active session. |
| `uid` | When signed in | The PocketBase user record ID. Absent if no session is active. |
| `source` | Always | Fixed value `mjw-apps-dash`. Identifies the originating dashboard so downstream apps can distinguish dashboard launches from direct access. |

## Using `buildLaunchUrl` directly

The `buildLaunchUrl` export lets you construct a URL without triggering navigation, for example in tests or for generating links:

```typescript
import { buildLaunchUrl } from '../lib/sso';

const url = buildLaunchUrl('https://your-tool.example.com', {
  token: 'custom-token',   // optional — defaults to pb.authStore.token
  userId: 'custom-uid',   // optional — defaults to pb.authStore.model.id
  source: 'mjw-apps-dash', // optional — this is already the default
});
```

If `appUrl` is not a valid URL, `new URL()` will throw and the calling code is responsible for catching it. `redirectWithToken` already wraps this in a try/catch and logs the error without crashing the app.

## What the receiving app must do

On initial load, the tool app should:

1. Read `token`, `uid`, and `source` from the URL query string.
2. If `token` is present, hydrate the tool's own PocketBase auth store: `pb.authStore.save(token, { id: uid })`.
3. Verify the token is still valid by calling `pb.collection('users').authRefresh()`. If it fails, redirect the user back to the dashboard login.
4. Remove `token`, `uid`, and `source` from the URL using `history.replaceState` to avoid them appearing in browser history or being copied in shared URLs.

Example (TypeScript):

```typescript
import PocketBase from 'pocketbase';

const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);

async function initAuth() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const uid = params.get('uid');

  if (token && uid) {
    pb.authStore.save(token, { id: uid });

    try {
      await pb.collection('users').authRefresh();
    } catch {
      pb.authStore.clear();
      window.location.href = 'https://apps.mjwdesign.ca/login';
      return;
    }

    // Clean launch params from the URL
    ['token', 'uid', 'source'].forEach((key) => params.delete(key));
    const qs = params.toString();
    history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
  }
}
```

## Security notes

- The token is a short-lived PocketBase JWT. Its expiry is configured in the PocketBase admin panel.
- Never log the token to the console or persist it in a location visible to other origins.
- Always verify the token server-side (via `authRefresh`) before granting access to protected resources.
- The `uid` parameter is a convenience for hydrating the auth store model; the token itself is the authoritative credential.
- Tool apps must not trust `uid` alone without a valid corresponding token.
- The `source` parameter is informational only and must never be used as a security check.

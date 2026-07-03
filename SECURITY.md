# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| latest  | ✅ actively patched |
| older   | ❌ no backports     |

Only the latest commit on `main` receives security fixes.

## Reporting a Vulnerability

**Please do not open a public GitHub issue for security problems.**

Email details to **security@cholosikhi.com** (PGP key on request).
For non-critical bugs you can also open a private GitHub Security Advisory.

We aim to:
- Acknowledge within **72 hours**.
- Ship a fix or mitigation within **14 days** for high-severity issues.
- Credit the reporter in the release notes (unless you ask to remain anonymous).

## Hardening Notes

This repo ships:

1. **Row-level security** on every Supabase table — do not bypass with a service
   role key on the client.
2. **Strict `Content-Security-Policy` headers** via `vercel.json` +
   `<meta http-equiv>` in `index.html`. If you self-host keep these intact.
3. **No secrets committed.** `.env.local` / `.env*.local` is in `.gitignore`.
   The committed `.env.example` carries only placeholders.

If you fork, rotate your own Supabase keys before going to production and keep
service-role keys **server-side only**.

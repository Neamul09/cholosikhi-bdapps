/**
 * Centralized external links & social URLs.
 *
 * Why this exists:
 * - Hard-coded `https://discord.gg/...` URLs scattered across pages were
 *   impossible to update without grep-and-replace. They also linked to a
 *   non-existent invite, which 404'd.
 * - The placeholder check lets pages gracefully degrade to "Coming soon"
 *   copy instead of pretending a server exists.
 *
 * To enable the real Discord invite:
 *   1. Set `VITE_DISCORD_URL` in `.env.local`.
 *   2. Restart `npm run dev` (Vite reads env vars at startup).
 *
 * The same env var is used by the landing site (cholosikhi/) — keeping the
 * two repos in sync via the variable name.
 */

const PLACEHOLDER_HOSTS = new Set([
  'discord.gg/cholosikhi-placeholder',
  'discord.gg/cholosikhi',
]);

const discordRaw =
  (import.meta.env.VITE_DISCORD_URL as string | undefined)?.trim() ||
  'https://discord.gg/cholosikhi-placeholder';

/** External Discord invite URL. Defaults to a safe placeholder. */
export const DISCORD_URL: string = discordRaw;

/**
 * `true` when the configured Discord URL is the placeholder, not a real
 * invite. UI should render a "Coming soon" hint instead of an external CTA.
 */
export const isDiscordPlaceholder: boolean =
  PLACEHOLDER_HOSTS.has(discordRaw.replace(/^https?:\/\//, ''));

/** External contact email (used by landing + community hub). */
export const CONTACT_EMAIL: string =
  (import.meta.env.VITE_CONTACT_EMAIL as string | undefined)?.trim() ||
  'contact@cholosikhi.com';

/** GitHub repo URL for the platform / py.cholosikhi codebase. */
export const GITHUB_REPO_URL = 'https://github.com/Neamul09/py.cholosikhi';

/** Build a mailto: link with a pre-filled subject. */
export const contactMailto = (
  subject: string,
  body = 'Hello CholoSikhi Team,\n\n',
): string =>
  `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

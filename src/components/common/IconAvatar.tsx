import * as Icons from 'lucide-react';
import { clsx } from 'clsx';
import { AVATAR_ICONS, type IconName } from './iconAvatarList';

export { AVATAR_ICONS, type IconName };

// Runtime allowlist — defense-in-depth so untrusted `name` values (e.g. from
// URL params, profile JSON, or future remote sources) can't resolve arbitrary
// exports from the lucide-react namespace.
const ALLOWED_NAMES: ReadonlySet<string> = new Set(AVATAR_ICONS);

interface IconAvatarProps {
  name: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export default function IconAvatar({
  name,
  size = 24,
  className,
  strokeWidth = 2,
}: IconAvatarProps) {
  // Validate against allowlist before lookup; fall back to User on mismatch.
  const Icon = ALLOWED_NAMES.has(name)
    ? (Icons[name as IconName] as Icons.LucideIcon)
    : Icons.User;

  return (
    <div className={clsx("flex items-center justify-center shrink-0", className)}>
      <Icon size={size} strokeWidth={strokeWidth} />
    </div>
  );
}

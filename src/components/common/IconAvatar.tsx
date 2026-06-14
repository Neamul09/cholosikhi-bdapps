import * as Icons from 'lucide-react';
import { clsx } from 'clsx';

export type IconName = keyof typeof Icons;

export const AVATAR_ICONS: IconName[] = [
  'User', 'Cpu', 'Zap', 'Ghost', 'Cat', 'Dog', 'Fish', 'Bird', 
  'Gamepad2', 'Rocket', 'Heart', 'Star', 'Crown', 'Music', 'Coffee',
  'Code2', 'Terminal', 'Brain', 'Smile', 'Lightbulb', 'Target', 'Trophy'
];

interface IconAvatarProps {
  name: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export default function IconAvatar({ name, size = 24, className, strokeWidth = 2 }: IconAvatarProps) {
  // Fallback to User icon if not found
  const Icon = (Icons[name as IconName] as any) || Icons.User;
  
  return (
    <div className={clsx("flex items-center justify-center shrink-0", className)}>
      <Icon size={size} strokeWidth={strokeWidth} />
    </div>
  );
}

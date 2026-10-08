import { useLocation, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import PaywallLock from './PaywallLock';
import AppShell from '@/components/layout/AppShell';

interface SubscriptionGuardProps {
  suite?: 'sat' | 'py';
  children?: React.ReactNode;
  wrapInAppShell?: boolean;
}

export default function SubscriptionGuard({ suite = 'sat', children, wrapInAppShell = false }: SubscriptionGuardProps) {
  const { session, isSubscribed, subscriptionStatus } = useAuthStore();
  const location = useLocation();

  const currentStatus = (subscriptionStatus || session?.subscriptionStatus || '').toUpperCase();
  const isPaid = (isSubscribed || session?.isSubscribed) && currentStatus === 'REGISTERED';

  const path = location.pathname.toLowerCase();
  const isUnlockedRoute = path.includes('/profile') || path.includes('/leaderboard');

  if (!isPaid && !isUnlockedRoute) {
    if (wrapInAppShell && suite === 'py') {
      return (
        <AppShell>
          <PaywallLock suite="py" />
        </AppShell>
      );
    }
    return <PaywallLock suite={suite} />;
  }

  return children ? <>{children}</> : <Outlet />;
}

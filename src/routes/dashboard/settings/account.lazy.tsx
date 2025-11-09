import { createLazyFileRoute } from '@tanstack/react-router';
import SettingsAccount from '@/features/settings/account';

export const Route = createLazyFileRoute('/dashboard/settings/account')({
  component: SettingsAccount,
});

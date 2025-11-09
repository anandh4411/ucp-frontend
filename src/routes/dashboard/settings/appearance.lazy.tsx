import { createLazyFileRoute } from '@tanstack/react-router';
import SettingsAppearance from '@/features/settings/appearance';

export const Route = createLazyFileRoute('/dashboard/settings/appearance')({
  component: SettingsAppearance,
});

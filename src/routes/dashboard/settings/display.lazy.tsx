import { createLazyFileRoute } from '@tanstack/react-router';
import SettingsDisplay from '@/features/settings/display';

export const Route = createLazyFileRoute('/dashboard/settings/display')({
  component: SettingsDisplay,
});

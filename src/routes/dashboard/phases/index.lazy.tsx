import { createLazyFileRoute } from '@tanstack/react-router';
import Phases from '@/features/phases';

export const Route = createLazyFileRoute('/dashboard/phases/')({
  component: Phases,
});

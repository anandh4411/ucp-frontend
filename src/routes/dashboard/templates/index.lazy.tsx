import { createLazyFileRoute } from '@tanstack/react-router';
import Templates from '@/features/templates';

export const Route = createLazyFileRoute('/dashboard/templates/')({
  component: Templates,
});

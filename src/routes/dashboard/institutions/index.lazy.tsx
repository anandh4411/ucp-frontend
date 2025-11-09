import { createLazyFileRoute } from '@tanstack/react-router';
import Institutions from '@/features/institutions';

export const Route = createLazyFileRoute('/dashboard/institutions/')({
  component: Institutions,
});

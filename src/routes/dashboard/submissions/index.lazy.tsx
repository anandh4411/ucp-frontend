import { createLazyFileRoute } from '@tanstack/react-router';
import Submissions from '@/features/submissions';

export const Route = createLazyFileRoute('/dashboard/submissions/')({
  component: Submissions,
});

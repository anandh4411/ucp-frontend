import { createLazyFileRoute } from '@tanstack/react-router';
import Forms from '@/features/forms';

export const Route = createLazyFileRoute('/dashboard/forms/')({
  component: Forms,
});

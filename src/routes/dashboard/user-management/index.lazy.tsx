import { createLazyFileRoute } from '@tanstack/react-router';
import Users from '@/features/users';

export const Route = createLazyFileRoute('/dashboard/user-management/')({
  component: Users,
});

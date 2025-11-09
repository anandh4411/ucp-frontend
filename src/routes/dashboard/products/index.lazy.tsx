import { createLazyFileRoute } from '@tanstack/react-router';
import Products from '@/features/products';

export const Route = createLazyFileRoute('/dashboard/products/')({
  component: Products,
});

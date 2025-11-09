/**
 * Toast Notification System
 *
 * Centralized, callable toast notifications for the entire application.
 * Can be called from anywhere - hooks, components, utils, etc.
 *
 * Usage:
 *   import { toast } from '@/lib/toast';
 *   toast.success('Operation completed!');
 *   toast.error('Something went wrong', 'Error details here');
 */

export { toaster as toast } from './toaster';
export { showSuccess, showError, showInfo, showWarning } from './error-handler';

// Type-safe toast with all options
export type { HandleErrorOptions } from './error-handler';

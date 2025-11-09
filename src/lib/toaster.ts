import { toast } from "sonner";

export const toaster = {
  success: (title: string, description?: string) => {
    toast.success(title, {
      description,
    });
  },
  error: (title: string, description?: string) => {
    toast.error(title, {
      description,
    });
  },
  info: (title: string, description?: string) => {
    toast.info(title, {
      description,
    });
  },
  warn: (title: string, description?: string) => {
    toast.warning(title, {
      description,
    });
  },
};

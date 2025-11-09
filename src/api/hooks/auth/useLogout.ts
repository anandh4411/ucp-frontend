import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

export const useLogout = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // In real app: await authApi.logout()
      return { success: true };
    },
    onSuccess: () => {
      // Clear all UCP localStorage
      localStorage.removeItem("ucp_token");
      localStorage.removeItem("ucp_user");
      localStorage.removeItem("ucp_remember");

      toast.success("Logged out successfully");

      // Redirect to sign in
      router.navigate({ to: "/sign-in" });
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });
};

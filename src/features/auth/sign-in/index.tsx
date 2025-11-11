import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { Shield, Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { login as firebaseLogin } from "@/api/firebase/auth";

// Sign in schema - remove .default() to keep type consistent
const SignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean(),
});

type SignInForm = z.infer<typeof SignInSchema>;

export default function SignIn() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignInForm>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false, // Set default here instead
    },
  });

  const onSubmit = async (values: SignInForm) => {
    setIsLoading(true);

    try {
      // Call Firebase login
      const result = await firebaseLogin({
        email: values.email,
        password: values.password,
      });

      // Check if user is active
      if (!result.profile.isActive) {
        toast.error("Your account is inactive. Contact administrator.");
        setIsLoading(false);
        return;
      }

      // Manually store tokens and user data for immediate access
      localStorage.setItem("ucp_token", result.tokens.accessToken);
      if (result.tokens.refreshToken) {
        localStorage.setItem("ucp_refresh_token", result.tokens.refreshToken);
      }
      localStorage.setItem("ucp_user", JSON.stringify({
        uuid: result.profile.uuid,
        name: result.profile.name,
        email: result.profile.email,
        role: result.profile.role,
        rank: result.profile.rank,
        serviceNumber: result.profile.serviceNumber,
        unit: result.profile.unit,
        avatar: result.profile.avatar,
      }));

      if (values.rememberMe) {
        localStorage.setItem("ucp_remember", "true");
      }

      toast.success(`Welcome back, ${result.profile.rank} ${result.profile.name}!`);

      // Navigate to dashboard
      router.navigate({ to: "/dashboard" });
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Sign in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Unit Communication Portal
          </CardTitle>
          <CardDescription>
            Sign in to access secure military communications
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your.email@unit.army"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          autoComplete="current-password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal cursor-pointer">
                        Remember me
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-sm"
                  onClick={() => router.navigate({ to: "/forgot-password" })}
                >
                  Forgot password?
                </Button>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>

              {/* Sign Up Link */}
              <div className="text-center text-sm">
                <span className="text-muted-foreground">
                  Don't have an account?{" "}
                </span>
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto font-semibold"
                  onClick={() => router.navigate({ to: "/sign-up" })}
                >
                  Sign Up
                </Button>
              </div>

              {/* Demo Credentials */}
              <div className="mt-6 p-4 bg-muted/50 rounded-lg space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase">
                  Demo Credentials
                </p>
                <div className="text-xs space-y-1">
                  <div>
                    <span className="font-semibold">Adjt:</span> adjt@unit.mil
                    / Adjt@2025
                  </div>
                  <div>
                    <span className="font-semibold">IT JCO:</span>{" "}
                    itjco@unit.mil / ItJco@2025
                  </div>
                  <div>
                    <span className="font-semibold">User:</span> user@unit.mil
                    / User@2025
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

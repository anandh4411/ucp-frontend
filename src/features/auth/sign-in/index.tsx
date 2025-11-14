import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { Shield, Eye, EyeOff, Lock } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
    <div className="min-h-screen flex">
      {/* Left Side - Military Background */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary via-primary/90 to-primary overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1551522435-a13afa10f103?w=1200&h=1200&fit=crop')",
          }}
        />

        {/* Overlay Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.05)_25%,rgba(68,68,68,.05)_50%,transparent_50%,transparent_75%,rgba(68,68,68,.05)_75%,rgba(68,68,68,.05))] bg-[length:60px_60px]" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 text-primary-foreground">
          {/* Unit Badge */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-primary-foreground/10 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-primary-foreground/30 shadow-2xl">
              <Shield className="w-14 h-14 text-primary-foreground" strokeWidth={1.5} />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-bold mb-4 tracking-tight">
            Unit Communication Portal
          </h1>

          <p className="text-xl text-primary-foreground/80 mb-8 max-w-md leading-relaxed">
            Secure military communications platform for operational excellence and unit coordination.
          </p>

          {/* Features */}
          <div className="space-y-3 text-primary-foreground/80">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-chart-2 rounded-full" />
              <span>Encrypted end-to-end communications</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-chart-2 rounded-full" />
              <span>Real-time mission updates & alerts</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-chart-2 rounded-full" />
              <span>Secure document sharing & resources</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-secondary to-secondary/80">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <Shield className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-card rounded-2xl shadow-2xl p-8 border border-border">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Lock className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Secure Access
                </span>
              </div>
              <h2 className="text-3xl font-bold text-card-foreground mb-2">
                Welcome Back
              </h2>
              <p className="text-muted-foreground">
                Enter your credentials to access the portal
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-foreground">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your.email@unit.army"
                          autoComplete="email"
                          className="h-11 bg-secondary border-input"
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
                      <FormLabel className="text-sm font-semibold text-foreground">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            className="h-11 bg-secondary border-input pr-10"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
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
                <div className="flex items-center justify-between pt-1">
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
                        <FormLabel className="text-sm font-normal cursor-pointer text-foreground">
                          Remember me
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto text-sm font-semibold text-foreground hover:text-foreground/80"
                    onClick={() => router.navigate({ to: "/forgot-password" })}
                  >
                    Forgot password?
                  </Button>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-11 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Authenticating...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                {/* Sign Up Link */}
                <div className="text-center text-sm pt-2">
                  <span className="text-muted-foreground">
                    Don't have an account?{" "}
                  </span>
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto font-semibold text-foreground hover:underline"
                    onClick={() => router.navigate({ to: "/sign-up" })}
                  >
                    Request Access
                  </Button>
                </div>

                {/* Demo Credentials */}
                <div className="mt-6 p-4 bg-chart-4/10 border border-chart-4/30 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-chart-4 rounded-full" />
                    <p className="text-xs font-bold text-chart-4 uppercase tracking-wide">
                      Test Credentials
                    </p>
                  </div>
                  <div className="text-xs space-y-1 text-foreground font-mono">
                    <div className="flex justify-between">
                      <span className="font-semibold">Adjutant:</span>
                      <span>adjt@unit.mil / Adjt@2025</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">IT JCO:</span>
                      <span>itjco@unit.mil / ItJco@2025</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">User:</span>
                      <span>user@unit.mil / User@2025</span>
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground mt-8">
            Protected by military-grade encryption · All access logged
          </p>
        </div>
      </div>
    </div>
  );
}

import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

// Form schemas
const loginSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters long",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
});

const registerSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters long",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [location, navigate] = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle login submit
  function onLoginSubmit(values: LoginFormValues) {
    loginMutation.mutate(values);
  }

  // Handle register submit
  function onRegisterSubmit(values: RegisterFormValues) {
    // Extract username and password, omit confirmPassword
    const { username, password } = values;
    registerMutation.mutate({ username, password });
  }

  return (
    <>
      <Helmet>
        <title>Login | FotoDS - Dawid Siedlec Photography</title>
        <meta 
          name="description" 
          content="Sign in to FotoDS photography portfolio admin area."
        />
      </Helmet>

      <div className="flex min-h-screen bg-muted">
        {/* Left Column: Auth Forms */}
        <div className="flex items-center justify-center w-full lg:w-1/2 p-8">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-poppins font-semibold mb-2">FotoDS</h1>
              <p className="text-secondary">Photography by Dawid Siedlec</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Admin Login</CardTitle>
                <CardDescription>
                  Sign in to access the admin dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your username" 
                              {...field} 
                              disabled={loginMutation.isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Enter your password" 
                              {...field} 
                              disabled={loginMutation.isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            <div className="mt-8 text-center">
              <p className="text-sm text-secondary">
                Return to{" "}
                <a href="/" className="text-primary hover:underline">
                  homepage
                </a>
              </p>
            </div>
          </div>
        </div>
        
        {/* Right Column: Hero Section */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <div className="absolute inset-0 bg-black">
            <img 
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1920&h=1080" 
              alt="Interior photography" 
              className="w-full h-full object-cover opacity-70" 
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/20"></div>
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="max-w-lg text-white">
              <h2 className="text-3xl font-poppins font-semibold mb-4">
                Admin Portal for FotoDS
              </h2>
              <p className="text-white/80 mb-6">
                Sign in to manage your photography portfolio. Add new photos, 
                update categories, and handle customer inquiries all from one place.
              </p>
              <div className="border-l-4 border-white/70 pl-4 py-2">
                <p className="italic text-white/90">
                  "In photography there is a reality so subtle that it becomes more real than reality."
                </p>
                <p className="mt-2 text-white/70">— Alfred Stieglitz</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

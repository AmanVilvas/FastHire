import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Eye, EyeOff, Sparkles, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Google icon component
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

interface AuthPageProps {
  onAuthSuccess: () => void;
  onContinueAsGuest?: () => void;
}

const AuthPage = ({ onAuthSuccess, onContinueAsGuest }: AuthPageProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const { toast } = useToast();

  // Google OAuth sign in
  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://wgrlvodoufjudnnhlfmo.supabase.co/auth/v1/callback',
        },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error("OAuth error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Resend verification email
  const handleResendVerification = async () => {
    if (!email) {
      toast({
        title: "Enter your email",
        description: "Please enter your email address first.",
        variant: "destructive",
      });
      return;
    }

    setResendingEmail(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) throw error;

      toast({
        title: "Verification email sent!",
        description: "Please check your inbox for the verification link.",
      });
    } catch (error: any) {
      console.error("Resend error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setResendingEmail(false);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event);
      if (event === 'SIGNED_IN' && session) {
        console.log("User signed in:", session.user?.email);
        onAuthSuccess();
      }
    });

    return () => subscription.unsubscribe();
  }, [onAuthSuccess]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
            },
            // Skip email confirmation for development
            emailRedirectTo: window.location.origin,
          },
        });

        if (error) throw error;

        console.log("Signup response:", data);

        // Check if user was created (some Supabase setups auto-confirm)
        if (data.user && data.session) {
          // User was auto-confirmed, they're signed in
          toast({
            title: "Success!",
            description: "Account created successfully!",
          });
          onAuthSuccess();
        } else {
          // Email confirmation required
          setSignupSuccess(true);
          toast({
            title: "Check your email!",
            description: "We sent you a confirmation link. Please check your email.",
          });
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        console.log("Signin response:", data);

        // Check if email is confirmed
        if (data.user && !data.user.email_confirmed_at) {
          // Email not confirmed - sign out and show message
          await supabase.auth.signOut();
          toast({
            title: "Email not verified",
            description: "Please check your email and click the verification link before signing in.",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Welcome back!",
          description: "Successfully signed in.",
        });
        // Auth state change listener will handle the redirect
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-black">
      {/* Left Side - Gradient Image with Quote */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-800 to-pink-700">
          {/* Animated wave effect using CSS */}
          <div className="absolute inset-0 opacity-80">
            <svg viewBox="0 0 1440 800" className="absolute inset-0 w-full h-full">
              <defs>
                <linearGradient id="wave-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="50%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
                <linearGradient id="wave-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
                <linearGradient id="wave-gradient-3" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="50%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
              
              {/* Wave layers */}
              <path 
                d="M0,400 C150,300 350,200 600,300 C850,400 1050,500 1200,400 C1350,300 1440,350 1440,350 L1440,800 L0,800 Z" 
                fill="url(#wave-gradient-1)" 
                opacity="0.6"
              />
              <path 
                d="M0,500 C200,400 400,300 650,400 C900,500 1100,600 1300,500 C1400,450 1440,480 1440,480 L1440,800 L0,800 Z" 
                fill="url(#wave-gradient-2)" 
                opacity="0.5"
              />
              <path 
                d="M0,600 C250,500 450,400 700,500 C950,600 1150,700 1350,600 C1420,560 1440,580 1440,580 L1440,800 L0,800 Z" 
                fill="url(#wave-gradient-3)" 
                opacity="0.7"
              />
            </svg>
          </div>
          
          {/* Glow effects */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Top - Badge */}
          <div className="flex items-center gap-3">
            <span className="text-white/80 text-sm font-medium tracking-wider uppercase">A Career Tip</span>
            <div className="flex-1 h-px bg-white/30 max-w-24" />
          </div>

          {/* Bottom - Quote */}
          <div className="space-y-6">
            <h2 className="text-5xl xl:text-6xl font-bold text-white leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Build Your<br />
              Dream<br />
              Career
            </h2>
            <p className="text-white/70 text-lg max-w-md">
              Your resume is the first impression. Make it count with Fast Hire's AI-powered resume builder.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 bg-white relative">
        {/* Mobile gradient background */}
        <div className="absolute inset-0 lg:hidden bg-gradient-to-br from-blue-50 to-purple-50" />
        
        {/* Logo */}
        <div className="relative z-10 w-full max-w-md">
          <div className="flex items-center justify-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Fast Hire</span>
          </div>

          {/* Signup Success Message */}
          {signupSuccess ? (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
                Check Your Email
              </h1>
              <p className="text-gray-500 max-w-sm mx-auto">
                We've sent a confirmation link to <strong className="text-gray-700">{email}</strong>. 
                Please check your inbox and click the link to verify your account.
              </p>
              <button
                onClick={() => {
                  setSignupSuccess(false);
                  setIsSignUp(false);
                }}
                className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-all duration-200"
              >
                Back to Sign In
              </button>
              <button
                onClick={handleResendVerification}
                disabled={resendingEmail}
                className="w-full h-10 text-blue-600 hover:text-blue-700 font-medium transition-colors disabled:opacity-50"
              >
                {resendingEmail ? "Sending..." : "Didn't receive email? Resend"}
              </button>
            </div>
          ) : (
            <>
              {/* Title */}
              <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                  {isSignUp ? "Create Account" : "Welcome Back"}
                </h1>
                <p className="text-gray-500">
                  {isSignUp 
                    ? "Enter your details to create your account" 
                    : "Enter your email and password to access your account"
                  }
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleEmailAuth} className="space-y-5">
            {/* Name fields for signup */}
            {isSignUp && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-gray-700 font-medium">First Name</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    required
                    className="h-12 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-gray-700 font-medium">Last Name</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    required
                    className="h-12 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl pr-10"
                  placeholder="Enter your email"
                  required
                />
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot password - Only for login */}
            {!isSignUp && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors"
                >
                  Forgot Password
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Please wait..." : (isSignUp ? "Sign Up" : "Sign In")}
            </button>

            {/* Resend verification - Only for login */}
            {!isSignUp && (
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={resendingEmail || !email}
                className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendingEmail ? "Sending..." : "Resend verification email"}
              </button>
            )}
          </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full flex items-center justify-center gap-3 h-12 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200"
              >
                <GoogleIcon />
                <span>Continue with Google</span>
              </button>

              {/* Toggle between sign in and sign up */}
              <p className="text-center mt-8 text-gray-600">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-gray-900 font-semibold hover:text-blue-600 transition-colors"
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </p>

              {/* Continue as Guest */}
              {onContinueAsGuest && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={onContinueAsGuest}
                    className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200"
                  >
                    Continue as Guest
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-2">
                    No account required • Limited features
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

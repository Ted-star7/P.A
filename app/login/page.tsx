'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      console.log('User already authenticated, redirecting to dashboard...');
      router.push('/');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      setIsSubmitting(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('Submitting login form...');
      await login(email.trim(), password);
      console.log('Login successful, should redirect...');
    } catch (err: any) {
      console.error('Login form error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading screen while checking auth state
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* LEFT: Branding Section */}
      <div className="relative hidden md:flex md:w-1/2 items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-linear-to-br from-blue-900 via-purple-900 to-pink-800"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1920")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 max-w-lg px-12 text-left">
          <div className="mb-8 flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-white/20 flex items-center justify-center">
              <span className="text-xl font-bold text-white">PA</span>
            </div>
            <h1 className="text-5xl font-bold text-white tracking-wide">
              Pergola Africa
            </h1>
          </div>

          <p className="text-xl text-white/80 mb-6">
            Admin Management Portal
          </p>

          <p className="text-white/70 leading-relaxed">
            Secure dashboard for managing bookings, guests, and resort operations.
            Built for efficiency and control.
          </p>
          
          <div className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <p className="text-white text-sm">
              <span className="font-semibold">Demo Credentials:</span><br/>
              Email: admin@pergolaafrica.com<br/>
              Password: ••••••••
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT: Login Form */}
      <div className="flex w-full md:w-1/2 items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md py-8">
          {/* Mobile Header */}
          <div className="md:hidden mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-xl font-bold text-white">PA</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              Pergola Africa
            </h1>
            <p className="text-sm text-muted-foreground">
              Admin Portal Login
            </p>
          </div>

          <div className="bg-card p-6 sm:p-8 rounded-xl border shadow-sm">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">
                  Welcome Back
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Sign in to your administrator account
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-3 rounded-lg bg-destructive/10 p-4 text-sm border border-destructive/20">
                  <AlertCircle className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
                  <div>
                    <p className="font-medium text-destructive">Login Error</p>
                    <p className="mt-1 text-destructive">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@pergolaafrica.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <Link
                      href="/reset-password"
                      className="text-xs text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isSubmitting}
                      className="h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                      disabled={isSubmitting}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11"
                  disabled={isSubmitting || !email || !password}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              <div className="pt-4 border-t">
                <p className="text-center text-sm text-muted-foreground">
                  Need help? Contact support{' '}
                  <Link 
                    href="mailto:support@pergolaafrica.com" 
                    className="text-primary font-medium hover:underline"
                  >
                    support@pergolaafrica.com
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Security Note */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              🔒 Secure login with JWT tokens. Session automatically expires after 24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
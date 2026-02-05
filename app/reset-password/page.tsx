'use client';

import React from "react"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';

type ResetStep = 'email' | 'verify' | 'reset' | 'success';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { resetPassword, isAuthenticated, isLoading } = useAuth();

  const [step, setStep] = useState<ResetStep>('email');
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successEmail, setSuccessEmail] = useState('');

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(email);
      setSuccessEmail(email);
      setStep('verify');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!resetCode) {
      setError('Reset code is required');
      return;
    }

    // In a real app, you'd verify the code with the backend
    // For demo purposes, we accept any 6-digit code
    if (!/^\d{6}$/.test(resetCode)) {
      setError('Reset code must be 6 digits');
      return;
    }

    setStep('reset');
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // In a real app, you'd send the new password to the backend
    setStep('success');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary mx-auto"></div>
          <p className="text-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side - Info (hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center bg-linear-to-br from-sidebar via-sidebar/80 to-sidebar/60 p-8">
        <div className="text-center max-w-md">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-primary mx-auto">
            <span className="text-2xl font-bold text-primary-foreground">PA</span>
          </div>
          <h1 className="mb-2 text-4xl font-bold text-sidebar-foreground">Pergola Africa</h1>
          <p className="text-lg text-sidebar-accent mb-8">Admin Management Portal</p>
          <p className="text-sidebar-foreground/70">
            Secure your account by resetting your password in just a few steps.
          </p>
        </div>
      </div>

      {/* Right side - Reset form */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-sm">
          {/* Mobile header */}
          <div className="md:hidden mb-8 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary mx-auto">
              <span className="text-xl font-bold text-primary-foreground">PA</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Pergola Africa</h1>
          </div>

          <div className="space-y-6">
            {/* Header */}
            {step !== 'success' && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Link href="/login" className="text-primary hover:text-primary/80">
                    <ArrowLeft className="h-5 w-5" />
                  </Link>
                  <h2 className="text-2xl font-bold text-foreground">Reset Password</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  {step === 'email' && 'Enter your email to get started'}
                  {step === 'verify' && 'Enter the code sent to your email'}
                  {step === 'reset' && 'Create a new password'}
                </p>
              </div>
            )}

            {error && (
              <div className="flex gap-3 rounded-lg bg-destructive/10 p-3 text-sm">
                <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
                <p className="text-destructive">{error}</p>
              </div>
            )}

            {/* Success State */}
            {step === 'success' && (
              <div className="text-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mx-auto">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Password Reset</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your password has been successfully reset
                  </p>
                </div>
                <Link href="/login">
                  <Button className="w-full">Return to Login</Button>
                </Link>
              </div>
            )}

            {/* Email Step */}
            {step === 'email' && (
              <form onSubmit={handleRequestReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="bg-background border-border"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the email associated with your account
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Reset Code'}
                </Button>
              </form>
            )}

            {/* Verify Step */}
            {step === 'verify' && (
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                  A reset code has been sent to {successEmail}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resetCode" className="text-foreground">
                    Reset Code
                  </Label>
                  <Input
                    id="resetCode"
                    type="text"
                    placeholder="000000"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    maxLength={6}
                    disabled={isSubmitting}
                    className="bg-background border-border text-center text-2xl tracking-widest"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the 6-digit code sent to your email
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  Verify Code
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    setStep('email');
                    setResetCode('');
                  }}
                  className="w-full text-sm text-primary hover:underline"
                >
                  Didn't receive the code? Try again
                </button>
              </form>
            )}

            {/* Reset Step */}
            {step === 'reset' && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isSubmitting}
                      className="bg-background border-border pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isSubmitting}
                      className="bg-background border-border pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Resetting...' : 'Reset Password'}
                </Button>
              </form>
            )}

            {/* Back to login link */}
            {step !== 'success' && (
              <p className="text-center text-sm text-muted-foreground">
                Remember your password?{' '}
                <Link href="/login" className="text-primary font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

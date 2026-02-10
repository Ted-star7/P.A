"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  Mail,
  Key,
  Lock,
} from "lucide-react";
import { postRequest } from "@/services/api";

type ResetStep = "email" | "verify" | "reset" | "success";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<ResetStep>("email");
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successEmail, setSuccessEmail] = useState("");

  // Step 1: Request reset code
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Requesting password reset for:", email);

      const response = await postRequest("/open/auth/reset-password/request", {
        email: email.trim(),
      });

      console.log("Reset request response:", response);

      if (
        response.message &&
        (response.message.toLowerCase().includes("success") ||
          response.message.toLowerCase().includes("sent"))
      ) {
        setSuccessEmail(email);
        setSuccessMessage(response.message || "Reset code sent to your email");
        setStep("verify");
      } else {
        throw new Error(response.message || "Failed to send reset email");
      }
    } catch (err: any) {
      console.error("Reset request error:", err);
      setError(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Verify reset token (This is just UI flow, actual verification happens in step 3)
  const handleVerifyToken = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!resetToken) {
      setError("Reset token is required");
      return;
    }

    if (resetToken.length < 6) {
      setError("Reset token must be at least 6 characters");
      return;
    }

    setStep("reset");
  };

  // Step 3: Complete password reset
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Completing password reset for:", email);
      console.log("Using reset token:", resetToken);

      const response = await postRequest("/open/auth/reset-password/complete", {
        resetToken: resetToken.trim(),
        newPassword: password,
      });

      console.log("Reset complete response:", response);

      if (
        response.message &&
        response.message.toLowerCase().includes("success")
      ) {
        setSuccessMessage(response.message || "Password reset successful!");
        setStep("success");
      } else {
        throw new Error(response.message || "Failed to reset password");
      }
    } catch (err: any) {
      console.error("Reset password error:", err);

      if (
        err.message?.includes("invalid") ||
        err.message?.includes("expired")
      ) {
        setError("Invalid or expired reset token. Please request a new one.");
        setStep("email");
        setResetToken("");
      } else {
        setError(err.message || "Failed to reset password. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const handleStartOver = () => {
    setStep("email");
    setEmail("");
    setResetToken("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setSuccessMessage("");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-linear-to-br from-gray-50 to-gray-100">
      {/* Left side - Brand/Info */}
      <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center p-8 bg-linear-to-br from-blue-900 via-purple-900 to-pink-900">
        <div className="max-w-md text-center">
          <div className="mb-8 flex justify-center">
            <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-3xl font-bold text-white">PA</span>
            </div>
          </div>

          <h1 className="mb-4 text-4xl font-bold text-white">Pergola Africa</h1>

          <p className="text-xl text-white/80 mb-6">Admin Portal</p>

          <div className="mt-12 space-y-6">
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Lock className="h-5 w-5 text-blue-300" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Secure Reset
                </h3>
              </div>
              <p className="text-white/70 text-sm">
                Your security is our priority. All password resets are encrypted
                and require email verification.
              </p>
            </div>

            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-green-300" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Email Verification
                </h3>
              </div>
              <p className="text-white/70 text-sm">
                Check your inbox for the reset token. It expires in 30 minutes
                for your security.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Reset Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="md:hidden mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-xl font-bold text-white">PA</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Pergola Africa</h1>
            <p className="text-sm text-gray-600">Password Recovery</p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200">
            {/* Navigation & Header */}
            <div className="mb-8">
              {step !== "success" && (
                <div className="flex items-center justify-between mb-4">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                  </Link>

                  <div className="flex items-center gap-2">
                    {["email", "verify", "reset"].map((s, i) => (
                      <div key={s} className="flex items-center">
                        <div
                          className={`h-2 w-8 rounded-full ${
                            (step === "email" && s === "email") ||
                            (step === "verify" &&
                              (s === "email" || s === "verify")) ||
                            (step === "reset" &&
                              (s === "email" ||
                                s === "verify" ||
                                s === "reset"))
                              ? "bg-blue-600"
                              : "bg-gray-200"
                          }`}
                        />
                        {i < 2 && <div className="h-0.5 w-2 bg-gray-300" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {step === "email" && "Reset Password"}
                  {step === "verify" && "Verify Email"}
                  {step === "reset" && "Create New Password"}
                  {step === "success" && "Success!"}
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  {step === "email" &&
                    "Enter your email to receive a reset token"}
                  {step === "verify" &&
                    `Enter the token sent to ${successEmail}`}
                  {step === "reset" &&
                    "Create a strong new password for your account"}
                  {step === "success" &&
                    "Your password has been successfully reset"}
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-lg bg-red-50 border border-red-200 p-4">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium text-red-800">Error</p>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {successMessage && step !== "success" && (
              <div className="mb-6 flex items-start gap-3 rounded-lg bg-green-50 border border-green-200 p-4">
                <CheckCircle className="h-5 w-5 shrink-0 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800">Success</p>
                  <p className="mt-1 text-sm text-green-700">
                    {successMessage}
                  </p>
                </div>
              </div>
            )}

            {/* Step 1: Email Input */}
            {step === "email" && (
              <form onSubmit={handleRequestReset} className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@pergolaafrica.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isSubmitting}
                      className="pl-10 h-12"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Enter the email address associated with your admin account
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting || !email}
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                      Sending Reset Token...
                    </>
                  ) : (
                    "Send Reset Token"
                  )}
                </Button>
              </form>
            )}

            {/* Step 2: Token Verification */}
            {step === "verify" && (
              <form onSubmit={handleVerifyToken} className="space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    A password reset token has been sent to{" "}
                    <span className="font-semibold">{successEmail}</span>. Check
                    your inbox and enter the token below.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="resetToken"
                    className="text-sm font-medium text-gray-700"
                  >
                    Reset Token
                  </Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="resetToken"
                      type="text"
                      placeholder="Enter the token from your email"
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                      required
                      disabled={isSubmitting}
                      className="pl-10 h-12"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Tokens expire in 12 hours for security
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleStartOver}
                    className="flex-1 h-12"
                    disabled={isSubmitting}
                  >
                    Use Different Email
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-12 bg-blue-600 hover:bg-blue-700"
                    disabled={isSubmitting || !resetToken}
                  >
                    {isSubmitting ? "Verifying..." : "Verify Token"}
                  </Button>
                </div>

                <button
                  type="button"
                  onClick={handleRequestReset}
                  className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium"
                  disabled={isSubmitting}
                >
                  Didn't receive the token? Resend
                </button>
              </form>
            )}

            {/* Step 3: New Password */}
            {step === "reset" && (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700"
                    >
                      New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isSubmitting}
                        className="pl-10 h-12 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <div
                        className={`h-1 flex-1 rounded-full ${password.length >= 6 ? "bg-green-500" : "bg-gray-200"}`}
                      />
                      <span>Minimum 6 characters</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium text-gray-700"
                    >
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isSubmitting}
                        className="pl-10 h-12 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {password &&
                      confirmPassword &&
                      password !== confirmPassword && (
                        <p className="text-xs text-red-600">
                          Passwords don't match
                        </p>
                      )}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                  disabled={
                    isSubmitting ||
                    !password ||
                    !confirmPassword ||
                    password !== confirmPassword
                  }
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                      Resetting Password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>

                <button
                  type="button"
                  onClick={() => setStep("verify")}
                  className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium"
                  disabled={isSubmitting}
                >
                  ← Go back to token entry
                </button>
              </form>
            )}

            {/* Step 4: Success */}
            {step === "success" && (
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900">
                    Password Reset Complete!
                  </h3>
                  <p className="text-gray-600">
                    {successMessage ||
                      "Your password has been successfully updated."}
                  </p>
                </div>

                <div className="space-y-3">
                  <Link href="/login">
                    <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700">
                      Sign In with New Password
                    </Button>
                  </Link>

                  <button
                    onClick={handleStartOver}
                    className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Reset another password
                  </button>
                </div>
              </div>
            )}

            {/* Help Text */}
            {step !== "success" && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-center text-sm text-gray-500">
                  Need help? Contact{" "}
                  <a
                    href="mailto:support@pergolaafrica.com"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    support@pergolaafrica.com
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

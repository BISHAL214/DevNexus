"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, CheckCircle2 } from "lucide-react";
import { OtpInput } from "@/components/app_components/otp/otp-input";
import { cn } from "@/lib/utils";
import { verifyEmailVerificationOtp } from "../../../../../actions/user_apis";
import { firebase_auth } from "@/firebase/__init";
import { useRouter } from "next/navigation";

export default function EmailVerification() {
  const router = useRouter();
  const [otpValue, setOtpValue] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const user = firebase_auth?.currentUser;
  // Handle OTP submission
  const handleSubmit = async () => {
    // Validate OTP
    if (otpValue.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    if (user && user?.email) {
      const { success, message } = await verifyEmailVerificationOtp(
        user.email,
        otpValue,
      );
      let timeout: NodeJS.Timeout | null = null;
      if (timeout) clearTimeout(timeout);
      if (success) {
        setSuccess(true);
        timeout = setTimeout(() => {
          router.push("/user/onboarding");
        }, 3000);
      } else {
        setError(message);
      }
    }
  };

  // Handle resend OTP
  const handleResend = () => {
    // Reset timer
    setTimeLeft(120);

    // Placeholder for resend OTP function
    console.log("Resending OTP");

    // Clear current OTP
    setOtpValue("");
  };

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[40%] left-[20%] h-[500px] w-[500px] rounded-full bg-purple-900/20 blur-[120px]" />
        <div className="absolute -bottom-[30%] right-[20%] h-[600px] w-[600px] rounded-full bg-blue-900/20 blur-[120px]" />
      </div>

      {/* Card container */}
      <Card className="relative w-full max-w-md overflow-hidden border-zinc-800 bg-zinc-900/80 backdrop-blur-sm">
        {/* Gradient accent line */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600" />

        {success ? (
          <div className="flex flex-col items-center justify-center p-8">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-900/20">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-white">
              Verification Successful
            </h2>
            <p className="mb-6 text-center text-zinc-400">
              Your email has been successfully verified.
            </p>
            <p className="text-center text-zinc-300">redirecting....</p>
          </div>
        ) : (
          <>
            <CardHeader className="space-y-1 pb-2">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600">
                <Mail className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="pt-4 text-center text-2xl font-bold text-white">
                Verify Your Email
              </CardTitle>
              <CardDescription className="text-center text-zinc-400">
                We&apos;ve sent a verification code to your email. Please enter
                it below.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 px-6 pb-2 pt-0">
              <div className="flex flex-col space-y-3">
                <div className="text-sm font-medium text-zinc-400">
                  Verification Code
                </div>
                <OtpInput
                  value={otpValue}
                  onChange={(value) => {
                    setOtpValue(value);
                    setError(null);
                  }}
                  autoFocus
                  length={6}
                  disabled={isSubmitting}
                  inputClassName="bg-zinc-800 border-zinc-700 text-white focus:border-blue-500 focus:ring-blue-500/20"
                  containerClassName="gap-3"
                  placeholder=""
                />
                {error && (
                  <p className="text-sm font-medium text-red-500">{error}</p>
                )}
              </div>

              <div className="flex items-center justify-center">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium",
                    timeLeft > 60
                      ? "bg-blue-900/20 text-blue-400"
                      : timeLeft > 30
                        ? "bg-yellow-900/20 text-yellow-400"
                        : "bg-red-900/20 text-red-400",
                  )}
                >
                  {formatTime(timeLeft)}
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 px-6 pb-6 pt-2">
              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white transition-all duration-300 hover:from-purple-700 hover:to-blue-700"
                onClick={handleSubmit}
                disabled={isSubmitting || otpValue.length !== 6}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Verifying...
                  </div>
                ) : (
                  "Verify Email"
                )}
              </Button>

              <div className="text-center text-sm text-zinc-400">
                Didn&apos;t receive the code?{" "}
                <button
                  onClick={handleResend}
                  disabled={timeLeft > 0}
                  className={cn(
                    "font-medium transition-colors",
                    timeLeft > 0
                      ? "cursor-not-allowed text-zinc-600"
                      : "text-blue-400 hover:text-blue-300",
                  )}
                >
                  {timeLeft > 0
                    ? `Resend in ${formatTime(timeLeft)}`
                    : "Resend Code"}
                </button>
              </div>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}

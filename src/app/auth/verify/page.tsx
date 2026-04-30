"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { verifyOTP, resendOTP } from "@/app/actions/auth";
import Link from "next/link";

function VerifyForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [error, setError] = useState("");
  const [message, setMessage] = useState(searchParams.get("resent") ? "A new verification code has been sent to your email." : "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    setMessage("");
    const result = await verifyOTP(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setMessage("");
    const result = await resendOTP(email);
    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      setMessage(result.success);
    }
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-3xl font-extrabold leading-9 tracking-tight text-slate-900 dark:text-white">
          Verify Your Email
        </h2>
        <p className="text-center mt-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
          We've sent a 6-digit code to <br />
          <span className="text-slate-900 dark:text-slate-200 font-bold">{email}</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="bg-white dark:bg-slate-900/50 px-6 py-10 shadow-xl shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200 dark:ring-slate-800 rounded-3xl backdrop-blur-sm">
          <form className="space-y-6" action={handleSubmit}>
            <input type="hidden" name="email" value={email} />
            
            {error && (
              <div className="text-red-500 text-sm font-semibold text-center bg-red-50 dark:bg-red-900/20 py-3 rounded-xl border border-red-100 dark:border-red-800">
                {error}
              </div>
            )}

            {message && (
              <div className="text-green-500 text-sm font-semibold text-center bg-green-50 dark:bg-green-900/20 py-3 rounded-xl border border-green-100 dark:border-green-800">
                {message}
              </div>
            )}
            
            <div>
              <label htmlFor="otp" className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-200 ml-1 text-center">
                Enter Verification Code
              </label>
              <div className="mt-4">
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  maxLength={6}
                  placeholder="000000"
                  className="block w-full text-center text-2xl tracking-[1em] font-mono rounded-xl border-0 py-3 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 shadow-sm ring-1 ring-inset ring-slate-200 dark:ring-slate-700 placeholder:text-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:focus:ring-blue-500 transition-all px-4"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold leading-6 text-white shadow-lg shadow-blue-500/25 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98]"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={handleResend}
              className="text-sm font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors"
            >
              Didn't receive a code? Resend
            </button>
          </div>
        </div>
        
        <p className="mt-10 text-center text-sm text-slate-500 dark:text-slate-400">
          Want to change email?{' '}
          <Link href="/auth/signup" className="font-semibold leading-6 text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors">
            Go back to Signup
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyForm />
    </Suspense>
  );
}

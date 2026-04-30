"use client";

import { useState } from "react";
import { forgotPassword } from "@/app/actions/auth";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    setMessage("");
    const result = await forgotPassword(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else if (result?.success) {
      setMessage(result.success);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-3xl font-extrabold leading-9 tracking-tight text-slate-900 dark:text-white">
          Reset Password
        </h2>
        <p className="text-center mt-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
          Enter your email to receive a reset code
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="bg-white dark:bg-slate-900/50 px-6 py-10 shadow-xl shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200 dark:ring-slate-800 rounded-3xl backdrop-blur-sm">
          <form className="space-y-6" action={handleSubmit}>
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
              <label htmlFor="email" className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-200 ml-1">
                Email Address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="name@example.com"
                  className="block w-full rounded-xl border-0 py-2.5 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 shadow-sm ring-1 ring-inset ring-slate-200 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:focus:ring-blue-500 sm:text-sm sm:leading-6 px-4 transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold leading-6 text-white shadow-lg shadow-blue-500/25 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98]"
              >
                {loading ? "Sending..." : "Send Reset Code"}
              </button>
            </div>
          </form>
        </div>
        
        <p className="mt-10 text-center text-sm text-slate-500 dark:text-slate-400">
          Remembered your password?{' '}
          <Link href="/auth/signin" className="font-semibold leading-6 text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors">
            Back to Signin
          </Link>
        </p>
      </div>
    </div>
  );
}

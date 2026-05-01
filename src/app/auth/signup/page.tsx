"use client";

import { useState } from "react";
import { signUp } from "@/app/actions/auth";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function SignUpPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    const result = await signUp(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="relative w-20 h-20 rounded-3xl overflow-hidden ring-4 ring-white dark:ring-slate-900 shadow-2xl shadow-blue-500/20 animate-in fade-in zoom-in duration-700">
            <img 
              src="/profile.png" 
              alt="DreamEdu Logo" 
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold leading-9 tracking-tight text-slate-900 dark:text-white">
          Create an Account
        </h2>
        <p className="text-center mt-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
          Join the DreamEdu learning community
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900/50 px-6 py-10 shadow-xl shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200 dark:ring-slate-800 rounded-3xl backdrop-blur-sm">
          <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-8">
            <Link 
              href="/auth/signin" 
              className="flex-1 text-center py-2.5 text-sm font-bold rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-all"
            >
              Sign In
            </Link>
            <Link 
              href="/auth/signup" 
              className="flex-1 text-center py-2.5 text-sm font-bold rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm transition-all"
            >
              Sign Up
            </Link>
          </div>

          <div className="space-y-6">
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-white dark:bg-slate-800 px-3 py-3 text-sm font-bold text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-200 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all active:scale-[0.98]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="text-sm font-bold leading-6">Join with Google</span>
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-sm font-medium leading-6">
                <span className="bg-white dark:bg-slate-900 px-6 text-slate-500 dark:text-slate-400">
                  Or join with email
                </span>
              </div>
            </div>
          </div>

          <form className="space-y-6 mt-6" action={handleSubmit}>
            {error && (
              <div className="text-red-500 text-sm font-semibold text-center bg-red-50 dark:bg-red-900/20 py-3 rounded-xl border border-red-100 dark:border-red-800">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="name" className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-200 ml-1">
                Full Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  className="block w-full rounded-xl border-0 py-2.5 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 shadow-sm ring-1 ring-inset ring-slate-200 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:focus:ring-blue-500 sm:text-sm sm:leading-6 px-4 transition-all"
                />
              </div>
            </div>

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

            <div>
              <label htmlFor="password" className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-200 ml-1">
                Create Your Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="••••••••"
                  className="block w-full rounded-xl border-0 py-2.5 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 shadow-sm ring-1 ring-inset ring-slate-200 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:focus:ring-blue-500 sm:text-sm sm:leading-6 px-4 transition-all"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold leading-6 text-white shadow-lg shadow-blue-500/25 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : "Create Account"}
              </button>
            </div>
          </form>
        </div>
        

      </div>
    </div>
  );
}

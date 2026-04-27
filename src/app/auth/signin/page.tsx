"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-3xl font-extrabold leading-9 tracking-tight text-slate-900 dark:text-white">
          Welcome Back
        </h2>
        <p className="text-center mt-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
          Sign in to your DreamEdu account
        </p>
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl">
          <p className="text-center text-xs text-blue-700 dark:text-blue-300 font-medium">
            Demo: admin@test.com / admin123
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="bg-white dark:bg-slate-900/50 px-6 py-10 shadow-xl shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200 dark:ring-slate-800 rounded-3xl backdrop-blur-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="text-red-500 text-sm font-semibold text-center bg-red-50 dark:bg-red-900/20 py-3 rounded-xl border border-red-100 dark:border-red-800">
                {error}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="block w-full rounded-xl border-0 py-2.5 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 shadow-sm ring-1 ring-inset ring-slate-200 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:focus:ring-blue-500 sm:text-sm sm:leading-6 px-4 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between ml-1">
                <label htmlFor="password" className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-200">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : "Sign in to Dashboard"}
              </button>
            </div>
          </form>
        </div>
        
        <p className="mt-10 text-center text-sm text-slate-500 dark:text-slate-400">
          Not a member?{' '}
          <Link href="/" className="font-semibold leading-6 text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors">
            Contact your administrator
          </Link>
        </p>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Notes", href: "/student/notes" },
    { name: "Test Series", href: "/student/tests" },
  ];

  if (session?.user?.role === "ADMIN") {
    navLinks.push({ name: "Admin Panel", href: "/admin" });
  }

  const getInitials = (name?: string | null) => {
    if (!name) return "??";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  return (
    <header className="bg-card text-card-foreground border-b border-border sticky top-0 z-50 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden ring-2 ring-blue-100 dark:ring-blue-900/50 group-hover:ring-blue-400 transition-all">
                <img 
                  src="/profile.png" 
                  alt="DreamEdu Logo" 
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                DreamEdu
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {status === "loading" ? (
              <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 animate-pulse rounded"></div>
            ) : session ? (
              <div className="flex items-center space-x-5">
                <Link href="/profile" className="flex items-center group">
                   <div className="h-10 w-10 rounded-xl bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-sm font-bold shadow-md group-hover:shadow-blue-500/20 group-hover:scale-105 transition-all duration-300 ring-2 ring-white dark:ring-slate-900 ring-offset-2 ring-offset-transparent group-hover:ring-blue-400">
                      {getInitials(session.user.name || session.user.email)}
                   </div>
                   <div className="ml-3 hidden lg:block">
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {session.user.name?.split(' ')[0] || session.user.email?.split('@')[0]}
                      </p>
                      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5">
                        {session.user.role}
                      </p>
                   </div>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-700 dark:text-slate-200 hover:text-red-600 dark:hover:text-red-400 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 border border-transparent hover:border-red-200 dark:hover:border-red-800"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
              >
                Sign In
              </Link>
            )}
          </div>

          <div className="flex items-center md:hidden space-x-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <FiX className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <FiMenu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-border">
            {status === "loading" ? (
               <div className="px-5 h-8 bg-slate-200 dark:bg-slate-800 animate-pulse rounded w-1/2"></div>
            ) : session ? (
              <div className="px-5 py-2">
                <Link href="/profile" className="flex items-center gap-4 group mb-4">
                  <div className="h-12 w-12 rounded-xl bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-lg font-bold shadow-lg">
                    {getInitials(session.user.name || session.user.email)}
                  </div>
                  <div>
                    <p className="text-base font-bold text-slate-900 dark:text-white">
                      {session.user.name || session.user.email?.split('@')[0]}
                    </p>
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                      {session.user.role} Account
                    </p>
                  </div>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="w-full text-center py-3 rounded-xl text-base font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 active:scale-95 transition-all"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="px-5">
                <Link
                  href="/auth/signin"
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-base font-medium"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

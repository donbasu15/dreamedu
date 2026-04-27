"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { FiSearch } from "react-icons/fi";

const LEVELS = [
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
  "Degree",
  "Others"
];

export default function SearchFilter({ placeholder = "Search..." }: { placeholder?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  function handleLevelChange(level: string) {
    const params = new URLSearchParams(searchParams);
    if (level) {
      params.set("level", level);
    } else {
      params.delete("level");
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="relative flex-1 w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md leading-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
          placeholder={placeholder}
          defaultValue={searchParams.get("search")?.toString()}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      <div className="w-full md:w-48">
        <select
          className="block w-full pl-3 pr-10 py-2 text-base border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 transition-colors"
          defaultValue={searchParams.get("level")?.toString() || ""}
          onChange={(e) => handleLevelChange(e.target.value)}
        >
          <option value="">All Levels</option>
          {LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>
      {isPending && (
        <div className="text-xs text-slate-500 animate-pulse">
          Updating...
        </div>
      )}
    </div>
  );
}

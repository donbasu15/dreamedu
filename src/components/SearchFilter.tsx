"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition, useState, useRef, useEffect } from "react";
import { FiSearch, FiChevronDown, FiCheck } from "react-icons/fi";
import { CATEGORIES } from "@/lib/categories";

export default function SearchFilter({ placeholder = "Search..." }: { placeholder?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categoryQuery, setCategoryQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCategory = searchParams.get("category") || "";

  const filteredCategories = categoryQuery === ""
    ? CATEGORIES
    : CATEGORIES.filter((cat) =>
        cat.toLowerCase().includes(categoryQuery.toLowerCase())
      );

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

  function handleCategoryChange(category: string) {
    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
    setIsDropdownOpen(false);
    setCategoryQuery("");
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      
      <div className="w-full md:w-64 relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center justify-between w-full pl-3 pr-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
        >
          <span className="truncate">{selectedCategory || "All Categories"}</span>
          <FiChevronDown className={`ml-2 h-4 w-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isDropdownOpen && (
          <div className="absolute z-50 mt-1 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg max-h-60 overflow-auto">
            <div className="sticky top-0 bg-white dark:bg-slate-800 p-2 border-b border-slate-100 dark:border-slate-700">
              <input
                type="text"
                autoFocus
                className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Search categories..."
                value={categoryQuery}
                onChange={(e) => setCategoryQuery(e.target.value)}
              />
            </div>
            <div className="py-1">
              <button
                onClick={() => handleCategoryChange("")}
                className="flex items-center justify-between w-full px-4 py-2 text-sm text-left hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
              >
                All Categories
                {!selectedCategory && <FiCheck className="h-4 w-4 text-blue-500" />}
              </button>
              {filteredCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className="flex items-center justify-between w-full px-4 py-2 text-sm text-left hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  <span className="truncate">{cat}</span>
                  {selectedCategory === cat && <FiCheck className="h-4 w-4 text-blue-500" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {isPending && (
        <div className="text-xs text-slate-500 animate-pulse">
          Updating...
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { CATEGORIES } from "@/lib/categories";
import { HiSelector, HiSearch, HiCheck } from "react-icons/hi";

interface CategorySelectorProps {
  selected: string;
  onChange: (category: string) => void;
}

export default function CategorySelector({ selected, onChange }: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredCategories = query === ""
    ? CATEGORIES
    : CATEGORIES.filter((category) =>
        category.toLowerCase().includes(query.toLowerCase())
      );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-full cursor-default rounded-md bg-white dark:bg-slate-900 py-2 pl-3 pr-10 text-left text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
      >
        <span className="block truncate">{selected || "Select Category"}</span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <HiSelector className="h-5 w-5 text-slate-400" aria-hidden="true" />
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-[100] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-slate-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          <div className="sticky top-0 z-20 bg-white dark:bg-slate-800 px-2 py-1.5 border-b border-slate-100 dark:border-slate-700">
            <div className="relative flex items-center">
              <HiSearch className="absolute left-2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                autoFocus
                className="w-full rounded-md border-0 py-1.5 pl-8 pr-3 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 ring-1 ring-inset ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 sm:text-sm"
                placeholder="Search categories..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          <ul className="max-h-52 overflow-y-auto">
            {filteredCategories.length === 0 ? (
              <li className="relative cursor-default select-none py-2 px-4 text-slate-700 dark:text-slate-400">
                No categories found.
              </li>
            ) : (
              filteredCategories.map((category) => (
                <li
                  key={category}
                  className={`relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-blue-600 hover:text-white text-slate-900 dark:text-slate-300 ${
                    selected === category ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" : ""
                  }`}
                  onClick={() => {
                    onChange(category);
                    setIsOpen(false);
                    setQuery("");
                  }}
                >
                  <span className={`block truncate ${selected === category ? "font-semibold" : "font-normal"}`}>
                    {category}
                  </span>
                  {selected === category && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600 dark:text-blue-400">
                      <HiCheck className="h-5 w-5" aria-hidden="true" />
                    </span>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

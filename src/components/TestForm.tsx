"use client";

import { useState } from "react";
import { createTest, updateTest } from "@/app/actions/tests";
import { useRouter } from "next/navigation";

interface TestFormProps {
  initialData?: {
    id: string;
    title: string;
    level?: string;
    durationMinutes: number;
    type: string;
    isPremium: boolean;
  };
}

export default function TestForm({ initialData }: TestFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || "");
  const [level, setLevel] = useState(initialData?.level || "");
  const [durationMinutes, setDurationMinutes] = useState(initialData?.durationMinutes || 30);
  const [type, setType] = useState(initialData?.type || "Quiz");
  const [isPremium, setIsPremium] = useState(initialData?.isPremium || false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !level) return;
    setLoading(true);

    try {
      if (initialData) {
        await updateTest(initialData.id, { title, level, durationMinutes, type, isPremium });
      } else {
        await createTest({ title, level, durationMinutes, type, isPremium });
      }
      router.push("/admin/tests");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-900/50 p-6 rounded-lg shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium leading-6 text-slate-900 dark:text-white">
            Test Title
          </label>
          <div className="mt-2">
            <input
              id="title"
              name="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 dark:text-white dark:bg-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              placeholder="e.g. JEE Main Mock Test 1"
            />
          </div>
        </div>

        <div>
           <label htmlFor="level" className="block text-sm font-medium leading-6 text-slate-900 dark:text-white">
            Target Level / Class
          </label>
          <div className="mt-2">
            <select
              id="level"
              name="level"
              required
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="block w-full rounded-md border-0 py-2 px-3 text-slate-900 dark:text-white dark:bg-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            >
              <option value="">Select Level</option>
              <option value="Class 4">Class 4</option>
              <option value="Class 5">Class 5</option>
              <option value="Class 6">Class 6</option>
              <option value="Class 7">Class 7</option>
              <option value="Class 8">Class 8</option>
              <option value="Class 9">Class 9</option>
              <option value="Class 10">Class 10</option>
              <option value="Class 11">Class 11</option>
              <option value="Class 12">Class 12</option>
              <option value="Degree">Degree</option>
              <option value="Others">Others</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="durationMinutes" className="block text-sm font-medium leading-6 text-slate-900 dark:text-white">
            Duration (Minutes)
          </label>
          <div className="mt-2">
            <input
              id="durationMinutes"
              name="durationMinutes"
              type="number"
              min="1"
              required
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 0)}
              className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 dark:text-white dark:bg-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
           <label htmlFor="type" className="block text-sm font-medium leading-6 text-slate-900 dark:text-white">
            Test Type
          </label>
          <div className="mt-2">
            <select
              id="type"
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 dark:text-white dark:bg-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            >
              <option value="Quiz" className="dark:bg-slate-900">Mini Quiz</option>
              <option value="Mock" className="dark:bg-slate-900">Full Mock Test</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <label className="text-sm font-medium leading-6 text-slate-900 dark:text-white" htmlFor="isPremium">
          Premium Test?
        </label>
        <button
          type="button"
          onClick={() => setIsPremium(!isPremium)}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${isPremium ? 'bg-purple-600' : 'bg-slate-200 dark:bg-slate-700'}`}
          role="switch"
          aria-checked={isPremium}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isPremium ? 'translate-x-5' : 'translate-x-0'}`}
          />
        </button>
      </div>

      <div className="pt-4 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !title || durationMinutes <= 0}
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-500 disabled:opacity-50 transition-colors"
        >
          {loading ? "Saving..." : initialData ? "Update Test" : "Create Test"}
        </button>
      </div>
    </form>
  );
}

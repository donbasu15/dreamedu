"use client";

import { useState } from "react";
import RichTextEditor from "./RichTextEditor";
import CategorySelector from "./CategorySelector";
import { createNote, updateNote } from "@/app/actions/notes";
import { useRouter } from "next/navigation";

export default function NoteForm({ initialData }: { initialData?: { id: string; title: string; content: string; category?: string; isPremium: boolean } }) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [isPremium, setIsPremium] = useState(initialData?.isPremium || false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !content || !category) return;
    setLoading(true);

    try {
      if (initialData) {
        await updateNote(initialData.id, { title, content, category, isPremium });
      } else {
        await createNote({ title, content, category, isPremium });
      }
      router.push("/admin/notes");
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
            Note Title
          </label>
          <div className="mt-2 text-slate-900 border-3 border-transparent rounded-lg">
            <input
              id="title"
              name="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 dark:text-white dark:bg-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              placeholder="e.g. Physics Chapter 1: Kinematics"
            />
          </div>
        </div>

        <div className="relative z-30">
          <label htmlFor="category" className="block text-sm font-medium leading-6 text-slate-900 dark:text-white">
            Category
          </label>
          <div className="mt-2">
            <CategorySelector
              selected={category}
              onChange={setCategory}
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium leading-6 text-slate-900 dark:text-white mb-2">
          Content
        </label>
        <RichTextEditor content={content} onChange={setContent} />
      </div>

      <div className="flex items-center gap-x-3">
        <label className="text-sm font-medium leading-6 text-slate-900 dark:text-white" htmlFor="isPremium">
          Premium Content?
        </label>
        <button
          type="button"
          onClick={() => setIsPremium(!isPremium)}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${isPremium ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}
          role="switch"
          aria-checked={isPremium}
        >
          <span
            aria-hidden="true"
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
          disabled={loading || !title || !content}
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-500 disabled:opacity-50 transition-colors"
        >
          {loading ? "Saving..." : initialData ? "Update Note" : "Create Note"}
        </button>
      </div>
    </form>
  );
}

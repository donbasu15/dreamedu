"use client";

import { useState } from "react";
import { addQuestion } from "@/app/actions/tests";
import { useRouter } from "next/navigation";

export default function AddQuestionForm({ testId }: { testId: string }) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctOption, setCorrectOption] = useState("A");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content || !optionA || !optionB || !optionC || !optionD || !correctOption) return;
    setLoading(true);

    try {
      await addQuestion(testId, { content, optionA, optionB, optionC, optionD, correctOption });
      // Reset form
      setContent("");
      setOptionA("");
      setOptionB("");
      setOptionC("");
      setOptionD("");
      setCorrectOption("A");
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg border border-slate-200 dark:border-slate-800 mt-8 transition-colors duration-300">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add New Question</h3>
      <div>
        <label className="block text-sm font-medium leading-6 text-slate-900 dark:text-white">
          Question Content
        </label>
        <div className="mt-2">
          <textarea
            required
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 dark:text-white dark:bg-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            placeholder="What is the capital of France?"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: 'Option A', value: optionA, setter: setOptionA },
          { label: 'Option B', value: optionB, setter: setOptionB },
          { label: 'Option C', value: optionC, setter: setOptionC },
          { label: 'Option D', value: optionD, setter: setOptionD },
        ].map((opt, i) => (
          <div key={i}>
            <label className="block text-sm font-medium text-slate-900 dark:text-white">{opt.label}</label>
            <input required type="text" value={opt.value} onChange={e => opt.setter(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border" />
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium leading-6 text-slate-900 dark:text-white">
          Correct Option
        </label>
        <div className="mt-2 flex gap-4">
          {['A', 'B', 'C', 'D'].map(opt => (
            <label key={opt} className="flex items-center gap-2">
              <input type="radio" name="correct" value={opt} checked={correctOption === opt} onChange={e => setCorrectOption(e.target.value)} className="h-4 w-4 text-blue-600 border-slate-300 dark:border-slate-700 dark:bg-slate-800 focus:ring-blue-600" />
              <span className="text-sm text-slate-700 dark:text-slate-400 font-medium">Option {opt}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-500 disabled:opacity-50 transition-colors"
        >
          {loading ? "Adding..." : "Add Question"}
        </button>
      </div>
    </form>
  );
}

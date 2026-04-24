"use client";

import { useState } from "react";
import { updateQuestion } from "@/app/actions/tests";
import { FiX, FiCheck } from "react-icons/fi";

interface EditQuestionModalProps {
  question: any;
  testId: string;
  onClose: () => void;
}

export default function EditQuestionModal({ question, testId, onClose }: EditQuestionModalProps) {
  const [content, setContent] = useState(question.content);
  const [optionA, setOptionA] = useState(question.optionA);
  const [optionB, setOptionB] = useState(question.optionB);
  const [optionC, setOptionC] = useState(question.optionC);
  const [optionD, setOptionD] = useState(question.optionD);
  const [correctOption, setCorrectOption] = useState(question.correctOption);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateQuestion(question.id, testId, { content, optionA, optionB, optionC, optionD, correctOption });
      onClose();
    } catch (error) {
      console.error("Failed to update question:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-xl shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Edit Question</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
            <FiX className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Question Content</label>
            <textarea
              required
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="block w-full rounded-lg border-0 py-2 px-3 text-slate-900 dark:text-white dark:bg-slate-800 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all sm:text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Option A', value: optionA, setter: setOptionA, key: 'A' },
              { label: 'Option B', value: optionB, setter: setOptionB, key: 'B' },
              { label: 'Option C', value: optionC, setter: setOptionC, key: 'C' },
              { label: 'Option D', value: optionD, setter: setOptionD, key: 'D' },
            ].map((opt) => (
              <div key={opt.key}>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-1">{opt.label}</label>
                <input
                  required
                  type="text"
                  value={opt.value}
                  onChange={e => opt.setter(e.target.value)}
                  className="block w-full rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border transition-all"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-3">Correct Option</label>
            <div className="flex flex-wrap gap-4">
              {['A', 'B', 'C', 'D'].map(opt => (
                <label key={opt} className={`flex items-center gap-3 px-4 py-2 rounded-lg border cursor-pointer transition-all ${correctOption === opt ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-300 ring-2 ring-blue-600' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>
                  <input
                    type="radio"
                    name="correct_edit"
                    value={opt}
                    checked={correctOption === opt}
                    onChange={e => setCorrectOption(e.target.value)}
                    className="sr-only"
                  />
                  <span className="font-bold text-base">{opt}</span>
                  <span className="text-sm">Correct</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-500 disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
            >
              {loading ? "Saving..." : <><FiCheck /> Update Question</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

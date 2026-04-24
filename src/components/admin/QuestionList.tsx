"use client";

import { useState } from "react";
import { deleteQuestion } from "@/app/actions/tests";
import { FiEdit2 } from "react-icons/fi";
import DeleteButton from "./DeleteButton";
import EditQuestionModal from "./EditQuestionModal";

interface QuestionListProps {
  questions: any[];
  testId: string;
}

export default function QuestionList({ questions, testId }: QuestionListProps) {
  const [editingQuestion, setEditingQuestion] = useState<any>(null);

  return (
    <div className="space-y-4">
      {questions.map((q: any, index: number) => (
        <div key={q.id} className="bg-white dark:bg-slate-900/50 p-5 rounded-lg shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 transition-all duration-300">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-slate-900 dark:text-white text-lg">Q{index + 1}.</span>
                <div className="flex gap-2">
                   <button
                    onClick={() => setEditingQuestion(q)}
                    className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    title="Edit Question"
                  >
                    <FiEdit2 className="h-4 w-4" />
                  </button>
                  <DeleteButton
                    id={q.id}
                    onDelete={(id) => deleteQuestion(id, testId)}
                    itemName="Question"
                  />
                </div>
              </div>
              <p className="text-slate-800 dark:text-slate-200 text-base">{q.content}</p>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 pl-8">
            {['A', 'B', 'C', 'D'].map((opt) => {
              const optKey = `option${opt}` as keyof any;
              const isCorrect = q.correctOption === opt;
              return (
                <div 
                  key={opt}
                  className={`p-2 rounded border transition-colors ${
                    isCorrect 
                      ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 font-semibold text-green-900 dark:text-green-300' 
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {opt}. {q[optKey]}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {editingQuestion && (
        <EditQuestionModal
          question={editingQuestion}
          testId={testId}
          onClose={() => setEditingQuestion(null)}
        />
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { FiCheckCircle, FiXCircle, FiAward, FiCalendar } from "react-icons/fi";
import Link from "next/link";

interface Question {
  id: string;
  content: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
}

interface TestData {
  id: string;
  title: string;
  questions: Question[];
}

export default function TestReviewInterface({ 
  test, 
  answers,
  score,
  totalScore,
  leaderboard = [],
  weekString = ""
}: { 
  test: TestData; 
  answers: Record<string, string>;
  score: number;
  totalScore: number;
  leaderboard?: any[];
  weekString?: string;
}) {
  const [activeTab, setActiveTab] = useState<"review" | "leaderboard">("review");

  return (
    <div className="max-w-4xl mx-auto pb-10 space-y-8">
      <div className="bg-white dark:bg-slate-900 px-6 py-6 rounded-2xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{test.title} - Results</h1>
           <div className="flex items-center gap-2 mt-1">
             <p className="text-slate-500 dark:text-slate-400">Your Score:</p>
             <span className="text-blue-600 dark:text-blue-400 font-bold">{score} / {totalScore}</span>
           </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
             <button
                onClick={() => setActiveTab("review")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "review" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
             >
                My Review
             </button>
             <button
                onClick={() => setActiveTab("leaderboard")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "leaderboard" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
             >
                Leaderboard
             </button>
          </div>
          <Link 
            href="/student/tests" 
            className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
          >
            Back to Tests
          </Link>
        </div>
      </div>

      {activeTab === "review" && (
        <div className="space-y-6">
          {test.questions.map((question, index) => {
            const userAnswer = answers[question.id];
            const isCorrect = userAnswer === question.correctOption;

            return (
              <div key={question.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 p-6 md:p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="h-8 w-8 shrink-0 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold flex items-center justify-center">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mt-1">
                    {question.content}
                  </h3>
                </div>

                <div className="space-y-3 pl-12">
                  {['A', 'B', 'C', 'D'].map((opt) => {
                    const val = question[`option${opt}` as keyof Question] as string;
                    const isSelected = userAnswer === opt;
                    const isRightAnswer = question.correctOption === opt;
                    
                    let borderClass = "border-slate-200 dark:border-slate-800";
                    let bgClass = "bg-transparent";
                    let textClass = "text-slate-700 dark:text-slate-300";
                    let icon = null;

                    if (isRightAnswer) {
                       borderClass = "border-green-500 ring-1 ring-green-500";
                       bgClass = "bg-green-50 dark:bg-green-900/20";
                       textClass = "text-green-800 dark:text-green-200 font-medium";
                       icon = <FiCheckCircle className="text-green-500 h-5 w-5" />;
                    } else if (isSelected && !isRightAnswer) {
                       borderClass = "border-red-500";
                       bgClass = "bg-red-50 dark:bg-red-900/20";
                       textClass = "text-red-800 dark:text-red-200";
                       icon = <FiXCircle className="text-red-500 h-5 w-5" />;
                    }

                    return (
                      <div key={opt} className={`flex items-center gap-3 p-3 rounded-xl border ${borderClass} ${bgClass}`}>
                        <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 text-sm font-medium">
                          {opt}
                        </div>
                        <span className={`flex-1 ${textClass}`}>{val}</span>
                        {icon && <div className="shrink-0">{icon}</div>}
                      </div>
                    );
                  })}
                </div>
                
                {!userAnswer && (
                  <div className="mt-4 pl-12 text-sm font-medium text-orange-600 dark:text-orange-400 flex items-center gap-2">
                    <FiXCircle /> You did not attempt this question
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "leaderboard" && (
        <div className="space-y-6">
          <div className="text-center space-y-4 mb-8 pt-4">
            <div className="mx-auto bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 h-16 w-16 flex items-center justify-center rounded-full mb-4">
               <FiAward className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Weekly Leaderboard</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Showing top results for the previous week.
            </p>
            {weekString && (
              <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full font-medium text-sm">
                 <FiCalendar /> Week of {weekString}
              </div>
            )}
          </div>
          
          <div className="bg-white dark:bg-slate-900/50 rounded-2xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden">
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {leaderboard.map((result: any, idx: number) => (
                 <li key={result.id} className="p-4 sm:px-6 py-5 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-5">
                       <div className={`flex items-center justify-center h-10 w-10 rounded-full font-bold text-lg
                          ${idx === 0 ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 ring-2 ring-amber-300' : 
                            idx === 1 ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 ring-2 ring-slate-300 dark:ring-slate-700' :
                            idx === 2 ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 ring-2 ring-orange-300' :
                            'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}
                       >
                         {idx + 1}
                       </div>
                       <div>
                         <p className="text-slate-900 dark:text-white font-bold text-lg">
                           {result.student?.name || result.student?.email?.split('@')[0] || "Unknown"}
                         </p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
                         {Math.round((result.score / result.totalScore) * 100)}%
                       </p>
                       <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{result.score} / {result.totalScore}</p>
                    </div>
                 </li>
              ))}
              {leaderboard.length === 0 && (
                 <li className="p-12 text-center text-slate-500 dark:text-slate-400 font-medium">
                    No results for this test during the specified week.
                 </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

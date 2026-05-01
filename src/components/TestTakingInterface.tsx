"use client";

import { useState, useEffect } from "react";
import { submitTestResult } from "@/app/actions/results";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

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
  durationMinutes: number;
  questions: Question[];
}

export default function TestTakingInterface({ test }: { test: TestData }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(test.durationMinutes * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{ score: number; total: number } | null>(null);

  useEffect(() => {
    if (submitted || isSubmitting) return;
    
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted, isSubmitting]);

  const handleSelect = (option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [test.questions[currentQuestionIndex].id]: option,
    }));
  };

  const calculateScore = () => {
    let score = 0;
    test.questions.forEach((q) => {
      if (answers[q.id] === q.correctOption) score++;
    });
    return score;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const score = calculateScore();
    const totalScore = test.questions.length;

    console.log("Attempting to submit result for user:", session?.user?.id);
    if (session?.user?.id) {
       try {
         console.log("Submitting with answers:", answers);
         const res = await submitTestResult({
           studentId: session.user.id,
           testId: test.id,
           score,
           totalScore,
           answersData: answers
         });
         console.log("Submission response:", res);
       } catch (error) {
         console.error("Failed to save result frontend error:", error);
       }
    } else {
       console.warn("No user ID found in session during submission");
    }
    
    setSubmitted({ score, total: totalScore });
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 p-10 text-center max-w-2xl mx-auto mt-10">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Test Submitted!</h2>
        <div className="inline-block bg-blue-50 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 text-6xl font-black px-8 py-6 rounded-3xl mb-6">
          {submitted.score} <span className="text-3xl text-blue-600/60 dark:text-blue-400/60 break-words">/ {submitted.total}</span>
        </div>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Your result has been recorded. You can now review your answers and check the leaderboard.
        </p>
        <div className="flex justify-center gap-4">
           <button onClick={() => router.push("/student/tests")} className="px-6 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium rounded-lg transition-colors">
              Back to Tests
           </button>
           <button onClick={() => window.location.reload()} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm cursor-pointer">
              Review & Leaderboard
           </button>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const question = test.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === test.questions.length - 1;

  if (!question) {
    return <div className="text-center py-20">This test has no questions yet.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-slate-900 px-6 py-4 rounded-xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 mb-6 gap-4 sm:gap-0 sticky top-20 z-10">
         <div>
           <h1 className="text-xl font-bold text-slate-900 dark:text-white truncate">{test.title}</h1>
           <p className="text-sm text-slate-500 dark:text-slate-400 font-medium font-mono tracking-tight mt-1 lg:mt-0">Question {currentQuestionIndex + 1} of {test.questions.length}</p>
         </div>
         <div className={`text-2xl font-black font-mono tracking-tight flex-shrink-0 ${timeLeft < 300 ? 'text-red-600' : 'text-blue-600 dark:text-blue-400'}`}>
            {formatTime(timeLeft)}
         </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 p-6 md:p-10">
        <h2 className="text-xl md:text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-8 leading-snug">
          {question.content}
        </h2>

        <div className="space-y-4">
          {['A', 'B', 'C', 'D'].map((opt) => {
             const val = question[`option${opt}` as keyof Question] as string;
             const isSelected = answers[question.id] === opt;
             return (
               <button
                 key={opt}
                 onClick={() => handleSelect(opt)}
                 className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-4 ${isSelected ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
               >
                 <div className={`flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full border ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400'}`}>
                   {opt}
                 </div>
                 <span className={`text-base flex-1 pt-0.5 ${isSelected ? 'text-blue-900 dark:text-blue-100 font-medium' : 'text-slate-700 dark:text-slate-300'}`}>{val}</span>
               </button>
             );
          })}
        </div>

        <div className="mt-10 flex border-t border-slate-100 dark:border-slate-800 pt-6 justify-between">
           <button
             onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
             disabled={currentQuestionIndex === 0}
             className="px-6 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
           >
             Previous
           </button>
           
           <div className="flex gap-3">
             <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/50 font-medium border border-orange-200 dark:border-orange-800 transition-colors flex items-center gap-2"
             >
                {isSubmitting ? '...' : (isLastQuestion ? 'Submit Test' : 'Finish Early')}
             </button>
             
             {!isLastQuestion && (
               <button
                 onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                 className="px-6 py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium shadow-sm transition-colors"
               >
                 Next
               </button>
             )}
           </div>
        </div>
      </div>
      
      {/* Question Navigator */}
      <div className="mt-8 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
         <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Question Navigator</h4>
         <div className="flex flex-wrap gap-2">
            {test.questions.map((q, idx) => {
               const answered = !!answers[q.id];
               const isCurrent = idx === currentQuestionIndex;
               return (
                  <button
                     key={q.id}
                     onClick={() => setCurrentQuestionIndex(idx)}
                     className={`h-10 w-10 flex items-center justify-center rounded border font-medium text-sm transition-colors
                     ${isCurrent ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                     ${answered ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600'}
                     `}
                  >
                     {idx + 1}
                  </button>
               )
            })}
         </div>
      </div>
    </div>
  );
}

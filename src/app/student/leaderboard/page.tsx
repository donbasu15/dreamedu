import { prisma } from "@/lib/prisma";
import { FiAward, FiTrendingUp } from "react-icons/fi";

export default async function LeaderboardPage() {
  const topResults = await prisma.result.findMany({
    take: 10,
    orderBy: [
      { score: "desc" },
      { submittedAt: "asc" }
    ],
    include: { student: true, test: true },
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="mx-auto bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 h-16 w-16 flex items-center justify-center rounded-full mb-4">
           <FiAward className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Weekly Leaderboard</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">See who is leading the pack. Keep studying to reach the top!</p>
      </div>

      <div className="bg-white dark:bg-slate-900/50 rounded-2xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden mt-8">
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {topResults.map((result: any, idx: number) => (
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
                     <p className="text-slate-900 dark:text-white font-bold text-lg">{result.student.name || result.student.email.split('@')[0]}</p>
                     <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><FiTrendingUp /> Scored on {result.test.title}</p>
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
          {topResults.length === 0 && (
             <li className="p-12 text-center text-slate-500 dark:text-slate-400 font-medium">
                No tests have been taken yet. Be the first to appear on the leaderboard!
             </li>
          )}
        </ul>
      </div>
    </div>
  );
}

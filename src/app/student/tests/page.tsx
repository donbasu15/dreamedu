import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FiClock, FiLock, FiCheckCircle } from "react-icons/fi";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import SearchFilter from "@/components/SearchFilter";

export default async function StudentTestsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const { search, category } = await searchParams;

  const tests = await prisma.test.findMany({
    where: {
      AND: [
        ...(search ? [{ title: { contains: search } }] : []),
        ...(category ? [{ categoryName: { equals: category } }] : []),
      ],
    },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { questions: true } } },
  });

  const session = await getServerSession(authOptions);
  const userResults = session?.user?.id
    ? await prisma.result.findMany({
        where: { studentId: session.user.id },
        select: { testId: true, score: true, totalScore: true }
      })
    : [];
    
  const completedTestMap = new Map(userResults.map((r: any) => [r.testId, r]));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Test Series</h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">Challenge yourself with dynamic quizzes and full-length mock tests.</p>
      </div>

      <SearchFilter placeholder="Search tests by title..." />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map((test: any) => (
          <div
            key={test.id}
            className="group flex flex-col justify-between bg-white dark:bg-slate-900/50 rounded-2xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 p-6 hover:shadow-md transition-all hover:ring-blue-300 dark:hover:ring-blue-800 relative overflow-hidden"
          >
            {test.isPremium && (
               <div className="absolute top-0 right-0 py-1 px-3 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-bl-lg">
                 Premium
               </div>
            )}
            {!test.isPremium && (
               <div className="absolute top-0 right-0 py-1 px-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-bold rounded-bl-lg">
                 Free
               </div>
            )}
            <div className="mt-2">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/30">
                  {test.categoryName || "General"}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${test.type === 'Mock' ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'}`}>
                  {test.type}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <FiClock className="h-3 w-3" /> {test.durationMinutes} mins
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <FiCheckCircle className="h-3 w-3" /> {test._count.questions} Qs
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-2 mb-2">
                {test.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium italic mb-1">
                By {test.creatorName || "DreamEdu Team"}
              </p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
               {completedTestMap.get(test.id) ? (
                 <Link href={`/student/tests/${test.id}?review=true`} className="block w-full text-center bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/30 hover:bg-green-100 dark:hover:bg-green-900/40 py-2 rounded-lg font-medium transition-colors">
                    Completed: {completedTestMap.get(test.id)?.score}/{completedTestMap.get(test.id)?.totalScore}
                 </Link>
               ) : (
                 <Link href={`/student/tests/${test.id}`} className="block w-full text-center bg-blue-600 text-white hover:bg-blue-700 py-2 rounded-lg font-medium transition-colors">
                    Start Test
                 </Link>
               )}
            </div>
          </div>
        ))}
        
        {tests.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            {search || category ? "No tests matching your search or filters." : "No tests have been published yet. Please check back later."}
          </div>
        )}
      </div>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import TestTakingInterface from "@/components/TestTakingInterface";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { FiLock, FiCheckCircle } from "react-icons/fi";
import TestReviewInterface from "@/components/TestReviewInterface";

export default async function TestPage({ 
  params,
  searchParams,
}: { 
  params: Promise<{ id: string }>;
  searchParams: Promise<{ review?: string }>;
}) {
  const { id } = await params;
  const { review } = await searchParams;
  const session = await getServerSession(authOptions);

  const test = await prisma.test.findUnique({
    where: { id },
    include: { questions: { orderBy: { createdAt: "asc" } } },
  });

  if (!test) {
    return notFound();
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-full mb-6">
          <FiLock className="w-12 h-12 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Login Required</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md">
          You need to be signed in to attempt this {test.type.toLowerCase()}. 
          Join DreamEdu today to track your progress and access premium content.
        </p>
        <Link 
          href={`/auth/signin?callbackUrl=/student/tests/${id}`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-500/20 group"
        >
          Sign In to Start <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">→</span>
        </Link>
      </div>
    );
  }

  const existingResult = await prisma.result.findFirst({
    where: {
      testId: id,
      studentId: session.user.id,
    },
  });

  if (existingResult) {
    let parsedAnswers = {};
    if (existingResult.answersData) {
      try {
        parsedAnswers = JSON.parse(existingResult.answersData);
      } catch(e) {}
    }

    // Leaderboard logic: Previous Week (Monday to Sunday)
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    
    const previousMonday = new Date(now);
    previousMonday.setDate(now.getDate() - daysSinceMonday - 7);
    previousMonday.setHours(0, 0, 0, 0);
    
    const previousSunday = new Date(previousMonday);
    previousSunday.setDate(previousMonday.getDate() + 6);
    previousSunday.setHours(23, 59, 59, 999);

    const dateOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    const weekString = `${previousMonday.toLocaleDateString(undefined, dateOptions)} - ${previousSunday.toLocaleDateString(undefined, dateOptions)}`;

    const topResults = await prisma.result.findMany({
      where: {
        testId: id,
        submittedAt: {
          gte: previousMonday,
          lte: previousSunday
        }
      },
      take: 10,
      orderBy: [
        { score: "desc" },
        { submittedAt: "asc" }
      ],
      include: { student: true },
    });
    
    return (
      <div className="pt-4">
        <TestReviewInterface 
          test={test} 
          answers={parsedAnswers} 
          score={existingResult.score}
          totalScore={existingResult.totalScore}
          leaderboard={topResults}
          weekString={weekString}
        />
      </div>
    );
  }

  return (
    <div className="pt-4">
      <TestTakingInterface test={test} />
    </div>
  );
}

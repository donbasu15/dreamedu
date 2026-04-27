import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import TestTakingInterface from "@/components/TestTakingInterface";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { FiLock } from "react-icons/fi";

export default async function TestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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

  return (
    <div className="pt-4">
      <TestTakingInterface test={test} />
    </div>
  );
}

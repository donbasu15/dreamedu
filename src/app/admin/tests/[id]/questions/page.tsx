import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AddQuestionForm from "@/components/AddQuestionForm";
import QuestionList from "@/components/admin/QuestionList";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default async function ManageQuestionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const test = await prisma.test.findUnique({
    where: { id },
    include: { questions: { orderBy: { createdAt: "asc" } } },
  });

  if (!test) return notFound();

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <Link href="/admin/tests" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
        <FiArrowLeft /> Back to Tests
      </Link>
      
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Manage Questions</h1>
        <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">{test.title}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{test.questions.length} question(s) currently added.</p>
      </div>

      <QuestionList questions={test.questions} testId={test.id} />

      <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
        <AddQuestionForm testId={test.id} />
      </div>
    </div>
  );
}

import TestForm from "@/components/TestForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditTestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const test = await prisma.test.findUnique({
    where: { id },
  });

  if (!test) {
    return notFound();
  }
  const normalizedTest = { ...test, category: test.categoryName ?? undefined };
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Edit Test Details</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Update the basic settings for this test.</p>
      </div>
      
      <TestForm initialData={normalizedTest} />
    </div>
  );
}

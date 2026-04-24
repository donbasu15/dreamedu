import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import TestTakingInterface from "@/components/TestTakingInterface";

export default async function TestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const test = await prisma.test.findUnique({
    where: { id },
    include: { questions: { orderBy: { createdAt: "asc" } } },
  });

  if (!test) {
    return notFound();
  }

  // TODO: Add actual paywall logic. If User is not premium, block it.
  
  return (
    <div className="pt-4">
      <TestTakingInterface test={test} />
    </div>
  );
}

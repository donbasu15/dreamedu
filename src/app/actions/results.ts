"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitTestResult(data: { studentId: string; testId: string; score: number; totalScore: number }) {
  const result = await prisma.result.create({
    data: {
      studentId: data.studentId,
      testId: data.testId,
      score: data.score,
      totalScore: data.totalScore
    },
  });

  revalidatePath("/student/leaderboard");
  return result;
}

"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitTestResult(data: { studentId: string; testId: string; score: number; totalScore: number; answersData?: Record<string, string> }) {
  console.log("Submitting test result for student:", data.studentId, "test:", data.testId);
  try {
  // Check if a result already exists for this student and test
  const existingResult = await prisma.result.findFirst({
    where: {
      studentId: data.studentId,
      testId: data.testId,
    },
  });

  if (existingResult) {
    return existingResult; // Only record the first attempt
  }

    const result = await prisma.result.create({
      data: {
        studentId: data.studentId,
        testId: data.testId,
        score: data.score,
        totalScore: data.totalScore,
        answersData: data.answersData ? JSON.stringify(data.answersData) : null
      },
    });

    console.log("Result created successfully:", result.id);
    revalidatePath("/student/leaderboard");
    return result;
  } catch (error) {
    console.error("Error in submitTestResult:", error);
    throw error;
  }
}

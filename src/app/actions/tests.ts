"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTest(data: { title: string; categoryId?: string; durationMinutes: number; type: string; isPremium: boolean }) {
  const test = await prisma.test.create({
    data: {
      title: data.title,
      durationMinutes: data.durationMinutes,
      type: data.type,
      isPremium: data.isPremium,
      ...(data.categoryId ? { categoryId: data.categoryId } : {}),
    },
  });
  
  revalidatePath("/admin/tests");
  revalidatePath("/student/tests");
  return test;
}

export async function updateTest(id: string, data: { title?: string; durationMinutes?: number; type?: string; isPremium?: boolean }) {
  const test = await prisma.test.update({
    where: { id },
    data,
  });
 
  revalidatePath("/admin/tests");
  revalidatePath(`/admin/tests/${id}`);
  revalidatePath("/student/tests");
  return test;
}

export async function deleteTest(id: string) {
  await prisma.test.delete({
    where: { id },
  });

  revalidatePath("/admin/tests");
  revalidatePath("/student/tests");
}

export async function addQuestion(testId: string, data: { content: string; optionA: string; optionB: string; optionC: string; optionD: string; correctOption: string }) {
  const question = await prisma.question.create({
    data: {
      testId,
      ...data,
    },
  });

  revalidatePath(`/admin/tests/${testId}/questions`);
  return question;
}

export async function updateQuestion(id: string, testId: string, data: { content?: string; optionA?: string; optionB?: string; optionC?: string; optionD?: string; correctOption?: string }) {
  const question = await prisma.question.update({
    where: { id },
    data,
  });

  revalidatePath(`/admin/tests/${testId}/questions`);
  return question;
}

export async function deleteQuestion(id: string, testId: string) {
  await prisma.question.delete({
    where: { id },
  });

  revalidatePath(`/admin/tests/${testId}/questions`);
}

"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createNote(data: { title: string; content: string; isPremium: boolean }) {
  const note = await prisma.note.create({
    data: {
      title: data.title,
      content: data.content,
      isPremium: data.isPremium,
    },
  });
  
  revalidatePath("/admin/notes");
  revalidatePath("/student/notes");
  return note;
}

export async function updateNote(id: string, data: { title?: string; content?: string; isPremium?: boolean }) {
  const note = await prisma.note.update({
    where: { id },
    data,
  });

  revalidatePath("/admin/notes");
  revalidatePath(`/student/notes`);
  return note;
}

export async function deleteNote(id: string) {
  await prisma.note.delete({
    where: { id },
  });

  revalidatePath("/admin/notes");
  revalidatePath("/student/notes");
}

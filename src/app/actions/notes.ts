"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function createNote(data: { title: string; content: string; level: string; isPremium: boolean }) {
  const session = await getServerSession(authOptions);
  
  const note = await prisma.note.create({
    data: {
      title: data.title,
      content: data.content,
      level: data.level,
      isPremium: data.isPremium,
      creatorName: session?.user?.name || "Admin",
    },
  });
  
  revalidatePath("/admin/notes");
  revalidatePath("/student/notes");
  return note;
}

export async function updateNote(id: string, data: { title?: string; content?: string; level?: string; isPremium?: boolean }) {
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

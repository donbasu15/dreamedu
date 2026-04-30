"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: {
  name: string;
  currentInstitution?: string;
  gradeOrClass?: string;
  phone?: string;
  address?: string;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.update({
    where: { email: session.user.email },
    data: {
      name: data.name,
      currentInstitution: data.currentInstitution,
      gradeOrClass: data.gradeOrClass,
      phone: data.phone,
      address: data.address,
    },
  });

  revalidatePath("/profile");
  return { success: true };
}

import NoteForm from "@/components/NoteForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditNotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const note = await prisma.note.findUnique({
    where: { id },
  });

  if (!note) {
    return notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Edit Note</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Update the contents of the note.</p>
      </div>
      <NoteForm initialData={note} />
    </div>
  );
}

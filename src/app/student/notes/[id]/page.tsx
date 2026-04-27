import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default async function NoteContentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const note = await prisma.note.findUnique({
    where: { id },
  });

  if (!note) {
    return notFound();
  }

  const content = note.content || "<i>No content provided.</i>";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/student/notes" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
        <FiArrowLeft /> Back to Notes
      </Link>
      
      <article className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden">
        <div className="px-6 py-8 md:px-10 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-4 mb-4">
            {note.isPremium ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                Premium Content
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                Free Content
              </span>
            )}
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Published on {new Date(note.createdAt).toLocaleDateString()} by <span className="font-semibold">{note.creatorName || "DreamEdu Team"}</span>
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {note.title}
          </h1>
        </div>

        <div className="px-6 py-8 md:px-10">
          <div 
            className="prose prose-slate dark:prose-invert max-w-none w-full prose-headings:text-slate-900 dark:prose-headings:text-white prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-500"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </article>
    </div>
  );
}

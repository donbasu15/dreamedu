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
      
      <article className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
        <div className="px-6 py-8 md:px-10 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-4 mb-4">
            {note.isPremium ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                Premium Content
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                Free Content
              </span>
            )}
            <span className="text-sm text-slate-500">
              Published on {new Date(note.createdAt).toLocaleDateString()} by <span className="font-semibold">{note.creatorName || "DreamEdu Team"}</span>
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            {note.title}
          </h1>
        </div>

        <div className="px-6 py-8 md:px-10">
          <div 
            className="prose prose-slate max-w-none w-full prose-headings:text-slate-900 prose-a:text-blue-600 hover:prose-a:text-blue-500"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </article>
    </div>
  );
}

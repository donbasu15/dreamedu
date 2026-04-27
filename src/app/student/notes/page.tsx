import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FiBook, FiLock } from "react-icons/fi";

import SearchFilter from "@/components/SearchFilter";

export default async function StudentNotesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const { search, category } = await searchParams;
  console.log("DEBUG: StudentNotesPage running with category:", category);

  const notes = await prisma.note.findMany({
    where: {
      AND: [
        ...(search ? [{ title: { contains: search } }] : []),
        ...(category ? [{ categoryName: { equals: category } }] : []),
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Study Materials</h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">Access high-quality notes designed to boost your academic performance.</p>
      </div>

      <SearchFilter placeholder="Search notes by title..." />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note: any) => (
          <Link
            key={note.id}
            href={`/student/notes/${note.id}`}
            className="group flex flex-col justify-between bg-white dark:bg-slate-900/50 rounded-2xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 p-6 hover:shadow-md transition-all hover:ring-blue-300 dark:hover:ring-blue-800"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                  <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-2 text-blue-600 dark:text-blue-400">
                    <FiBook className="h-5 w-5" />
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    {note.categoryName || "General"}
                  </span>
                </div>
                {note.isPremium && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400">
                    <FiLock className="h-3 w-3" /> Premium
                  </span>
                )}
                {!note.isPremium && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400">
                    Free
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                {note.title}
              </h3>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400 font-medium italic">
                By {note.creatorName || "DreamEdu Team"}
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-1 transition-transform inline-block">
                Read Note →
              </span>
            </div>
          </Link>
        ))}
        
        {notes.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            {search || category ? "No notes matching your search or filters." : "No notes have been published yet. Please check back later."}
          </div>
        )}
      </div>
    </div>
  );
}

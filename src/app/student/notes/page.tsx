import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FiBook, FiLock } from "react-icons/fi";

export default async function StudentNotesPage() {
  const notes = await prisma.note.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Study Materials</h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">Access high-quality notes designed to boost your academic performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note: any) => (
          <Link
            key={note.id}
            href={`/student/notes/${note.id}`}
            className="group flex flex-col justify-between bg-white dark:bg-slate-900/50 rounded-2xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 p-6 hover:shadow-md transition-all hover:ring-blue-300 dark:hover:ring-blue-800"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-2 text-blue-600 dark:text-blue-400">
                  <FiBook className="h-5 w-5" />
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
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-500 dark:text-slate-400 font-medium">
              Read Note <span className="ml-1 group-hover:translate-x-1 inline-block transition-transform">→</span>
            </div>
          </Link>
        ))}
        
        {notes.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            No notes have been published yet. Please check back later.
          </div>
        )}
      </div>
    </div>
  );
}

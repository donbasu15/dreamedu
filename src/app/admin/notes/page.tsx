import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { deleteNote } from "@/app/actions/notes";
import DeleteButton from "@/components/admin/DeleteButton";

import SearchFilter from "@/components/SearchFilter";

export default async function AdminNotesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const { search, category } = await searchParams;

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manage Notes</h1>
        <Link
          href="/admin/notes/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm"
        >
          <FiPlus /> New Note
        </Link>
      </div>

      <SearchFilter placeholder="Search notes by title..." />

      <div className="bg-white dark:bg-slate-900/50 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:table-cell">Creator</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">Created</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900/20 divide-y divide-slate-200 dark:divide-slate-800">
              {notes.map((note: any) => (
                <tr key={note.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[150px] sm:max-w-xs">{note.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-[10px] sm:text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded w-max border border-blue-100 dark:border-blue-900/30">
                      {note.categoryName || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <div className="text-sm text-slate-500 dark:text-slate-400">{note.creatorName || "N/A"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${note.isPremium ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'}`}>
                      {note.isPremium ? 'Premium' : 'Free'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 hidden md:table-cell">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2 sm:gap-3 items-center">
                      <Link href={`/admin/notes/${note.id}`} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-white transition-colors" title="Edit Note">
                        <FiEdit2 className="h-4 w-4 sm:h-5 sm:w-5"/>
                      </Link>
                      <DeleteButton id={note.id} onDelete={deleteNote} itemName="Note" />
                    </div>
                  </td>
                </tr>
              ))}
              {notes.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-slate-500 dark:text-slate-400">
                    {search || category ? "No notes matching your filters." : "No notes found. Create your first one."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

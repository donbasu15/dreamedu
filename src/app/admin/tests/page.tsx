import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FiPlus, FiEdit2, FiList } from "react-icons/fi";

import { deleteTest } from "@/app/actions/tests";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminTestsPage() {
  const tests = await prisma.test.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, _count: { select: { questions: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manage Tests</h1>
        <div className="flex gap-3">
          <Link
            href="/admin/tests/new"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm"
          >
            <FiPlus /> New Test
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900/50 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Test Details</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type / Duration</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Questions</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-900/20 divide-y divide-slate-200 dark:divide-slate-800">
            {tests.map((test: any) => (
              <tr key={test.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{test.title}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{test.category?.name || "Uncategorized"}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    <span className={`inline-flex items-center w-max px-2.5 py-0.5 rounded-full text-xs font-medium ${test.type === 'Mock' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'}`}>
                      {test.type}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{test.durationMinutes} mins</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{test._count.questions}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-4 items-center">
                    <Link href={`/admin/tests/${test.id}/questions`} className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-white flex items-center gap-1 text-xs font-medium bg-blue-50 dark:bg-blue-900/30 px-2 border border-blue-100 dark:border-blue-800 py-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors" title="Manage Questions">
                      <FiList /> Questions
                    </Link>
                    <Link href={`/admin/tests/${test.id}`} className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" title="Edit Test Details">
                      <FiEdit2 className="h-5 w-5" />
                    </Link>
                    <DeleteButton id={test.id} onDelete={deleteTest} itemName="Test" />
                  </div>
                </td>
              </tr>
            ))}
            {tests.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-slate-500 dark:text-slate-400">
                  No tests available. Create the first one!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

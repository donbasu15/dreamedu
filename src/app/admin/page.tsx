import { prisma } from "@/lib/prisma";
import { FiUsers, FiFileText, FiEdit3, FiActivity } from "react-icons/fi";

export default async function AdminDashboardPage() {
  const userCount = await prisma.user.count();
  const noteCount = await prisma.note.count();
  const testCount = await prisma.test.count();
  const resultCount = await prisma.result.count();

  const stats = [
    { title: "Total Users", count: userCount, icon: FiUsers, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Published Notes", count: noteCount, icon: FiFileText, color: "text-emerald-600", bg: "bg-emerald-100" },
    { title: "Active Tests", count: testCount, icon: FiEdit3, color: "text-amber-600", bg: "bg-amber-100" },
    { title: "Test Submissions", count: resultCount, icon: FiActivity, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Overview of platform metrics and recent activity.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 flex items-center justify-between">
             <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{stat.count}</p>
             </div>
             <div className={`${stat.bg} ${stat.color} dark:bg-opacity-20 p-4 rounded-xl`}>
                <stat.icon className="h-6 w-6" />
             </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
         <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Links</h2>
         <div className="flex flex-wrap gap-4">
            <a href="/admin/notes" className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Manage Notes</a>
            <a href="/admin/tests" className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Manage Tests</a>
         </div>
      </div>
    </div>
  );
}

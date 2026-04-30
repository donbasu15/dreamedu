import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProfileForm from "./ProfileForm";

export const metadata = {
  title: "Profile | DreamEdu Classes",
  description: "Manage your user profile and contact details.",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      name: true,
      email: true,
      currentInstitution: true,
      gradeOrClass: true,
      phone: true,
      address: true,
      role: true,
    },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Your Profile</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Manage your personal details and contact information.
        </p>
      </div>
      
      <div className="bg-card text-card-foreground shadow-sm rounded-lg border border-border overflow-hidden transition-colors duration-300">
        <div className="px-4 py-5 sm:px-6 border-b border-border bg-slate-50 dark:bg-slate-900/50">
          <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-slate-100 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Personal Information
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
            Ensure your details are up to date for better communication.
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <ProfileForm user={user} />
        </div>
      </div>
    </div>
  );
}

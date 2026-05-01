import Link from "next/link";
import { FiBookOpen, FiEdit3, FiAward } from "react-icons/fi";

export default function Home() {
  const features = [
    {
      name: "Comprehensive Notes",
      description: "Access high-quality study materials, carefully curated by our expert educators.",
      icon: FiBookOpen,
      href: "/student/notes"
    },
    {
      name: "Dynamic Test Series",
      description: "Take daily mini-quizzes and mock tests to assess your preparation.",
      icon: FiEdit3,
      href: "/student/tests"
    },
    {
      name: "Weekly Leaderboard",
      description: "Compete with peers and check your ranking on our weekly leaderboard after completing tests.",
      icon: FiAward,
      href: "/student/tests"
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center space-y-16 py-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-3xl">
        <div className="flex justify-center mb-8">
          <div className="relative w-24 h-24 rounded-3xl overflow-hidden ring-4 ring-blue-100 dark:ring-blue-900/50 shadow-2xl shadow-blue-500/20 animate-in fade-in zoom-in duration-1000">
            <img 
              src="/profile.png" 
              alt="DreamEdu Logo" 
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
          Welcome to <span className="text-blue-600 dark:text-blue-400">DreamEdu</span> Classes
        </h1>
        <p className="text-lg leading-8 text-slate-600 dark:text-slate-300">
          The ultimate learning management platform. Discover high-quality text notes, participate in structured test series, and track your progress to achieve academic excellence.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/auth/signin"
            className="rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
          >
            Get Started <span aria-hidden="true">→</span>
          </Link>
          <Link href="/student/notes" className="text-sm font-semibold leading-6 text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Browse Notes
          </Link>
        </div>
      </section>

      {/* Feature Section */}
      <section className="w-full mt-16 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Link key={feature.name} href={feature.href} className="block group">
              <div className="flex flex-col items-start p-6 bg-white dark:bg-slate-900/50 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 group-hover:shadow-md dark:group-hover:bg-slate-900 transition-all">
                <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3 ring-1 ring-blue-100 dark:ring-blue-900/40 mb-4 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                  <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold leading-7 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {feature.name}
                </h3>
                <p className="mt-2 text-base leading-7 text-slate-600 dark:text-slate-400 flex-1">
                  {feature.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

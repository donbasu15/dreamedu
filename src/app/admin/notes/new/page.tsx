import NoteForm from "@/components/NoteForm";

export default function NewNotePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Create New Note</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Draft a new educational note with rich text.</p>
      </div>
      <NoteForm />
    </div>
  );
}

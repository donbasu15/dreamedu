import TestForm from "@/components/TestForm";

export default function NewTestPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create New Test</h1>
        <p className="text-sm text-slate-500">Add a new quiz or mock test to your series.</p>
      </div>
      <TestForm />
    </div>
  );
}

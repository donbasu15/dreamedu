export default function CatchAll({ params }: { params: { slug: string[] } }) {
  return (
    <div className="p-8">
      <h1>Root Catch-all</h1>
      <p>Slug: {JSON.stringify(params.slug)}</p>
    </div>
  );
}

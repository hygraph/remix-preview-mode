export function PreviewBanner() {
  return (
    <p style={{ fontWeight: "bold" }}>
      You&apos;re in <strong>preview mode</strong> (Content served from DRAFT)
      &mdash;&nbsp;
      <form action="/api/exit-preview" method="post" className="inline-block">
        <button type="submit" className="font-bold text-white underline">
          Exit Preview Mode <span aria-hidden="true">&rarr;</span>
        </button>
      </form>
    </p>
  );
}

export function ContentPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-5xl px-5 py-16 lg:px-8 lg:py-24">
      <h1 className="max-w-3xl text-4xl font-bold leading-tight text-[var(--blc-green-900)] sm:text-5xl">
        {title}
      </h1>
      {intro && (
        <p className="mt-6 max-w-2xl text-lg text-[var(--blc-green-700)]">
          {intro}
        </p>
      )}
      {children && <div className="mt-12">{children}</div>}
    </section>
  );
}

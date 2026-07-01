export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy-deep px-4 py-12">
      <div className="mb-8 text-center">
        <span className="font-heading text-3xl font-medium tracking-wide text-canvas">
          Valeris
        </span>
        <p className="mt-1 text-sm text-canvas/60">Internal CRM</p>
      </div>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}

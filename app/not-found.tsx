import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="font-serif text-6xl text-gold-600">404</p>
      <h1 className="mt-2 font-serif text-2xl text-navy-900">Page not found</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-[var(--radius)] bg-gold-500 px-6 py-3 font-semibold text-navy-950 hover:bg-gold-600"
      >
        Back to Home
      </Link>
    </div>
  );
}

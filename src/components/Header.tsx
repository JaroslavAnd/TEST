import Link from "next/link";

// NEXT_PUBLIC_APP_NAME доступна у браузері через prefix NEXT_PUBLIC_
const appName = process.env.NEXT_PUBLIC_APP_NAME || "StudyHub";

export default function Header() {
  return (
    <header className="h-16 bg-secondary text-white flex items-center px-4 md:px-6 flex-shrink-0">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-sm font-bold">
          S
        </div>
        <span className="text-lg font-bold tracking-tight">{appName}</span>
      </Link>
    </header>
  );
}

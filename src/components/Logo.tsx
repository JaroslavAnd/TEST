import Link from "next/link";

// Знак: аркуш у клітинку з червоним полем і рядком, виділеним маркером
function Mark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true" className="shrink-0">
      <rect x="1" y="1" width="26" height="26" rx="4" fill="#fff" stroke="#1f2e86" strokeWidth="2" />
      <line x1="8" y1="1" x2="8" y2="27" stroke="#c8362f" strokeWidth="1.5" />
      <rect x="11" y="10" width="11" height="4.5" fill="#ffe04d" />
      <line x1="11" y1="9" x2="22" y2="9" stroke="#1f2e86" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="11" y1="14.5" x2="22" y2="14.5" stroke="#1f2e86" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="11" y1="20" x2="18" y2="20" stroke="#1f2e86" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 ${className}`} aria-label="StudyHub — на головну">
      <Mark />
      <span className="text-xl font-extrabold tracking-tight text-text-main">StudyHub</span>
    </Link>
  );
}

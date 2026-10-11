import Header from "@/components/Header";
import Navigation from "@/components/Navigation/Navigation";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1">
      <Navigation />
      <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8 max-w-7xl">{children}</main>
    </div>
  );
}

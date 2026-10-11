import Navigation from "@/components/Navigation/Navigation";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-8 md:px-8 md:pb-16 md:pt-12">
        {children}
      </main>
      <Navigation />
    </>
  );
}

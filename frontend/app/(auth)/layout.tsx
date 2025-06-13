import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* シンプルなヘッダー */}
      <header className="p-4">
        <Link href="/" className="text-2xl font-bold gradient-text">
          Personal Insight Dashboard
        </Link>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>
    </div>
  );
}

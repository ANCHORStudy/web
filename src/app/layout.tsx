import AuthButton from '@/components/AuthButton';
import './globals.css';
import { Inter } from 'next/font/google';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Anchor Videos',
  description: 'A platform for managing Anchor videos and materials',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Supabaseからカテゴリ一覧を取得
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const { data: classes } = await supabase
    .from('class')
    .select('category, name')
    .order('category', { ascending: true });
  // Discordログイン状態を取得
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex">
          {/* Sidebar */}
          <aside className="w-64 bg-card border-r border-border flex-shrink-0">
            <div className="p-4 border-b border-border">
              <div className="p-4 border-b border-border flex items-center space-x-2">
                <img src="/anchor-logo.png" alt="Anchor Logo" className="w-8 h-8 rounded-md" />
                <a href="/" className="text-xl font-semibold text-foreground hover:text-primary transition-colors">
                  Anchor
                </a>
              </div>
            </div>
            <nav className="p-4 space-y-2">
              <div className="text-sm font-medium text-muted mb-2">Classes</div>
              {/* 動的カテゴリ一覧 */}
              {classes && classes.length > 0 ? (
                classes.map((c: { category: string; name: string }) => (
                  <a
                    key={c.category}
                    href={`/class/${c.category}`}
                    className="block px-3 py-2 text-foreground hover:bg-border rounded-md transition-colors"
                  >
                    {c.name}
                  </a>
                ))
              ) : (
                <div className="text-muted text-sm">No classes</div>
              )}
              <div className="pt-4 mt-4 border-t border-border">
                <div className="text-sm font-medium text-muted mb-2">Resources</div>
                <a href="/resources" className="block px-3 py-2 text-foreground hover:bg-border rounded-md transition-colors">
                  All Resources
                </a>
                <a href="https://sites.google.com/view/anchorstudy" target="_blank" rel="noopener noreferrer" className="block px-3 py-2 text-foreground hover:bg-border rounded-md transition-colors">
                  About
                </a>
                <a href="https://discord.gg/3Pm8rq8b" target="_blank" rel="noopener noreferrer" className="block px-3 py-2 text-foreground hover:bg-border rounded-md transition-colors">
                  Discord
                </a>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Discord未ログイン時のバナー */}
            {!user && (
              <div className="w-full bg-yellow-100 border-b border-yellow-300 text-yellow-900 text-center py-3 font-semibold text-base">
                Please login with Discord!
              </div>
            )}
            <header className="bg-card border-b border-border">
              <div className="px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  {/*
                  <input
                    type="search"
                    placeholder="Search sessions..."
                    className="w-64 px-4 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  */}
                </div>
                <div className="flex items-center space-x-4">
                  {/*
                  <button className="text-muted hover:text-foreground transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </button>
                  */}
                  <AuthButton />
                </div>
              </div>
            </header>

            <main className="flex-1 overflow-auto">
              <div className="max-w-5xl mx-auto px-6 py-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}

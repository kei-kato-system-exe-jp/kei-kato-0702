import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '神秘の占いサイト - あなたの運命を占います',
  description: 'タロット占い、星座占い、おみくじ、数秘術で、あなたの運命を詳しく占います。毎日の運勢から人生の指針まで、神秘的な力があなたを導きます。',
  keywords: ['占い', 'タロット', '星座', 'おみくじ', '数秘術', '運勢', '恋愛運', '仕事運'],
  authors: [{ name: '神秘の占いサイト' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: '神秘の占いサイト - あなたの運命を占います',
    description: 'タロット占い、星座占い、おみくじ、数秘術で、あなたの運命を詳しく占います。',
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    title: '神秘の占いサイト - あなたの運命を占います',
    description: 'タロット占い、星座占い、おみくじ、数秘術で、あなたの運命を詳しく占います。',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-mystic-gradient">
          {children}
        </div>
      </body>
    </html>
  );
}
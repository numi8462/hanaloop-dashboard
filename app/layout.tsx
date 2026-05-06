import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "HanaLoop — PCF Dashboard",
  description: "제품 탄소 발자국(PCF) 관리 대시보드",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="overflow-x-hidden">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 min-w-0 overflow-x-hidden min-h-screen bg-[#f8fafc] lg:ml-60 pt-14 lg:pt-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

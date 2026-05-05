import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}

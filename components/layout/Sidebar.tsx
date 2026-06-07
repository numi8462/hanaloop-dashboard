"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Table2,
  Clock,
  TrendingUp,
  FileText,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "대시보드",
    href: "/dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  {
    label: "데이터 관리",
    href: "/data",
    icon: <Table2 size={18} />,
  },
  {
    label: "배출계수 관리",
    href: "/emission-factors",
    icon: <Clock size={18} />,
  },
  {
    label: "목표관리",
    href: "/goals",
    icon: <TrendingUp size={18} />,
  },
  {
    label: "리포트",
    href: "/report",
    icon: <FileText size={18} />,
  },
];

// 네비게이션 내용
function NavContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {/* 로고 */}
      <div className="flex items-center px-5 h-16 border-b border-[#e3e8ee] gap-2">
        <Image
          src="/hanaloop-logo.png"
          alt="HanaLoop"
          width={40}
          height={20}
          className="h-6 w-auto"
          priority
        />
        <p className="font-semibold text-[#0d253d]">하나루프</p>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto text-[#64748d] hover:text-[#0d253d] transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 px-3 py-4">
        <p className="px-2 py-1 text-[10px] font-semibold tracking-widest uppercase mb-2 text-[#94a3b8]">
          메인 메뉴
        </p>
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const isDisabled = item.badge === "준비 중";

            return (
              <li key={item.href}>
                <Link
                  href={isDisabled ? "#" : item.href}
                  onClick={(e) => {
                    if (isDisabled) e.preventDefault();
                    else onClose?.();
                  }}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${
                      isActive
                        ? "bg-[#533afd]/8 text-[#533afd]"
                        : isDisabled
                          ? "text-[#94a3b8] opacity-60 cursor-not-allowed"
                          : "text-[#64748d] hover:bg-[#f6f9fc] hover:text-[#0d253d]"
                    }
                  `}
                >
                  {item.icon}
                  <span className="flex-1">{item.label}</span>
                  {item.badge ? (
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-[#f0efff] text-[#533afd]">
                      {item.badge}
                    </span>
                  ) : isActive ? (
                    <ChevronRight size={14} className="text-[#533afd]/50" />
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 데스크탑 사이드바 */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen flex-col w-60 bg-white border-r border-[#e3e8ee] z-40">
        <NavContent />
      </aside>

      {/* 모바일 햄버거 버튼 */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white border border-[#e3e8ee] shadow-sm"
      >
        <Menu size={20} className="text-[#64748d]" />
      </button>

      {/* 모바일 오버레이 */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-[#0d253d]/30 z-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 모바일 드로어 */}
      <aside
        className={`lg:hidden fixed left-0 top-0 h-screen flex flex-col w-60 bg-white border-r border-[#e3e8ee] z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <NavContent onClose={() => setIsOpen(false)} />
      </aside>
    </>
  );
}

"use client";

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
    label: "예측",
    href: "/forecast",
    icon: <TrendingUp size={18} />,
    badge: "준비 중",
  },
  {
    label: "리포트",
    href: "/report",
    icon: <FileText size={18} />,
    badge: "준비 중",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen flex flex-col w-60 bg-white border-r border-border z-40">
      {/* 로고 */}
      <div className="flex items-center px-5 h-16 border-b border-border gap-1">
        <Image
          src="/hanaloop-logo.png"
          alt="HanaLoop"
          width={40}
          height={20}
          priority
        />
        <p className="font-semibold text-black">하나루프</p>
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 px-3 py-4">
        <p className="px-2 py-1 text-xs font-semibold tracking-widest mb-1 text-(--color-text-muted)">
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
                  onClick={(e) => isDisabled && e.preventDefault()}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${
                      isActive
                        ? "bg-(--color-text-primary) text-white"
                        : isDisabled
                          ? "text-(--color-text-muted) opacity-60 cursor-not-allowed"
                          : "text-(--color-text-secondary) hover:bg-(--color-surface-raised) hover:text-(--color-text-primary)"
                    }
                  `}
                >
                  {item.icon}
                  <span className="flex-1">{item.label}</span>
                  {item.badge ? (
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-yellow-100 text-yellow-600">
                      {item.badge}
                    </span>
                  ) : isActive ? (
                    <ChevronRight size={14} />
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

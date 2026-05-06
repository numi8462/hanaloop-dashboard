import { EmissionType } from "@/types";

// 카테고리별 색상
export const CATEGORY_COLORS: Record<string, string> = {
  전기: "#08428C",
  원소재: "#2995D9",
  운송: "#79CFF2",
};

// 유형별 배지 스타일
export const TYPE_BADGE: Record<EmissionType, { bg: string; text: string }> = {
  전기: { bg: "bg-[#e8f0f9]", text: "text-[#08428C]" },
  원소재: { bg: "bg-[#edf6fd]", text: "text-[#2995D9]" },
  운송: { bg: "bg-[#f0faff]", text: "text-[#79CFF2]" },
};

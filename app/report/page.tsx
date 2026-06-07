"use client";

import { useState } from "react";
import {
  useCategorySummary,
  useMonthlySummary,
  useTotalCo2e,
  useDashboard,
} from "@/hooks/useDashboard";
import { useGoals } from "@/hooks/useGoals";
import ReportDownloadButton from "@/components/report/ReportDownloadButton";

const DEFAULT_PRICE_PER_TON = 16000;

export default function ReportPage() {
  const [pricePerTon] = useState(DEFAULT_PRICE_PER_TON);

  const { isLoading } = useDashboard();
  const totalCo2e = useTotalCo2e();
  const byCategory = useCategorySummary();
  const byMonth = useMonthlySummary();
  const { goals, isLoading: goalsLoading } = useGoals();

  const isReady = !isLoading && !goalsLoading;

  return (
    <div className="p-6 lg:p-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1
          className="text-2xl font-semibold text-[#0d253d]"
          style={{ letterSpacing: "-0.64px" }}
        >
          보고서
        </h1>
        <p className="text-sm mt-1 text-[#64748d]">
          PCF 데이터를 Excel 형식으로 다운로드합니다
        </p>
      </div>

      {/* 보고서 포함 내용 */}
      <div className="card p-6 mb-6">
        <h3 className="text-base font-semibold text-[#0d253d] mb-4">
          보고서 포함 내용
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { title: "요약", desc: "총 배출량, 탄소 비용" },
            { title: "카테고리별 배출량", desc: "전기, 원소재, 운송 분류" },
            { title: "월별 배출량", desc: "월별 추이 데이터" },
            { title: "목표 관리", desc: "연도별 목표 달성률" },
          ].map((item) => (
            <div
              key={item.title}
              className="px-4 py-3 rounded-lg bg-[#f6f9fc] border border-[#e3e8ee]"
            >
              <p className="text-sm font-medium text-[#0d253d]">{item.title}</p>
              <p className="text-xs text-[#64748d] mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 데이터 요약 */}
      <div className="card p-6 mb-6">
        <h3 className="text-base font-semibold text-[#0d253d] mb-4">
          현재 데이터 요약
        </h3>
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-4 w-48" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2 text-sm">
            <p className="text-[#64748d]">
              총 배출량:{" "}
              <span className="tnum text-[#0d253d] font-medium">
                {totalCo2e.toLocaleString("ko-KR", {
                  maximumFractionDigits: 2,
                })}{" "}
                kgCO₂e
              </span>
            </p>
            <p className="text-[#64748d]">
              탄소 비용:{" "}
              <span className="tnum text-[#0d253d] font-medium">
                {((totalCo2e / 1000) * pricePerTon).toLocaleString("ko-KR", {
                  maximumFractionDigits: 0,
                })}
                원
              </span>
            </p>
            <p className="text-[#64748d]">
              데이터 기간:{" "}
              <span className="tnum text-[#0d253d] font-medium">
                {byMonth.length > 0
                  ? `${byMonth[0].yearMonth} ~ ${byMonth[byMonth.length - 1].yearMonth}`
                  : "-"}
              </span>
            </p>
            <p className="text-[#64748d]">
              설정된 목표:{" "}
              <span className="tnum text-[#0d253d] font-medium">
                {goals.length}개
              </span>
            </p>
          </div>
        )}
      </div>

      {/* 다운로드 버튼 */}
      <ReportDownloadButton
        totalCo2e={totalCo2e}
        byCategory={byCategory}
        byMonth={byMonth}
        goals={goals}
        pricePerTon={pricePerTon}
        disabled={!isReady}
      />
    </div>
  );
}

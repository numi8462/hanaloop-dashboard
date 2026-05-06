import { useEffect, useMemo } from "react";
import { CategorySummary, MonthlySummary, PcfResult } from "@/types";
import { aggregateByCategory, aggregateByMonth } from "@/lib/pcf-calculator";
import { useDashboardStore } from "@/store/dashboardStore";

/**
 * 대시보드 데이터 fetch 및 상태 관리 훅
 * 컴포넌트 마운트 시 자동으로 데이터 fetch
 */
export function useDashboard() {
  const store = useDashboardStore();

  useEffect(() => {
    store.fetchData();
  }, []);

  return {
    summary: store.summary,
    pcfResults: store.pcfResults,
    isLoading: store.isLoading,
    error: store.error,
    selectedYear: store.selectedYear,
    selectedType: store.selectedType,
    setSelectedYear: store.setSelectedYear,
    setSelectedType: store.setSelectedType,
    invalidate: store.invalidate,
  };
}

/**
 * 선택된 연도/카테고리 필터가 적용된 PCF 결과 반환
 * 필터 값이 바뀔 때만 재계산 (useMemo)
 */
export function useFilteredPcfResults(): PcfResult[] {
  const { pcfResults, selectedYear, selectedType } = useDashboardStore();

  return useMemo(() => {
    return pcfResults.filter((r) => {
      const matchYear = r.date.startsWith(selectedYear);
      const matchType = selectedType ? r.type === selectedType : true;
      return matchYear && matchType;
    });
  }, [pcfResults, selectedYear, selectedType]);
}

/**
 * 필터 적용된 카테고리별 집계
 * 파이 차트에서 사용
 */
export function useCategorySummary(): CategorySummary[] {
  const filteredResults = useFilteredPcfResults();
  return useMemo(() => aggregateByCategory(filteredResults), [filteredResults]);
}

/**
 * 필터 적용된 월별 집계
 * 바 차트에서 사용
 */
export function useMonthlySummary(): MonthlySummary[] {
  const filteredResults = useFilteredPcfResults();
  return useMemo(() => aggregateByMonth(filteredResults), [filteredResults]);
}

/**
 * 필터 적용된 전체 CO₂e 합계
 * KPI 카드에서 사용
 */
export function useTotalCo2e(): number {
  const filteredResults = useFilteredPcfResults();
  return useMemo(
    () => filteredResults.reduce((sum, r) => sum + r.co2e, 0),
    [filteredResults],
  );
}

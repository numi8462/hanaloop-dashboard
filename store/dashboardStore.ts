import { DashboardSummary, PcfResult } from "@/types";
import { create } from "zustand";

interface DashboardState {
  selectedYear: string;
  selectedType: string | null;
  summary: DashboardSummary | null;
  pcfResults: PcfResult[];
  isLoading: boolean;
  error: string | null;
  /** 마지막 fetch 시각 (30초 캐시 판단용) */
  lastFetched: number | null;
  setSelectedYear: (year: string) => void;
  setSelectedType: (type: string | null) => void;
  fetchData: () => Promise<void>;
  invalidate: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  selectedYear: "2025",
  selectedType: null,
  summary: null,
  pcfResults: [],
  isLoading: false,
  error: null,
  lastFetched: null,

  setSelectedYear: (year) => set({ selectedYear: year }),
  setSelectedType: (type) => set({ selectedType: type }),

  fetchData: async () => {
    const { isLoading, lastFetched } = get();

    // 이미 로딩 중이면 중복 요청 방지
    if (isLoading) return;

    // 30초 이내 fetch된 데이터 있으면 재사용
    if (lastFetched && Date.now() - lastFetched < 30_000) return;

    set({ isLoading: true, error: null });

    try {
      const [summaryRes, pcfRes] = await Promise.all([
        fetch("/api/pcf?format=summary"),
        fetch("/api/pcf"),
      ]);

      if (!summaryRes.ok || !pcfRes.ok) {
        throw new Error("데이터를 불러오지 못했습니다.");
      }

      const [summaryJson, pcfJson] = await Promise.all([
        summaryRes.json(),
        pcfRes.json(),
      ]);

      set({
        summary: summaryJson.data,
        pcfResults: pcfJson.data,
        isLoading: false,
        lastFetched: Date.now(),
      });
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "데이터를 불러오지 못했습니다.",
        isLoading: false,
      });
    }
  },

  invalidate: () => set({ lastFetched: null }),
}));

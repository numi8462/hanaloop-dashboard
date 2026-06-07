/**
 * 배출계수 전역 상태 관리 (Zustand)
 */

import { create } from "zustand";
import { EmissionFactor } from "@/types";
import {
  getEmissionFactors,
  updateEmissionFactor as apiUpdateEmissionFactor,
  activateEmissionFactor as apiActivateEmissionFactor,
} from "@/services/emissionFactorService";

interface EmissionFactorState {
  // ─── 데이터 상태 ─────────────────────────────────────────────
  factors: EmissionFactor[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  saveError: string | null;
  successMessage: string | null;

  // ─── 액션 ───────────────────────────────────────────────────
  fetchFactors: () => Promise<void>;
  updateFactor: (id: string, emissionFactor: number) => Promise<boolean>;
  activateFactor: (id: string) => Promise<boolean>;
  clearMessages: () => void;
}

export const useEmissionFactorStore = create<EmissionFactorState>((set) => ({
  factors: [],
  isLoading: false,
  isSaving: false,
  error: null,
  saveError: null,
  successMessage: null,

  fetchFactors: async () => {
    set({ isLoading: true, error: null });
    try {
      const factors = await getEmissionFactors();
      set({ factors });
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "데이터를 불러오지 못했습니다.",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  updateFactor: async (id, emissionFactor) => {
    set({ isSaving: true, saveError: null, successMessage: null });
    try {
      await apiUpdateEmissionFactor(id, emissionFactor);
      // 수정 후 전체 다시 fetch (새 버전 생성되므로)
      const factors = await getEmissionFactors();
      set({ factors, successMessage: "배출계수가 수정되었습니다." });
      return true;
    } catch (e) {
      set({
        saveError: e instanceof Error ? e.message : "수정에 실패했습니다.",
      });
      return false;
    } finally {
      set({ isSaving: false });
    }
  },

  activateFactor: async (id) => {
    set({ isSaving: true, saveError: null, successMessage: null });
    try {
      await apiActivateEmissionFactor(id);
      const factors = await getEmissionFactors();
      set({ factors, successMessage: "버전이 변경되었습니다." });
      return true;
    } catch (e) {
      set({
        saveError: e instanceof Error ? e.message : "버전 변경에 실패했습니다.",
      });
      return false;
    } finally {
      set({ isSaving: false });
    }
  },

  clearMessages: () => set({ saveError: null, successMessage: null }),
}));

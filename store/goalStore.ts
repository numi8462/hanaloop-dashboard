/**
 * 목표 관리 전역 상태 관리 (Zustand)
 */

import { create } from "zustand";
import { GoalData } from "@/lib/db/goals";
import {
  getGoals,
  upsertGoal as apiUpsertGoal,
  deleteGoal as apiDeleteGoal,
} from "@/services/goalService";

interface GoalState {
  // ─── 데이터 상태 ─────────────────────────────────────────────
  goals: GoalData[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  saveError: string | null;
  successMessage: string | null;

  // ─── 액션 ───────────────────────────────────────────────────
  fetchGoals: () => Promise<void>;
  upsertGoal: (year: number, targetCo2e: number) => Promise<boolean>;
  deleteGoal: (id: string) => Promise<boolean>;
  clearMessages: () => void;
}

export const useGoalStore = create<GoalState>((set) => ({
  goals: [],
  isLoading: false,
  isSaving: false,
  error: null,
  saveError: null,
  successMessage: null,

  fetchGoals: async () => {
    set({ isLoading: true, error: null });
    try {
      const goals = await getGoals();
      set({ goals });
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "목표를 불러오지 못했습니다.",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  upsertGoal: async (year, targetCo2e) => {
    set({ isSaving: true, saveError: null, successMessage: null });
    try {
      const goal = await apiUpsertGoal(year, targetCo2e);
      set((state) => {
        const exists = state.goals.find((g) => g.year === year);
        return {
          goals: exists
            ? state.goals.map((g) => (g.year === year ? goal : g))
            : [goal, ...state.goals],
          successMessage: "목표가 저장되었습니다.",
        };
      });
      return true;
    } catch (e) {
      set({
        saveError: e instanceof Error ? e.message : "저장에 실패했습니다.",
      });
      return false;
    } finally {
      set({ isSaving: false });
    }
  },

  deleteGoal: async (id) => {
    set({ isSaving: true, saveError: null, successMessage: null });
    try {
      await apiDeleteGoal(id);
      set((state) => ({
        goals: state.goals.filter((g) => g.id !== id),
        successMessage: "목표가 삭제되었습니다.",
      }));
      return true;
    } catch (e) {
      set({
        saveError: e instanceof Error ? e.message : "삭제에 실패했습니다.",
      });
      return false;
    } finally {
      set({ isSaving: false });
    }
  },

  clearMessages: () => set({ saveError: null, successMessage: null }),
}));

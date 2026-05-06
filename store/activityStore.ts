import { create } from "zustand";
import { ActivityData, ActivityInput } from "@/types";
import {
  getActivities,
  createActivity as apiCreateActivity,
  deleteActivity as apiDeleteActivity,
} from "@/services/activityService";

interface ActivityState {
  activities: ActivityData[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  saveError: string | null;
  successMessage: string | null;

  fetchActivities: () => Promise<void>;
  createActivity: (input: ActivityInput) => Promise<boolean>;
  deleteActivity: (id: string) => Promise<boolean>;
  clearMessages: () => void;
}

export const useActivityStore = create<ActivityState>((set) => ({
  activities: [],
  isLoading: false,
  isSaving: false,
  error: null,
  saveError: null,
  successMessage: null,

  fetchActivities: async () => {
    set({ isLoading: true, error: null });
    try {
      const activities = await getActivities();
      set({ activities });
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "데이터를 불러오지 못했습니다.",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  createActivity: async (input) => {
    set({ isSaving: true, saveError: null, successMessage: null });
    try {
      const activity = await apiCreateActivity(input);
      // 새로 추가된 데이터를 목록 맨 앞에 삽입
      set((state) => ({
        activities: [activity, ...state.activities],
        successMessage: "활동 데이터가 추가되었습니다.",
      }));
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

  deleteActivity: async (id) => {
    set({ isSaving: true, saveError: null, successMessage: null });
    try {
      await apiDeleteActivity(id);
      // 삭제된 데이터를 목록에서 제거
      set((state) => ({
        activities: state.activities.filter((a) => a.id !== id),
        successMessage: "활동 데이터가 삭제되었습니다.",
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

  /** 성공/실패 메시지 초기화 */
  clearMessages: () => set({ saveError: null, successMessage: null }),
}));

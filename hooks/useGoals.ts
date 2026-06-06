/**
 * 목표 관리 훅
 */

import { useEffect } from "react";
import { useGoalStore } from "@/store/goalStore";

export function useGoals() {
  const store = useGoalStore();

  useEffect(() => {
    store.fetchGoals();
  }, []);

  return {
    goals: store.goals,
    isLoading: store.isLoading,
    isSaving: store.isSaving,
    error: store.error,
    saveError: store.saveError,
    successMessage: store.successMessage,
    upsertGoal: store.upsertGoal,
    deleteGoal: store.deleteGoal,
    clearMessages: store.clearMessages,
  };
}

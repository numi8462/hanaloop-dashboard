/**
 * 활동 데이터 CRUD 훅
 * activityStore를 통해 상태를 관리하고
 * 컴포넌트에서 사용하기 편한 형태로 반환
 */

import { useEffect } from "react";
import { useActivityStore } from "@/store/activityStore";

export function useActivities() {
  const store = useActivityStore();

  // 컴포넌트 마운트 시 활동 데이터 자동 fetch
  useEffect(() => {
    store.fetchActivities();
  }, []);

  return {
    activities: store.activities,
    isLoading: store.isLoading,
    isSaving: store.isSaving,
    error: store.error,
    saveError: store.saveError,
    successMessage: store.successMessage,
    createActivity: store.createActivity,
    deleteActivity: store.deleteActivity,
    clearMessages: store.clearMessages,
  };
}

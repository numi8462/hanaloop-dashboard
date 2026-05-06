import { useEffect } from "react";
import { useActivityStore } from "@/store/activityStore";
import { ActivityInput } from "@/types";

export function useActivities() {
  const store = useActivityStore();

  useEffect(() => {
    async function fetchActivities() {
      store.setLoading(true);
      store.setError(null);

      try {
        const res = await fetch("/api/activities");
        if (!res.ok) throw new Error("데이터를 불러오지 못했습니다.");
        const json = await res.json();
        store.setActivities(json.data);
      } catch (e) {
        store.setError(
          e instanceof Error ? e.message : "데이터를 불러오지 못했습니다.",
        );
      } finally {
        store.setLoading(false);
      }
    }

    fetchActivities();
  }, []);

  async function createActivity(input: ActivityInput): Promise<boolean> {
    store.setSaving(true);
    store.clearMessages();

    try {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "저장에 실패했습니다.");

      store.addActivity(json.data);
      store.setSuccessMessage("활동 데이터가 추가되었습니다.");
      return true;
    } catch (e) {
      store.setSaveError(
        e instanceof Error ? e.message : "저장에 실패했습니다.",
      );
      return false;
    } finally {
      store.setSaving(false);
    }
  }

  async function deleteActivity(id: string): Promise<boolean> {
    store.setSaving(true);
    store.clearMessages();

    try {
      const res = await fetch(`/api/activities/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("삭제에 실패했습니다.");

      store.removeActivity(id);
      store.setSuccessMessage("활동 데이터가 삭제되었습니다.");
      return true;
    } catch (e) {
      store.setSaveError(
        e instanceof Error ? e.message : "삭제에 실패했습니다.",
      );
      return false;
    } finally {
      store.setSaving(false);
    }
  }

  return {
    activities: store.activities,
    isLoading: store.isLoading,
    isSaving: store.isSaving,
    error: store.error,
    saveError: store.saveError,
    successMessage: store.successMessage,
    createActivity,
    deleteActivity,
    clearMessages: store.clearMessages,
  };
}

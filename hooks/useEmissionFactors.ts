/**
 * 배출계수 관리 훅
 */

import { useEffect } from "react";
import { useEmissionFactorStore } from "@/store/emissionFactorStore";

export function useEmissionFactors() {
  const store = useEmissionFactorStore();

  useEffect(() => {
    store.fetchFactors();
  }, []);

  return {
    factors: store.factors,
    isLoading: store.isLoading,
    isSaving: store.isSaving,
    error: store.error,
    saveError: store.saveError,
    successMessage: store.successMessage,
    updateFactor: store.updateFactor,
    activateFactor: store.activateFactor,
    clearMessages: store.clearMessages,
  };
}

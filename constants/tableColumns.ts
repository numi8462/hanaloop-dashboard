export const ACTIVITY_TABLE_COLUMNS = [
  { key: "date", label: "날짜" },
  { key: "type", label: "유형" },
  { key: "description", label: "설명" },
  { key: "amount", label: "수량" },
  { key: "unit", label: "단위" },
  { key: "action", label: "" },
] as const;

export const EMISSION_FACTOR_COLUMNS = [
  { key: "type", label: "유형" },
  { key: "description", label: "설명" },
  { key: "emissionFactor", label: "배출계수" },
  { key: "unit", label: "단위" },
  { key: "version", label: "버전" },
  { key: "validFrom", label: "적용 시작일" },
] as const;

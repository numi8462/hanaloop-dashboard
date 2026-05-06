"use client";

import { useState } from "react";
import { ActivityInput, EmissionType, UNIT_MAP } from "@/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DESCRIPTION_MAP: Record<EmissionType, string[]> = {
  전기: ["한국전력"],
  원소재: ["플라스틱 1", "플라스틱 2"],
  운송: ["트럭"],
};

const EMISSION_TYPES: EmissionType[] = ["전기", "원소재", "운송"];

// 폼 에러 타입
interface FormErrors {
  date?: string;
  type?: string;
  description?: string;
  amount?: string;
}

interface ActivityFormProps {
  onSubmit: (input: ActivityInput) => Promise<boolean>;
  isSaving: boolean;
  saveError: string | null;
  successMessage: string | null;
  onClearMessages: () => void;
}

export default function ActivityForm({
  onSubmit,
  isSaving,
  saveError,
  successMessage,
  onClearMessages,
}: ActivityFormProps) {
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    type: "" as EmissionType | "",
    description: "",
    amount: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // 유효성 검증
  function validate(): FormErrors {
    const newErrors: FormErrors = {};
    if (!form.date) newErrors.date = "날짜를 입력해주세요.";
    if (!form.type) newErrors.type = "유형을 선택해주세요.";
    if (!form.description) newErrors.description = "설명을 선택해주세요.";
    if (!form.amount) {
      newErrors.amount = "수량을 입력해주세요.";
    } else if (isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      newErrors.amount = "0보다 큰 숫자를 입력해주세요.";
    }
    return newErrors;
  }

  function handleChange(field: string, value: string) {
    if (field === "type") {
      // 유형 변경 시 description 자동 설정
      const descriptions = DESCRIPTION_MAP[value as EmissionType] ?? [];
      setForm((prev) => ({
        ...prev,
        type: value as EmissionType,
        description: descriptions[0] ?? "",
      }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }

    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    onClearMessages();
  }

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = validate();
    setErrors((prev) => ({
      ...prev,
      [field]: newErrors[field as keyof FormErrors],
    }));
  }

  async function handleSubmit() {
    setTouched({ date: true, type: true, description: true, amount: true });
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const input: ActivityInput = {
      date: new Date(form.date).toISOString(),
      type: form.type as EmissionType,
      description: form.description,
      amount: Number(form.amount),
      unit: UNIT_MAP[form.type as EmissionType],
    };

    const success = await onSubmit(input);
    if (success) {
      setForm({
        date: new Date().toISOString().slice(0, 10),
        type: "",
        description: "",
        amount: "",
      });
      setErrors({});
      setTouched({});
    }
  }

  return (
    <div className="card p-6">
      <h3 className="text-base font-semibold text-slate-900 mb-5">
        활동 데이터 추가
      </h3>

      <div className="flex flex-col gap-4">
        {/* 날짜 */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">
            날짜 <span className="text-red-500">*</span>
          </label>
          <Input
            type="date"
            value={form.date}
            onChange={(e) => handleChange("date", e.target.value)}
            onBlur={() => handleBlur("date")}
            className={
              errors.date && touched.date ? "border-red-300 bg-red-50" : ""
            }
          />
          {errors.date && touched.date && (
            <p className="mt-1 text-xs text-red-500">{errors.date}</p>
          )}
        </div>

        {/* 유형 */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">
            유형 <span className="text-red-500">*</span>
          </label>
          <Select
            value={form.type}
            onValueChange={(value) => handleChange("type", value)}
          >
            <SelectTrigger
              className={
                errors.type && touched.type ? "border-red-300 bg-red-50" : ""
              }
              onBlur={() => handleBlur("type")}
            >
              <SelectValue placeholder="유형 선택" />
            </SelectTrigger>
            <SelectContent position="popper" align="start">
              {EMISSION_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.type && touched.type && (
            <p className="mt-1 text-xs text-red-500">{errors.type}</p>
          )}
        </div>

        {/* 설명 */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">
            설명 <span className="text-red-500">*</span>
          </label>
          <Select
            value={form.description}
            onValueChange={(value) => handleChange("description", value)}
            disabled={!form.type}
          >
            <SelectTrigger
              className={
                errors.description && touched.description
                  ? "border-red-300 bg-red-50"
                  : ""
              }
              onBlur={() => handleBlur("description")}
            >
              <SelectValue placeholder="설명 선택" />
            </SelectTrigger>
            <SelectContent position="popper" align="start">
              {form.type &&
                DESCRIPTION_MAP[form.type as EmissionType].map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {errors.description && touched.description && (
            <p className="mt-1 text-xs text-red-500">{errors.description}</p>
          )}
        </div>

        {/* 수량 + 단위 */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">
              수량 <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              onBlur={() => handleBlur("amount")}
              placeholder="0"
              className={
                errors.amount && touched.amount
                  ? "border-red-300 bg-red-50"
                  : ""
              }
            />
            {errors.amount && touched.amount && (
              <p className="mt-1 text-xs text-red-500">{errors.amount}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">
              단위
            </label>
            <Input
              value={form.type ? UNIT_MAP[form.type as EmissionType] : ""}
              readOnly
              placeholder="유형 선택 시 자동 설정"
              className="bg-slate-100 text-slate-500 cursor-not-allowed"
            />
          </div>
        </div>

        {/* 에러 메시지 */}
        {saveError && (
          <div className="px-3 py-2.5 rounded-lg text-sm bg-red-50 border border-red-200 text-red-600">
            {saveError}
          </div>
        )}

        {/* 성공 메시지 */}
        {successMessage && (
          <div className="px-3 py-2.5 rounded-lg text-sm bg-green-50 border border-green-200 text-green-600">
            {successMessage}
          </div>
        )}

        {/* 제출 버튼 */}
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-[#08428C] hover:bg-[#05285a] disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? "저장 중..." : "데이터 추가"}
        </button>
      </div>
    </div>
  );
}

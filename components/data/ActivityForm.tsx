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
      <h3 className="text-base font-semibold text-slate-100 mb-5">
        활동 데이터 추가
      </h3>

      <div className="flex flex-col gap-4">
        {/* 날짜 */}
        <div>
          <label className="text-sm text-slate-300 mb-1.5 block">
            날짜 <span className="text-red-400">*</span>
          </label>
          <Input
            type="date"
            value={form.date}
            onChange={(e) => handleChange("date", e.target.value)}
            onBlur={() => handleBlur("date")}
            aria-invalid={!!(errors.date && touched.date)}
          />
          {errors.date && touched.date && (
            <p className="mt-1 text-xs text-red-400">{errors.date}</p>
          )}
        </div>

        {/* 유형 */}
        <div>
          <label className="text-sm text-slate-300 mb-1.5 block">
            유형 <span className="text-red-400">*</span>
          </label>
          <Select
            value={form.type}
            onValueChange={(value) => handleChange("type", value)}
          >
            <SelectTrigger
              onBlur={() => handleBlur("type")}
              aria-invalid={!!(errors.type && touched.type)}
            >
              <SelectValue placeholder="유형 선택" />
            </SelectTrigger>
            <SelectContent>
              {EMISSION_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.type && touched.type && (
            <p className="mt-1 text-xs text-red-400">{errors.type}</p>
          )}
        </div>

        {/* 설명 */}
        <div>
          <label className="text-sm text-slate-300 mb-1.5 block">
            설명 <span className="text-red-400">*</span>
          </label>
          <Select
            value={form.description}
            onValueChange={(value) => handleChange("description", value)}
            disabled={!form.type}
          >
            <SelectTrigger
              onBlur={() => handleBlur("description")}
              aria-invalid={!!(errors.description && touched.description)}
            >
              <SelectValue placeholder="설명 선택" />
            </SelectTrigger>
            <SelectContent>
              {form.type &&
                DESCRIPTION_MAP[form.type].map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {errors.description && touched.description && (
            <p className="mt-1 text-xs text-red-400">{errors.description}</p>
          )}
        </div>

        {/* 수량 + 단위 */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-slate-300 mb-1.5 block">
              수량 <span className="text-red-400">*</span>
            </label>
            <Input
              type="number"
              value={form.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              onBlur={() => handleBlur("amount")}
              aria-invalid={!!(errors.amount && touched.amount)}
            />
            {errors.amount && touched.amount && (
              <p className="mt-1 text-xs text-red-400">{errors.amount}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-slate-300 mb-1.5 block">단위</label>
            <Input
              value={form.type ? UNIT_MAP[form.type] : ""}
              placeholder="설정 시 자동 적용"
              readOnly
            />
          </div>
        </div>

        {/* 에러 메시지 */}
        {saveError && (
          <div className="px-3 py-2.5 rounded-lg text-sm bg-red-500/10 border border-red-500/30 text-red-400">
            {saveError}
          </div>
        )}

        {/* 성공 메시지 */}
        {successMessage && (
          <div className="px-3 py-2.5 rounded-lg text-sm bg-green-500/10 border border-green-500/30 text-green-400">
            {successMessage}
          </div>
        )}

        {/* 버튼 */}
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-[#0b3d91] hover:bg-[#174ea6] disabled:bg-slate-600 transition-colors"
        >
          {isSaving ? "저장 중..." : "데이터 추가"}
        </button>
      </div>
    </div>
  );
}

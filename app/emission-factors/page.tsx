"use client";

import { useEffect, useState } from "react";
import { EmissionFactor, EmissionType } from "@/types";
import { getEmissionFactors } from "@/services/emissionFactorService";
import { TYPE_BADGE } from "@/constants/colors";
import { EMISSION_FACTOR_COLUMNS } from "@/constants/tableColumns";

export default function EmissionFactorsPage() {
  const [factors, setFactors] = useState<EmissionFactor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFactors() {
      try {
        const data = await getEmissionFactors();
        setFactors(data);
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "데이터를 불러오지 못했습니다.",
        );
      } finally {
        setIsLoading(false);
      }
    }
    fetchFactors();
  }, []);

  // 활성화된 버전으로 필터
  const activeFactors = factors.filter((f) => f.isActive);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          배출계수 관리
        </h1>
        <p className="text-sm mt-1 text-slate-400">
          GHG 배출계수를 관리하고 버전 이력을 추적합니다
        </p>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-lg mb-6 text-sm bg-red-50 border border-red-200 text-red-600">
          {error}
        </div>
      )}

      {/* 현재 배출계수 */}
      <div className="card overflow-hidden mb-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">현재 유효한 배출계수</h3>
        </div>
        <div className="overflow-x-auto overflow-y-auto max-h-[60vh]">
          <table className="w-full min-w-150 text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {EMISSION_FACTOR_COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="border-b border-slate-100">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-5 py-4">
                          <div className="skeleton h-4 w-full" />
                        </td>
                      ))}
                    </tr>
                  ))
                : activeFactors.map((f) => {
                    const badge = TYPE_BADGE[f.type as EmissionType] ?? {
                      bg: "bg-slate-100",
                      text: "text-slate-500",
                    };

                    return (
                      <tr
                        key={f.id}
                        className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${badge.bg} ${badge.text}`}
                          >
                            {f.type}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-medium text-slate-900">
                          {f.description}
                        </td>
                        <td className="px-5 py-4 font-bold text-[#08428C]">
                          {f.emissionFactor}
                        </td>
                        <td className="px-5 py-4 text-slate-400">{f.unit}</td>
                        <td className="px-5 py-4">
                          <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                            v{f.version}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-xs text-slate-400">
                          {f.validFrom.slice(0, 10)}
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

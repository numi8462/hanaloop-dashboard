"use client";

import { useEffect, useState } from "react";
import { EmissionFactor } from "@/types";
import { getEmissionFactors } from "@/services/emissionFactorService";

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

  const activeFactors = factors.filter((f) => f.isActive);
  const inactiveFactors = factors.filter((f) => !f.isActive);

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

      {/* 현재 유효한 배출계수 */}
      <div className="card overflow-hidden mb-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">현재 유효한 배출계수</h3>
          <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-50 text-green-600">
            활성화
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-150 text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {[
                  "유형",
                  "설명",
                  "배출계수",
                  "단위",
                  "버전",
                  "적용 시작일",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider"
                  >
                    {h}
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
                : activeFactors.map((f) => (
                    <tr
                      key={f.id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#e8f0f9] text-[#08428C]">
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
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 버전 이력 */}
      {inactiveFactors.length > 0 && (
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">버전 이력</h3>
            <span className="text-xs px-2 py-1 rounded-full font-medium bg-slate-100 text-slate-500">
              Archived
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {[
                    "유형",
                    "설명",
                    "배출계수",
                    "단위",
                    "버전",
                    "적용 기간",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {inactiveFactors.map((f) => (
                  <tr
                    key={f.id}
                    className="border-b border-slate-100 opacity-60"
                  >
                    <td className="px-5 py-3 text-xs text-slate-400">
                      {f.type}
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      {f.description}
                    </td>
                    <td className="px-5 py-3 line-through text-slate-400">
                      {f.emissionFactor}
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-400">
                      {f.unit}
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-400">
                      v{f.version}
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-400">
                      {f.validFrom.slice(0, 10)} ~{" "}
                      {f.validTo?.slice(0, 10) ?? "현재"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

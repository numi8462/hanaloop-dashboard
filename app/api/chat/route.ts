import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { dbGetActivities, dbGetActiveEmissionFactors } from "@/lib/db";
import {
  generatePcfResults,
  aggregateByCategory,
  aggregateByMonth,
} from "@/lib/pcf-calculator";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    const [activities, emissionFactors] = await Promise.all([
      dbGetActivities(),
      dbGetActiveEmissionFactors(),
    ]);

    const pcfResults = generatePcfResults(activities, emissionFactors);
    const byCategory = aggregateByCategory(pcfResults);
    const byMonth = aggregateByMonth(pcfResults);
    const totalCo2e = pcfResults.reduce((sum, r) => sum + r.co2e, 0);
    const totalCost = (totalCo2e / 1000) * 16000;

    const systemPrompt = `
당신은 HanaLoop PCF 대시보드의 탄소 배출량 분석 AI 어시스턴트입니다.
반드시 한국어로만 답변하세요. 영어, 한자, 중국어, 일본어는 절대 사용하지 마세요.
현재 회사의 탄소 배출 데이터를 기반으로 질문에 답변해주세요.
답변은 친절하고 간결하게 해주세요.
숫자는 구체적으로 제시하고 실용적인 인사이트를 제공해주세요.

=== 현재 PCF 데이터 ===

총 배출량: ${totalCo2e.toFixed(2)} kgCO₂e
탄소 비용 (K-ETS 기준, 16,000원/tCO₂e): ${totalCost.toLocaleString("ko-KR")}원

카테고리별 배출량:
${byCategory.map((c) => `- ${c.type} (${c.scope}): ${c.totalCo2e.toFixed(2)} kgCO₂e (${c.percentage}%)`).join("\n")}

월별 배출량:
${byMonth
  .sort((a, b) => a.yearMonth.localeCompare(b.yearMonth))
  .map(
    (m) =>
      `- ${m.yearMonth}: ${Object.values(m.byType)
        .reduce((s, v) => s + v, 0)
        .toFixed(2)} kgCO₂e`,
  )
  .join("\n")}

=== 현재 배출계수 ===
${emissionFactors
  .map(
    (f) =>
      `- ${f.type} (${f.description}): ${f.emissionFactor} ${f.unit} (v${f.version}, ${f.validFrom.slice(0, 10)}부터 적용)`,
  )
  .join("\n")}
    `.trim();

    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      max_tokens: 1000,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
    });

    return NextResponse.json({
      message: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("[POST /api/chat]", error);
    return NextResponse.json(
      { error: "답변을 생성하지 못했습니다." },
      { status: 500 },
    );
  }
}

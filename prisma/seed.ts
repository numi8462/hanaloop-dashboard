import { PrismaClient } from "@prisma/client";
import { SEED_ACTIVITIES, SEED_EMISSION_FACTORS } from "../lib/seed-data";

const prisma = new PrismaClient();

async function main() {
  console.log("시드 데이터 삽입 시작...");

  const factorCount = await prisma.emissionFactor.count();
  if (factorCount === 0) {
    await prisma.emissionFactor.createMany({
      data: SEED_EMISSION_FACTORS.map((f) => ({
        ...f,
        validFrom: new Date(f.validFrom),
        validTo: f.validTo ? new Date(f.validTo) : null,
      })),
    });
    console.log(`배출계수 ${SEED_EMISSION_FACTORS.length}건 삽입 완료`);
  } else {
    console.log("배출계수 이미 존재, 스킵");
  }

  const activityCount = await prisma.activityData.count();
  if (activityCount === 0) {
    await prisma.activityData.createMany({
      data: SEED_ACTIVITIES.map((a) => ({
        ...a,
        date: new Date(a.date),
      })),
    });
    console.log(`활동 데이터 ${SEED_ACTIVITIES.length}건 삽입 완료`);
  } else {
    console.log("활동 데이터 이미 존재, 스킵");
  }

  console.log("시드 완료!");
}

main()
  .catch((e) => {
    console.error("시드 실패:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { prisma } from "@/lib/prisma";
import { EmissionFactor, EmissionType } from "@/types";

export function toEmissionFactor(row: {
  id: string;
  type: string;
  description: string;
  emissionFactor: number;
  unit: string;
  version: number;
  isActive: boolean;
  validFrom: Date;
  validTo: Date | null;
  createdAt: Date;
}): EmissionFactor {
  return {
    id: row.id,
    type: row.type as EmissionType,
    description: row.description,
    emissionFactor: row.emissionFactor,
    unit: row.unit,
    version: row.version,
    isActive: row.isActive,
    validFrom: row.validFrom.toISOString(),
    validTo: row.validTo ? row.validTo.toISOString() : null,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function dbGetAllEmissionFactors(): Promise<EmissionFactor[]> {
  const rows = await prisma.emissionFactor.findMany({
    orderBy: [{ type: "asc" }, { version: "desc" }],
  });
  return rows.map(toEmissionFactor);
}

export async function dbGetActiveEmissionFactors(): Promise<EmissionFactor[]> {
  const rows = await prisma.emissionFactor.findMany({
    where: { isActive: true },
    orderBy: { type: "asc" },
  });
  return rows.map(toEmissionFactor);
}

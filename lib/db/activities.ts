import { prisma } from "@/lib/prisma";
import { ActivityData, ActivityInput } from "@/types";

export function toActivityData(row: {
  id: string;
  date: Date;
  type: string;
  description: string;
  amount: number;
  unit: string;
  createdAt: Date;
  updatedAt: Date;
}): ActivityData {
  return {
    id: row.id,
    date: row.date.toISOString(),
    type: row.type as ActivityData["type"],
    description: row.description,
    amount: row.amount,
    unit: row.unit,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function dbGetActivities(): Promise<ActivityData[]> {
  const rows = await prisma.activityData.findMany({
    orderBy: { date: "desc" },
  });
  return rows.map(toActivityData);
}

export async function dbCreateActivity(
  input: ActivityInput,
): Promise<ActivityData> {
  const row = await prisma.activityData.create({
    data: {
      date: new Date(input.date),
      type: input.type,
      description: input.description,
      amount: input.amount,
      unit: input.unit,
    },
  });
  return toActivityData(row);
}

export async function dbUpdateActivity(
  id: string,
  input: Partial<ActivityInput>,
): Promise<ActivityData> {
  const row = await prisma.activityData.update({
    where: { id },
    data: {
      ...(input.date && { date: new Date(input.date) }),
      ...(input.type && { type: input.type }),
      ...(input.description && { description: input.description }),
      ...(input.amount != null && { amount: input.amount }),
      ...(input.unit && { unit: input.unit }),
    },
  });
  return toActivityData(row);
}

export async function dbDeleteActivity(id: string): Promise<void> {
  await prisma.activityData.delete({ where: { id } });
}

export async function dbBulkCreateActivities(
  inputs: ActivityInput[],
): Promise<number> {
  const result = await prisma.activityData.createMany({
    data: inputs.map((i) => ({
      date: new Date(i.date),
      type: i.type,
      description: i.description,
      amount: i.amount,
      unit: i.unit,
    })),
  });
  return result.count;
}

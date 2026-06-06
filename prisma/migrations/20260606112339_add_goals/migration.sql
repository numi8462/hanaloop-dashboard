-- CreateTable
CREATE TABLE "goals" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "targetCo2e" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "goals_year_key" ON "goals"("year");

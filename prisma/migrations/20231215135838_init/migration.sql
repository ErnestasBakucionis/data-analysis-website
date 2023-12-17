-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "DataFlow";

-- CreateTable
CREATE TABLE "DataFlow"."Vartotojas" (
    "VartotojoID" SERIAL NOT NULL,
    "Vardas" TEXT NOT NULL,
    "Pavarde" TEXT NOT NULL,
    "El_pastas" TEXT NOT NULL,
    "Slaptazodis" TEXT NOT NULL,
    "Role" TEXT NOT NULL,

    CONSTRAINT "Vartotojas_pkey" PRIMARY KEY ("VartotojoID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vartotojas_El_pastas_key" ON "DataFlow"."Vartotojas"("El_pastas");

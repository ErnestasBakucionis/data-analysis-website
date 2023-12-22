/*
  Warnings:

  - Added the required column `Proceso_tipas` to the `Uzsakymas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DataFlow"."Uzsakymas" ADD COLUMN     "Analizes_irankis" TEXT,
ADD COLUMN     "Analizes_rezultatai" JSONB,
ADD COLUMN     "CSV_Duomenu_kelias" TEXT,
ADD COLUMN     "Duomenu_tipas" TEXT,
ADD COLUMN     "Proceso_tipas" TEXT NOT NULL;

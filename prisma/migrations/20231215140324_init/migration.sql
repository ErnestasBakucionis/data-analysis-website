-- CreateTable
CREATE TABLE "DataFlow"."Uzsakymas" (
    "UzsakymoID" SERIAL NOT NULL,
    "VartotojoID" INTEGER NOT NULL,
    "Uzsakymo_data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Uzsakymo_busena" TEXT NOT NULL,

    CONSTRAINT "Uzsakymas_pkey" PRIMARY KEY ("UzsakymoID")
);

-- CreateTable
CREATE TABLE "DataFlow"."Kategorija" (
    "KategorijosID" SERIAL NOT NULL,
    "Pavadinimas" TEXT NOT NULL,
    "Aprasymas" TEXT,

    CONSTRAINT "Kategorija_pkey" PRIMARY KEY ("KategorijosID")
);

-- CreateTable
CREATE TABLE "DataFlow"."Komentaras" (
    "KomentaroID" SERIAL NOT NULL,
    "VartotojoID" INTEGER NOT NULL,
    "UzsakymoID" INTEGER NOT NULL,
    "Komentaro_tekstas" TEXT NOT NULL,
    "Komentaro_data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Komentaras_pkey" PRIMARY KEY ("KomentaroID")
);

-- CreateTable
CREATE TABLE "DataFlow"."UzsakymoDetale" (
    "EilutesID" SERIAL NOT NULL,
    "UzsakymoID" INTEGER NOT NULL,
    "Kiekis" INTEGER NOT NULL,
    "Vieneto_kaina" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "UzsakymoDetale_pkey" PRIMARY KEY ("EilutesID")
);

-- AddForeignKey
ALTER TABLE "DataFlow"."Uzsakymas" ADD CONSTRAINT "Uzsakymas_VartotojoID_fkey" FOREIGN KEY ("VartotojoID") REFERENCES "DataFlow"."Vartotojas"("VartotojoID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataFlow"."Komentaras" ADD CONSTRAINT "Komentaras_VartotojoID_fkey" FOREIGN KEY ("VartotojoID") REFERENCES "DataFlow"."Vartotojas"("VartotojoID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataFlow"."Komentaras" ADD CONSTRAINT "Komentaras_UzsakymoID_fkey" FOREIGN KEY ("UzsakymoID") REFERENCES "DataFlow"."Uzsakymas"("UzsakymoID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataFlow"."UzsakymoDetale" ADD CONSTRAINT "UzsakymoDetale_UzsakymoID_fkey" FOREIGN KEY ("UzsakymoID") REFERENCES "DataFlow"."Uzsakymas"("UzsakymoID") ON DELETE RESTRICT ON UPDATE CASCADE;

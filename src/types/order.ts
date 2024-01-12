import { SimpleData } from "@/interfaces/simpleData";

export type Order = {
    UzsakymoID: number;
    VartotojoID: number;
    Uzsakymo_data: Date;
    Uzsakymo_busena: string;
    Proceso_tipas: string;
    Duomenu_tipas?: string;
    Analizes_irankis?: string;
    CSV_Duomenu_kelias?: string;
    Analizes_rezultatai?: any;
    JSON_duomenys?: SimpleData[];
};

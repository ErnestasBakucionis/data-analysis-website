import prisma from '../db/prismaClient';
import Papa from 'papaparse';
import fs from 'fs';
import { saveFileLocally } from '@/utils/FileOperations'; // Make sure the path is correct
import formidable from 'formidable';

interface CreateOrderParams {
    csvFilePath: string;
    orderDate: Date;
    processType: string;
    dataType: string;
    analysisTool: string;
    userId: number; // User ID of the person creating the order
}

export async function createOrder({ csvFilePath, orderDate, processType, dataType, analysisTool, userId }: CreateOrderParams) {
    const newOrder = await prisma.uzsakymas.create({
        data: {
            VartotojoID: userId,
            Uzsakymo_busena: 'Pending', // or any specific status based on analysis
            Uzsakymo_data: orderDate,
            Proceso_tipas: processType,
            Duomenu_tipas: dataType,
            Analizes_irankis: analysisTool,
            CSV_Duomenu_kelias: csvFilePath,
            // Analizes_rezultatai: analysisResults, // Uncomment and provide the analysis results if applicable
        },
    });

    return newOrder;
}

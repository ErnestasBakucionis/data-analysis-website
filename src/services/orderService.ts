import prisma from '../db/prismaClient';
import Papa from 'papaparse';
import fs from 'fs';
import { saveFileLocally } from '@/utils/FileOperations'; // Make sure the path is correct
import formidable from 'formidable';

interface OrderParams {
    csvFilePath: string;
    orderDate: Date;
    processType: string;
    dataType: string;
    analysisTool: string;
    userId: number; // User ID of the person creating the order
    jsonData: any;
}

interface UpdateOrderParams {
    orderId: number;
    userId: number;
    newStatus?: string;
    analysisJsonData?: any;
}

export async function createOrder({ csvFilePath, orderDate, processType, dataType, analysisTool, userId, jsonData }: OrderParams) {

    const newOrder = await prisma.uzsakymas.create({
        data: {
            VartotojoID: userId,
            Uzsakymo_busena: 'Pending', // or any specific status based on analysis
            Uzsakymo_data: orderDate,
            Proceso_tipas: processType,
            Duomenu_tipas: dataType,
            Analizes_irankis: analysisTool,
            CSV_Duomenu_kelias: csvFilePath,
            JSON_duomenys: jsonData, // Include the new JSON data
            // Analizes_rezultatai: analysisResults, // Uncomment and provide the analysis results if applicable
        },
    });

    return newOrder;
}

export async function getOrdersByUserId(userId: number, page: number = 1, limit: number = 10, searchTerm: string = '') {
    const startIndex = (page - 1) * limit;

    const searchConditions = {
        OR: [
            { Proceso_tipas: { contains: searchTerm } },
            { Duomenu_tipas: { contains: searchTerm } },
            { Analizes_irankis: { contains: searchTerm } },
            { Uzsakymo_busena: { contains: searchTerm } },
        ],
    };

    const orders = await prisma.uzsakymas.findMany({
        skip: startIndex,
        take: limit,
        where: {
            VartotojoID: userId,
            ...(searchTerm && searchConditions),
        },
        select: {
            UzsakymoID: true,
            VartotojoID: true,
            Uzsakymo_data: true,
            Uzsakymo_busena: true,
            Proceso_tipas: true,
            Duomenu_tipas: true,
            Analizes_irankis: true,
        },
    });

    const total = await prisma.uzsakymas.count({
        where: {
            VartotojoID: userId,
            ...(searchTerm && searchConditions),
        },
    });

    return { orders, total };
}

export async function getOrderById(orderId: number, userId: number): Promise<OrderParams | null> {
    const order = await prisma.uzsakymas.findUnique({
        where: {
            UzsakymoID: orderId,
            VartotojoID: userId,
        },
    });
    return order as OrderParams | null;
}

export async function updateOrder({ orderId, userId, newStatus, analysisJsonData }: UpdateOrderParams) {
    // check if newStatus is valid
    if (newStatus && !['Pending', 'Done', 'Cancelled'].includes(newStatus)) {
        throw new Error('invalidStatus');
    }

    // check if order exists
    const order = await getOrderById(orderId, userId);
    if (!order) {
        throw new Error('orderNotFound');
    }

    const updatedOrder = await prisma.uzsakymas.update({
        where: {
            UzsakymoID: orderId,
            VartotojoID: userId,
        },
        data: {
            ...(newStatus && { Uzsakymo_busena: newStatus }),
            ...(analysisJsonData && { Analizes_rezultatai: analysisJsonData }),
        },
    });

    return updatedOrder;
}
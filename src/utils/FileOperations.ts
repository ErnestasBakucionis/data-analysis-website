import fs from 'fs';
import path from 'path';
import { File } from 'formidable';
import cuid from 'cuid';
import { SimpleData } from '@/interfaces/simpleData';
import Papa from 'papaparse';

function generateFileName(userId: number, orderDate: Date, processType: string, dataType: string, analysisType: string): string {
    const formattedDate = orderDate.toISOString().split('T')[0].replace(/-/g, '');
    const uniqueCuid = cuid();
    return `${userId}_${formattedDate}_${processType}_${dataType}_${analysisType}_${uniqueCuid}.csv`;
}

export const saveFileLocally = (
    csvFile: File,
    userId: number,
    orderDate: Date,
    processType: string,
    dataType: string,
    analysisType: string
): Promise<string> => {
    const localUploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(localUploadsDir)) {
        fs.mkdirSync(localUploadsDir, { recursive: true });
    }

    if (!csvFile.filepath) {
        return Promise.reject(new Error('File path is undefined.'));
    }

    const fileName = generateFileName(userId, orderDate, processType, dataType, analysisType);
    const filePath = path.join(localUploadsDir, fileName);

    const readStream = fs.createReadStream(csvFile.filepath);
    const writeStream = fs.createWriteStream(filePath);

    readStream.pipe(writeStream);

    return new Promise<string>((resolve, reject) => {
        writeStream.on('finish', () => resolve(filePath));
        writeStream.on('error', reject);
        readStream.on('error', reject);
    });
};


export const readCSVFromFile = (filePath: string): Promise<SimpleData[]> => {
    return new Promise((resolve, reject) => {
        Papa.parse(fs.createReadStream(filePath), {
            header: true,
            dynamicTyping: true,
            complete: (results) => resolve(results.data as SimpleData[]),
            error: (error) => reject(error)
        });
    });
}
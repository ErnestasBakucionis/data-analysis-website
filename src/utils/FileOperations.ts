import fs from 'fs';
import path from 'path';
import { File } from 'formidable';

function generateFileName(userId: number, orderDate: Date, processType: string, dataType: string, analysisType: string): string {
    const formattedDate = orderDate.toISOString().split('T')[0].replace(/-/g, '');
    return `${userId}_${formattedDate}_${processType}_${dataType}_${analysisType}.csv`;
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

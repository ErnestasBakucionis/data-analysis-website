import type { NextApiRequest, NextApiResponse } from 'next';
import { saveFileLocally } from '@/utils/FileOperations'; // Ensure this path is correct
import { createOrder } from '@/services/orderService'; // Ensure this path is correct
import { IncomingForm, Fields, Files } from 'formidable';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const form = new IncomingForm();
            const formData = await new Promise<{ fields: Fields, files: Files }>((resolve, reject) => {
                form.parse(req, (err: Error | null, fields: Fields, files: Files) => {
                    if (err) reject(err);
                    console.log(files); // Log the files object to inspect its structure
                    resolve({ fields, files });
                });
            });

            const { fields, files } = formData as { fields: { [key: string]: any }, files: { [key: string]: any } };

            // Extract fields and ensure they are not undefined
            const processType = fields.processType ? fields.processType.toString() : (() => { throw new Error('Process type is required.'); })();
            const dataType = fields.dataType ? fields.dataType.toString() : (() => { throw new Error('Data type is required.'); })();
            const analysisTool = fields.analysisTool ? fields.analysisTool.toString() : (() => { throw new Error('Analysis tool is required.'); })();
            const userId = fields.userId ? Number(fields.userId) : (() => { throw new Error('User ID is required.'); })();

            // Check that csvFile is actually provided
            if (!files.csvFile || !Array.isArray(files.csvFile) || files.csvFile.length === 0) {
                return res.status(400).json({ message: 'CSV file is required.' });
            }
            const csvFile = files.csvFile[0]; // This is now guaranteed to be defined
            const orderDate = new Date();

            // Here, handle the single file and call `createOrder`
            const filePathOrURL = await saveFileLocally(
                csvFile, // This is now a File object from formidable
                Number(userId),
                orderDate,
                processType.toString(),
                dataType.toString(),
                analysisTool.toString()
            );

            // Now call createOrder with the file path or URL and other details
            const newOrder = await createOrder({
                csvFilePath: filePathOrURL, // Pass the file path or URL
                orderDate: orderDate,
                processType: processType.toString(),
                dataType: dataType.toString(),
                analysisTool: analysisTool.toString(),
                userId: Number(userId),
            });

            return res.status(200).json({ message: 'Order created successfully', order: newOrder });
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error); // Log the full error
                return res.status(500).json({ message: 'An error occurred while creating the order.', error: error.message });
            } else {
                // If it's not an Error instance, log it as a general error object
                console.error('An unknown error occurred:', error);
                return res.status(500).json({ message: 'An unknown error occurred.' });
            }
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

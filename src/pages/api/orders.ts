import type { NextApiRequest, NextApiResponse } from 'next';
import { saveFileLocally } from '@/utils/FileOperations'; // Ensure this path is correct
import { createOrder, getOrderById, getOrdersByUserId, updateOrder } from '@/services/orderService'; // Ensure this path is correct
import { IncomingForm, Fields, Files } from 'formidable';
import { parse } from 'path';
import AnalysisService from '@/services/analysisService';
import Papa from 'papaparse';
import fs from 'fs';
import RegressionAnalysis from '@/services/regressionService';

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
            const dataTemplate = fields.dataTemplate ? fields.dataTemplate.toString() : (() => { throw new Error('Data template is required.'); })();
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
                dataTemplate.toString(),
                analysisTool.toString()
            );

            let newOrder: any = null;

            // Now call createOrder with the file path or URL and other details
            await csvToJson(filePathOrURL)
                .then(async jsonData => {
                    // Create a new order with the JSON data
                    newOrder = await createOrder({
                        csvFilePath: filePathOrURL,
                        orderDate: new Date(),
                        processType: processType.toString(),
                        dataType: dataTemplate.toString(),
                        analysisTool: analysisTool.toString(),
                        userId: Number(userId),
                        jsonData: jsonData, // Pass the parsed JSON data here
                    });

                    // Return response here after the new order has been created
                    return res.status(200).json({ message: 'Order created successfully', order: newOrder });
                })
                .catch(error => {
                    console.error(error);
                    return res.status(500).json({ message: 'An error occurred while parsing the CSV file.' });
                });

            // Do analysis
            const analysisService = new AnalysisService(filePathOrURL);
            const degree = 10;
            const model = analysisService.createPolynomialRegressionModel(degree);
            await analysisService.trainModel(model, degree, 300);
            const generateDates = await analysisService.generateFutureDates(30);
            const analysisResults = await analysisService.forecastSales(model, generateDates, degree);

            if (analysisResults) {
                // Update the order with the analysis results
                const updatedOrder = await updateOrder({
                    orderId: newOrder.UzsakymoID,
                    userId: Number(userId),
                    newStatus: 'Done',
                    analysisJsonData: analysisResults,
                });

                // const regressionService = new RegressionAnalysis(filePathOrURL);
                // const predictions = await regressionService.runForecast();
                // console.log('Predictions:', predictions);
                // console.log('Predictions length:', predictions.length);



                // Return response here after the order has been updated
                return res.status(200).json({ message: 'Order updated successfully', order: updatedOrder });
            } else {
                return res.status(500).json({ message: 'An error occurred while analyzing the data.' });
            }

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
    } else if (req.method === 'GET') {
        try {
            const userId = parseInt(req.query.userId as string) || res.status(400).json({ message: 'User ID is required.' });
            const orderId = parseInt(req.query.orderId as string);
            if (orderId && userId) {
                // Handling fetching a specific order by orderId
                try {
                    const order = await getOrderById(orderId, userId);
                    if (!order) {
                        return res.status(404).json({ message: 'Order not found.' });
                    }
                    return res.status(200).json(order);
                } catch (error) {
                    return res.status(500).json({ message: 'An error occurred while fetching the order.' });
                }
            } else {
                // Handling fetching all orders by userId
                const page = parseInt(req.query.page as string) || 1;
                const limit = parseInt(req.query.limit as string) || 20;
                const searchTerm = req.query.search as string || '';

                if (typeof userId !== 'number') {
                    return res.status(400).json({ message: 'User ID must be a number.' });
                }

                const { orders, total } = await getOrdersByUserId(userId, page, limit, searchTerm);
                return res.status(200).json({ orders, total });
            }
        } catch (error) {
            return res.status(500).json({ message: 'An error occurred while fetching users.' });
        }
    } else {
        res.setHeader('Allow', ['POST', 'GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

async function csvToJson(filePath: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
        const fileStream = fs.createReadStream(filePath, 'utf8');
        Papa.parse(fileStream, {
            header: true,
            complete: (results) => {
                resolve(results.data);
            },
            error: (error) => {
                reject(error);
            },
        });
    });
}
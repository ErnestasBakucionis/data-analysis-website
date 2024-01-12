import Papa from 'papaparse';
import * as fs from 'fs';
import { SimpleData } from '@/interfaces/simpleData';
import tf from '@tensorflow/tfjs';
import { SalesData, RegressionAnalysisResult, ForecastResult, ModelMetrics } from '@/interfaces/analysisResults';

interface EnhancedSalesData {
    'Order Date': string;
    'Unit Price': number;
    'Quantity': number;
    dayOfWeek: number;
    dayOfMonth: number;
    month: number;
    year: number;
}

class AnalysisService {
    private filePath: string;
    private minDate!: number;
    private maxDate!: number;
    private minSales!: number;
    private maxSales!: number;
    private actualMSE!: number;
    private actualRMSE!: number;
    private actualMAE!: number;
    private rSquared!: number;
    public performanceMSE!: string;
    public performanceRMSE!: string;
    public performanceMAE!: string;
    private overallPerformance!: string;
    public acceptableMSE: number = 0.05;
    public acceptableRMSE: number = 0.1;
    public acceptableMAE: number = 0.05;

    constructor(filePath: string) {
        this.filePath = filePath;
    }

    private async initializeNormalizationParameters(): Promise<void> {
        const aggregatedData = await this.aggregateSalesByDate();
        const numericDates = aggregatedData.map(item => this.dateToNumeric(item.date));
        const salesValues = aggregatedData.map(item => item.totalSales);

        this.minDate = Math.min(...numericDates);
        this.maxDate = Math.max(...numericDates);
        this.minSales = Math.min(...salesValues);
        this.maxSales = Math.max(...salesValues);
    }

    private normalizeDate(dateNumeric: number): number {
        return (dateNumeric - this.minDate) / (this.maxDate - this.minDate);
    }

    private normalizeSales(sale: number): number {
        return (sale - this.minSales) / (this.maxSales - this.minSales);
    }

    public async readCSV(): Promise<SimpleData[]> {
        return new Promise((resolve, reject) => {
            Papa.parse(fs.createReadStream(this.filePath), {
                header: true,
                dynamicTyping: true,
                complete: (results) => resolve(results.data as SimpleData[]),
                error: (error) => reject(error)
            });
        });
    }

    private denormalizeSales(normalizedSale: number): number {
        return normalizedSale * (this.maxSales - this.minSales) + this.minSales;
    }

    public evaluatePerformance(mse: number, rmse: number, mae: number): string {
        this.performanceMSE = mse <= this.acceptableMSE ? 'Good' : 'Poor';
        this.performanceRMSE = rmse <= this.acceptableRMSE ? 'Good' : 'Poor';
        this.performanceMAE = mae <= this.acceptableMAE ? 'Good' : 'Poor';

        return mse <= this.acceptableMSE && rmse <= this.acceptableRMSE && mae <= this.acceptableMAE ? 'Good Overall' : 'Poor Overall';
    }

    public async aggregateSalesByDate(): Promise<SalesData[]> {
        const data = await this.readCSV();
        const enhancedData = data.map(item => {
            const date = new Date(item['Order Date']);
            return {
                ...item,
                dayOfWeek: date.getDay(),
                dayOfMonth: date.getDate(),
                month: date.getMonth() + 1,
                year: date.getFullYear()
            } as unknown as EnhancedSalesData;
        });

        const salesByDate = new Map<string, any>();

        enhancedData.forEach(item => {
            const totalSale = item['Unit Price'] * item['Quantity'];
            const date = item['Order Date'];

            if (!salesByDate.has(date)) {
                salesByDate.set(date, {
                    totalSales: 0,
                    dayOfWeek: item.dayOfWeek,
                    dayOfMonth: item.dayOfMonth,
                    month: item.month,
                    year: item.year
                });
            }

            salesByDate.get(date).totalSales += totalSale;
        });

        return Array.from(salesByDate, ([date, data]) => ({
            date,
            totalSales: data.totalSales,
            dayOfWeek: data.dayOfWeek,
            dayOfMonth: data.dayOfMonth,
            month: data.month,
            year: data.year
        }));
    }

    private dateToNumeric(dateStr: string): number {
        return new Date(dateStr).getTime();
    }

    private calculateMetrics(actual: tf.Tensor, predicted: tf.Tensor): void {
        const mse = actual.sub(predicted).square().mean().dataSync()[0];
        const rmse = Math.sqrt(mse);
        const mae = actual.sub(predicted).abs().mean().dataSync()[0];
        const meanActual = actual.mean().dataSync()[0];
        const ssRes = actual.sub(predicted).square().sum().dataSync()[0];
        const ssTot = actual.sub(tf.scalar(meanActual)).square().sum().dataSync()[0];
        const rSquared = 1 - ssRes / ssTot;

        console.log(`Mean Squared Error (MSE): ${mse}`);
        console.log(`Root Mean Squared Error (RMSE): ${rmse}`);
        console.log(`Mean Absolute Error (MAE): ${mae}`);
        console.log(`R-squared (R²): ${rSquared}`);

        this.actualMSE = mse;
        this.actualRMSE = rmse;
        this.actualMAE = mae;
        this.rSquared = rSquared;

        const performance = this.evaluatePerformance(mse, rmse, mae);
        this.overallPerformance = performance;
        console.log(`Model Performance: ${performance}`);
    }

    public async getPolynomialFeatures(degree: number): Promise<tf.Tensor[]> {
        await this.initializeNormalizationParameters();
        const aggregatedData = await this.aggregateSalesByDate();

        const additionalFeatures = aggregatedData.map(item => [
            item.dayOfWeek / 6,
            item.dayOfMonth / 31,
            item.month / 12,
            (item.year - this.minDate) / (this.maxDate - this.minDate)
        ]);

        const additionalFeaturesTensor = tf.tensor2d(additionalFeatures);

        const dates = aggregatedData.map(item => this.normalizeDate(this.dateToNumeric(item.date)));
        const datesTensor = tf.tensor1d(dates);
        const polynomialFeatures = [];
        for (let i = 0; i <= degree; i++) {
            polynomialFeatures.push(datesTensor.pow(tf.scalar(i)));
        }

        const datePolynomialFeaturesTensor = tf.stack(polynomialFeatures, 1);
        const finalFeaturesTensor = tf.concat([datePolynomialFeaturesTensor, additionalFeaturesTensor], 1);

        const sales = aggregatedData.map(item => this.normalizeSales(item.totalSales));
        const salesTensor = tf.tensor1d(sales);

        console.log('Shape of finalFeaturesTensor:', finalFeaturesTensor.shape);
        console.log('Shape of salesTensor:', salesTensor.shape);

        return [finalFeaturesTensor, salesTensor];
    }

    public async generateFutureDates(daysAhead: number = 5): Promise<string[]> {
        const aggregatedData = await this.aggregateSalesByDate();

        const latestDate = new Date(Math.max(...aggregatedData.map(data => new Date(data.date).getTime())));
        let futureDates = [];
        let nextDate = new Date(latestDate);

        // Add one day to the latest date to start generating future dates
        nextDate.setDate(nextDate.getDate() + 1);

        for (let day = 0; day < daysAhead; day++) {
            futureDates.push(nextDate.toISOString().split('T')[0]);
            nextDate.setDate(nextDate.getDate() + 1);
        }

        return futureDates;
    }

    public createPolynomialRegressionModel(degree: number): tf.Sequential {
        const model = tf.sequential();
        const inputShape = degree + 1 + 4;
        model.add(tf.layers.dense({
            units: 1,
            inputShape: [inputShape],
            kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }),
        }));

        const optimizer = tf.train.adam();
        model.compile({ optimizer: optimizer, loss: 'meanSquaredError' });

        return model;
    }


    public async trainModel(model: tf.Sequential, degree: number, epochs: number = 100): Promise<any> {
        const [featuresTensor, salesTensor] = await this.getPolynomialFeatures(degree);

        const history = await model.fit(featuresTensor, salesTensor, {
            epochs,
            validationSplit: 0.1,
            callbacks: tf.callbacks.earlyStopping({ monitor: 'val_loss', patience: 10 })
        });

        const predictions = model.predict(featuresTensor) as tf.Tensor;
        this.calculateMetrics(salesTensor, predictions);
    }

    public async forecastSales(model: tf.Sequential, futureDates: string[], degree: number): Promise<RegressionAnalysisResult> {
        const normalizedFutureDates = futureDates.map(date => this.normalizeDate(this.dateToNumeric(date)));

        let futureDatesTensor = tf.tensor1d(normalizedFutureDates);
        let futurePolynomialFeatures = [];
        for (let i = 0; i <= degree; i++) {
            futurePolynomialFeatures.push(futureDatesTensor.pow(tf.scalar(i)));
        }
        let futureDatePolynomialFeaturesTensor = tf.stack(futurePolynomialFeatures, 1);
        let futureAdditionalFeaturesTensor = tf.ones([futureDates.length, 4]);

        let futureFeaturesTensor = tf.concat([futureDatePolynomialFeaturesTensor, futureAdditionalFeaturesTensor], 1);
        console.log('Shape of futureFeaturesTensor:', futureFeaturesTensor.shape);

        const predictionsTensor = model.predict(futureFeaturesTensor) as tf.Tensor;
        const normalizedPredictions = predictionsTensor.dataSync() as unknown as number[];

        const denormalizedPredictions = normalizedPredictions.map(sale => this.denormalizeSales(sale));

        const forecastData: ForecastResult[] = futureDates.map((date, index) => ({
            date: date,
            totalSales: denormalizedPredictions[index]
        }));

        const modelMetrics: ModelMetrics = {
            mse: this.actualMSE,
            rmse: this.actualRMSE,
            mae: this.actualMAE,
            rSquared: this.rSquared,
            performanceMSE: this.performanceMSE,
            performanceRMSE: this.performanceRMSE,
            performanceMAE: this.performanceMAE,
            overallPerformance: this.overallPerformance
        };

        return {
            forecastData,
            modelMetrics
        };
    }
}

export default AnalysisService;

import { SimpleData } from '@/interfaces/simpleData';
import tf from '@tensorflow/tfjs';
import { readCSVFromFile } from '@/utils/FileOperations';

interface ExtendedData extends SimpleData {
    OrderDateNumeric: number;
    'Quantity^2': number;
    MonthNumeric: number;
    YearNumeric: number;
    IsPublicHoliday: number;
    SeasonEncoded: number;
    PreviousDaySales: number; // Example of a lagged feature
    Rolling7DayAvgSales: number; // Example of a rolling statistic
    DayOfWeek: number; // 0 for Sunday, 1 for Monday, etc.
    IsWeekend: number; // 0 for weekdays, 1 for weekends
}

class RegressionService {
    private data: ExtendedData[] = [];
    private model: tf.Sequential | null = null;
    private filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
    }

    private async loadData(): Promise<void> {
        try {
            console.log('Starting to load data...');
            const rawData = await readCSVFromFile(this.filePath);
            this.data = rawData.map(d => ({
                ...d,
                OrderDateNumeric: 0,
                'Quantity^2': 0,
                MonthNumeric: 0,
                YearNumeric: 0,
                IsPublicHoliday: 0,
                SeasonEncoded: 0,
                PreviousDaySales: 0,
                Rolling7DayAvgSales: 0,
                DayOfWeek: 0,
                IsWeekend: 0,
            }));
            console.log(`Data loaded successfully. Total records: ${this.data.length}`);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    private preprocessData(): { trainingData: ExtendedData[], testData: ExtendedData[] } {
        console.log('Starting data preprocessing with additional features...');
        try {
            this.data.sort((a, b) => new Date(a['Order Date']).getTime() - new Date(b['Order Date']).getTime());

            const previousDaySalesMap = new Map<number, number>();

            let rollingSum = 0;

            this.data = this.data.map((item, index) => {
                const date = new Date(item['Order Date']);
                const monthNumeric = date.getMonth() + 1;
                const yearNumeric = date.getFullYear();
                const dayOfWeek = date.getDay();
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6 ? 1 : 0;

                const quantitySquared = Math.pow(item.Quantity, 2);
                const isPublicHoliday = item['Public Holiday'] === 1 ? 1 : 0;
                const seasonEncoded = this.encodeSeason(item.Season);

                const previousDaySales = previousDaySalesMap.get(item.ID - 1) || 0;
                rollingSum += item['Total Price'];
                if (index >= 7) {
                    rollingSum -= this.data[index - 7]['Total Price'];
                }
                const rolling7DayAvgSales = rollingSum / Math.min(index + 1, 7);

                previousDaySalesMap.set(item.ID, item['Total Price']);

                return {
                    ...item,
                    OrderDateNumeric: date.getTime(),
                    'Quantity^2': quantitySquared,
                    MonthNumeric: monthNumeric,
                    YearNumeric: yearNumeric,
                    IsPublicHoliday: isPublicHoliday,
                    SeasonEncoded: seasonEncoded,
                    PreviousDaySales: previousDaySales,
                    Rolling7DayAvgSales: rolling7DayAvgSales,
                    DayOfWeek: dayOfWeek,
                    IsWeekend: isWeekend,
                };
            });

            this.data = this.normalizeFeatures(this.data, [
                'Unit Price', 'Quantity', 'Total Price', 'Marketing Spend', 'Competitor Pricing',
            ]);

            const splitIndex = Math.floor(this.data.length * 0.8);
            const trainingData = this.data.slice(0, splitIndex);
            const testData = this.data.slice(splitIndex);

            console.log(`Preprocessing complete. Training data size: ${trainingData.length}, Test data size: ${testData.length}`);
            return { trainingData, testData };
        } catch (error) {
            console.error('Error during preprocessing:', error);
            throw error;
        }
    }

    private encodeSeason(season: string): number {
        const seasons = ['Winter', 'Spring', 'Summer', 'Fall'];
        return seasons.indexOf(season);
    }

    private normalizeFeatures(data: ExtendedData[], features: (keyof SimpleData)[]): ExtendedData[] {
        console.log('Starting feature normalization process...');

        type NumericKeys = Exclude<keyof SimpleData, 'Order Date' | 'Product Name' | 'Country' | 'City' | 'Category Name' | 'Weekday' | 'Season'>;

        const maxValues: Record<NumericKeys, number> = {} as Record<NumericKeys, number>;

        features.forEach((feature) => {
            const numericFeature = feature as NumericKeys;
            maxValues[numericFeature] = Math.max(...data.map(item => item[numericFeature] as number));
            console.log(`Max value for ${numericFeature}: ${maxValues[numericFeature]}`);
        });

        const normalizedData = data.map(item => {
            const normalizedItem = { ...item };
            features.forEach((feature) => {
                const numericFeature = feature as NumericKeys;
                const value = item[numericFeature];
                const maxValue = maxValues[numericFeature];
                if (typeof value === 'number' && maxValue != null) {
                    normalizedItem[numericFeature] = value / maxValue;
                }
            });
            return normalizedItem;
        });

        console.log('Feature normalization process completed.');
        return normalizedData;
    }

    private createModel(inputFeatures: number): void {
        console.log('Creating model...');

        this.model = tf.sequential();

        this.model.add(tf.layers.dense({ inputShape: [inputFeatures], units: 64, activation: 'relu' }));
        this.model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
        this.model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
        this.model.add(tf.layers.dense({ units: 1 }));

        this.model.compile({
            optimizer: tf.train.adam(),
            loss: 'meanSquaredError',
            metrics: ['mae'],
        });

        console.log('Model creation complete.');
    }

    private async trainModel(trainingData: tf.Tensor2D, targetData: tf.Tensor2D): Promise<tf.History> {
        if (!this.model) {
            throw new Error('Model has not been created yet.');
        }

        console.log('Starting model training...');

        const response = await this.model.fit(trainingData, targetData, {
            epochs: 100,
            validationSplit: 0.2,
            callbacks: tf.callbacks.earlyStopping({ patience: 10 }),
        });

        console.log('Model training complete.');
        return response;
    }

    private evaluateModel(testData: tf.Tensor2D, targetData: tf.Tensor2D): { loss: number; metric: number } {
        if (!this.model) {
            throw new Error('Model has not been created yet.');
        }
        console.log('Evaluating model...');

        const result = this.model.evaluate(testData, targetData) as tf.Tensor[];

        const loss = result[0].dataSync()[0];
        const metric = result[1].dataSync()[0];

        console.log(`Evaluation result: Loss = ${loss}, Metric = ${metric}`);
        return { loss, metric };
    }

    private forecastSales(inputData: tf.Tensor2D): Float32Array {
        if (!this.model) {
            throw new Error('Model has not been created yet.');
        }

        console.log('Forecasting sales...');

        const predictions = this.model.predict(inputData) as tf.Tensor<tf.Rank>;
        const predictedSales = predictions.dataSync();

        console.log('Sales forecast complete.');
        return new Float32Array(predictedSales);
    }

    public async runForecast(): Promise<Float32Array> {
        await this.loadData();
        let { trainingData, testData } = this.preprocessData();

        const featureNames = Object.keys(trainingData[0]).filter(key =>
            key !== 'ID' && // ID is typically an index and not a feature
            key !== 'Country' && // Non-numeric
            key !== 'City' && // Non-numeric
            key !== 'Category Name' && // Non-numeric, unless encoded as a number
            key !== 'Product Name' && // Non-numeric
            key !== 'Order Date' && // Replaced by OrderDateNumeric
            key !== 'Season' && // Replaced by SeasonEncoded
            key !== 'Weekday' && // Non-numeric, unless encoded as a number
            key !== 'Total Price' // Assuming 'Total Price' is the target variable
        );

        this.createModel(featureNames.length);

        const trainingFeatures = tf.tensor2d(trainingData.map(item =>
            featureNames.map(name => Number(item[name as keyof ExtendedData]))
        ));
        const trainingTargets = tf.tensor2d(trainingData.map(item => [item['Total Price']]));

        const testFeatures = tf.tensor2d(testData.map(item =>
            featureNames.map(name => Number(item[name as keyof ExtendedData]))
        ));
        const testTargets = tf.tensor2d(testData.map(item => [item['Total Price']]));

        await this.trainModel(trainingFeatures, trainingTargets);

        this.evaluateModel(testFeatures, testTargets);

        const newInputData = tf.tensor2d(testData.map(item =>
            featureNames.map(name => Number(item[name as keyof ExtendedData]))
        ));

        return this.forecastSales(newInputData);
    }
}

export default RegressionService;
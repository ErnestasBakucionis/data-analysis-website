export interface SalesData {
    year: number;
    month: number;
    dayOfMonth: number;
    dayOfWeek: number;
    date: string;
    totalSales: number;
}

export interface ForecastResult {
    date: string;
    totalSales: number;
}

export interface ModelMetrics {
    mse: number;
    rmse: number;
    mae: number;
    rSquared: number;
    performanceMSE: string;
    performanceRMSE: string;
    performanceMAE: string;
    overallPerformance: string;
}

export interface RegressionAnalysisResult {
    forecastData: ForecastResult[];
    modelMetrics: ModelMetrics;
}
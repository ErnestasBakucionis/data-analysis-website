import AnalysisService from '../services/analysisService';

describe('AnalysisService', () => {
    const filePath = 'path/to/data.csv';
    const analysisService = new AnalysisService(filePath);

    describe('evaluatePerformance', () => {
        test('should return "Good Overall" if all metrics are within acceptable ranges', () => {
            const mse = analysisService.acceptableMSE - 0.01;
            const rmse = analysisService.acceptableRMSE - 0.01;
            const mae = analysisService.acceptableMAE - 0.01;
            const performance = analysisService.evaluatePerformance(mse, rmse, mae);
            expect(performance).toBe('Good Overall');
        });

        test('should return "Poor Overall" if any metric is outside the acceptable range', () => {
            const mse = analysisService.acceptableMSE + 0.01;
            const rmse = analysisService.acceptableRMSE + 0.01;
            const mae = analysisService.acceptableMAE + 0.01;
            const performance = analysisService.evaluatePerformance(mse, rmse, mae);
            expect(performance).toBe('Poor Overall');
        });

        test('should return "Good" for MSE if it is within the acceptable range', () => {
            const mse = analysisService.acceptableMSE - 0.01;
            const rmse = analysisService.acceptableRMSE + 0.01;
            const mae = analysisService.acceptableMAE + 0.01;
            analysisService.evaluatePerformance(mse, rmse, mae);
            expect(analysisService.performanceMSE).toBe('Good');
            expect(analysisService.performanceRMSE).toBe('Poor');
            expect(analysisService.performanceMAE).toBe('Poor');
        });

    });
});
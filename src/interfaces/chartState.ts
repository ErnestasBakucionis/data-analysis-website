export interface ChartState {
    labels: string[];
    datasets: Array<{
        label: string;
        data: Array<{ x: Date | string; y: number }>;
        backgroundColor: string;
        pointBackgroundColor?: string; // Make pointBackgroundColor optional
        borderColor?: string; // Make borderColor optional
        showLine?: boolean; // Make showLine optional
        fill?: boolean; // Make fill optional
    }>;
}
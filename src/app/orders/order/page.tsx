'use client';
import { useEffect, useRef, useState } from 'react';
import { Scatter, Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, TimeScale, Title, Tooltip, Legend, ChartOptions, LineElement, ChartData, ChartDataset, BarElement, BarController, PieController, ArcElement, RadarController, RadialLinearScale } from 'chart.js';
import { OrderProps } from '@/interfaces/orderProps';
import { useSession } from 'next-auth/react';
import { ChartState } from '@/interfaces/chartState';
import type { Order } from '@/types/order';
import AnimatedButton from '@/components/AnimatedButton';
import Link from 'next/link';
import 'chartjs-adapter-date-fns';
import { SalesData, RegressionAnalysisResult, ForecastResult, ModelMetrics } from '@/interfaces/analysisResults';
import 'leaflet/dist/leaflet.css';
import { SimpleData } from '@/interfaces/simpleData';
import useTranslation from '@/utils/useTranslation';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    TimeScale,
    LineElement,
    BarElement,
    BarController,
    PieController,
    ArcElement,
    RadarController,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend
);

type TimeUnit = 'day' | 'month' | 'year';

type SalesPerProduct = {
    [productName: string]: number;
};

const Order: React.FC<OrderProps> = ({ searchParams }) => {
    const { t } = useTranslation();
    const { data: sessionData } = useSession();
    const userId = sessionData?.user?.id;
    const chartRef = useRef<any>(null);
    const [chartKey, setChartKey] = useState(0);
    const [timeUnit, setTimeUnit] = useState<TimeUnit>('day');
    const [modelMetrics, setModelMetrics] = useState<ModelMetrics | null>(null);
    const [chartData, setChartData] = useState<ChartState>({
        labels: [],
        datasets: [
            {
                label: 'Total Sales by Date',
                data: [], // your data array
                backgroundColor: 'darkgreen', // This will set the point's fill color
                borderColor: 'green', // This will set the line color
                pointBackgroundColor: 'darkgreen', // This will set the point color
                showLine: true, // required to show the line
                fill: false // set to false to not fill under the line
            },
        ],
    });
    const [barChartData, setBarChartData] = useState<ChartData<'bar', number[], string>>({
        labels: [],
        datasets: [{
            label: 'Total Sales per Product',
            data: [],
            backgroundColor: 'rgba(34, 197, 94, 1)',
            borderColor: 'rgba(34, 197, 94, 0.9)',
            borderWidth: 1
        }]
    });
    const [pieChartData, setPieChartData] = useState<ChartData<'pie', number[], string>>({
        labels: [], // This will be your categories, countries, or products
        datasets: [{
            data: [], // This will be the sales data
            backgroundColor: [], // You can define an array of colors for each segment
            hoverOffset: 4 // Optional, for hover effect
        }]
    });

    const options: ChartOptions<'line'> = {
        scales: {
            y: {
                beginAtZero: true,
            },
            x: {
                type: 'time',
                time: {
                    unit: timeUnit, // Use the state here
                    displayFormats: {
                        day: 'dd-MM-yyyy',
                        month: 'MM-yyyy', // Format for months
                        year: 'yyyy' // Format for years
                    }
                },
                title: {
                    display: true,
                    text: 'Date'
                },
            }
        },
        elements: {
            line: {
                tension: 0, // Set tension to 0 to create a straight line without bezier curves
                segment: {
                    borderColor: ctx => 'green', // This sets the line segment color to green
                }
            },
            point: {
                backgroundColor: 'darkgreen' // This sets the point color to dark green
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    title: function (tooltipItems) {
                        // Ensure that the title callback only returns a formatted date for the x-axis
                        return tooltipItems[0].label;
                    },
                    label: function (context) {
                        // Format the label to show your y value correctly
                        let label = context.dataset.label || '';

                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat().format(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        }
    };

    const barChartOptions: ChartOptions<'bar'> = {
        scales: {
            x: {
                // This should be a 'category' type or you can omit 'type' altogether.
                type: 'category',
                title: {
                    display: true,
                    text: 'Product Name'
                },
            },
            y: {
                beginAtZero: true,
            }
        },
        // ...other options
    };

    const pieChartOptions: ChartOptions<'pie'> = {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1, // Adjust this to change the size of the Pie chart
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Sales Distribution'
            },
        }
    };

    const aggregateSalesPerProduct = (orderData: SimpleData[]): SalesPerProduct => {
        const salesPerProduct: SalesPerProduct = {};

        orderData.forEach(order => {
            const productName = order['Product Name'];
            const totalSale = order['Total Price'];

            if (salesPerProduct[productName]) {
                salesPerProduct[productName] += totalSale;
            } else {
                salesPerProduct[productName] = totalSale;
            }
        });

        return salesPerProduct;
    };

    const aggregateSalesByCountry = (data: SimpleData[]) => {
        const salesByCountry: { [country: string]: number } = {};

        data.forEach((item) => {
            const totalPrice = parseFloat(String(item['Total Price']));
            if (!isNaN(totalPrice)) {
                if (salesByCountry[item.Country]) {
                    salesByCountry[item.Country] += totalPrice;
                } else {
                    salesByCountry[item.Country] = totalPrice;
                }
            }
        });

        return salesByCountry;
    };

    const updatePieChartData = (salesByCountry: { [country: string]: number }) => {
        const countries = Object.keys(salesByCountry);
        const sales = Object.values(salesByCountry);

        // Define colors for each country - this could be a predefined array of colors
        const colors = countries.map(() => `hsl(${Math.random() * 360}, 100%, 70%)`);

        setPieChartData({
            labels: countries,
            datasets: [{
                data: sales,
                backgroundColor: colors,
                hoverOffset: 4
            }]
        });
    };

    useEffect(() => {
        const currentChartRef = chartRef.current;

        const handleResize = () => {
            if (currentChartRef) {
                currentChartRef.resize();
            }
        };

        if (window) {
            window.removeEventListener('resize', handleResize);
        }

        const fetchOrderData = async () => {
            try {
                const response = await fetch(`/api/orders?userId=${userId}&orderId=${searchParams.id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const orderData: Order = await response.json();
                const insertedData = orderData.JSON_duomenys as unknown as SimpleData[];
                const processedData = aggregateSalesPerProduct(insertedData);

                setBarChartData({
                    labels: Object.keys(processedData),
                    datasets: [{
                        ...barChartData.datasets[0],
                        data: Object.values(processedData).map(value => typeof value === 'string' ? parseFloat(value) : value),
                    }]
                });

                const salesByCountry = aggregateSalesByCountry(insertedData);
                updatePieChartData(salesByCountry);
                console.log('Pie Chart Data:', pieChartData);

                const separateRecords = (orderData.JSON_duomenys as unknown as { 'Order Date': string; 'Total Price': string }[]).reduce((acc: { date: string; totalPrice: number }[], order) => {
                    const existingRecord = acc.find(record => record.date === order['Order Date']);
                    if (existingRecord) {
                        existingRecord.totalPrice += parseFloat(order['Total Price']);
                    } else {
                        acc.push({
                            date: order['Order Date'],
                            totalPrice: parseFloat(order['Total Price']),
                        });
                    }
                    return acc;
                }, []);

                // Sort records by date from oldest to newest
                const sortedRecords = separateRecords.sort((a, b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);

                    return dateA.getTime() - dateB.getTime();
                });

                const labels = sortedRecords.map(record => record.date);
                const data = sortedRecords.map(record => {
                    const date = new Date(record.date);
                    return {
                        x: date,
                        y: record.totalPrice
                    };
                });

                const lastOriginalDataPoint = data[data.length - 1];

                const regressionPredictedDataResults = orderData.Analizes_rezultatai as RegressionAnalysisResult;
                setModelMetrics(regressionPredictedDataResults.modelMetrics);
                const forecastResults = regressionPredictedDataResults.forecastData;

                const dataPredicted = forecastResults.map((result) => ({
                    x: new Date(result.date), // Convert the date string to a Date object
                    y: result.totalSales,
                }));

                // If you need to prepend the last original data point
                dataPredicted.unshift({
                    x: new Date(lastOriginalDataPoint.x), // Convert the string to a Date object if necessary
                    y: lastOriginalDataPoint.y,
                });

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'ORIGINAL Total Sales by Date',
                            data, // <-- This should be the array of objects with x and y properties
                            backgroundColor: 'darkgrey', // For the tooltip background
                            borderColor: 'grey', // Line color
                            pointBackgroundColor: 'darkgrey', // Point color
                            showLine: true, // Required to show the line
                            fill: false // Set to false to not fill under the line
                        },
                        {
                            label: 'PREDICTED Total Sales by Date',
                            data: dataPredicted, // <-- This should be the array of objects with x and y properties
                            backgroundColor: 'rgba(34, 197, 94, 1)', // For the tooltip background
                            borderColor: 'rgba(34, 197, 94, 0.9)', // Line color
                            pointBackgroundColor: 'rgba(34, 197, 94, 1)', // Point color
                            showLine: true, // Required to show the line
                            fill: false // Set to false to not fill under the line
                        },
                    ],
                });
                setChartKey(prevKey => prevKey + 1);
            } catch (error) {
                console.error('Failed to fetch order data:', error);
            }
        };

        fetchOrderData();

        return () => {
            if (window) {
                window.removeEventListener('resize', handleResize);
            }
            if (currentChartRef) {
                currentChartRef.destroy();
            }
        };
    }, [searchParams.id, userId, timeUnit]);


    return (
        <div className="container mx-auto p-6">
            <div className="buttons-container">
                <Link href="/orders/myorders" passHref>
                    <AnimatedButton
                        className='px-3 mb-3 py-2 rounded-md text-sm font-medium text-gray-100 hover:bg-green-600 bg-green-500'
                    >
                        Go back
                    </AnimatedButton>
                </Link>
            </div>

            <hr className="mb-8" />

            <div className="container p-6">
                <h1 className="text-3xl font-semibold mb-4">Sales Forecasting</h1>
                <div className="mx-auto p-6 m-4 bg-white rounded-lg shadow-md">
                    {modelMetrics && (
                        <div className="flex flex-wrap -mx-2">
                            <div className="px-2 w-full lg:w-1/2">
                                <h2 className="text-xl font-semibold mb-4">Model Metrics</h2>
                                <p className={`text-lg ${modelMetrics.performanceMSE === 'Good' ? 'text-green-600' : 'text-red-600'}`}>
                                    <b>MSE:</b> {modelMetrics.mse} <span>({modelMetrics.performanceMSE})</span>
                                </p>
                                <p className={`text-lg ${modelMetrics.performanceRMSE === 'Good' ? 'text-green-600' : 'text-red-600'}`}>
                                    <b>RMSE:</b> {modelMetrics.rmse} <span>({modelMetrics.performanceRMSE})</span>
                                </p>
                                <p className={`text-lg ${modelMetrics.performanceMAE === 'Good' ? 'text-green-600' : 'text-red-600'}`}>
                                    <b>MAE:</b> {modelMetrics.mae} <span>({modelMetrics.performanceMAE})</span>
                                </p>
                                <p className="text-lg">
                                    <b>R-squared:</b> {modelMetrics.rSquared}
                                </p>
                                <p className={`text-lg font-bold ${modelMetrics.overallPerformance === 'Good' ? 'text-green-600' : 'text-red-600'}`}>
                                    <b>Overall Performance:</b> {modelMetrics.overallPerformance}
                                </p>
                            </div>
                            <div className="px-2 w-full lg:w-1/2">
                                <h2 className="text-xl font-semibold mb-4">Model Description</h2>
                                <p className="text-lg mb-2">This section provides a comprehensive overview of the model is performance metrics. Understanding these metrics is crucial for evaluating the model is predictive accuracy and reliability.</p>
                                <ul className="list-disc pl-5 mb-4">
                                    <li><b>MSE (Mean Squared Error):</b> Indicates the average squared difference between the estimated values and the actual value.</li>
                                    <li><b>RMSE (Root Mean Squared Error):</b> Represents the square root of the second sample moment of the differences between predicted values and observed values.</li>
                                    <li><b>MAE (Mean Absolute Error):</b> Measures the average magnitude of the errors in a set of predictions, without considering their direction.</li>
                                    <li><b>R-squared:</b> Provides a measure of how well observed outcomes are replicated by the model, based on the proportion of total variation of outcomes explained by the model.</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
                {/* Center a div */}
                <div className='flex justify-center'>
                    <AnimatedButton className="px-3 m-2 py-2 rounded-md text-sm font-medium text-gray-100 hover:bg-green-600 bg-green-500" onClick={() => setTimeUnit('day')}>Show in Days</AnimatedButton>
                    <AnimatedButton className="px-3 m-2 py-2 rounded-md text-sm font-medium text-gray-100 hover:bg-green-600 bg-green-500" onClick={() => setTimeUnit('month')}>Show in Months</AnimatedButton>
                    <AnimatedButton className="px-3 m-2 py-2 rounded-md text-sm font-medium text-gray-100 hover:bg-green-600 bg-green-500" onClick={() => setTimeUnit('year')}>Show in Years</AnimatedButton>
                </div>
                <Line key={chartKey} ref={chartRef} data={chartData} options={options} />
            </div>


            <hr className="mb-8" />
            <div className="bar-chart-container container p-6" style={{ minHeight: '400px' }}>
                <h1 className="text-3xl font-semibold mb-4">Total Sales per Product</h1>
                <Bar data={barChartData} options={barChartOptions} />
            </div>

            <hr className="mb-8" />
            <div className="pie-chart-container container mx-auto p-6" style={{ width: '50%', height: 'auto' }}>
                <h1 className="text-3xl font-semibold mb-4">Sales Distribution</h1>
                <div style={{ position: 'relative', height: '40vh', width: '40vw' }}> {/* Adjust the height and width as needed */}
                    <Pie data={pieChartData} options={pieChartOptions} />
                </div>
            </div>
        </div >
    );
};

export default Order;

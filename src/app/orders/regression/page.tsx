import Link from 'next/link';
import React from 'react';

function Regression() {
    const clientCsvFile = '/sample_data.csv';

    return (
        <div className="container mx-auto p-6">
            {/* Information About Regression Analysis */}
            <div>
                <h1 className="text-3xl font-semibold mb-4">Understanding Regression Analysis</h1>
                <p className="mb-4">
                    Regression analysis is a powerful statistical method used for predicting and forecasting data. It helps in understanding the relationship between a dependent variable and one or more independent variables. Widely used in various fields for making informed predictions, regression analysis analyzes historical data to forecast future trends and outcomes. This section explores the basics of regression, its significance, and its application in accurate data forecasting.
                </p>
                <hr className="mb-8" />
            </div>

            {/* Performing Regression Analysis with Our Template */}
            <div>
                <h1 className="text-3xl font-semibold mb-4">Simplifying Regression with Our Custom Template</h1>
                <p className="mb-4">
                    Our user-friendly CSV template is designed to make regression analysis straightforward.
                    It features specific columns for different data types, ensuring seamless data integration.
                    Fill in your data in the designated columns, and our system will automatically perform a detailed
                    regression analysis, providing reliable forecast analysis with ease and accuracy. (<Link href="/orders/automatedAnalysis" className="text-blue-600 hover:underline">Learn More</Link>)
                </p>
                <hr className="mb-8" />
            </div>

            {/* Ordering Custom Data Analysis Work */}
            <div>
                <h1 className="text-3xl font-semibold mb-4">Tailored Data Analysis Services</h1>
                <p className="mb-4">
                    If your dataset does not align with our standard CSV template, our tailored data analysis services
                    are here to help. Provide your unique dataset, and our experts will conduct a comprehensive regression
                    analysis, offering personalized insights and forecasts. This bespoke service ensures precise and relevant
                    analysis for any data structure.
                </p>
                <hr className="mb-8" />
            </div>
        </div>
    );
}

export default Regression;

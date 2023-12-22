'use client';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import Papa from 'papaparse';
import Link from 'next/link';
import AnimatedButton from '@/components/AnimatedButton';
import { useSession } from 'next-auth/react';

type AnalysisTool = 'regression' | 'segmentation' | 'timeseries' | 'cohort';
type DataType = 'client' | 'order' | 'product' | 'category' | 'orderLineItem';

interface CSVHeaders {
    [key: string]: string[];
}

const csvHeaders: CSVHeaders = {
    client: ['ID', 'Name', 'Surname', 'Email', 'Address', 'Phone Number'],
    order: ['ID', 'Order Date', 'Total Amount', 'Client ID', 'Delivery Status'],
    product: ['ID', 'Name', 'Description', 'Price', 'Category ID'],
    category: ['ID', 'Name', 'Description'],
    orderLineItem: ['ID', 'Order ID', 'Product ID', 'Quantity', 'Unit Price'],
};

function MyOrders() {
    const [file, setFile] = useState<File | null>(null);
    const [learnMoreLink, setLearnMoreLink] = useState('/orders/regression');
    const [selectedAnalysisTool, setSelectedAnalysisTool] = useState<AnalysisTool>('regression');
    const [selectedDataType, setSelectedDataType] = useState<DataType>('client');
    const [validationError, setValidationError] = useState<string>('');
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [isAutomated, setIsAutomated] = useState<boolean>(true);
    const { data } = useSession();

    const handleAutomationChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setIsAutomated(event.target.value === 'automated');
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            if (file.name.endsWith('.csv')) {
                setValidationError('');
                setFile(file);
            } else {
                setValidationError('The file must be a CSV.');
            }
        }
    };

    const validateCSVContents = (data: any[], expectedHeaders: string[]): boolean => {
        const actualHeaders = data[0] ? Object.keys(data[0]) : [];
        return actualHeaders.length === expectedHeaders.length &&
            expectedHeaders.every((header, index) => actualHeaders[index] === header);
    };

    const handleValidation = (file: File): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            Papa.parse(file, {
                complete: (results) => {
                    if (results.data && results.data.length > 0) {
                        if (validateCSVContents(results.data, csvHeaders[selectedDataType])) {
                            resolve(true); // Validation passed
                        } else {
                            setValidationError('The CSV file does not have the expected headers.');
                            resolve(false); // Validation failed
                        }
                    } else {
                        setValidationError('The CSV file is empty or could not be read.');
                        resolve(false); // Validation failed
                    }
                },
                header: true,
                skipEmptyLines: true
            });
        });
    };

    const handleAnalysisToolChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const newAnalysisTool = event.target.value as AnalysisTool;
        setSelectedAnalysisTool(newAnalysisTool);

        // Update the 'learn more' link based on the analysis tool selected
        const analysisToolInfoPages = {
            regression: '/orders/regression',
            segmentation: '/orders/segmentation',
            timeseries: '/orders/timeseries',
            cohort: '/orders/cohort',
        };

        setLearnMoreLink(analysisToolInfoPages[newAnalysisTool] || '/orders');
    };

    const handleDataTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedDataType(event.target.value as DataType);
    };

    const validateForm = (): boolean => {
        if (!file) {
            setValidationError('Please upload a CSV file.');
            return false;
        }
        if (!selectedAnalysisTool) {
            setValidationError('Please select an analysis tool.');
            return false;
        }
        if (!selectedDataType) {
            setValidationError('Please select a data type.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setValidationError('');
        setIsSubmitted(false);

        if (!file) {
            setValidationError('Please upload a CSV file.');
            return;
        }

        const isValid = await handleValidation(file);
        if (!isValid) {
            return;
        }

        const formData = new FormData();
        formData.append('csvFile', file);
        formData.append('processType', isAutomated ? 'automated' : 'manual');
        formData.append('dataType', selectedDataType);
        formData.append('analysisTool', selectedAnalysisTool);
        formData.append('userId', data?.user?.id ?? '');

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            if (response.ok) {
                setIsSubmitted(true);
                console.log('Order submitted:', result);
            } else {
                throw new Error(result.message || 'An error occurred');
            }
        } catch (error) {
            setValidationError('An error occurred');
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-semibold mb-4">Create New Order</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="csvUpload" className="block text-gray-700 text-sm font-bold mb-2">
                        Upload CSV File
                    </label>
                    <input
                        type="file"
                        id="csvUpload"
                        accept=".csv"
                        onChange={handleFileChange}
                        required
                        className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="automationStatus" className="block text-gray-700 text-sm font-bold mb-2">
                        Order Automation
                    </label>
                    <select
                        id="automationStatus"
                        value={isAutomated ? 'automated' : 'manual'}
                        onChange={handleAutomationChange}
                        required
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="automated">Automated</option>
                        <option value="manual" disabled>Manual (Under development)</option>
                    </select>
                </div>

                {isAutomated && (
                    <div className="mb-4">
                        <label htmlFor="dataType" className="block text-gray-700 text-sm font-bold mb-2">
                            Select Data Type (<Link href="/orders/automatedAnalysis" className="text-blue-600 hover:underline">Learn More</Link>)
                        </label>
                        <select
                            id="dataType"
                            value={selectedDataType}
                            onChange={handleDataTypeChange}
                            required
                            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="client">Client</option>
                            <option value="order" disabled>Order (Under development)</option>
                            <option value="product" disabled>Product (Under development)</option>
                            <option value="category" disabled>Category (Under development)</option>
                            <option value="orderLineItem" disabled>Order Line Item (Under development)</option>
                        </select>
                    </div>
                )}

                <div className="mb-4">
                    <label htmlFor="analysisTool" className="block text-gray-700 text-sm font-bold mb-2">
                        Select Analysis Tool (<Link href={learnMoreLink} className="text-blue-600 hover:underline">Learn More</Link>)
                    </label>
                    <select
                        id="analysisTool"
                        value={selectedAnalysisTool}
                        onChange={handleAnalysisToolChange}
                        required
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="regression">Regression Analysis</option>
                        <option value="segmentation" disabled>Segmentation Analysis (Under development)</option>
                        <option value="timeseries" disabled>Time Series Analysis (Under development)</option>
                        <option value="cohort" disabled>Cohort Analysis (Under development)</option>
                    </select>
                </div>

                <AnimatedButton type="submit">
                    Submit Order
                </AnimatedButton>
            </form>
            {isSubmitted && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Success!</strong>
                    <span className="block sm:inline"> Your order has been successfully submitted.</span>
                </div>
            )}

            {validationError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {validationError}</span>
                </div>
            )}
        </div>
    );
}

export default MyOrders;

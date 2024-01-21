'use client';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import Papa from 'papaparse';
import Link from 'next/link';
import AnimatedButton from '@/components/AnimatedButton';
import { useSession } from 'next-auth/react';
import OrdersTable from '@/components/OrdersTable';
import useTranslation from '@/utils/useTranslation';

type AnalysisTool = 'regression' | 'segmentation' | 'timeseries' | 'cohort';
type DataType = 'simple' | 'advanced';

interface CSVHeaders {
    [key: string]: string[];
}

const csvHeaders: CSVHeaders = {
    //ID,Country,City,Order Date,Product Name,Unit Price,Quantity,Total Price,Category Name,Weekday,Public Holiday,Season,Month,Year,Price Change Indicator,7-day Moving Average,Category Seasonality Index,Competitor Pricing,Marketing Spend,Customer Average Rating,Inventory Level,Online Search Trend
    simple: ['ID', 'Country', 'City', 'Order Date', 'Product Name', 'Unit Price', 'Quantity', 'Total Price', 'Category Name', 'Weekday', 'Public Holiday', 'Season', 'Month', 'Year', 'Price Change Indicator', '7-day Moving Average', 'Category Seasonality Index', 'Competitor Pricing', 'Marketing Spend', 'Customer Average Rating', 'Inventory Level', 'Online Search Trend'],
    //simple: ['ID', 'Name', 'Surname', 'Email', 'Address', 'Phone Number', 'Country', 'City', 'Order Date', 'Product Name', 'Product Description', 'Unit Price', 'Quantity', 'Total Price', 'Category Name', 'Category Description'],
    advanced: [],
};

function MyOrders() {
    const { t } = useTranslation();
    const [file, setFile] = useState<File | null>(null);
    const [learnMoreLink, setLearnMoreLink] = useState('/orders/regression');
    const [selectedAnalysisTool, setSelectedAnalysisTool] = useState<AnalysisTool>('regression');
    const [selectedDataTemplate, setSelectedDataTemplate] = useState<DataType>('simple');
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
                setValidationError(t('fileIsNotCsv'));
                return false;
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
                        if (validateCSVContents(results.data, csvHeaders[selectedDataTemplate])) {
                            resolve(true); // Validation passed
                        } else {
                            setValidationError(t('csvFileDontHaveExpectedHeaders'));
                            resolve(false); // Validation failed
                        }
                    } else {
                        setValidationError(t('csvFileIsEmptyOrCannotBeRead'));
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
        setSelectedDataTemplate(event.target.value as DataType);
    };

    const validateForm = (): boolean => {
        if (!file) {
            setValidationError(t('pleaseUploadCsvFile'));
            return false;
        }
        if (!selectedAnalysisTool) {
            setValidationError(t('pleaseSelectAnalysisTool'));
            return false;
        }
        if (!selectedDataTemplate) {
            setValidationError(t('pleaseSelectDataTemplate'));
            return false;
        }
        return true;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setValidationError('');
        setIsSubmitted(false);

        if (!file) {
            setValidationError(t('pleaseUploadCsvFile'));
            return;
        }

        const isValid = await handleValidation(file);
        if (!isValid) {
            return;
        }

        const formData = new FormData();
        formData.append('csvFile', file);
        formData.append('processType', isAutomated ? 'automated' : 'manual');
        formData.append('dataTemplate', selectedDataTemplate);
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
        <div className="container mx-auto p-6 m-4 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-semibold mb-4">{t('createNewOrder')}</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="csvUpload" className="block text-gray-700 text-sm font-bold mb-2">
                        {t('uploadCsvFile')}
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
                        {t('processType')}
                    </label>
                    <select
                        id="automationStatus"
                        value={isAutomated ? 'automated' : 'manual'}
                        onChange={handleAutomationChange}
                        required
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="automated">{t('automated')}</option>
                        <option value="manual" disabled>{t('manual')} ({t('underDevelopment')})</option>
                    </select>
                </div>

                {isAutomated && (
                    <div className="mb-4">
                        <label htmlFor="dataType" className="block text-gray-700 text-sm font-bold mb-2">
                            {t('dataTemplate')} (<Link href="/orders/automatedAnalysis" className="text-blue-600 hover:underline">{t('learnMore')}</Link>)
                        </label>
                        <select
                            id="dataType"
                            value={selectedDataTemplate}
                            onChange={handleDataTypeChange}
                            required
                            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="simple">{t('simple')}</option>
                            <option value="advanced" disabled>{t('advanced')} ({t('underDevelopment')})</option>
                        </select>
                    </div>
                )}

                <div className="mb-4">
                    <label htmlFor="analysisTool" className="block text-gray-700 text-sm font-bold mb-2">
                        {t('analysisTool')} (<Link href={learnMoreLink} className="text-blue-600 hover:underline">{t('learnMore')}</Link>)
                    </label>
                    <select
                        id="analysisTool"
                        value={selectedAnalysisTool}
                        onChange={handleAnalysisToolChange}
                        required
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="regression">{t('regression')}</option>
                        <option value="segmentation" disabled>{t('segmentation')} ({t('underDevelopment')})</option>
                        <option value="timeseries" disabled>{t('timeSeries')} ({t('underDevelopment')})</option>
                        <option value="cohort" disabled>{t('cohort')} ({t('underDevelopment')})</option>
                    </select>
                </div>

                <AnimatedButton type="submit" className='px-3 mb-3 py-2 rounded-md text-sm font-medium text-gray-100 hover:bg-green-600 bg-green-500'>
                    {t('submitOrder')}
                </AnimatedButton>
            </form>
            {isSubmitted && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative m-4" role="alert">
                    <strong className="font-bold">{t('success')}</strong>
                    <span className="block sm:inline"> {t('orderSucceded')} </span>
                </div>
            )}

            {validationError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4" role="alert">
                    <strong className="font-bold">{t('error')}</strong>
                    <span className="block sm:inline"> {validationError}</span>
                </div>
            )}
            <hr className="my-4" />
            <h1 className="text-3xl font-semibold mb-4">{t('myOrders')}</h1>
            <OrdersTable />
        </div>
    );
}

export default MyOrders;
